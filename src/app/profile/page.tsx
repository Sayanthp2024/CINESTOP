'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div style={{ padding: '50px', color: 'var(--toxic-green)' }}>LOADING IDENTITY...</div>;
  }

  if (!session) return null;

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">IDENTITY ESTABLISHED 👤</span>
          <h1 className="section-toxic-title">MY PROFILE</h1>
        </div>
        <button className="btn pink" onClick={() => signOut()}>
          LOGOUT
        </button>
      </div>

      <div className="comic-modal-content" style={{ maxWidth: '600px', margin: '0' }}>
        <h2 style={{ color: 'var(--toxic-green)', marginBottom: '10px' }}>{session.user?.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Email: {session.user?.email}</p>
        <p style={{ color: 'var(--text-muted)' }}>Role: {(session.user as any)?.role || 'User'}</p>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
          <div style={{ background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)', flex: 1 }}>
            <h3 style={{ color: 'var(--electric-orange)' }}>HIT LIST</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
          </div>
          <div style={{ background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)', flex: 1 }}>
            <h3 style={{ color: 'var(--hot-pink)' }}>OBSESSIONS</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
          </div>
        </div>
      </div>
    </section>
  );
}
