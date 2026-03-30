 'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Usluge() {
  const [usluge, setUsluge] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUsluga, setEditUsluga] = useState(null);
  const [form, setForm] = useState({ name: '', duration: '', price: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchUsluge();
  }, []);

  const fetchUsluge = async () => {
    const res = await fetch('http://localhost:5000/api/services');
    const data = await res.json();
    setUsluge(data);
  };

  const openDodaj = () => {
    setEditUsluga(null);
    setForm({ name: '', duration: '', price: '', description: '' });
    setShowForm(true);
  };

  const openUredi = (usluga) => {
    setEditUsluga(usluga);
    setForm({ name: usluga.name, duration: usluga.duration, price: usluga.price, description: usluga.description || '' });
    setShowForm(true);
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
    fetchUsluge();
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigurno želiš obrisati ovu uslugu?')) return;
    await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
    fetchUsluge();
  };

  const toggleActive = async (usluga) => {
    await fetch(`http://localhost:5000/api/services/${usluga.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...usluga, active: !usluga.active })
    });
    fetchUsluge();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Upravljanje uslugama</h1>
            <p className="text-gray-500 text-sm">Dodaj, uredi ili obriši usluge</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/admin')}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
              ← Nazad
            </button>
            <button onClick={openDodaj}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm">
              + Dodaj uslugu
            </button>
          </div>
        </div>

        {/* Forma */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl border mb-6">
            <h2 className="font-semibold mb-4">{editUsluga ? 'Uredi uslugu' : 'Nova usluga'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-gray-600 block mb-1">Naziv usluge</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" placeholder="npr. Šišanje"/>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Trajanje (min)</label>
                <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" placeholder="30"/>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Cijena (KM)</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" placeholder="15"/>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 block mb-1">Opis (opciono)</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" rows={2}/>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 border rounded-lg text-sm">Odustani</button>
              <button onClick={handleSave}
                disabled={!form.name || !form.duration || !form.price}
                className="flex-1 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-40">
                {editUsluga ? 'Sačuvaj izmjene' : 'Dodaj uslugu'}
              </button>
            </div>
          </div>
        )}

        {/* Lista usluga */}
        <div className="space-y-3">
          {usluge.map(usluga => (
            <div key={usluga.id} className="bg-white p-5 rounded-xl border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{usluga.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${usluga.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {usluga.active ? 'Aktivna' : 'Neaktivna'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{usluga.duration} min · {usluga.price} KM</p>
                  {usluga.description && <p className="text-xs text-gray-400 mt-0.5">{usluga.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(usluga)}
                  className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50">
                  {usluga.active ? 'Deaktiviraj' : 'Aktiviraj'}
                </button>
                <button onClick={() => openUredi(usluga)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100">
                  Uredi
                </button>
                <button onClick={() => handleDelete(usluga.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100">
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
