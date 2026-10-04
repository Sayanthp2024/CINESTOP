import { Suspense } from 'react';
import Link from 'next/link';
import DynamicMovieGrid from '@/components/DynamicMovieGrid';

export default function Home() {
  return (
    <section id="home" className="page active">
      {/* DRAMATIC TOXIC HERO */}
      <div id="heroFeatureArea">
        <article className="hero-comic-feature">
          <div className="hero-comic-content">
            <span className="comic-sticker green">NOW SCREENING</span>
            <h1>WELCOME TO THE TOXIC VAULT</h1>
            <p className="hero-tagline">
              Your underground cinematic repository. No boring algorithms, just pure unfiltered chaos.
            </p>
            <div className="hero-buttons">
              <Link href="/movies" className="btn primary full">
                <i className="fa-solid fa-play"></i> EXPLORE THE VAULT
              </Link>
            </div>
          </div>
          <div className="hero-comic-poster">
            <div className="poster-burst-badge">★ HOT!</div>
            <div className="hero-framed-fallback">🎬</div>
          </div>
        </article>
      </div>

      {/* PICK YOUR CHAOS (GENRE STICKERS) */}
      <section style={{ marginBottom: '50px' }}>
        <div className="section-toxic-header">
          <div>
            <span className="section-toxic-kicker">GENRE STICKERS 💥</span>
            <h2 className="section-toxic-title">PICK YOUR CHAOS</h2>
            <span className="section-toxic-desc">
              Smash any genre sticker to unleash that specific brand of madness
            </span>
          </div>
        </div>

        <div className="chaos-grid">
          <Link href="/genres?q=Action" className="chaos-card">
            <span className="comic-emoji">💥</span>
            <h3>ACTION</h3>
            <p>Fists, explosions & adrenaline rushes</p>
          </Link>
          <Link href="/genres?q=Animation" className="chaos-card">
            <span className="comic-emoji">🧸</span>
            <h3>ANIMATION</h3>
            <p>Halftone multiverses & visual magic</p>
          </Link>
          <Link href="/genres?q=Comedy" className="chaos-card">
            <span className="comic-emoji">😂</span>
            <h3>COMEDY</h3>
            <p>Unfiltered satire & riotous laughs</p>
          </Link>
          <Link href="/genres?q=Drama" className="chaos-card">
            <span className="comic-emoji">🎭</span>
            <h3>DRAMA</h3>
            <p>Gritty character studies & raw tension</p>
          </Link>
          <Link href="/genres?q=Sci-Fi" className="chaos-card">
            <span className="comic-emoji">🚀</span>
            <h3>SCI-FI</h3>
            <p>Cosmic wormholes & cybernetic nightmares</p>
          </Link>
          <Link href="/genres?q=Adventure" className="chaos-card">
            <span className="comic-emoji">🗺️</span>
            <h3>ADVENTURE</h3>
            <p>Grand odysseys into wild frontiers</p>
          </Link>
        </div>
      </section>

      {/* POPULAR FLICKS CONNECTED TO BACKEND */}
      <section style={{ marginBottom: '50px' }}>
        <div className="section-toxic-header">
          <div>
            <span className="section-toxic-kicker">CROWD FAVORITES ⚡</span>
            <h2 className="section-toxic-title">POPULAR FLICKS</h2>
            <span className="section-toxic-desc">
              Powered by our Next.js API & TMDB!
            </span>
          </div>
          <Link href="/movies" className="section-toxic-btn">
            MORE HITS →
          </Link>
        </div>

        <Suspense fallback={<div style={{ color: 'var(--toxic-green)' }}>SCANNING THE VAULT...</div>}>
          <DynamicMovieGrid customEndpoint="/api/movies/popular" />
        </Suspense>
      </section>
    </section>
  );
}
