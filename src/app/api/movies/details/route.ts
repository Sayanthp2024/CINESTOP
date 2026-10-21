import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
  }

  const numId = Number(id);

  // If it's a custom vault ID range, check MongoDB first
  if (!isNaN(numId) && numId >= 9000000) {
    try {
      await connectMongo();
      const customMovie = await CustomMovie.findOne({ id: numId }).lean();
      if (customMovie) {
        return NextResponse.json({
          ...customMovie,
          trailers: customMovie.trailer_key ? [{
            id: 'custom-1',
            key: customMovie.trailer_key,
            name: `${customMovie.title} - Official Vault Trailer`,
            site: 'YouTube',
            type: 'Trailer',
            official: true
          }] : [],
          primaryTrailer: customMovie.trailer_key ? {
            key: customMovie.trailer_key,
            name: `${customMovie.title} - Official Vault Trailer`
          } : null,
          watchProviders: customMovie.stream_url ? {
            customStreamUrl: customMovie.stream_url
          } : null
        });
      }
    } catch (dbErr) {
      console.warn('Failed to query custom movie from DB:', dbErr);
    }
  }

  // Otherwise, query TMDB with videos and watch/providers appended
  try {
    const data = await fetchFromTMDB(`/movie/${id}`, {
      language: 'en-US',
      append_to_response: 'videos,watch/providers'
    });

    if (data && data.title) {
      // Extract YouTube trailers
      const rawVideos = data.videos?.results || [];
      const youtubeVideos = rawVideos.filter((v: any) => v.site === 'YouTube');
      
      const trailers = youtubeVideos.filter((v: any) => v.type === 'Trailer');
      const teasers = youtubeVideos.filter((v: any) => v.type === 'Teaser' || v.type === 'Clip');

      const allVideoOptions = trailers.length > 0 ? trailers : teasers;
      const primaryTrailer = allVideoOptions.find((v: any) => v.official) || allVideoOptions[0] || null;

      // Extract watch providers by country
      const rawProviders = data['watch/providers']?.results || {};

      return NextResponse.json({
        ...data,
        trailers: allVideoOptions,
        primaryTrailer,
        watchProviders: rawProviders,
      });
    }
  } catch {
    // If TMDB fails, try finding in MongoDB CustomMovie as fallback
    try {
      if (!isNaN(numId)) {
        await connectMongo();
        const customMovie = await CustomMovie.findOne({ id: numId }).lean();
        if (customMovie) {
          return NextResponse.json({
            ...customMovie,
            trailers: customMovie.trailer_key ? [{
              id: 'custom-1',
              key: customMovie.trailer_key,
              name: `${customMovie.title} - Official Vault Trailer`,
              site: 'YouTube',
              type: 'Trailer',
              official: true
            }] : [],
            primaryTrailer: customMovie.trailer_key ? {
              key: customMovie.trailer_key,
              name: `${customMovie.title} - Official Vault Trailer`
            } : null,
            watchProviders: customMovie.stream_url ? {
              customStreamUrl: customMovie.stream_url
            } : null
          });
        }
      }
    } catch {
      // Fall through to 404
    }
  }

  return NextResponse.json(
    { error: 'Movie not found' },
    { status: 404 }
  );
}
