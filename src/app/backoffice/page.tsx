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
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Database Places
  const [placesList, setPlacesList] = useState<any[]>([]);
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);

  // Editable Form Fields
  const [placeName, setPlaceName] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [commune, setCommune] = useState('Gombe');
  const [vertical, setVertical] = useState('kin_food');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState('$$');
  const [placeDesc, setPlaceDesc] = useState('');

  // Fetch all listed places from Supabase
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

  // Populate form to edit a place
  const startEditing = (place: any) => {
    setEditingPlaceId(place.id);
    setPlaceName(place.name || '');
    setGoogleMapsUrl(place.google_maps_url || '');
    setCommune(place.commune || 'Gombe');
    setVertical(place.vertical || 'kin_food');
    setAddress(place.address || '');
    setBudget(place.budget || '$$');
    setPlaceDesc(place.description || '');
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save changes to database (Insert or Update)
  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    const payload = {
      name: placeName.trim(),
      google_maps_url: googleMapsUrl.trim() || null,
      commune,
      vertical,
      address,
      budget,
      description: placeDesc,
      is_label_recommended: true
    };

    try {
      if (editingPlaceId) {
        // UPDATE existing place name and maps link
        const { error } = await supabase
          .from('places')
          .update(payload)
          .eq('id', editingPlaceId);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: `Lieu "${placeName}" mis à jour avec succès !` });
      } else {
        // INSERT new place
        const { error } = await supabase
          .from('places')
          .insert([payload]);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: `Lieu "${placeName}" ajouté à la sélection KINSHASA LABEL !` });
      }

      resetForm();
      fetchPlaces();
      setActiveTab('manage');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingPlaceId(null);
    setPlaceName('');
    setGoogleMapsUrl('');
    setAddress('');
    setPlaceDesc('');
  };

  const handleDeletePlace = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;

    try {
      const { error } = await supabase.from('places').delete().eq('id', id);
      if (error) throw error;

      setStatusMsg({ type: 'success', text: `Lieu "${name}" supprimé.` });
      fetchPlaces();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Navigation Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 28px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0, letterSpacing: '1px' }}>
          KINSHASA LABEL — Gestion des Lieux
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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('manage')} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'manage' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📋 Liste des Lieux ({placesList.length})
          </button>

          <button 
            onClick={() => { setActiveTab('add'); resetForm(); }} 
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: activeTab === 'add' ? '#2563eb' : '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {editingPlaceId ? '✏️ Modifier le Lieu' : '➕ Ajouter un Nouveau Lieu'}
          </button>
        </div>

        {/* LIST & EDIT TAB */}
        {activeTab === 'manage' && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', color: '#38bdf8', marginTop: 0, marginBottom: '20px' }}>
              Lieux Répertoriés à Kinshasa
            </h2>

            {placesList.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun lieu enregistré dans la base de données.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {placesList.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {item.vertical}
                        </span>
                        <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 'bold' }}>{item.commune}</span>
                        <span style={{ fontSize: '11px', color: '#eab308' }}>{item.budget}</span>
                      </div>

                      {/* Name */}
                      <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                        {item.name}
                      </h3>

                      {/* Google Maps Link Display */}
                      {item.google_maps_url ? (
                        <a href={item.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          📍 {item.google_maps_url}
                        </a>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>⚠️ Pas de lien Google Maps</span>
                      )}

                      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, maxWidth: '600px' }}>{item.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => startEditing(item)} style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                        ✏️ Éditer Le Nom / Lien
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

        {/* ADD / EDIT FORM */}
        {activeTab === 'add' && (
          <form onSubmit={handleSavePlace} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', color: '#38bdf8', margin: 0 }}>
                {editingPlaceId ? `Éditer : "${placeName}"` : 'Nouveau Lieu'}
              </h2>
              {editingPlaceId && (
                <button type="button" onClick={() => { resetForm(); setActiveTab('manage'); }} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Annuler
                </button>
              )}
            </div>

            {/* Edit Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Nom du Lieu *
              </label>
              <input 
                type="text" 
                value={placeName} 
                onChange={(e) => setPlaceName(e.target.value)} 
                required 
                placeholder="ex: Restaurent Abou Tarek" 
                style={{ width: '100%', padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Edit Google Maps URL */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Lien Google Maps / Itinéraire
              </label>
              <input 
                type="url" 
                value={googleMapsUrl} 
                onChange={(e) => setGoogleMapsUrl(e.target.value)} 
                placeholder="https://maps.app.goo.gl/..." 
                style={{ width: '100%', padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} 
              />
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Adresse / Repère</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ex: Av. Blvd 30 Juin" style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Budget</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}>
                  <option value="$">$ (Abordable)</option>
                  <option value="$$">$$ (Moyen)</option>
                  <option value="$$$">$$$ (Premium)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Description *</label>
              <textarea value={placeDesc} onChange={(e) => setPlaceDesc(e.target.value)} required rows={3} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', backgroundColor: editingPlaceId ? '#eab308' : '#2563eb', color: editingPlaceId ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              {submitting ? 'Enregistrement...' : editingPlaceId ? 'Enregistrer les Modifications →' : 'Enregistrer le Lieu →'}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
