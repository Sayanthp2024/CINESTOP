import { Suspense } from 'react';
import DynamicMovieGrid from '@/components/DynamicMovieGrid';

export default function Recommendations() {
  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">ALGORITHMIC CHAOS ⭐</span>
          <h1 className="section-toxic-title">PICKS FOR YOU</h1>
          <span className="section-toxic-desc">Curated madness based on your vault history. (Top Rated)</span>
        </div>
      </div>
      
      <Suspense fallback={<div style={{ color: 'var(--toxic-green)' }}>SCANNING ALGORITHM...</div>}>
        <DynamicMovieGrid customEndpoint="/api/user/recommendations" />
      </Suspense>
    </section>
  );
}
