'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [posterPath, setPosterPath] = useState('');
  const [addingMovie, setAddingMovie] = useState(false);

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews);
        setLoading(false);
      });
  }, []);

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMovie(true);
    try {
      const res = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          overview,
          release_date: releaseDate,
          poster_path: posterPath,
          vote_average: 10, // Give custom vault movies a max rating
        }),
      });
      if (res.ok) {
        alert('Custom Movie injected into the vault successfully!');
        setTitle('');
        setOverview('');
        setReleaseDate('');
        setPosterPath('');
      } else {
        alert('Failed to add movie');
      }
    } catch (err) {
      alert('Error connecting to database');
    }
    setAddingMovie(false);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(rev => rev._id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch (e) {
      alert('Error connecting to database');
    }
  };

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">SYSTEM HQ ⚙️</span>
          <h1 className="section-toxic-title">ADMIN PANEL</h1>
          <span className="section-toxic-desc">Manage the underground vault.</span>
        </div>
      </div>

      <div className="comic-modal-content" style={{ border: '3px solid var(--electric-orange)', boxShadow: '8px 8px 0px var(--electric-orange)', marginBottom: '40px' }}>
        <h2 style={{ color: 'var(--electric-orange)' }}>DATABASE STATUS: ONLINE</h2>
        <p style={{ marginTop: '20px', color: 'var(--off-white)' }}>
          Welcome to the command center. Use the tools below to moderate the community and inject manual overrides into the movie vault.
        </p>
      </div>

      <h2 style={{ color: 'var(--electric-orange)', marginBottom: '20px' }}>INJECT CUSTOM MOVIE</h2>
      <div style={{ background: 'var(--charcoal-card)', padding: '30px', border: 'var(--border-thick)', marginBottom: '40px' }}>
        <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>TITLE</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>OVERVIEW / DESCRIPTION</label>
            <textarea value={overview} onChange={(e) => setOverview(e.target.value)} required rows={3} style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>RELEASE DATE (YYYY-MM-DD)</label>
              <input type="text" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>POSTER URL (Optional)</label>
              <input type="text" value={posterPath} onChange={(e) => setPosterPath(e.target.value)} style={{ background: 'var(--bg-dark)', color: 'var(--off-white)', padding: '10px', border: 'var(--border-thick)', width: '100%' }} />
            </div>
          </div>
          <button type="submit" className="btn orange" disabled={addingMovie}>
            {addingMovie ? 'INJECTING...' : '+ OVERRIDE & INJECT MOVIE'}
          </button>
        </form>
      </div>

      <h2 style={{ color: 'var(--toxic-green)', marginBottom: '20px' }}>CONTENT MODERATION (REVIEWS)</h2>
      {loading ? (
        <div style={{ color: 'var(--off-white)' }}>LOADING MODERATION QUEUE...</div>
      ) : reviews.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>No reviews in the database.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.map(rev => (
            <div key={rev._id} style={{ background: 'var(--charcoal-card)', padding: '20px', borderLeft: '5px solid var(--hot-pink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: 'var(--toxic-green)' }}>{rev.movieTitle}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>
                    By: {rev.user?.name || 'Unknown'} ({rev.user?.email || 'N/A'}) - Rating: {rev.rating}/5
                  </p>
                  <p style={{ color: 'var(--off-white)', fontSize: '16px' }}>"{rev.text}"</p>
                </div>
                <button 
                  onClick={() => handleDeleteReview(rev._id)} 
                  className="btn pink" 
                  style={{ fontSize: '12px', padding: '10px' }}
                >
                  FLAG & DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
