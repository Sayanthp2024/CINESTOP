'use client';

import { Suspense } from 'react';
import DynamicMovieGrid from '@/components/DynamicMovieGrid';
import Link from 'next/link';

export default function MoviesPage() {
  return (
    <section className="page active" style={{ padding: '20px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">REPERTORY VAULT 🔍</span>
          <h1 className="section-toxic-title">FIND YOUR NEXT OBSESSION</h1>
          <span className="section-toxic-desc">
            Filter through our entire underground database of cult celluloid.
          </span>
        </div>
      </div>

      <div className="search-hero-box" style={{ marginBottom: '40px' }}>
        <div className="filter-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <form 
            className="toxic-input-wrap" 
            style={{ flex: 1, minWidth: '250px' }}
            action="/movies"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" name="q" placeholder="Search by title, director, keyword..." />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
          <div className="toxic-input-wrap">
            <select onChange={(e) => window.location.href = `/movies?q=${e.target.value}`}>
              <option value="">ALL GENRES 💥</option>
              <option value="Action">Action</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
            <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
          </div>
        </div>
      </div>

      <Suspense fallback={<div style={{ color: 'var(--toxic-green)' }}>SCANNING THE VAULT...</div>}>
        <DynamicMovieGrid />
      </Suspense>
    </section>
  );
}
