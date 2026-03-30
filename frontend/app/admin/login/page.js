'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
    } else {
      setError('Pogrešan email ili lozinka');
    }
  };

  const s = {
    input: { background: '#222220', border: '0.5px solid #C9A84C44', color: '#e8e6e0', borderRadius: 8, padding: '11px 14px', width: '100%', fontSize: 14, outline: 'none' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111110', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a18', border: '0.5px solid #C9A84C44', borderRadius: 16, padding: 40, width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#C9A84C', marginBottom: 6 }}>Salon Prestige</div>
          <div style={{ fontSize: 13, color: '#888780' }}>Admin prijava</div>
        </div>

        {error && (
          <div style={{ background: '#E24B4A22', border: '0.5px solid #E24B4A44', color: '#F09595', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=""/>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Lozinka</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
        </div>

        <button onClick={handleLogin}
          style={{ width: '100%', padding: '12px 0', background: '#C9A84C', color: '#111110', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Prijavi se
        </button>
      </div>
    </div>
  );
}