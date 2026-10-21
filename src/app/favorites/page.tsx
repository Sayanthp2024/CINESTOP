'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Favorites() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
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
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  const handleRemove = async (movieId: number) => {
    try {
      const res = await fetch('/api/user/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, action: 'remove', listType: 'favorites' }),
      });
      if (res.ok) {
        setMovies(movies.filter((m) => m.id !== movieId));
      } else {
        alert('Failed to remove obsession');
      }
    } catch {
      alert('Error updating database');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>LOADING OBSESSIONS...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <section className="page active" style={{ padding: '40px' }}>
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--electric-orange)' }}>YOU MUST LOG IN TO VIEW YOUR OBSESSIONS</h2>
          <Link href="/login" className="btn orange" style={{ marginTop: '20px', display: 'inline-block' }}>LOG IN</Link>
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
          <span className="section-toxic-desc">Your ultimate cinematic obsessions stored in MongoDB.</span>
        </div>
      </div>

      {movies.length === 0 ? (
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>NO OBSESSIONS ADDED YET</h2>
          <Link href="/movies" className="btn orange" style={{ marginTop: '20px', display: 'inline-block' }}>BROWSE VAULT</Link>
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
                  <span className="comic-sticker orange">OBSESSION</span>
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
                    💔 REMOVE OBSESSION
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
