'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ client_name: '', client_email: '', client_phone: '', notes: '' });
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [takenSlots, setTakenSlots] = useState([]);

  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchTaken = () => {
      fetch(`http://localhost:5000/api/bookings/taken?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => setTakenSlots(data));
    };

    fetchTaken();
    const interval = setInterval(fetchTaken, 5000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleBooking = async () => {
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: selectedService.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        booking_date: selectedDate,
        booking_time: selectedTime,
        notes: formData.notes
      })
    });
    if (res.ok) setSuccess(true);
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#111110', color: '#e8e6e0', fontFamily: 'system-ui, sans-serif' },
    inner: { maxWidth: 520, margin: '0 auto', padding: '0 20px 48px' },
    card: { background: '#1a1a18', border: '0.5px solid #C9A84C44', borderRadius: 12, padding: 22 },
    input: { background: '#222220', border: '0.5px solid #C9A84C44', color: '#e8e6e0', borderRadius: 8, padding: '10px 13px', width: '100%', fontSize: 13, outline: 'none', marginBottom: 12 },
    label: { fontSize: 10, color: '#888780', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 },
    btnGold: { flex: 1, padding: '11px 0', background: '#C9A84C', color: '#111110', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
    btnGhost: { flex: 1, padding: '11px 0', background: 'transparent', border: '0.5px solid #C9A84C44', color: '#888780', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  };

  if (success) return (
    <div style={{ ...s.wrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a18', border: '0.5px solid #C9A84C44', borderRadius: 16, padding: '48px 40px', textAlign: 'center', maxWidth: 320 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1D9E7522', border: '0.5px solid #5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22, color: '#5DCAA5' }}>✓</div>
        <div style={{ fontSize: 19, fontWeight: 500, color: '#C9A84C', marginBottom: 8 }}>Rezervacija uspješna!</div>
        <div style={{ fontSize: 13, color: '#888780', marginBottom: 28 }}>Kontaktirat ćemo vas uskoro na email.</div>
        <button onClick={() => { setSuccess(false); setStep(1); setSelectedService(null); setSelectedTime(''); setFormData({ client_name: '', client_email: '', client_phone: '', notes: '' }); }}
          style={{ ...s.btnGold, flex: 'none', width: '100%' }}>
          Nova rezervacija
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={{ borderBottom: '0.5px solid #C9A84C22', padding: '40px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#C9A84C', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>Dobrodošli</div>
        <h1 style={{ fontSize: 30, fontWeight: 500, color: '#e8e6e0', marginBottom: 8 }}>Salon Prestige</h1>
        <p style={{ fontSize: 13, color: '#888780' }}>Rezervišite vaš termin online — brzo i jednostavno</p>
      </div>

      <div style={s.inner}>
        {/* Klikabilni koraci */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '28px 0 24px' }}>
          {['Usluga', 'Termin', 'Podaci'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                style={{
                  width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500,
                  background: step > i + 1 ? '#1D9E7522' : step === i + 1 ? '#C9A84C' : '#1a1a18',
                  color: step > i + 1 ? '#5DCAA5' : step === i + 1 ? '#111110' : '#5F5E5A',
                  border: step > i + 1 ? '0.5px solid #5DCAA5' : step === i + 1 ? 'none' : '0.5px solid #C9A84C33',
                  cursor: i + 1 < step ? 'pointer' : 'default',
                }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span
                onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                style={{ fontSize: 12, color: step === i + 1 ? '#C9A84C' : '#5F5E5A', cursor: i + 1 < step ? 'pointer' : 'default' }}>
                {label}
              </span>
              {i < 2 && <div style={{ width: 24, height: 0.5, background: '#C9A84C33', margin: '0 2px' }}/>}
            </div>
          ))}
        </div>

        {/* Korak 1 — Usluga */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map(service => (
              <div key={service.id}
                onClick={() => { setSelectedService(service); setStep(2); }}
                style={{ background: '#1a1a18', border: '0.5px solid #C9A84C44', borderRadius: 10, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#C9A84C44'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: '#e8e6e0', marginBottom: 3 }}>{service.name}</div>
                  <div style={{ fontSize: 11, color: '#5F5E5A' }}>{service.duration} min</div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 500, color: '#C9A84C' }}>{service.price} KM</div>
              </div>
            ))}
          </div>
        )}

        {/* Korak 2 — Termin */}
        {step === 2 && (
          <div style={s.card}>
            <div style={{ borderBottom: '0.5px solid #C9A84C22', paddingBottom: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#888780' }}>Odabrana usluga: <span style={{ color: '#C9A84C' }}>{selectedService?.name}</span></span>
            </div>
            <label style={s.label}>Datum</label>
            <input style={s.input} type="date" value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
              min={new Date().toISOString().slice(0, 10)}/>
            <label style={{ ...s.label, marginBottom: 10 }}>Vrijeme</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 20 }}>
              {times.map(t => {
                const taken = takenSlots.includes(t);
                return (
                  <button key={t} onClick={() => !taken && setSelectedTime(t)}
                    disabled={taken}
                    style={{
                      padding: '8px 0', borderRadius: 7, fontSize: 12, cursor: taken ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                      background: taken ? '#88878011' : selectedTime === t ? '#C9A84C22' : '#222220',
                      border: taken ? '0.5px solid #88878033' : selectedTime === t ? '0.5px solid #C9A84C' : '0.5px solid #C9A84C33',
                      color: taken ? '#444441' : selectedTime === t ? '#C9A84C' : '#e8e6e0',
                      fontWeight: selectedTime === t ? 500 : 400,
                      textDecoration: taken ? 'line-through' : 'none',
                    }}>{t}</button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={s.btnGhost}>Nazad</button>
              <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}
                style={{ ...s.btnGold, opacity: (!selectedDate || !selectedTime) ? 0.4 : 1 }}>Dalje</button>
            </div>
          </div>
        )}

        {/* Korak 3 — Podaci */}
        {step === 3 && (
          <div style={s.card}>
            <div style={{ borderBottom: '0.5px solid #C9A84C22', paddingBottom: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#888780' }}>
                <span style={{ color: '#C9A84C' }}>{selectedService?.name}</span> · {selectedDate} · <span style={{ color: '#C9A84C' }}>{selectedTime}</span>
              </span>
            </div>
            {[['Ime i prezime', 'client_name', 'text', 'Marko Petrović'], ['Email', 'client_email', 'email', 'marko@gmail.com'], ['Telefon', 'client_phone', 'tel', '+387 61 123 456']].map(([label, field, type, ph]) => (
              <div key={field}>
                <label style={s.label}>{label}</label>
                <input style={s.input} type={type} placeholder={ph} value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}/>
              </div>
            ))}
            <label style={s.label}>Napomena (opciono)</label>
            <textarea style={{ ...s.input, resize: 'none', marginBottom: 16 }} rows={2}
              placeholder="Ako imate posebnih zahtjeva..."
              value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}/>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} style={s.btnGhost}>Nazad</button>
              <button onClick={handleBooking} disabled={!formData.client_name || !formData.client_email}
                style={{ ...s.btnGold, opacity: (!formData.client_name || !formData.client_email) ? 0.4 : 1 }}>
                Rezerviši
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}