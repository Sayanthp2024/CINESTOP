'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingDb, setCheckingDb] = useState(false);

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [posterPath, setPosterPath] = useState('');
  const [addingMovie, setAddingMovie] = useState(false);

  const [geminiStatus, setGeminiStatus] = useState<any>(null);
  const [adminKey, setAdminKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [keyMsg, setKeyMsg] = useState<string | null>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const loadData = () => {
    setCheckingDb(true);
    Promise.all([
      fetch('/api/admin/reviews').then(res => res.json()).catch(() => ({})),
      fetch('/api/admin/users').then(res => res.json()).catch(() => ({})),
      fetch('/api/admin/db-status').then(res => res.json()).catch(() => ({ connected: false })),
      fetch('/api/chat/recommendations').then(res => res.json()).catch(() => ({ configured: false })),
    ]).then(([reviewData, userData, statusData, geminiData]) => {
      if (reviewData?.reviews) setReviews(reviewData.reviews);
      if (userData?.users) setUsers(userData.users);
      if (statusData) setDbStatus(statusData);
      if (geminiData) setGeminiStatus(geminiData);
      setLoading(false);
      setCheckingDb(false);
    }).catch(() => {
      setLoading(false);
      setCheckingDb(false);
    });
  };

  useEffect(() => {
    loadData();
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
          vote_average: 10,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Custom Movie injected into MongoDB vault successfully!');
        setTitle('');
        setOverview('');
        setReleaseDate('');
        setPosterPath('');
        loadData();
      } else {
        alert(data.error || 'Failed to add movie');
      }
    } catch {
      alert('Error connecting to database');
    }
    setAddingMovie(false);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review from MongoDB?')) return;
    
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(rev => rev._id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch {
      alert('Error connecting to database');
    }
  };

  const handleSaveAdminKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim() || savingKey) return;
    setSavingKey(true);
    setKeyMsg('Validating with Google Gemini API...');
    try {
      const res = await fetch('/api/chat/save-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: adminKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeyMsg('✅ Gemini API Key verified and saved to .env.local!');
        setAdminKey('');
        loadData();
      } else {
        setKeyMsg(`❌ ${data.error || 'Failed to verify key'}`);
      }
    } catch {
      setKeyMsg('❌ Server error while saving key');
    } finally {
      setSavingKey(false);
    }
  };

  const handleTestAi = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/chat/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Recommend 3 awesome mind-bending sci-fi films' }),
      });
      const data = await res.json();
      if (data.isGeminiPowered) {
        setTestResult(`✅ Gemini (${data.modelUsed}) Active! Bot commentary: "${data.reply?.slice(0, 90)}..."`);
      } else {
        setTestResult(`⚠️ Fallback Engine Active (Gemini key not configured or failed).`);
      }
    } catch {
      setTestResult('❌ Failed to test AI endpoint.');
    } finally {
      setTestingAi(false);
    }
  };


  return (
    <section className="page active" style={{ padding: '40px' }}>
      <div className="section-toxic-header">
        <div>
          <span className="section-toxic-kicker">SYSTEM HQ ⚙️</span>
          <h1 className="section-toxic-title">ADMIN PANEL</h1>
          <span className="section-toxic-desc">Manage the underground MongoDB vault.</span>
        </div>
      </div>

      {/* Real-Time Database Status Card */}
      <div 
        className="comic-modal-content" 
        style={{ 
          border: `3px solid ${dbStatus?.connected ? 'var(--toxic-green)' : 'var(--electric-orange)'}`, 
          boxShadow: `8px 8px 0px ${dbStatus?.connected ? 'var(--toxic-green)' : 'var(--electric-orange)'}`, 
          marginBottom: '40px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ color: dbStatus?.connected ? 'var(--toxic-green)' : 'var(--electric-orange)', margin: 0 }}>
              DATABASE STATUS: {dbStatus?.connected ? 'ONLINE ✅' : 'ATTENTION REQUIRED ⚠️'}
            </h2>
            <p style={{ marginTop: '10px', color: 'var(--off-white)', fontSize: '15px' }}>
              {dbStatus?.message || (dbStatus?.connected ? 'Connected to MongoDB cluster' : 'Testing connection...')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn pink" 
              onClick={async () => {
                try {
                  const res = await fetch('/api/admin/seed', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    alert('Sample users, admins, and data seeded successfully in MongoDB!');
                    loadData();
                  } else {
                    alert(data.error || 'Seeding failed. Make sure MongoDB Atlas is connected.');
                  }
                } catch {
                  alert('Error connecting to seed endpoint');
                }
              }}
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              🌱 SEED SAMPLE ACCOUNTS
            </button>
            <button 
              type="button"
              className="btn orange" 
              onClick={loadData} 
              disabled={checkingDb}
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              {checkingDb ? 'CHECKING...' : '🔄 RE-TEST CONNECTION'}
            </button>
          </div>
        </div>

        {/* If IP blocked by MongoDB Atlas */}
        {dbStatus && !dbStatus.connected && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 69, 0, 0.15)', borderLeft: '4px solid var(--electric-orange)', color: 'var(--off-white)' }}>
            <h3 style={{ color: 'var(--electric-orange)', marginBottom: '8px', fontSize: '16px' }}>
              👉 MongoDB Atlas Whitelist Required
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Your current public IP is: <strong style={{ color: 'var(--toxic-green)' }}>{dbStatus.recommendedIp || '103.175.137.253'}</strong>.
              <br />
              To allow MongoDB connections:
              <br />
              1. Log into your <strong>MongoDB Atlas Dashboard</strong>.
              <br />
              2. Navigate to <strong>Security &gt; Network Access</strong>.
              <br />
              3. Click <strong>Add IP Address</strong> and add your current IP or allow <code>0.0.0.0/0</code> for development.
              <br />
              4. Once active in Atlas, click the <strong>RE-TEST CONNECTION</strong> button above!
            </p>
          </div>
        )}

        {dbStatus?.connected && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--charcoal-card)', padding: '15px 20px', border: 'var(--border-thick)', flex: 1, minWidth: '130px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>DATABASE</span>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--toxic-green)', margin: '5px 0 0 0' }}>{dbStatus.dbName}</p>
            </div>
            <div style={{ background: 'var(--charcoal-card)', padding: '15px 20px', border: 'var(--border-thick)', flex: 1, minWidth: '130px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>REGISTERED USERS</span>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--cyber-yellow, #ffe600)', margin: '5px 0 0 0' }}>{dbStatus.usersCount}</p>
            </div>
            <div style={{ background: 'var(--charcoal-card)', padding: '15px 20px', border: 'var(--border-thick)', flex: 1, minWidth: '130px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>VAULT MOVIES</span>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--electric-orange)', margin: '5px 0 0 0' }}>{dbStatus.customMoviesCount}</p>
            </div>
            <div style={{ background: 'var(--charcoal-card)', padding: '15px 20px', border: 'var(--border-thick)', flex: 1, minWidth: '130px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL REVIEWS</span>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--hot-pink)', margin: '5px 0 0 0' }}>{dbStatus.reviewsCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Google Gemini AI Engine Card */}
      <div 
        className="comic-modal-content" 
        style={{ 
          border: `3px solid ${geminiStatus?.configured ? 'var(--toxic-green)' : 'var(--electric-orange)'}`, 
          boxShadow: `8px 8px 0px ${geminiStatus?.configured ? 'var(--toxic-green)' : 'var(--electric-orange)'}`, 
          marginBottom: '40px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ color: geminiStatus?.configured ? 'var(--toxic-green)' : 'var(--electric-orange)', margin: 0 }}>
              GOOGLE GEMINI AI: {geminiStatus?.configured ? 'ACTIVE & ONLINE ✅' : 'API KEY REQUIRED ⚡'}
            </h2>
            <p style={{ marginTop: '10px', color: 'var(--off-white)', fontSize: '15px' }}>
              {geminiStatus?.configured 
                ? `Neural engine active with key (${geminiStatus.maskedKey}). Powers Cine-Bot conversational film recommendations.` 
                : 'Connect your Google Gemini API key to enable intelligent AI chatbot recommendations.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn green" 
              onClick={handleTestAi} 
              disabled={testingAi}
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              {testingAi ? 'TESTING GEMINI...' : '⚡ TEST AI RADAR'}
            </button>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn orange" 
              style={{ fontSize: '13px', padding: '10px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              GET FREE KEY ↗
            </a>
          </div>
        </div>

        {testResult && (
          <div style={{ marginTop: '15px', padding: '12px 16px', background: 'var(--bg-dark)', borderLeft: '4px solid var(--toxic-green)', color: 'var(--off-white)', fontSize: '14px' }}>
            {testResult}
          </div>
        )}

        {/* Update Gemini API Key form */}
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <form onSubmit={handleSaveAdminKey} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder={geminiStatus?.configured ? `Update Key (Current: ${geminiStatus.maskedKey})` : "Paste Google Gemini API Key (AIzaSy...)"}
              style={{
                flex: 1,
                minWidth: '280px',
                background: 'var(--bg-dark)',
                color: '#fff',
                border: '2px solid var(--toxic-green)',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={savingKey || !adminKey.trim()}
              className="btn orange"
              style={{ fontSize: '13px', padding: '10px 20px' }}
            >
              {savingKey ? 'VALIDATING WITH GOOGLE...' : 'SAVE TO .ENV.LOCAL 💾'}
            </button>
          </form>
          {keyMsg && (
            <p style={{ marginTop: '10px', fontSize: '13px', fontWeight: 'bold', color: keyMsg.startsWith('✅') ? 'var(--toxic-green)' : 'var(--electric-orange)' }}>
              {keyMsg}
            </p>
          )}
        </div>
      </div>

      <h2 style={{ color: 'var(--electric-orange)', marginBottom: '20px' }}>INJECT CUSTOM MOVIE INTO MONGODB</h2>

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
            {addingMovie ? 'INJECTING INTO MONGODB...' : '+ OVERRIDE & INJECT MOVIE'}
          </button>
        </form>
      </div>

      <h2 style={{ color: 'var(--toxic-green)', marginBottom: '20px' }}>CONTENT MODERATION (REVIEWS IN MONGODB)</h2>
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

      <h2 style={{ color: 'var(--cyber-yellow, #ffe600)', marginTop: '40px', marginBottom: '20px' }}>REGISTERED USERS IN MONGODB ({users.length})</h2>
      {loading ? (
        <div style={{ color: 'var(--off-white)' }}>LOADING USERS...</div>
      ) : users.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>No users found in database.</div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--charcoal-card)', border: 'var(--border-thick)', padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--off-white)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--cyber-yellow, #ffe600)' }}>
                <th style={{ padding: '12px 8px' }}>NAME</th>
                <th style={{ padding: '12px 8px' }}>EMAIL</th>
                <th style={{ padding: '12px 8px' }}>ROLE</th>
                <th style={{ padding: '12px 8px' }}>WATCHLIST</th>
                <th style={{ padding: '12px 8px' }}>FAVORITES</th>
                <th style={{ padding: '12px 8px' }}>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{u.name}</td>
                  <td style={{ padding: '12px 8px' }}>{u.email}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: u.role === 'admin' ? 'var(--electric-orange)' : 'rgba(255,255,255,0.1)',
                      color: u.role === 'admin' ? '#000' : 'var(--off-white)'
                    }}>
                      {u.role ? u.role.toUpperCase() : 'USER'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>{u.watchlist?.length || 0}</td>
                  <td style={{ padding: '12px 8px' }}>{u.favorites?.length || 0}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
