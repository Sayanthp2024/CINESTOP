'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();

  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listMessage, setListMessage] = useState('');

  // Radar & Streaming State
  const [selectedCountry, setSelectedCountry] = useState('IN');

  // Trailer State
  const [selectedTrailerKey, setSelectedTrailerKey] = useState<string | null>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch Movie Details via API (which queries TMDB & MongoDB CustomMovie)
    fetch(`/api/movies/details?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMovie(data);
          if (data.primaryTrailer?.key) {
            setSelectedTrailerKey(data.primaryTrailer.key);
          } else if (data.trailers && data.trailers.length > 0) {
            setSelectedTrailerKey(data.trailers[0].key);
          }
        }
      })
      .catch(err => console.error(err));

    // Fetch Reviews from MongoDB
    fetch(`/api/reviews?movieId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToList = async (listType: 'watchlist' | 'favorites') => {
    if (status !== 'authenticated') {
      alert(`You must log in to add movies to your ${listType === 'watchlist' ? 'Hit List' : 'Obsessions'}!`);
      return;
    }

    try {
      const res = await fetch('/api/user/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: Number(id), action: 'add', listType }),
      });
      const data = await res.json();
      if (res.ok) {
        setListMessage(listType === 'watchlist' ? '🎯 Added to your Hit List!' : '❤️ Added to your Obsessions!');
        setTimeout(() => setListMessage(''), 3000);
      } else {
        alert(data.error || 'Failed to update list');
      }
    } catch {
      alert('Error updating list in database');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      alert('You must log in to write a review.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: Number(id), rating, text }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setText('');
        setRating(5);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !movie) {
    return (
      <div style={{ color: 'var(--toxic-green)', padding: '60px', textAlign: 'center', fontFamily: 'var(--font-comic)', fontSize: '24px' }}>
        DECRYPTING VAULT ARCHIVE & SCANNING STREAMING SIGNALS...
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ color: 'var(--electric-orange)', padding: '60px', textAlign: 'center' }}>
        <h2>MOVIE NOT FOUND IN VAULT</h2>
        <Link href="/movies" className="btn orange" style={{ marginTop: '20px', display: 'inline-block' }}>
          RETURN TO VAULT
        </Link>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? (movie.poster_path.startsWith('http') || movie.poster_path.startsWith('/')
        ? movie.poster_path
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : '';

  // Current country streaming signals
  const countryProviders = movie.watchProviders ? movie.watchProviders[selectedCountry] : null;
  const flatrate = countryProviders?.flatrate || [];
  const rent = countryProviders?.rent || [];
  const buy = countryProviders?.buy || [];
  const free = countryProviders?.free || countryProviders?.ads || [];
  const justWatchLink = countryProviders?.link;

  const hasAnyProviders = flatrate.length > 0 || rent.length > 0 || buy.length > 0 || free.length > 0;
  const trailersList = movie.trailers || [];

  return (
    <section className="page active" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <Link href="/movies" style={{ color: 'var(--toxic-green)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
          ← BACK TO REPERTORY VAULT
        </Link>
      </div>

      {/* Main Movie Hero Section */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '50px' }}>
        
        {/* Left: Poster & Action Buttons */}
        <div style={{ flex: '1', minWidth: '280px', maxWidth: '360px' }}>
          <div style={{ position: 'relative', border: '4px solid var(--electric-orange)', boxShadow: '8px 8px 0 var(--electric-orange)' }}>
            {posterUrl ? (
              <img 
                src={posterUrl} 
                alt={movie.title} 
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '450px', background: 'var(--charcoal-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                🎬
              </div>
            )}
            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
              <span className="comic-sticker pink">VAULT FILE</span>
            </div>
          </div>

          {/* Quick List Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              className="btn orange full" 
              style={{ flex: 1, padding: '12px 8px', fontSize: '13px' }}
              onClick={() => handleAddToList('watchlist')}
            >
              + HIT LIST
            </button>
            <button 
              className="btn pink full" 
              style={{ flex: 1, padding: '12px 8px', fontSize: '13px' }}
              onClick={() => handleAddToList('favorites')}
            >
              ❤️ OBSESS
            </button>
          </div>

          {selectedTrailerKey && (
            <a 
              href="#trailer-theater" 
              className="btn full" 
              style={{ 
                marginTop: '10px', 
                background: 'var(--toxic-green)', 
                color: '#000', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                textDecoration: 'none', 
                display: 'block', 
                padding: '12px',
                border: 'var(--border-thick)',
                boxShadow: 'var(--shadow-black)'
              }}
            >
              ▶ JUMP TO TRAILER
            </a>
          )}

          {listMessage && (
            <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-dark)', borderLeft: '4px solid var(--toxic-green)', color: 'var(--toxic-green)', fontWeight: 'bold' }}>
              {listMessage}
            </div>
          )}
        </div>
        
        {/* Right: Metadata & Synopsis */}
        <div style={{ flex: '2', minWidth: '320px' }}>
          <span className="comic-sticker green" style={{ marginBottom: '10px', display: 'inline-block' }}>
            CELLULOID ARCHIVE
          </span>
          <h1 style={{ color: 'var(--toxic-green)', fontSize: '50px', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '15px', textShadow: '2px 2px 0 var(--bg-dark)' }}>
            {movie.title}
          </h1>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '25px', color: 'var(--text-muted)' }}>
            <span className="comic-sticker pink">{movie.release_date?.split('-')[0] || 'N/A'}</span>
            <span style={{ fontSize: '18px', color: 'var(--cyber-yellow, #ffe600)', fontWeight: 'bold' }}>
              ★ {movie.vote_average?.toFixed(1) || '0.0'} / 10
            </span>
            {movie.runtime && (
              <span style={{ color: 'var(--off-white)' }}>⏱️ {movie.runtime} min</span>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {movie.genres.map((g: any) => (
                  <span key={g.id || g.name} style={{ background: 'var(--charcoal-card)', padding: '3px 8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {movie.tagline && (
            <p style={{ color: 'var(--electric-orange)', fontStyle: 'italic', fontSize: '18px', marginBottom: '20px' }}>
              "{movie.tagline}"
            </p>
          )}

          <h3 style={{ color: 'var(--off-white)', marginBottom: '10px', fontSize: '16px', letterSpacing: '1px' }}>SYNOPSIS</h3>
          <p style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--off-white)', marginBottom: '35px' }}>
            {movie.overview}
          </p>

          {/* STREAMING SIGNALS RADAR CARD */}
          <div 
            style={{ 
              background: 'var(--charcoal-card)', 
              padding: '25px', 
              border: '3px solid var(--cyber-blue)', 
              boxShadow: '6px 6px 0 var(--cyber-blue)',
              marginBottom: '35px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📡</span>
                  <h2 style={{ color: 'var(--cyber-blue)', fontSize: '22px', margin: 0 }}>
                    WHERE TO STREAM RADAR
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Live transmission powered by JustWatch & TMDB
                </span>
              </div>

              {/* Country Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--off-white)', fontWeight: 'bold' }}>REGION:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  style={{
                    background: 'var(--bg-dark)',
                    color: 'var(--off-white)',
                    padding: '8px 12px',
                    border: 'var(--border-thick)',
                    borderRadius: '0px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* If Custom Stream URL is set on MongoDB CustomMovie */}
            {movie.watchProviders?.customStreamUrl && (
              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(183, 255, 0, 0.1)', borderLeft: '4px solid var(--toxic-green)' }}>
                <span style={{ color: 'var(--toxic-green)', fontWeight: 'bold', fontSize: '13px' }}>⚡ VAULT EXCLUSIVE BROADCAST</span>
                <p style={{ margin: '5px 0 10px 0', fontSize: '14px' }}>This movie is hosted directly through the CineStop Vault network.</p>
                <a href={movie.watchProviders.customStreamUrl} target="_blank" rel="noopener noreferrer" className="btn green" style={{ display: 'inline-block', padding: '8px 15px', fontSize: '12px' }}>
                  STREAM NOW ↗
                </a>
              </div>
            )}

            {/* Providers Content */}
            {!hasAnyProviders && !movie.watchProviders?.customStreamUrl ? (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  No active streaming signals detected for <strong>{COUNTRIES.find(c => c.code === selectedCountry)?.name}</strong> right now.
                </p>
                <p style={{ fontSize: '13px', color: 'var(--off-white)', marginTop: '5px' }}>
                  Try switching the region dropdown above (e.g. <strong>United States 🇺🇸</strong> or <strong>United Kingdom 🇬🇧</strong>).
                </p>
                {justWatchLink && (
                  <a href={justWatchLink} target="_blank" rel="noopener noreferrer" className="btn orange" style={{ marginTop: '15px', display: 'inline-block', fontSize: '12px' }}>
                    CHECK WORLDWIDE AVAILABILITY ↗
                  </a>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Subscription Streaming (Watch Now) */}
                {flatrate.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--toxic-green)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      🟢 STREAM WITH SUBSCRIPTION:
                    </span>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {flatrate.map((p: any) => (
                        <div 
                          key={p.provider_id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            background: 'var(--bg-dark)', 
                            padding: '8px 14px', 
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                          }}
                        >
                          <img 
                            src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                            alt={p.provider_name} 
                            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--off-white)' }}>
                            {p.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Free / Ad-Supported */}
                {free.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyber-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      🔵 STREAM FREE (WITH ADS):
                    </span>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {free.map((p: any) => (
                        <div 
                          key={p.provider_id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            background: 'var(--bg-dark)', 
                            padding: '8px 14px', 
                            border: '1px solid rgba(255,255,255,0.15)' 
                          }}
                        >
                          <img 
                            src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                            alt={p.provider_name} 
                            style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--off-white)' }}>
                            {p.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Rent / Buy (Digital Store) */}
                {(rent.length > 0 || buy.length > 0) && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyber-yellow, #ffe600)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      🟡 RENT OR BUY (DIGITAL):
                    </span>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {Array.from(new Map([...rent, ...buy].map((p: any) => [p.provider_id, p])).values()).slice(0, 6).map((p: any) => (
                        <div 
                          key={p.provider_id} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            background: 'var(--bg-dark)', 
                            padding: '6px 12px', 
                            border: '1px solid rgba(255,255,255,0.1)' 
                          }}
                        >
                          <img 
                            src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                            alt={p.provider_name} 
                            style={{ width: '24px', height: '24px', borderRadius: '3px' }}
                          />
                          <span style={{ fontSize: '13px', color: 'var(--off-white)' }}>
                            {p.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deep Link to JustWatch */}
                {justWatchLink && (
                  <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <a 
                      href={justWatchLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--electric-orange)', fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                      View complete pricing & HD/4K quality details on JustWatch ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🎬 CINEMATIC TRAILER THEATER */}
      <div 
        id="trailer-theater" 
        style={{ 
          background: 'var(--charcoal-card)', 
          padding: '35px', 
          border: '4px solid var(--electric-orange)', 
          boxShadow: '8px 8px 0 var(--electric-orange)',
          marginBottom: '50px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
          <div>
            <span className="comic-sticker orange">THEATER REEL 🎬</span>
            <h2 style={{ color: 'var(--electric-orange)', fontSize: '32px', margin: '10px 0 0 0' }}>
              OFFICIAL TRAILER & PREVIEWS
            </h2>
          </div>

          {/* Multiple Trailers Switcher */}
          {trailersList.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trailersList.map((t: any, idx: number) => (
                <button
                  key={t.id || t.key}
                  type="button"
                  onClick={() => setSelectedTrailerKey(t.key)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: selectedTrailerKey === t.key ? 'var(--electric-orange)' : 'var(--bg-dark)',
                    color: selectedTrailerKey === t.key ? '#000' : 'var(--off-white)',
                    border: 'var(--border-thick)'
                  }}
                >
                  {t.type ? `${t.type} ${idx + 1}` : `Reel ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTrailerKey ? (
          <div>
            <div 
              style={{ 
                position: 'relative', 
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0, 
                overflow: 'hidden', 
                background: '#000',
                border: 'var(--border-thick)'
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailerKey}?rel=0&modestbranding=1`}
                title={`${movie.title} Trailer`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span>Now Playing: {trailersList.find((t: any) => t.key === selectedTrailerKey)?.name || 'Official Trailer'}</span>
              <a 
                href={`https://www.youtube.com/watch?v=${selectedTrailerKey}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--hot-pink)', textDecoration: 'underline' }}
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-dark)', border: 'var(--border-thick)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>📼</span>
            <h3 style={{ color: 'var(--off-white)', marginBottom: '5px' }}>NO TRAILER BROADCAST AVAILABLE</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No official video reel is currently archived for this title.
            </p>
          </div>
        )}
      </div>

      {/* Review Form & Community Reviews */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left: Review Form */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <div style={{ background: 'var(--charcoal-card)', padding: '30px', border: 'var(--border-thick)', marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--electric-orange)', marginBottom: '20px' }}>WRITE A REVIEW</h2>
            {status === 'authenticated' ? (
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>RATING (1-5 STARS)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))} 
                    style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100px', fontSize: '16px' }} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>YOUR THOUGHTS / CRITIQUE</label>
                  <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    rows={4} 
                    placeholder="Drop your unfiltered opinion..." 
                    style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%', resize: 'vertical' }} 
                    required 
                  />
                </div>
                <button type="submit" className="btn orange" disabled={submitting}>
                  {submitting ? 'TRANSMITTING REVIEW...' : 'PUBLISH REVIEW TO MONGODB'}
                </button>
              </form>
            ) : (
              <div style={{ padding: '20px', background: 'var(--bg-dark)', borderLeft: '4px solid var(--electric-orange)' }}>
                <p style={{ color: 'var(--off-white)', marginBottom: '10px' }}>You must be logged in to post reviews.</p>
                <Link href="/login" className="btn orange" style={{ display: 'inline-block', fontSize: '12px' }}>
                  LOG IN TO REVIEW
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Existing Reviews */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <h2 style={{ color: 'var(--toxic-green)', marginBottom: '20px', fontSize: '26px' }}>
            COMMUNITY DISPATCHES ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div style={{ padding: '30px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No dispatches logged yet for this film. Be the first critic!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map((rev) => (
                <div key={rev._id} style={{ background: 'var(--charcoal-card)', padding: '20px', borderLeft: '5px solid var(--toxic-green)', borderTop: 'var(--border-thick)', borderRight: 'var(--border-thick)', borderBottom: 'var(--border-thick)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--off-white)' }}>
                      👤 {rev.user?.name || 'Anonymous Operative'}
                    </span>
                    <span style={{ color: 'var(--cyber-yellow, #ffe600)', fontWeight: 'bold' }}>
                      ★ {rev.rating}/5
                    </span>
                  </div>
                  <p style={{ color: 'var(--off-white)', fontSize: '15px', lineHeight: '1.6' }}>
                    "{rev.text}"
                  </p>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '12px' }}>
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
