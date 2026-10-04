'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch Movie Details via TMDB
    fetch(`/api/movies/details?id=${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));

    // Fetch Reviews
    fetch(`/api/reviews?movieId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews);
        setLoading(false);
      });
  }, [id]);

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

  if (loading || !movie) {
    return <div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>DECRYPTING VAULT FILE...</div>;
  }

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Movie Poster & Details */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''} 
            alt={movie.title} 
            style={{ width: '100%', border: '4px solid var(--electric-orange)', boxShadow: '8px 8px 0 var(--electric-orange)' }}
          />
        </div>
        
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h1 style={{ color: 'var(--toxic-green)', fontSize: '48px', textTransform: 'uppercase', marginBottom: '10px', textShadow: '2px 2px 0 var(--bg-dark)' }}>{movie.title}</h1>
          <div style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            <span className="comic-sticker pink">{movie.release_date?.split('-')[0]}</span>
            <span style={{ marginLeft: '15px' }}>★ {movie.vote_average?.toFixed(1)} / 10</span>
          </div>
          <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>{movie.overview}</p>

          {/* Review Form */}
          <div style={{ background: 'var(--charcoal-card)', padding: '30px', border: 'var(--border-thick)', marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--electric-orange)', marginBottom: '20px' }}>WRITE A REVIEW</h2>
            {status === 'authenticated' ? (
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>RATING (1-5)</label>
                  <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100px' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>YOUR THOUGHTS</label>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%', resize: 'vertical' }} required />
                </div>
                <button type="submit" className="btn orange" disabled={submitting}>
                  {submitting ? 'SUBMITTING...' : 'PUBLISH REVIEW'}
                </button>
              </form>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>You must be logged in to write a review.</p>
            )}
          </div>

          {/* Existing Reviews */}
          <h2 style={{ color: 'var(--toxic-green)', marginBottom: '20px' }}>COMMUNITY REVIEWS</h2>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map((rev) => (
                <div key={rev._id} style={{ background: 'var(--bg-dark)', padding: '20px', borderLeft: '4px solid var(--toxic-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--off-white)' }}>{rev.user?.name || 'Anonymous User'}</span>
                    <span style={{ color: 'var(--hot-pink)' }}>★ {rev.rating}/5</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
