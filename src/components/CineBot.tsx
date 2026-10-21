'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function CineBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{ configured: boolean; maskedKey: string | null }>({
    configured: false,
    maskedKey: null,
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "⚡ Transmission received, operative! I'm **CINE-BOT**, your underground AI film curator powered by Google Gemini. Drop a title you love (e.g. *\"movies like Interstellar\"*), an aesthetic (*\"gritty 90s cyberpunk\"*), or a mood, and I'll scan the vault!",
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkGeminiStatus = async () => {
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
    checkGeminiStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
          setShowKeyModal(false);
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

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();
      const botMessage: Message = {
        sender: 'bot',
        text: data.reply || "Signals encrypted. Here's what the vault surfaced:",
        movies: data.movies || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGeminiPowered: Boolean(data.isGeminiPowered),
        modelUsed: data.modelUsed,
        engine: data.engine,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Neural static detected. Could not connect to vault radar. Please try again!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  const samplePrompts = [
    '💥 Movies like Inception',
    '🩸 Intense psychological thriller',
    '🚀 90s Cyberpunk Sci-Fi',
    '😂 Funniest dark comedy',
  ];

  return (
    <>
      {/* FLOATING BOT LAUNCHER BUTTON */}
      <div 
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Cine-Bot AI Chat"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--toxic-green)',
            color: '#000',
            fontWeight: '900',
            fontFamily: 'var(--font-comic, "Bangers", sans-serif)',
            fontSize: '18px',
            letterSpacing: '1px',
            padding: '14px 22px',
            border: '3px solid #000',
            boxShadow: '5px 5px 0px #000',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '7px 7px 0px #000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '5px 5px 0px #000';
          }}
        >
          <span style={{ fontSize: '22px' }}>🤖</span>
          <span>{isOpen ? 'CLOSE RADAR' : 'CINE-BOT AI 💥'}</span>
          {!isOpen && (
            <span 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--electric-orange)',
                display: 'inline-block',
                marginLeft: '4px',
                boxShadow: '0 0 6px var(--electric-orange)'
              }}
            />
          )}
        </button>
      </div>

      {/* EXPANDABLE CHAT MODAL */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '25px',
            width: '420px',
            maxWidth: 'calc(100vw - 40px)',
            height: '620px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--charcoal-bg, #151515)',
            border: '4px solid var(--toxic-green)',
            boxShadow: '8px 8px 0px #000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--charcoal-card, #242424)',
              padding: '12px 16px',
              borderBottom: '3px solid #000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <h3 
                  style={{ 
                    margin: 0, 
                    color: 'var(--toxic-green)', 
                    fontFamily: 'var(--font-comic, "Bangers", sans-serif)',
                    fontSize: '22px',
                    letterSpacing: '1px'
                  }}
                >
                  CINE-BOT: VAULT ORACLE
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Underground AI Film Curator & Mood Matcher
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowKeyModal(!showKeyModal)}
                title={geminiStatus.configured ? `Gemini Key Active (${geminiStatus.maskedKey})` : 'Configure Google Gemini API Key'}
                style={{
                  background: geminiStatus.configured ? 'var(--toxic-green)' : 'var(--electric-orange)',
                  color: '#000',
                  border: '2px solid #000',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '2px 2px 0 #000',
                }}
              >
                <span>{geminiStatus.configured ? '⚡ GEMINI ACTIVE' : '🔑 SET GEMINI KEY'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--hot-pink)',
                  color: '#fff',
                  border: '2px solid #000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Gemini Key Config Drawer */}
          {showKeyModal && (
            <div
              style={{
                background: 'var(--charcoal-surface, #1e1e1e)',
                borderBottom: '3px solid var(--electric-orange)',
                padding: '14px 16px',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--electric-orange)' }}>
                  ⚡ GOOGLE GEMINI API CONFIGURATION
                </span>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--off-white)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Enter your Google Gemini API key. It will be verified against Gemini 1.5 Flash and saved into <code>.env.local</code>.
              </p>
              <form onSubmit={handleSaveGeminiKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={geminiStatus.configured ? `Active Key: ${geminiStatus.maskedKey}` : "Paste AIzaSy... here"}
                  style={{
                    background: 'var(--bg-dark, #0d0d0d)',
                    color: '#fff',
                    border: '1px solid var(--toxic-green)',
                    padding: '8px 10px',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="submit"
                    disabled={savingKey || !keyInput.trim()}
                    style={{
                      flex: 1,
                      background: 'var(--toxic-green)',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      padding: '8px',
                      border: '2px solid #000',
                      boxShadow: '2px 2px 0 #000',
                      cursor: savingKey || !keyInput.trim() ? 'not-allowed' : 'pointer',
                      opacity: savingKey || !keyInput.trim() ? 0.6 : 1,
                    }}
                  >
                    {savingKey ? 'VERIFYING WITH GOOGLE...' : 'SAVE & ACTIVATE ⚡'}
                  </button>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'var(--charcoal-card)',
                      color: 'var(--off-white)',
                      fontSize: '11px',
                      padding: '8px 10px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    GET KEY ↗
                  </a>
                </div>
                {keyFeedback && (
                  <span style={{ fontSize: '11px', color: keyFeedback.startsWith('✅') ? 'var(--toxic-green)' : 'var(--electric-orange)', fontWeight: 'bold' }}>
                    {keyFeedback}
                  </span>
                )}
              </form>
            </div>
          )}

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'radial-gradient(circle at top right, rgba(183, 255, 0, 0.05), transparent 40%)',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    background: msg.sender === 'user' ? 'var(--electric-orange)' : 'var(--charcoal-card, #242424)',
                    color: msg.sender === 'user' ? '#000' : 'var(--off-white)',
                    fontWeight: msg.sender === 'user' ? 'bold' : 'normal',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    border: '2px solid #000',
                    boxShadow: msg.sender === 'user' ? '3px 3px 0 #000' : '3px 3px 0 var(--toxic-green)',
                  }}
                >
                  {msg.text}

                  {/* Gemini Badge */}
                  {msg.isGeminiPowered && (
                    <div style={{ marginTop: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'rgba(183, 255, 0, 0.15)',
                          color: 'var(--toxic-green)',
                          border: '1px solid var(--toxic-green)',
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px',
                        }}
                      >
                        ⚡ GEMINI AI ({msg.modelUsed || '1.5-flash'})
                      </span>
                    </div>
                  )}


                  {/* Render Movie Cards if Bot returned suggestions */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                      {msg.movies.map((m) => {
                        const poster = m.poster_path
                          ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w200${m.poster_path}`)
                          : null;

                        return (
                          <div
                            key={m.id}
                            style={{
                              display: 'flex',
                              gap: '12px',
                              background: 'var(--bg-dark, #0d0d0d)',
                              padding: '10px',
                              border: '2px solid rgba(255,255,255,0.15)',
                            }}
                          >
                            {poster && (
                              <img
                                src={poster}
                                alt={m.title}
                                style={{
                                  width: '50px',
                                  height: '75px',
                                  objectFit: 'cover',
                                  border: '1px solid var(--electric-orange)',
                                }}
                              />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4
                                style={{
                                  margin: '0 0 3px 0',
                                  color: 'var(--toxic-green)',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {m.title}
                              </h4>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>
                                <span style={{ color: 'var(--cyber-yellow, #ffe600)', fontWeight: 'bold' }}>
                                  ★ {m.vote_average?.toFixed(1) || 'N/A'}
                                </span>
                                <span>{m.release_date?.split('-')[0] || ''}</span>
                              </div>
                              {m.matchReason && (
                                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--electric-orange)', fontStyle: 'italic' }}>
                                  {m.matchReason}
                                </p>
                              )}
                              <Link
                                href={`/movie/${m.id}`}
                                onClick={() => setIsOpen(false)}
                                style={{
                                  display: 'inline-block',
                                  background: 'var(--toxic-green)',
                                  color: '#000',
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  border: '1px solid #000',
                                }}
                              >
                                VIEW & STREAM ↗
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    margin: '0 4px',
                  }}
                >
                  {msg.time}
                </span>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 14px',
                  background: 'var(--charcoal-card, #242424)',
                  color: 'var(--toxic-green)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2px solid #000',
                }}
              >
                DECRYPTING VAULT ARCHIVE... ⚡
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--charcoal-surface, #1e1e1e)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={loading}
                style={{
                  background: 'var(--bg-dark, #0d0d0d)',
                  color: 'var(--off-white)',
                  fontSize: '11px',
                  padding: '5px 10px',
                  border: '1px solid var(--electric-orange)',
                  cursor: 'pointer',
                  borderRadius: '0px',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              display: 'flex',
              padding: '12px',
              background: 'var(--charcoal-card, #242424)',
              borderTop: '3px solid #000',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Cine-Bot for movie suggestions..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--bg-dark, #0d0d0d)',
                color: 'var(--off-white)',
                border: '2px solid #000',
                padding: '10px 12px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: 'var(--toxic-green)',
                color: '#000',
                fontWeight: 'bold',
                border: '2px solid #000',
                padding: '0 16px',
                fontSize: '14px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              SEND ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
