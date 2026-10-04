'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="comic-modal-content" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title">JOIN THE CHAOS</h2>
          <span className="comic-sticker pink">NEW BLOOD</span>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Create an account to track your cinematic obsessions.
        </p>

        {error && <div style={{ color: 'var(--electric-orange)', marginBottom: '20px', fontWeight: 'bold' }}>❌ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="toxic-input-wrap">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="YOUR CODENAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="toxic-input-wrap">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="toxic-input-wrap">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn primary full" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'INITIATING...' : 'ENLIST NOW'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          ALREADY IN THE GANG?{' '}
          <Link href="/login" style={{ color: 'var(--toxic-green)', fontWeight: 'bold', textDecoration: 'underline' }}>
            LOG IN HERE
          </Link>
        </div>
      </div>
    </section>
  );
}
