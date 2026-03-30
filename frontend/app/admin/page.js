'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [usluge, setUsluge] = useState([]);
  const [tab, setTab] = useState('rezervacije');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUsluga, setEditUsluga] = useState(null);
  const [form, setForm] = useState({ name: '', duration: '', price: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    const [b, u] = await Promise.all([
      fetch('http://localhost:5000/api/bookings').then(r => r.json()),
      fetch('http://localhost:5000/api/services').then(r => r.json()),
    ]);
    setBookings(b);
    setUsluge(u);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Sigurno želiš obrisati ovu rezervaciju?')) return;
    await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleSave = async () => {
    if (editUsluga) {
      await fetch(`http://localhost:5000/api/services/${editUsluga.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, active: editUsluga.active })
      });
    } else {
      await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setShowForm(false);
    setEditUsluga(null);
    setForm({ name: '', duration: '', price: '', description: '' });
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigurno želiš obrisati ovu uslugu?')) return;
    await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const toggleActive = async (usluga) => {
    await fetch(`http://localhost:5000/api/services/${usluga.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...usluga, active: !usluga.active })
    });
    fetchAll();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#111110', color: '#e8e6e0', fontFamily: 'system-ui, sans-serif' },
    inner: { maxWidth: 960, margin: '0 auto', padding: '32px 24px' },
    btnGhost: { background: 'transparent', border: '0.5px solid #C9A84C44', color: '#C9A84C', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
    btnGold: { background: '#C9A84C', border: 'none', color: '#111110', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
    stats: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 },
    stat: { background: '#1a1a18', border: '0.5px solid #C9A84C22', borderRadius: 12, padding: 16 },
    tabs: { display: 'flex', gap: 4, marginBottom: 20, background: '#1a1a18', padding: 4, borderRadius: 10, border: '0.5px solid #C9A84C22' },
    card: { background: '#1a1a18', border: '0.5px solid #C9A84C22', borderRadius: 12, overflow: 'hidden' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' },
    input: { background: '#222220', border: '0.5px solid #C9A84C44', color: '#e8e6e0', borderRadius: 8, padding: '10px 14px', width: '100%', fontSize: 14, outline: 'none' },
  };

  const tabBtn = (name, label) => (
    <button onClick={() => setTab(name)} style={{
      flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      background: tab === name ? '#C9A84C' : 'transparent',
      color: tab === name ? '#111110' : '#888780',
    }}>{label}</button>
  );

  const badgeStyle = (status) => ({
    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
    background: status === 'confirmed' ? '#1D9E7522' : status === 'cancelled' ? '#E24B4A22' : '#BA751722',
    color: status === 'confirmed' ? '#5DCAA5' : status === 'cancelled' ? '#F09595' : '#EF9F27',
  });

  if (loading) return (
    <div style={{ ...s.wrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888780' }}>Učitavanje...</p>
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.inner}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#C9A84C' }}>Salon Prestige</div>
          <button onClick={logout} style={s.btnGhost}>Odjavi se</button>
        </div>

        {/* Statistike */}
        <div style={s.stats}>
          {[
            { label: 'Ukupno', value: bookings.length, color: '#C9A84C' },
            { label: 'Potvrđeno', value: bookings.filter(b => b.status === 'confirmed').length, color: '#5DCAA5' },
            { label: 'Na čekanju', value: bookings.filter(b => b.status === 'pending').length, color: '#EF9F27' },
          ].map((stat, i) => (
            <div key={i} style={s.stat}>
              <div style={{ fontSize: 12, color: '#888780', marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 500, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabovi */}
        <div style={s.tabs}>
          {tabBtn('rezervacije', 'Rezervacije')}
          {tabBtn('usluge', 'Usluge')}
        </div>

        {/* Tab: Rezervacije */}
        {tab === 'rezervacije' && (
          <div style={s.card}>
            {bookings.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888780' }}>Nema rezervacija</div>
            ) : bookings.map((b, i) => (
              <div key={b.id} style={{ ...s.row, borderBottom: i === bookings.length - 1 ? 'none' : '0.5px solid #C9A84C11' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: '#e8e6e0' }}>{b.client_name}</div>
                  <div style={{ fontSize: 12, color: '#5F5E5A', marginTop: 2 }}>
                    {b.service_name} · {b.booking_date ? b.booking_date.slice(0,10).split('-').reverse().join('.') : ''} · {b.booking_time ? b.booking_time.slice(0,5) : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={badgeStyle(b.status)}>
                    {b.status === 'confirmed' ? 'Potvrđeno' : b.status === 'cancelled' ? 'Otkazano' : 'Na čekanju'}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.status !== 'confirmed' && (
                      <button onClick={() => updateStatus(b.id, 'confirmed')}
                        style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#1D9E7522', color: '#5DCAA5' }}>
                        Potvrdi
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button onClick={() => updateStatus(b.id, 'cancelled')}
                        style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#E24B4A22', color: '#F09595' }}>
                        Otkaži
                      </button>
                    )}
                    <button onClick={() => handleDeleteBooking(b.id)}
                      style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#44444122', color: '#888780' }}>
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Usluge */}
        {tab === 'usluge' && (
          <div>
            {showForm && (
              <div style={{ ...s.card, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#C9A84C', marginBottom: 16 }}>
                  {editUsluga ? 'Uredi uslugu' : 'Nova usluga'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Naziv</label>
                    <input style={s.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="npr. Šišanje"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Trajanje (min)</label>
                    <input style={s.input} type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="30"/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Cijena (KM)</label>
                    <input style={s.input} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="15"/>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: 11, color: '#888780', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Opis</label>
                    <input style={s.input} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Opciono"/>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button onClick={() => { setShowForm(false); setEditUsluga(null); }} style={{ ...s.btnGhost, flex: 1 }}>Odustani</button>
                  <button onClick={handleSave} disabled={!form.name || !form.duration || !form.price}
                    style={{ ...s.btnGold, flex: 1, opacity: (!form.name || !form.duration || !form.price) ? 0.4 : 1 }}>
                    {editUsluga ? 'Sačuvaj' : 'Dodaj'}
                  </button>
                </div>
              </div>
            )}

            {!showForm && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button onClick={() => { setEditUsluga(null); setForm({ name: '', duration: '', price: '', description: '' }); setShowForm(true); }} style={s.btnGold}>
                  + Dodaj uslugu
                </button>
              </div>
            )}

            <div style={s.card}>
              {usluge.map((u, i) => (
                <div key={u.id} style={{ ...s.row, borderBottom: i === usluge.length - 1 ? 'none' : '0.5px solid #C9A84C11' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, color: '#e8e6e0' }}>{u.name}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: u.active ? '#1D9E7522' : '#88878022', color: u.active ? '#5DCAA5' : '#888780' }}>
                        {u.active ? 'Aktivna' : 'Neaktivna'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#5F5E5A', marginTop: 2 }}>{u.duration} min · <span style={{ color: '#C9A84C' }}>{u.price} KM</span></div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleActive(u)}
                      style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '0.5px solid #C9A84C44', background: 'transparent', color: '#C9A84C', cursor: 'pointer' }}>
                      {u.active ? 'Deaktiviraj' : 'Aktiviraj'}
                    </button>
                    <button onClick={() => { setEditUsluga(u); setForm({ name: u.name, duration: u.duration, price: u.price, description: u.description || '' }); setShowForm(true); }}
                      style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: '#1D9E7522', color: '#5DCAA5', cursor: 'pointer' }}>
                      Uredi
                    </button>
                    <button onClick={() => handleDelete(u.id)}
                      style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: '#E24B4A22', color: '#F09595', cursor: 'pointer' }}>
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}