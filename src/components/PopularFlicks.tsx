'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PopularFlicks() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/movies/popular')
      .then(async (res) => {
        if (!res.ok) throw new Error('API Error');
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        if (data.results) {
          setMovies(data.results.slice(0, 8)); // Grab top 8
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load movies:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', fontFamily: 'var(--font-comic)' }}>LOADING CHAOS...</div>;
  }

  return (
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
            <span className="comic-sticker green">Popular</span>
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta">
              <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
              <span className="year">{movie.release_date?.split('-')[0]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
