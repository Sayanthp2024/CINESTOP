'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function RegisterContent() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
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
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password, 
          role 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration. Check MongoDB connection.');
    } finally {
      setLoading(false);
    }
  };

  const fillSample = (sampleRole: 'admin' | 'user') => {
    if (sampleRole === 'admin') {
      setName('Vault Director');
      setEmail('admin@cinestop.com');
      setPassword('admin123');
      setRole('admin');
    } else {
      setName('Alex Cinephile');
      setEmail('user@cinestop.com');
      setPassword('user123');
      setRole('user');
    }
    setError('');
  };

  return (
    <section className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div className="comic-modal-content" style={{ width: '100%', maxWidth: '520px', padding: '35px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title">JOIN THE CHAOS</h2>
          <span className="comic-sticker pink">NEW BLOOD</span>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '14px' }}>
          Create an operative account or enroll as a vault admin.
        </p>

        {error && <div style={{ color: 'var(--electric-orange)', marginBottom: '20px', fontWeight: 'bold' }}>❌ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="toxic-input-wrap">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="YOUR CODENAME / NAME"
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
              placeholder="PASSWORD (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: 'var(--off-white)' }}>
              ACCOUNT TYPE:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`btn full ${role === 'user' ? 'pink' : ''}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  background: role === 'user' ? 'var(--hot-pink)' : 'var(--charcoal-card)',
                  color: 'var(--off-white)',
                  border: 'var(--border-thick)'
                }}
                onClick={() => setRole('user')}
              >
                👤 Operative (User)
              </button>
              <button
                type="button"
                className={`btn full ${role === 'admin' ? 'orange' : ''}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  background: role === 'admin' ? 'var(--electric-orange)' : 'var(--charcoal-card)',
                  color: role === 'admin' ? '#000' : 'var(--off-white)',
                  border: 'var(--border-thick)'
                }}
                onClick={() => setRole('admin')}
              >
                🛡️ Vault Director (Admin)
              </button>
            </div>
          </div>

          <button type="submit" className="btn primary full" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'INITIATING RECRUIT...' : 'ENLIST NOW'}
          </button>
        </form>

        {/* PRE-FILL SAMPLE CREDENTIALS */}
        <div style={{ marginTop: '25px', padding: '15px', background: 'var(--charcoal-card)', border: 'var(--border-thick)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyber-yellow, #ffe600)' }}>
              ⚡ QUICK FILL SAMPLES
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-populates form</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn orange" 
              style={{ flex: 1, padding: '7px', fontSize: '11px' }}
              onClick={() => fillSample('admin')}
            >
              🛡️ Fill Sample Admin
            </button>
            <button 
              type="button" 
              className="btn pink" 
              style={{ flex: 1, padding: '7px', fontSize: '11px' }}
              onClick={() => fillSample('user')}
            >
              👤 Fill Sample User
            </button>
          </div>
        </div>

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

export default function Register() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--toxic-green)', padding: '40px', textAlign: 'center' }}>INITIALIZING REGISTRATION...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
