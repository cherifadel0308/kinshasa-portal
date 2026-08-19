'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const COMMUNES = [
  'Gombe', 'Limete', 'Ngaliema', "N'sele", "N'djili", 'Kintambo', 
  'Barumbu', 'Kinshasa', 'Lingwala', 'Kasa-Vubu', 'Bandalungwa', 
  'Kalamu', 'Ngiri-Ngiri', 'Bumbu', 'Selembao', 'Makala', 'Ngaba', 
  'Lemba', 'Matete', 'Masina', 'Kimbanseke', 'Mont-Ngafula', 'Maluku', 'Ouanza'
];

export default function BackofficePage() {
  const [activeTab, setActiveTab] = useState<'place' | 'event'>('place');
  const [commune, setCommune] = useState('Gombe');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Place State
  const [placeName, setPlaceName] = useState('');
  const [vertical, setVertical] = useState('kin_food');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('$$');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [placeDesc, setPlaceDesc] = useState('');

  // Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('Concert');
  const [eventDesc, setEventDesc] = useState('');

  const handlePublishPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const { error } = await supabase.from('places').insert([{
        name: placeName,
        commune,
        vertical,
        address,
        budget,
        google_maps_url: googleMapsUrl || null,
        description: placeDesc,
        is_label_recommended: true
      }]);
      if (error) throw error;
      setStatusMsg({ type: 'success', text: `Lieu "${placeName}" ajouté à la sélection KINSHASA LABEL !` });
      setPlaceName(''); setPlaceDesc(''); setAddress(''); setGoogleMapsUrl('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally { setSubmitting(false); }
  };

  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const { error } = await supabase.from('events').insert([{
        title: eventTitle,
        commune,
        event_date: eventDate || new Date().toISOString().split('T')[0],
        category: eventCategory,
        description: eventDesc,
        is_weekend_featured: true
      }]);
      if (error) throw error;
      setStatusMsg({ type: 'success', text: `Événement "${eventTitle}" ajouté à KIN WEEKEND !` });
      setEventTitle(''); setEventDesc('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally { setSubmitting(false); }
  };

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 28px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0, letterSpacing: '1px' }}>KINSHASA LABEL — Backoffice Curation</h1>
        <Link href="/" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>← Voir le Média</Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {statusMsg && (
          <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold', fontSize: '13px', backgroundColor: statusMsg.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: statusMsg.type === 'success' ? '#4ade80' : '#f87171', border: `1px solid ${statusMsg.type === 'success' ? '#22c55e' : '#ef4444'}` }}>
            {statusMsg.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('place')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'place' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            📍 Ajouter un Lieu (100 KIN)
          </button>
          <button onClick={() => setActiveTab('event')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'event' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            🎉 Ajouter KIN WEEKEND
          </button>
        </div>

        {activeTab === 'place' && (
          <form onSubmit={handlePublishPlace} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>Sélection 100 KIN (Lieu Recommandé)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Commune</label>
                <select value={commune} onChange={(e) => setCommune(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Verticale</label>
                <select value={vertical} onChange={(e) => setVertical(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  <option value="kin_food">🍔 KIN FOOD (Où bien manger)</option>
                  <option value="kin_places">📍 KIN PLACES (Lieux à découvrir)</option>
                  <option value="kin_culture">🎨 KIN CULTURE (Culture & Musique)</option>
                  <option value="kin_style">👗 KIN STYLE (Mode & Créateurs)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Nom du Lieu *</label>
              <input type="text" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required placeholder="ex: Le Cercle de la Gombe" style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Adresse / Repère</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ex: Av. Blvd 30 Juin" style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Budget Indicatif</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  <option value="$">$ (Abordable)</option>
                  <option value="$$">$$ (Moyen)</option>
                  <option value="$$$">$$$ (Premium / High-End)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Lien Google Maps / Itinéraire (Optional)</label>
              <input type="url" value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Pourquoi y aller ? *</label>
              <textarea value={placeDesc} onChange={(e) => setPlaceDesc(e.target.value)} required rows={4} placeholder="Ce qui rend cet endroit unique et authentique..." style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {submitting ? 'Enregistrement...' : 'Certifier & Publier dans 100 KIN →'}
            </button>
          </form>
        )}

        {activeTab === 'event' && (
          <form onSubmit={handlePublishEvent} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', color: '#a855f7', marginTop: 0, marginBottom: '20px' }}>Rendez-vous KIN WEEKEND</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Commune</label>
                <select value={commune} onChange={(e) => setCommune(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Date de l'Événement</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Catégorie</label>
                <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  <option value="Concert">🎶 Concert & Musique</option>
                  <option value="Gastronomie">🍽️ Gastronomie / Resto</option>
                  <option value="Exposition">🎨 Exposition / Art</option>
                  <option value="Loisirs">🌊 Loisirs & Nature</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Titre de l'Événement *</label>
              <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required placeholder="ex: Live Jazz & BBQ au Bord du Fleuve" style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Détails de l'Événement *</label>
              <textarea value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} required rows={4} placeholder="Heure, lieu précis, artiste, réservation..." style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {submitting ? 'Enregistrement...' : 'Ajouter à la Sélection du Weekend →'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
