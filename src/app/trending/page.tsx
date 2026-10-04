import { Suspense } from 'react';
import DynamicMovieGrid from '@/components/DynamicMovieGrid';

export default function TrendingPage() {
  return (
    <section className="page active" style={{ padding: '20px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">VIRAL OUTBREAK ☣️</span>
          <h1 className="section-toxic-title">TRENDING NOW</h1>
          <span className="section-toxic-desc">
            The most watched and hyped underground hits in the last 24 hours.
          </span>
        </div>
      </div>

      <Suspense fallback={<div style={{ color: 'var(--toxic-green)' }}>SCANNING RADAR...</div>}>
        <DynamicMovieGrid customEndpoint="/api/movies/trending" />
      </Suspense>
    </section>
  );
}
