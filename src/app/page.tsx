'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { supabase } from '../lib/supabase';
import communesData from '../data/communes.json';

const VERTICALS = [
  { id: 'all', label: '✨ TOUT KIN' },
  { id: 'kin_food', label: '🍔 KIN FOOD' },
  { id: 'kin_places', label: '📍 KIN PLACES' },
  { id: 'kin_culture', label: '🎨 KIN CULTURE' },
  { id: 'kin_style', label: '👗 KIN STYLE' },
  { id: 'kin_weekend', label: '🎉 KIN WEEKEND' }
];

export default function HomePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const [activeVertical, setActiveVertical] = useState('all');
  const [selectedCommune, setSelectedCommune] = useState<string | null>('Gombe'); // null means "All Kinshasa"
  const [places, setPlaces] = useState<any[]>([]);
  const [weekendEvents, setWeekendEvents] = useState<any[]>([]);

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [15.3057, -4.3245],
      zoom: 11,
      pitch: 40
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('communes-geojson', {
        type: 'geojson',
        data: communesData as any
      });

      map.current.addLayer({
        id: 'communes-layer',
        type: 'fill-extrusion',
        source: 'communes-geojson',
        paint: {
          'fill-extrusion-color': '#1e293b',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-opacity': 0.7
        }
      });

      map.current.on('click', 'communes-layer', (e) => {
        if (e.features && e.features[0]) {
          const name = e.features[0].properties?.name;
          if (name) setSelectedCommune(name);
        }
      });
    });
  }, []);

  // Fetch Curated Places & Events (Supports all communes or a selected commune)
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Places
      let placeQuery = supabase.from('places').select('*');
      if (selectedCommune) {
        placeQuery = placeQuery.ilike('commune', `%${selectedCommune}%`);
      }
      if (activeVertical !== 'all' && activeVertical !== 'kin_weekend') {
        placeQuery = placeQuery.eq('vertical', activeVertical);
      }
      const { data: placeData } = await placeQuery;
      setPlaces(placeData || []);

      // 2. Fetch Weekend Events
      let eventQuery = supabase.from('events').select('*').order('event_date', { ascending: true });
      if (selectedCommune) {
        eventQuery = eventQuery.ilike('commune', `%${selectedCommune}%`);
      }
      const { data: eventData } = await eventQuery;
      setWeekendEvents(eventData || []);
    };

    fetchData();
  }, [selectedCommune, activeVertical]);

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Brand Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1650px', margin: '0 auto 20px auto', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Le Média-Guide de Recommandation</span>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '1px' }}>KINSHASA LABEL</h1>
        </div>

        <Link href="/backoffice" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
          + Proposer un Lieu / Événement
        </Link>
      </nav>

      {/* Hero Campaign Bar */}
      <div style={{ maxWidth: '1650px', margin: '0 auto 20px auto', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', marginRight: '10px' }}>SÉLECTION #001</span>
          <strong style={{ fontSize: '15px', color: '#ffffff' }}>"Tu Connais Kin ?" — Le Guide Curation des 100 Meilleurs Lieux de la Capitale</strong>
        </div>
        <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}>Recommandé par KINSHASA LABEL ★</span>
      </div>

      {/* Verticals Filter Bar */}
      <div style={{ maxWidth: '1650px', margin: '0 auto 24px auto', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {VERTICALS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVertical(v.id)}
            style={{
              backgroundColor: activeVertical === v.id ? '#2563eb' : '#0f172a',
              color: '#ffffff',
              border: '1px solid #1e293b',
              padding: '10px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(340px, 4fr)', gap: '24px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* MAP SECTION */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Carte Interactive de Curation</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>
                {selectedCommune ? `Commune : ${selectedCommune}` : 'Toutes les Communes'}
              </span>
              {selectedCommune && (
                <button
                  onClick={() => setSelectedCommune(null)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#38bdf8',
                    border: '1px solid #334155',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Voir Tout Kinshasa
                </button>
              )}
            </div>
          </div>
          <div ref={mapContainer} style={{ width: '100%', height: '540px', borderRadius: '12px', overflow: 'hidden' }} />
        </section>

        {/* CURATED SELECTION DISPLAY */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* View Filter Bar (Show All Kinshasa vs Single Commune) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                {selectedCommune ? selectedCommune : 'Tout Kinshasa'}
              </h2>
              
              <button
                onClick={() => setSelectedCommune(selectedCommune ? null : 'Gombe')}
                style={{
                  backgroundColor: selectedCommune === null ? '#2563eb' : '#020617',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {selectedCommune === null ? '📍 Filtrer par Commune' : '🌍 Voir Tous les Lieux'}
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#38bdf8', margin: '0 0 20px 0', fontWeight: 'bold' }}>
              {selectedCommune ? `Pépites Certifiées à ${selectedCommune}` : 'Toutes les adresses certifiées à Kinshasa'}
            </p>

            {/* KIN WEEKEND SECTION */}
            {(activeVertical === 'all' || activeVertical === 'kin_weekend') && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '12px' }}>
                  🎉 KIN WEEKEND ({weekendEvents.length})
                </h3>
                {weekendEvents.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Aucun événement programmé actuellement.</p>
                ) : (
                  weekendEvents.map((evt) => (
                    <div key={evt.id} style={{ backgroundColor: '#020617', border: '1px solid #a855f7', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>● {evt.category} ({evt.commune})</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{evt.event_date}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>{evt.title}</h4>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{evt.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 100 KIN PLACES SECTION */}
            {activeVertical !== 'kin_weekend' && (
              <div>
                <h3 style={{ fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '12px' }}>
                  📍 Sélection 100 KIN ({places.length})
                </h3>
                {places.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Aucun lieu certifié enregistré dans cette vue.</p>
                ) : (
                  places.map((place) => (
                    <div key={place.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}>★ {place.commune}</span>
                        <span style={{ fontSize: '10px', color: '#eab308', fontWeight: 'bold' }}>{place.budget}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>{place.name}</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px 0' }}>{place.address}</p>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{place.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link 
            href={selectedCommune ? `/commune/${encodeURIComponent(selectedCommune)}` : `/commune/Gombe`} 
            style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff', padding: '14px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px', marginTop: '20px' }}
          >
            {selectedCommune ? `Ouvrir le Guide de ${selectedCommune} →` : 'Ouvrir le Guide de Gombe →'}
          </Link>
        </section>

      </div>
    </main>
  );
}
