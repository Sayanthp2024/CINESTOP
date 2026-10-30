'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MovieSuggestion {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  matchReason?: string;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  movies?: MovieSuggestion[];
  time: string;
  isGeminiPowered?: boolean;
  modelUsed?: string;
  engine?: string;
}

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{ configured: boolean; maskedKey: string | null }>({
    configured: false,
    maskedKey: null,
  });
  const [showConfig, setShowConfig] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "⚡ Transmission established, operative! I'm **CINE-BOT**, the underground AI film curator powered by Google Gemini. Whether you want movies that match a specific film, a weird late-night mood, or an obscure sub-genre, tell me what you crave and I'll decrypt the vault!",
      time: 'ONLINE',
    },
  ]);

  const checkGemini = async () => {
    try {
      const res = await fetch('/api/chat/recommendations');
      const data = await res.json();
      setGeminiStatus({
        configured: Boolean(data.configured),
        maskedKey: data.maskedKey || null,
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkGemini();
  }, []);

  const handleSaveGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || savingKey) return;

    setSavingKey(true);
    setKeyFeedback('Testing key with Google Gemini API...');

    try {
      const res = await fetch('/api/chat/save-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setKeyFeedback('✅ Key verified & saved to .env.local!');
        setGeminiStatus({ configured: true, maskedKey: data.maskedKey });
        setTimeout(() => {
          setShowConfig(false);
          setKeyInput('');
          setKeyFeedback(null);
        }, 1200);
      } else {
        setKeyFeedback(`❌ ${data.error || 'Failed to verify key'}`);
      }
    } catch {
      setKeyFeedback('❌ Error connecting to server');
    } finally {
      setSavingKey(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || "Archived signals found in the vault:",
          movies: data.movies || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isGeminiPowered: Boolean(data.isGeminiPowered),
          modelUsed: data.modelUsed,
          engine: data.engine,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Neural transmission glitch. Please try transmitting your query again!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleCategories = [
    { label: '🧠 Mind-Bending', query: 'Mind-bending sci-fi movies with massive plot twists like Inception' },
    { label: '🩸 Gritty Noir', query: 'Dark gritty crime thriller like Fight Club or Taxi Driver' },
    { label: '🚀 90s Cyberpunk', query: 'Retro cyberpunk dystopia with synthesizers and neon aesthetic' },
    { label: '😂 Black Comedy', query: 'Dark hilarious satire and absurd comedy' },
    { label: '🌌 Space Horror', query: 'Terrifying cosmic space horror where crew is trapped' },
  ];

  return (
    <section className="page active" style={{ padding: '30px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="section-toxic-header" style={{ marginBottom: '20px' }}>
        <div>
          <span className="section-toxic-kicker">NEURAL VAULT RADAR 🤖💥</span>
          <h1 className="section-toxic-title">CINE-BOT AI ORACLE</h1>
          <span className="section-toxic-desc">
            Natural language movie discovery powered by Google Gemini AI & TMDB metadata.
          </span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`btn ${geminiStatus.configured ? 'green' : 'orange'}`}
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            {geminiStatus.configured ? '⚡ GEMINI AI ACTIVE' : '🔑 CONFIGURE GEMINI KEY'}
          </button>
        </div>
      </div>

      {/* Gemini AI Key Config Card */}
      {showConfig && (
        <div
          style={{
            background: 'var(--charcoal-card, #242424)',
            border: '3px solid var(--electric-orange)',
            boxShadow: '6px 6px 0px #000',
            padding: '20px',
            marginBottom: '25px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: 'var(--electric-orange)', fontSize: '18px' }}>
              ⚡ GOOGLE GEMINI AI CONFIGURATION
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <p style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: '1.5', margin: '0 0 15px 0' }}>
            {geminiStatus.configured
              ? `Gemini API Key is active: ${geminiStatus.maskedKey}. You can update it below.`
              : 'Enter your Google Gemini API key to activate deep neural natural language recommendations powered by Gemini 1.5 Flash.'}
          </p>
          <form onSubmit={handleSaveGeminiKey} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste AIzaSy... here"
              style={{
                flex: 1,
                minWidth: '240px',
                background: 'var(--bg-dark, #0d0d0d)',
                color: '#fff',
                border: '2px solid var(--toxic-green)',
                padding: '12px 14px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={savingKey || !keyInput.trim()}
              className="btn green"
              style={{ fontSize: '13px', padding: '12px 20px' }}
            >
              {savingKey ? 'VALIDATING...' : 'SAVE & ACTIVATE ⚡'}
            </button>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn orange"
              style={{ fontSize: '13px', padding: '12px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              GET FREE KEY ↗
            </a>
          </form>
          {keyFeedback && (
            <p style={{ marginTop: '10px', fontSize: '13px', fontWeight: 'bold', color: keyFeedback.startsWith('✅') ? 'var(--toxic-green)' : 'var(--electric-orange)' }}>
              {keyFeedback}
            </p>
          )}
        </div>
      )}


      {/* Suggested Fast Prompts */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
        {sampleCategories.map(cat => (
          <button
            key={cat.label}
            onClick={() => handleSend(cat.query)}
            disabled={loading}
            style={{
              background: 'var(--charcoal-card, #242424)',
              color: 'var(--off-white)',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid var(--electric-orange)',
              boxShadow: '3px 3px 0 var(--electric-orange)',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
          >
            {cat.label} ➔
          </button>
        ))}
      </div>

      {/* Main Chat Container */}
      <div
        style={{
          background: 'var(--charcoal-card, #242424)',
          border: '4px solid var(--toxic-green)',
          boxShadow: '8px 8px 0px #000',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        {/* Messages Log */}
        <div style={{ flex: 1, padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: m.sender === 'user' ? '70%' : '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  background: m.sender === 'user' ? 'var(--electric-orange)' : 'var(--bg-dark, #0d0d0d)',
                  color: m.sender === 'user' ? '#000' : 'var(--off-white)',
                  fontWeight: m.sender === 'user' ? 'bold' : 'normal',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  border: '3px solid #000',
                  boxShadow: m.sender === 'user' ? '4px 4px 0 #000' : '4px 4px 0 var(--toxic-green)',
                }}
              >
                {m.text}

                {/* Gemini Badge */}
                {m.isGeminiPowered && (
                  <div style={{ marginTop: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(183, 255, 0, 0.15)',
                        color: 'var(--toxic-green)',
                        border: '1px solid var(--toxic-green)',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      ⚡ POWERED BY GOOGLE GEMINI ({m.modelUsed || '1.5-FLASH'})
                    </span>
                  </div>
                )}

                {/* Render Suggested Movies inside the response */}
                {m.movies && m.movies.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', marginTop: '20px' }}>
                    {m.movies.map((movie) => {
                      const poster = movie.poster_path
                        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w300${movie.poster_path}`)
                        : null;

                      return (
                        <div
                          key={movie.id}
                          style={{
                            background: 'var(--charcoal-surface, #1e1e1e)',
                            border: '2px solid rgba(255,255,255,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                            {poster ? (
                              <img
                                src={poster}
                                alt={movie.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                                🎬
                              </div>
                            )}
                            <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                              <span className="comic-sticker pink" style={{ fontSize: '11px', padding: '2px 6px' }}>
                                ★ {movie.vote_average?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h3 style={{ color: 'var(--toxic-green)', fontSize: '16px', margin: '0 0 6px 0', lineHeight: '1.2' }}>
                                {movie.title}
                              </h3>
                              {movie.matchReason && (
                                <p style={{ fontSize: '11px', color: 'var(--electric-orange)', fontStyle: 'italic', margin: '0 0 10px 0' }}>
                                  {movie.matchReason}
                                </p>
                              )}
                            </div>

                            <Link
                              href={`/movie/${movie.id}`}
                              className="btn orange full"
                              style={{ padding: '8px', fontSize: '12px', textAlign: 'center', textDecoration: 'none' }}
                            >
                              ▶ TRAILER & STREAM RADAR
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', margin: '0 4px' }}>
                {m.time}
              </span>
            </div>
          ))}

          {loading && (
            <div style={{ padding: '15px', background: 'var(--bg-dark)', color: 'var(--toxic-green)', fontWeight: 'bold', width: 'fit-content', border: '2px solid var(--toxic-green)' }}>
              ⚡ DECRYPTING VAULT ARCHIVE FOR RECOMMENDATIONS...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '20px',
            background: 'var(--charcoal-surface, #1e1e1e)',
            borderTop: '3px solid #000',
            display: 'flex',
            gap: '12px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your vibe, mood, or 'movies like [title]'..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--bg-dark, #0d0d0d)',
              color: 'var(--off-white)',
              border: '3px solid #000',
              padding: '14px 18px',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="btn orange"
            disabled={loading || !input.trim()}
            style={{ padding: '0 25px', fontSize: '16px' }}
          >
            TRANSMIT ➔
          </button>
        </form>
      </div>
    </section>
  );
}
