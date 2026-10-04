'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials. Access denied.');
      setLoading(false);
    } else {
      // Fetch session to check role
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (sessionData?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    }
  };

  return (
    <div className="comic-modal-content" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="modal-title">ACCESS VAULT</h2>
        <span className="comic-sticker orange">SECURE</span>
      </div>

      {registered && (
        <div style={{ color: 'var(--toxic-green)', marginBottom: '20px', fontWeight: 'bold' }}>
          ✅ Registration successful! Please log in.
        </div>
      )}
      
      {error && <div style={{ color: 'var(--electric-orange)', marginBottom: '20px', fontWeight: 'bold' }}>❌ {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        <button type="submit" className="btn orange full" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'AUTHENTICATING...' : 'ENTER VAULT'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        NEED AN ACCOUNT?{' '}
        <Link href="/register" style={{ color: 'var(--hot-pink)', fontWeight: 'bold', textDecoration: 'underline' }}>
          REGISTER HERE
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <section className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Suspense fallback={<div style={{ color: 'var(--toxic-green)' }}>LOADING SECURITY MODULE...</div>}>
        <LoginContent />
      </Suspense>
    </section>
  );
}
