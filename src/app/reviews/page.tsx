'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Reviews() {
  const { status } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/user/reviews')
        .then(res => res.json())
        .then(data => {
          if (data.reviews) setReviews(data.reviews);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status]);

  if (loading) {
    return <div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>LOADING LOGS...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <section className="page active" style={{ padding: '40px' }}>
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--electric-orange)' }}>YOU MUST LOG IN TO VIEW YOUR REVIEWS</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">CRITIC'S CORNER 💬</span>
          <h1 className="section-toxic-title">MY REVIEWS</h1>
          <span className="section-toxic-desc">Everything you've said about the underground.</span>
        </div>
      </div>
      
      {reviews.length === 0 ? (
        <div style={{ padding: '40px', background: 'var(--charcoal-card)', border: 'var(--border-thick)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>NO REVIEWS POSTED YET</h2>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map(rev => (
            <div key={rev._id} style={{ display: 'flex', gap: '20px', background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)' }}>
              {rev.posterPath && (
                <Link href={`/movie/${rev.movieId}`}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${rev.posterPath}`} 
                    alt="Poster" 
                    style={{ width: '100px', height: '150px', objectFit: 'cover', border: '2px solid var(--toxic-green)' }} 
                  />
                </Link>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Link href={`/movie/${rev.movieId}`} style={{ textDecoration: 'none' }}>
                    <h2 style={{ color: 'var(--toxic-green)' }}>{rev.movieTitle}</h2>
                  </Link>
                  <span style={{ color: 'var(--electric-orange)', fontSize: '20px', fontWeight: 'bold' }}>★ {rev.rating}/5</span>
                </div>
                <p style={{ color: 'var(--off-white)', fontSize: '16px', lineHeight: '1.5' }}>{rev.text}</p>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '15px' }}>
                  {new Date(rev.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
