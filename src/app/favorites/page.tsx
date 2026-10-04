'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/user/movies?listType=favorites')
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
    }
  }, [status]);

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>LOADING OBSESSIONS...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <section className="page active" style={{ padding: '40px' }}>
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--electric-orange)' }}>YOU MUST LOG IN TO VIEW YOUR OBSESSIONS</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">TOP TIER ❤️</span>
          <h1 className="section-toxic-title">MY FAVORITES</h1>
          <span className="section-toxic-desc">Your ultimate cinematic obsessions.</span>
        </div>
      </div>

      {movies.length === 0 ? (
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>NO OBSESSIONS ADDED YET</h2>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-comic-card">
              <div className="movie-poster-frame">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="movie-fallback">🎬</div>
                )}
              </div>
              <div className="movie-info-panel">
                <span className="comic-sticker orange">OBSESSION</span>
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  <span className="rating">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
