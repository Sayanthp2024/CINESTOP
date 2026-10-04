'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DynamicMovieGrid({ defaultQuery = '', customEndpoint = '' }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || defaultQuery;
  
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // If a custom API endpoint is provided, use it. Otherwise, use search/popular logic.
    let endpoint = customEndpoint;
    if (!endpoint) {
      endpoint = q ? `/api/movies/search?q=${encodeURIComponent(q)}` : '/api/movies/popular';
    }
    
    fetch(endpoint)
      .then(async (res) => {
        if (!res.ok) throw new Error('API Error');
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        if (data.results) {
          setMovies(data.results.slice(0, 12)); // Display up to 12 results
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load movies:', err);
        setLoading(false);
      });
  }, [q]);

  const addToHitList = async (movieId: number) => {
    try {
      const res = await fetch('/api/user/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, action: 'add', listType: 'watchlist' }),
      });
      if (res.status === 401) {
        alert('You must be logged in to add movies to your Hit List!');
        return;
      }
      if (res.ok) {
        alert('Movie successfully added to your Hit List!');
      } else {
        alert('Failed to add movie.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to database.');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', fontFamily: 'var(--font-comic)', textAlign: 'center', padding: '40px' }}>SCANNING THE VAULT...</div>;
  }

  if (movies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <h2>NO CHAOS FOUND {q ? `FOR "${q}"` : ''}</h2>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-comic-card">
          <div className="movie-poster-frame">
            <Link href={`/movie/${movie.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="movie-fallback">🎬</div>
              )}
            </Link>
          </div>
          <div className="movie-info-panel">
            <span className="comic-sticker green">VAULT ITEM</span>
            <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
              <h3 className="movie-title">{movie.title}</h3>
            </Link>
            <div className="movie-meta">
              <span className="rating">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
              <span className="year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn orange full" style={{ flex: 1, padding: '10px 5px', fontSize: '12px' }} onClick={() => addToHitList(movie.id)}>
                + HIT LIST
              </button>
              <button className="btn pink full" style={{ flex: 1, padding: '10px 5px', fontSize: '12px' }} onClick={async () => {
                try {
                  const res = await fetch('/api/user/movies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieId: movie.id, action: 'add', listType: 'favorites' }),
                  });
                  if (res.status === 401) {
                    alert('You must be logged in to add obsessions!');
                    return;
                  }
                  if (res.ok) alert('Added to your Obsessions (Favorites)!');
                  else alert('Failed to add movie.');
                } catch (e) {
                  alert('Error connecting to database.');
                }
              }}>
                ❤️ OBSESS
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
