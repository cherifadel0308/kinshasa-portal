'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const COMMUNES = [
  'Gombe', 'Limete', 'Ngaliema', "N'sele", "N'djili", 'Kintambo', 
  'Barumbu', 'Kinshasa', 'Lingwala', 'Kasa-Vubu', 'Bandalungwa', 
  'Kalamu', 'Ngiri-Ngiri', 'Bumbu', 'Selembao', 'Makala', 'Ngaba', 
  'Lemba', 'Matete', 'Masina', 'Kimbanseke', 'Mont-Ngafula', 'Maluku', 'Ouanza'
];

export default function BackofficePage() {
  const [activeTab, setActiveTab] = useState<'place' | 'event' | 'manage'>('place');
  const [commune, setCommune] = useState('Gombe');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Existing Places List State
  const [placesList, setPlacesList] = useState<any[]>([]);
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);

  // Place Form State
  const [placeName, setPlaceName] = useState('');
  const [vertical, setVertical] = useState('kin_food');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('$$');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [placeDesc, setPlaceDesc] = useState('');

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('Concert');
  const [eventDesc, setEventDesc] = useState('');

  // Fetch all existing places
  const fetchPlaces = async () => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPlacesList(data);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Handle Add OR Update Place
  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    const payload = {
      name: placeName,
      commune,
      vertical,
      address,
      budget,
      google_maps_url: googleMapsUrl || null,
      description: placeDesc,
      is_label_recommended: true
    };

    try {
      if (editingPlaceId) {
        // UPDATE Existing Place
        const { error } = await supabase
          .from('places')
          .update(payload)
          .eq('id', editingPlaceId);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: `Lieu "${placeName}" mis à jour avec succès !` });
      } else {
        // INSERT New Place
        const { error } = await supabase
          .from('places')
          .insert([payload]);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: `Nouveau lieu "${placeName}" ajouté à la sélection KINSHASA LABEL !` });
      }

      resetPlaceForm();
      fetchPlaces();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Populate form for editing
  const startEditing = (place: any) => {
    setEditingPlaceId(place.id);
    setPlaceName(place.name || '');
    setCommune(place.commune || 'Gombe');
    setVertical(place.vertical || 'kin_food');
    setAddress(place.address || '');
    setBudget(place.budget || '$$');
    setGoogleMapsUrl(place.google_maps_url || '');
    setPlaceDesc(place.description || '');
    setActiveTab('place');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Place Form
  const resetPlaceForm = () => {
    setEditingPlaceId(null);
    setPlaceName('');
    setAddress('');
    setGoogleMapsUrl('');
    setPlaceDesc('');
  };

  // Delete Place
  const handleDeletePlace = async (id: number, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) return;

    try {
      const { error } = await supabase.from('places').delete().eq('id', id);
      if (error) throw error;

      setStatusMsg({ type: 'success', text: `Lieu "${name}" supprimé.` });
      fetchPlaces();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  // Handle Event Submit
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
      
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 28px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0, letterSpacing: '1px' }}>
          KINSHASA LABEL — Backoffice Curation
        </h1>
        <Link href="/" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
          ← Voir le Média
        </Link>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Status Notification */}
        {statusMsg && (
          <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold', fontSize: '13px', backgroundColor: statusMsg.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: statusMsg.type === 'success' ? '#4ade80' : '#f87171', border: `1px solid ${statusMsg.type === 'success' ? '#22c55e' : '#ef4444'}` }}>
            {statusMsg.text}
          </div>
        )}

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => { setActiveTab('place'); resetPlaceForm(); }} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'place' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {editingPlaceId ? '✏️ Modifier le Lieu' : '📍 Ajouter un Lieu (100 KIN)'}
          </button>

          <button 
            onClick={() => setActiveTab('manage')} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'manage' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📋 Gérer / Éditer les Lieux ({placesList.length})
          </button>

          <button 
            onClick={() => setActiveTab('event')} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'event' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🎉 Ajouter KIN WEEKEND
          </button>
        </div>

        {/* PLACE FORM (ADD OR EDIT) */}
        {activeTab === 'place' && (
          <form onSubmit={handleSavePlace} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', color: '#38bdf8', margin: 0 }}>
                {editingPlaceId ? `Édition : "${placeName}"` : 'Sélection 100 KIN (Nouveau Lieu)'}
              </h2>
              {editingPlaceId && (
                <button type="button" onClick={resetPlaceForm} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Annuler l'Édition
                </button>
              )}
            </div>

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
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Lien Google Maps / Itinéraire</label>
              <input type="url" value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Pourquoi y aller ? *</label>
              <textarea value={placeDesc} onChange={(e) => setPlaceDesc(e.target.value)} required rows={4} placeholder="Ce qui rend cet endroit unique et authentique..." style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', backgroundColor: editingPlaceId ? '#eab308' : '#2563eb', color: editingPlaceId ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {submitting ? 'Enregistrement...' : editingPlaceId ? 'Enregistrer les Modifications →' : 'Certifier & Publier dans 100 KIN →'}
            </button>
          </form>
        )}

        {/* MANAGE PLACES TAB */}
        {activeTab === 'manage' && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>
              Liste des Lieux Enregistrés ({placesList.length})
            </h2>

            {placesList.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun lieu enregistré dans la base de données.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {placesList.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {item.vertical}
                        </span>
                        <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 'bold' }}>{item.commune}</span>
                        <span style={{ fontSize: '11px', color: '#eab308' }}>{item.budget}</span>
                      </div>
                      <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px 0', fontWeight: 'bold' }}>{item.name}</h3>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, maxWidth: '600px' }}>{item.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => startEditing(item)} style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                        ✏️ Éditer
                      </button>
                      <button onClick={() => handleDeletePlace(item.id, item.name)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENT FORM */}
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
