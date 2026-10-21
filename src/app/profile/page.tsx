'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch('/api/user/profile')
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setProfileData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return <div style={{ padding: '50px', color: 'var(--toxic-green)' }}>LOADING IDENTITY FROM MONGODB...</div>;
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

      <div className="comic-modal-content" style={{ maxWidth: '650px', margin: '0' }}>
        <h2 style={{ color: 'var(--toxic-green)', marginBottom: '10px' }}>
          {profileData?.name || session.user?.name}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Email: {profileData?.email || session.user?.email}</p>
        <p style={{ color: 'var(--text-muted)' }}>
          Role: <span style={{ color: 'var(--electric-orange)', fontWeight: 'bold' }}>{(profileData?.role || (session.user as any)?.role || 'user').toUpperCase()}</span>
        </p>
        {profileData?.createdAt && (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Operative Since: {new Date(profileData.createdAt).toLocaleDateString()}
          </p>
        )}
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/watchlist" style={{ flex: 1, minWidth: '150px', textDecoration: 'none' }}>
            <div style={{ background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--electric-orange)', fontSize: '16px' }}>HIT LIST</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--off-white)', marginTop: '10px' }}>
                {profileData?.watchlistCount ?? 0}
              </p>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>View targets →</span>
            </div>
          </Link>

          <Link href="/favorites" style={{ flex: 1, minWidth: '150px', textDecoration: 'none' }}>
            <div style={{ background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--hot-pink)', fontSize: '16px' }}>OBSESSIONS</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--off-white)', marginTop: '10px' }}>
                {profileData?.favoritesCount ?? 0}
              </p>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>View favorites →</span>
            </div>
          </Link>

          <Link href="/reviews" style={{ flex: 1, minWidth: '150px', textDecoration: 'none' }}>
            <div style={{ background: 'var(--charcoal-card)', padding: '20px', border: 'var(--border-thick)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--toxic-green)', fontSize: '16px' }}>REVIEWS</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--off-white)', marginTop: '10px' }}>
                {profileData?.reviewCount ?? 0}
              </p>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>View reviews →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
