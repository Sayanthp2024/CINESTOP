import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  anime: 16,
  comedy: 35,
  funny: 35,
  hilarious: 35,
  crime: 80,
  gangster: 80,
  mafia: 80,
  documentary: 99,
  drama: 18,
  emotional: 18,
  family: 10751,
  fantasy: 14,
  magic: 14,
  history: 36,
  historical: 36,
  horror: 27,
  scary: 27,
  creepy: 27,
  spooky: 27,
  music: 10402,
  musical: 10402,
  mystery: 9648,
  detective: 9648,
  whodunit: 9648,
  romance: 10749,
  romantic: 10749,
  love: 10749,
  scifi: 878,
  'sci-fi': 878,
  science: 878,
  cyberpunk: 878,
  space: 878,
  thriller: 53,
  suspense: 53,
  intense: 53,
  war: 10752,
  military: 10752,
  western: 37,
  cowboy: 37,
};

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(geminiKey && geminiKey.trim().length > 10);
  return NextResponse.json({
    configured: isConfigured,
    maskedKey: isConfigured ? `${geminiKey!.trim().slice(0, 6)}...${geminiKey!.trim().slice(-4)}` : null,
    models: ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite'],
  });
}

async function callGeminiAI(userPrompt: string, apiKey: string) {
  // Support verified working models in order of preference
  const models = [
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash',
  ];
  let lastError: any = null;


  const systemInstructions = `You are Cine-Bot, an underground, rebellious comic-style movie curator for CineStop (Toxic Pop Cinema). You talk with electric energy, comic flair, 90s zine slang, and deep cinephile knowledge.
Analyze the user's movie request and recommend 3 to 5 real, existing, exceptional films that precisely fit their taste, vibe, mood, or comparison.

CRITICAL: Return ONLY a valid JSON object formatted as:
{
  "reply": "Your in-character Cine-Bot commentary speaking directly to the user (use **bold** for movie titles or keywords, witty attitude)",
  "recommendations": [
    {
      "title": "Exact Title of the Movie",
      "year": "2010",
      "reason": "1 punchy sentence why it fits their vibe"
    }
  ]
}`;

  for (const model of models) {
    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${systemInstructions}\n\nUser request: "${userPrompt}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.75,
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        lastError = new Error(`Gemini (${model}) returned status ${res.status}: ${errorText}`);
        continue; // Try next model
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        lastError = new Error(`No content parts returned by Gemini (${model})`);
        continue;
      }

      // Clean potential markdown backticks or wrappers
      let cleanText = rawText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleanText);
      return { ...parsed, modelUsed: model };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

export async function POST(request: Request) {
  try {
    const { message, userGeminiKey, apiKey } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const cleanMsg = message.trim();
    const effectiveGeminiKey = (apiKey || userGeminiKey || process.env.GEMINI_API_KEY || '').trim();

    let recommendedMovies: any[] = [];
    let botCommentary = '';
    let isGeminiPowered = false;
    let modelUsed: string | null = null;

    // ==========================================
    // STRATEGY 1: GOOGLE GEMINI AI ENGINE
    // ==========================================
    if (effectiveGeminiKey && effectiveGeminiKey.length > 10) {
      try {
        const geminiResult = await callGeminiAI(cleanMsg, effectiveGeminiKey);
        botCommentary = geminiResult.reply || 'Vault neural net deciphered your request:';
        modelUsed = geminiResult.modelUsed || 'gemini-1.5-flash';

        if (geminiResult.recommendations && Array.isArray(geminiResult.recommendations)) {
          // Hydrate each Gemini movie title with TMDB data (posters, trailers, ratings)
          const hydrated = await Promise.all(
            geminiResult.recommendations.map(async (rec: any) => {
              try {
                const searchParams: Record<string, string> = { query: rec.title };
                if (rec.year) searchParams.year = rec.year;

                const searchRes = await fetchFromTMDB('/search/movie', searchParams);
                if (searchRes.results && searchRes.results.length > 0) {
                  const tmdbMovie = searchRes.results[0];
                  return {
                    ...tmdbMovie,
                    matchReason: rec.reason || `Curated by Gemini AI (${modelUsed})`,
                  };
                }
              } catch {
                // Ignore search error for single movie
              }
              return null;
            })
          );

          recommendedMovies = hydrated.filter(Boolean);
          isGeminiPowered = true;
        }
      } catch (geminiError: any) {
        console.warn('Gemini AI execution failed, falling back to TMDB engine:', geminiError.message);
      }
    }


    // ==========================================
    // STRATEGY 2: ALGORITHMIC FALLBACK / DEFAULT
    // ==========================================
    if (recommendedMovies.length === 0) {
      const lower = cleanMsg.toLowerCase();

      // Check for movie title comparisons ("like Inception")
      const likeMatch = lower.match(/(?:like|similar to|after|recommend.*like|loved|enjoyed)\s+["']?([^"'\.,\?!]+)["']?/i);
      let targetMovieName = likeMatch ? likeMatch[1].trim() : null;
      if (targetMovieName && ['something', 'a movie', 'this', 'that', 'anything', 'movies'].includes(targetMovieName)) {
        targetMovieName = null;
      }

      if (targetMovieName) {
        try {
          const searchRes = await fetchFromTMDB('/search/movie', { query: targetMovieName, page: '1' });
          if (searchRes.results && searchRes.results.length > 0) {
            const baseMovie = searchRes.results[0];
            const [recsRes, similarRes] = await Promise.all([
              fetchFromTMDB(`/movie/${baseMovie.id}/recommendations`, { page: '1' }).catch(() => ({ results: [] })),
              fetchFromTMDB(`/movie/${baseMovie.id}/similar`, { page: '1' }).catch(() => ({ results: [] })),
            ]);

            const combined = [...(recsRes.results || []), ...(similarRes.results || [])];
            const seen = new Set();
            for (const m of combined) {
              if (m.id !== baseMovie.id && !seen.has(m.id) && m.poster_path) {
                seen.add(m.id);
                recommendedMovies.push({
                  ...m,
                  matchReason: `Shares the raw DNA and vibe of "${baseMovie.title}"`,
                });
              }
            }

            botCommentary = `Signal detected, operative! If you vibed with **"${baseMovie.title}"** (${baseMovie.release_date?.split('-')[0] || ''}), these vault picks operate on that exact frequency:`;
          }
        } catch {
          // ignore
        }
      }

      // Genre Detection
      if (recommendedMovies.length === 0) {
        const detectedGenreIds: number[] = [];
        for (const [key, id] of Object.entries(GENRE_MAP)) {
          if (lower.includes(key) && !detectedGenreIds.includes(id)) {
            detectedGenreIds.push(id);
          }
        }

        if (detectedGenreIds.length > 0) {
          try {
            const discoverRes = await fetchFromTMDB('/discover/movie', {
              with_genres: detectedGenreIds.join(','),
              sort_by: 'vote_average.desc',
              'vote_count.gte': '1000',
              page: '1',
            });

            if (discoverRes.results && discoverRes.results.length > 0) {
              recommendedMovies = discoverRes.results
                .filter((m: any) => m.poster_path)
                .slice(0, 6)
                .map((m: any) => ({
                  ...m,
                  matchReason: 'Top-tier cult classic matching your requested genre',
                }));

              botCommentary = `Decrypted the frequency! Found ${recommendedMovies.length} masterworks matching your genre criteria:`;
            }
          } catch {
            // ignore
          }
        }
      }

      // Keyword / Free text search
      if (recommendedMovies.length === 0) {
        try {
          const query = lower
            .replace(/suggest|recommend|movie|film|something|good|watch|want|looking for|please|best|about/gi, '')
            .trim();

          if (query.length > 2) {
            const searchRes = await fetchFromTMDB('/search/movie', { query, page: '1' });
            if (searchRes.results && searchRes.results.length > 0) {
              recommendedMovies = searchRes.results
                .filter((m: any) => m.poster_path)
                .slice(0, 6)
                .map((m: any) => ({
                  ...m,
                  matchReason: `Direct vault search hit for "${query}"`,
                }));

              botCommentary = `Scanned the archives for "${query}". Here are the standout vault entries:`;
            }
          }
        } catch {
          // ignore
        }
      }

      // Trending fallback
      if (recommendedMovies.length === 0) {
        try {
          const trendingRes = await fetchFromTMDB('/trending/movie/week', {});
          if (trendingRes.results && trendingRes.results.length > 0) {
            recommendedMovies = trendingRes.results
              .filter((m: any) => m.poster_path)
              .slice(0, 5)
              .map((m: any) => ({
                ...m,
                matchReason: 'High-adrenaline trending crowd pick',
              }));

            botCommentary = `Transmission received! Tell me your exact vibe or a film you love, or check these trending crowd hits right now:`;
          }
        } catch {
          botCommentary = `Transmission received, operative! Tell me your mood or ask for "movies like [Title]"!`;
        }
      }
    }

    // Check custom MongoDB vault movies
    try {
      await connectMongo();
      const customMovies = await CustomMovie.find().lean();
      if (customMovies && customMovies.length > 0) {
        const lower = cleanMsg.toLowerCase();
        const matched = customMovies.filter((cm: any) =>
          lower.includes(cm.title.toLowerCase()) ||
          cm.overview.toLowerCase().includes(lower) ||
          lower.includes('vault') || lower.includes('custom')
        );
        if (matched.length > 0) {
          recommendedMovies = [
            ...matched.map(cm => ({ ...cm, matchReason: '⭐ Vault Exclusive MongoDB Entry' })),
            ...recommendedMovies,
          ];
        }
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      reply: botCommentary,
      movies: recommendedMovies.slice(0, 5),
      isGeminiPowered,
      modelUsed: isGeminiPowered ? modelUsed : null,
      engine: isGeminiPowered ? `Google Gemini (${modelUsed})` : 'CineStop Vault Heuristic Engine',
    });
  } catch (error: any) {
    console.error('Chat bot API error:', error);
    return NextResponse.json(
      {
        reply: "Transmission glitch in the vault neural net. Please re-enter your transmission!",
        movies: [],
        isGeminiPowered: false,
        modelUsed: null,
      },
      { status: 500 }
    );
  }
}

