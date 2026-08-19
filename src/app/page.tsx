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
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
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

  // Load Curated Places & Events
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Places
      let placeQuery = supabase.from('places').select('*').ilike('commune', `%${selectedCommune}%`);
      if (activeVertical !== 'all' && activeVertical !== 'kin_weekend') {
        placeQuery = placeQuery.eq('vertical', activeVertical);
      }
      const { data: placeData } = await placeQuery;
      setPlaces(placeData || []);

      // Fetch Weekend Events
      const { data: eventData } = await supabase.from('events').select('*').ilike('commune', `%${selectedCommune}%`).order('event_date', { ascending: true });
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

      {/* Hero "TU CONNAIS KIN ?" Campaign Bar */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Carte Interactive de Curation</span>
            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>Commune sélectionnée : {selectedCommune}</span>
          </div>
          <div ref={mapContainer} style={{ width: '100%', height: '540px', borderRadius: '12px', overflow: 'hidden' }} />
        </section>

        {/* CURATED SELECTION DISPLAY */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', marginTop: 0, marginBottom: '4px', textTransform: 'uppercase' }}>
              {selectedCommune} — Sélection
            </h2>
            <p style={{ fontSize: '12px', color: '#38bdf8', margin: '0 0 20px 0', fontWeight: 'bold' }}>
              Les Pépites Certifiées par KINSHASA LABEL
            </p>

            {/* KIN WEEKEND SECTION */}
            {(activeVertical === 'all' || activeVertical === 'kin_weekend') && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '12px' }}>
                  🎉 KIN WEEKEND à {selectedCommune} ({weekendEvents.length})
                </h3>
                {weekendEvents.length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Aucun événement programmé pour ce weekend.</p>
                ) : (
                  weekendEvents.map((evt) => (
                    <div key={evt.id} style={{ backgroundColor: '#020617', border: '1px solid #a855f7', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>● {evt.category}</span>
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
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Aucun lieu certifié enregistré pour {selectedCommune}.</p>
                ) : (
                  places.map((place) => (
                    <div key={place.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}>★ KIN RECOMMENDED</span>
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

          <Link href={`/commune/${encodeURIComponent(selectedCommune)}`} style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: '#ffffff', padding: '14px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px', marginTop: '20px' }}>
            Explorer tout le Guide de {selectedCommune} →
          </Link>
        </section>

      </div>
    </main>
  );
}
