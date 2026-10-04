import Link from 'next/link';

export default function Genres() {
  const genres = ['Action', 'Horror', 'Sci-Fi', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Documentary', 'Crime', 'Romance', 'Mystery', 'Fantasy'];

  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">GENRE STICKERS 💥</span>
          <h1 className="section-toxic-title">ALL GENRES</h1>
          <span className="section-toxic-desc">Pick your poison.</span>
        </div>
      </div>

      <div className="chaos-grid">
        {genres.map((g) => (
          <Link href={`/movies?q=${g}`} key={g} className="chaos-card" style={{ textDecoration: 'none' }}>
            <h3>{g}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
