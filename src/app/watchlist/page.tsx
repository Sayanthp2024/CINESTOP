'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Watchlist() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = () => {
    fetch('/api/user/movies?listType=watchlist')
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setMovies(data.results);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'authenticated') {
      fetchWatchlist();
    }
  }, [status]);

  const handleRemove = async (movieId: number) => {
    try {
      const res = await fetch('/api/user/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, action: 'remove', listType: 'watchlist' }),
      });
      if (res.ok) {
        setMovies(movies.filter((m) => m.id !== movieId));
      } else {
        alert('Failed to remove from hit list');
      }
    } catch {
      alert('Error updating database');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>LOADING HIT LIST...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <section className="page active" style={{ padding: '40px' }}>
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--electric-orange)' }}>YOU MUST LOG IN TO VIEW YOUR HIT LIST</h2>
          <Link href="/login" className="btn orange" style={{ marginTop: '20px', display: 'inline-block' }}>LOG IN</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">TARGETS ACQUIRED 🎯</span>
          <h1 className="section-toxic-title">MY WATCHLIST</h1>
          <span className="section-toxic-desc">Movies you are hunting down in MongoDB.</span>
        </div>
      </div>

      {movies.length === 0 ? (
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>YOUR HIT LIST IS EMPTY</h2>
          <Link href="/movies" className="btn orange" style={{ marginTop: '20px', display: 'inline-block' }}>FIND TARGETS</Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => {
            const poster = movie.poster_path
              ? (movie.poster_path.startsWith('http') || movie.poster_path.startsWith('/')
                  ? movie.poster_path
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
              : null;

            return (
              <div key={movie.id} className="movie-comic-card">
                <div className="movie-poster-frame">
                  <Link href={`/movie/${movie.id}`}>
                    {poster ? (
                      <img
                        src={poster}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="movie-fallback">🎬</div>
                    )}
                  </Link>
                </div>
                <div className="movie-info-panel">
                  <span className="comic-sticker pink">TARGET</span>
                  <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="movie-title">{movie.title}</h3>
                  </Link>
                  <div className="movie-meta">
                    <span className="rating">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                  </div>
                  <button 
                    onClick={() => handleRemove(movie.id)}
                    className="btn pink full"
                    style={{ marginTop: '12px', fontSize: '11px', padding: '8px' }}
                  >
                    ✖ REMOVE TARGET
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
