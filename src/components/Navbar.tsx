'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="toxic-header">
        <div className="header-container">
          
          <Link href="/" className="brand-logo">
            <span className="brand-icon">🎬</span>
            <div className="brand-title-wrap">
              <div className="brand-title">CINE<span>STOP</span></div>
              <span className="brand-tag">UNDERGROUND CINEMA ZINE 💥</span>
            </div>
          </Link>

          <nav id="mainNav">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
            <Link href="/trending" className={pathname === '/trending' ? 'active' : ''}>Trending</Link>
            <Link href="/movies" className={pathname === '/movies' ? 'active' : ''}>Movies</Link>
            <Link href="/genres" className={pathname === '/genres' ? 'active' : ''}>Genres</Link>
            <Link href="/watchlist" className={pathname === '/watchlist' ? 'active' : ''}>Watchlist <span className="nav-badge" id="navWatchlistBadge"></span></Link>
            <Link href="/favorites" className={pathname === '/favorites' ? 'active' : ''}>Favorites <span className="nav-badge fav" id="navFavBadge"></span></Link>
            <Link href="/reviews" className={pathname === '/reviews' ? 'active' : ''}>Reviews</Link>
            <Link href="/recommendations" className={pathname === '/recommendations' ? 'active' : ''}>Picks For You</Link>
            <Link href="/chatbot" className={pathname === '/chatbot' ? 'active' : ''} style={{ color: 'var(--toxic-green)', fontWeight: 'bold' }}>Cine-Bot 🤖</Link>
          </nav>

          <div className="nav-actions">
            <form 
              className="toxic-search" 
              onSubmit={(e) => {
                e.preventDefault();
                const q = (document.getElementById('navbarSearch') as HTMLInputElement).value;
                if (q.trim()) {
                  window.location.href = `/movies?q=${encodeURIComponent(q.trim())}`;
                }
              }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="navbarSearch"
                placeholder="Search movies..."
              />
            </form>

            {session?.user ? (
              <>
                <Link href="/profile" className="nav-action-btn" title="My Profile">
                  <i className="fa-solid fa-user"></i>
                  <span>{session.user.name?.split(' ')[0] || 'Profile'}</span>
                </Link>

                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="nav-action-btn hq-btn" title="Admin Panel">
                    <i className="fa-solid fa-gear"></i>
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="nav-action-btn"
                  title="Sign Out"
                  style={{ background: 'transparent', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: 'var(--hot-pink)' }}></i>
                  <span>Exit</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn orange" style={{ fontSize: '12px', padding: '8px 16px', textDecoration: 'none' }}>
                <i className="fa-solid fa-key" style={{ marginRight: '6px' }}></i> LOGIN
              </Link>
            )}

            <button className="nav-action-btn menu-btn" onClick={toggleMenu} title="Open Menu" aria-label="Open navigation menu">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`} id="mobileMenu">
        <Link href="/" onClick={toggleMenu}>🏠 Home</Link>
        <Link href="/movies" onClick={toggleMenu}>🎬 Movies</Link>
        <Link href="/genres" onClick={toggleMenu}>💥 Genres</Link>
        <Link href="/watchlist" onClick={toggleMenu}>🎯 Watchlist</Link>
        <Link href="/favorites" onClick={toggleMenu}>❤️ Favorites</Link>
        <Link href="/reviews" onClick={toggleMenu}>💬 Reviews</Link>
        <Link href="/recommendations" onClick={toggleMenu}>⭐ Picks For You</Link>
        <Link href="/chatbot" onClick={toggleMenu} style={{ color: 'var(--toxic-green)' }}>🤖 Cine-Bot AI</Link>
        {session?.user ? (
          <>
            <Link href="/profile" onClick={toggleMenu}>👤 Profile ({session.user.name})</Link>
            {(session.user as any)?.role === 'admin' && (
              <Link href="/admin" onClick={toggleMenu}>⚙️ Admin Panel</Link>
            )}
            <button
              onClick={() => { toggleMenu(); signOut({ callbackUrl: '/login' }); }}
              style={{ background: 'none', border: 'none', color: 'var(--hot-pink)', textAlign: 'left', padding: '12px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🚪 Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={toggleMenu} style={{ color: 'var(--cyber-yellow, #ffe600)', fontWeight: 'bold' }}>🔑 Sign In / Login</Link>
            <Link href="/register" onClick={toggleMenu}>⚡ Register New Account</Link>
          </>
        )}
      </div>
    </>
  );
}
