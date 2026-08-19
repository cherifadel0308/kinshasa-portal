'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function CommuneHubPage({ params }: { params: { name: string } }) {
  const communeName = decodeURIComponent(params.name).trim();
  const [places, setPlaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: placeData } = await supabase.from('places').select('*').ilike('commune', `%${communeName}%`);
      const { data: eventData } = await supabase.from('events').select('*').ilike('commune', `%${communeName}%`);
      setPlaces(placeData || []);
      setEvents(eventData || []);
    };

    fetchData();
  }, [communeName]);

  const foodPlaces = places.filter(p => p.vertical === 'kin_food');
  const otherPlaces = places.filter(p => p.vertical === 'kin_places');
  const culturePlaces = places.filter(p => p.vertical === 'kin_culture');
  const stylePlaces = places.filter(p => p.vertical === 'kin_style');

  const renderPlaceCard = (p: any) => (
    <div key={p.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
      {p.image_url && (
        <img 
          src={p.image_url} 
          alt={p.name} 
          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', border: '1px solid #1e293b' }} 
        />
      )}
      <strong style={{ color: '#fff', fontSize: '15px', display: 'block', marginBottom: '2px' }}>
        {p.name} {p.budget ? `(${p.budget})` : ''}
      </strong>
      {p.address && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>{p.address}</span>}
      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 8px 0', lineHeight: '1.4' }}>{p.description}</p>
      {p.google_maps_url && (
        <a href={p.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}>
          📍 Google Maps Itinéraire →
        </a>
      )}
    </div>
  );

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1650px', margin: '0 auto 28px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>KINSHASA LABEL — Média-Guide</span>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{communeName} Sector Guide</h1>
        </div>
        <Link href="/" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>← Retour à la Carte</Link>
      </nav>

      <div style={{ maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* Banner */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
          <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>★ CERTIFIÉ KINSHASA LABEL</span>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
            Le Meilleur de {communeName}
          </h1>
        </div>

        {/* KIN WEEKEND HIGHLIGHT */}
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #a855f7', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#a855f7', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            🎉 KIN WEEKEND — À faire ce weekend à {communeName} ({events.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {events.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun événement ce weekend.</p> : events.map(e => (
              <div key={e.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>{e.category} ● {e.event_date}</span>
                <h3 style={{ fontSize: '15px', color: '#fff', margin: '6px 0' }}>{e.title}</h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 VERTICAL CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* KIN FOOD */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#22c55e', margin: '0 0 16px 0', textTransform: 'uppercase' }}>🍔 KIN FOOD ({foodPlaces.length})</h2>
            {foodPlaces.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>Aucune adresse enregistrée.</p> : foodPlaces.map(renderPlaceCard)}
          </section>

          {/* KIN PLACES */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#38bdf8', margin: '0 0 16px 0', textTransform: 'uppercase' }}>📍 KIN PLACES ({otherPlaces.length})</h2>
            {otherPlaces.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun lieu enregistré.</p> : otherPlaces.map(renderPlaceCard)}
          </section>

          {/* KIN CULTURE */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#f59e0b', margin: '0 0 16px 0', textTransform: 'uppercase' }}>🎨 KIN CULTURE ({culturePlaces.length})</h2>
            {culturePlaces.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun espace culturel enregistré.</p> : culturePlaces.map(renderPlaceCard)}
          </section>

          {/* KIN STYLE */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#ec4899', margin: '0 0 16px 0', textTransform: 'uppercase' }}>👗 KIN STYLE ({stylePlaces.length})</h2>
            {stylePlaces.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>Aucun créateur/boutique enregistré.</p> : stylePlaces.map(renderPlaceCard)}
          </section>

        </div>
      </div>
    </main>
  );
}
