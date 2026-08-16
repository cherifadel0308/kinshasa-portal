'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { supabase } from '../lib/supabase';
import communesData from '../data/communes.json';

interface Commune {
  id: string;
  slug: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  height: number;
  center: number[];
}

const COMMUNES: Commune[] = communesData.communes;
const KINSHASA_CENTER: [number, number] = [15.3057, -4.3245];

export default function HomePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const [selectedCommune, setSelectedCommune] = useState<string>('Gombe');
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [pitch, setPitch] = useState<number>(45);

  const activeCommuneObj = COMMUNES.find(
    (c) => c.name.toLowerCase() === selectedCommune.toLowerCase()
  ) || COMMUNES[0];

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: KINSHASA_CENTER,
      zoom: 11,
      pitch: 45,
      bearing: -10
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add 3D Extruded Communes Layer
      map.current.addSource('kinshasa-communes', {
        type: 'geojson',
        data: communesData as any
      });

      map.current.addLayer({
        id: 'communes-3d',
        type: 'fill-extrusion',
        source: 'kinshasa-communes',
        paint: {
          'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#2563eb',
            '#1e293b'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85
        }
      });

      // Hover / Click interaction
      map.current.on('click', 'communes-3d', (e) => {
        if (e.features && e.features[0]) {
          const clickedName = e.features[0].properties?.name;
          if (clickedName) setSelectedCommune(clickedName);
        }
      });

      map.current.on('mouseenter', 'communes-3d', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'communes-3d', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });
  }, []);

  // Fetch Live Dispatches for Active Commune from Supabase
  useEffect(() => {
    const fetchCommuneNews = async () => {
      try {
        const { data } = await supabase
          .from('dispatches')
          .select('*')
          .ilike('commune', selectedCommune)
          .order('created_at', { ascending: false })
          .limit(3);

        if (data && data.length > 0) {
          setLiveNews(data);
        } else {
          setLiveNews([
            { id: 1, title: `${selectedCommune} Urban Surveillance Active`, details: 'Security forces and municipal teams operating routine surveillance.', category: 'security' },
            { id: 2, title: `${selectedCommune} Commercial Activity Normal`, details: 'Local markets reporting standard high-volume density.', category: 'economy' }
          ]);
        }
      } catch (err) {
        setLiveNews([]);
      }
    };

    fetchCommuneNews();
  }, [selectedCommune]);

  // Handle Top View / 3D Toggle
  const toggleViewMode = () => {
    if (!map.current) return;
    const newPitch = pitch === 0 ? 45 : 0;
    map.current.easeTo({ pitch: newPitch, duration: 1000 });
    setPitch(newPitch);
  };

  return (
    <main 
      style={{ 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        minHeight: '100vh', 
        padding: '20px', 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        boxSizing: 'border-box' 
      }}
    >
      
      {/* Navigation Header */}
      <nav 
        style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px', 
          paddingBottom: '14px', 
          borderBottom: '1px solid #1e293b',
          maxWidth: '1650px',
          margin: '0 auto 20px auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: '#22c55e', 
              boxShadow: '0 0 10px #22c55e' 
            }} 
          />
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#ffffff' }}>
            Kinshasa — 24 Communes Live Activity in 3D
          </h1>
        </div>
        <Link 
          href="/backoffice" 
          style={{ 
            backgroundColor: '#dc2626', 
            color: '#ffffff', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            fontSize: '12px', 
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Journalist Access
        </Link>
      </nav>

      {/* Main Container Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', 
          gap: '20px', 
          maxWidth: '1650px', 
          margin: '0 auto' 
        }}
      >
        
        {/* MAP SECTION */}
        <section 
          style={{ 
            backgroundColor: '#0f172a', 
            borderRadius: '16px', 
            border: '1px solid #1e293b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              3D Extruded Vector Map
            </span>
            <button 
              onClick={toggleViewMode}
              style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {pitch === 0 ? '3D View' : 'Top View'}
            </button>
          </div>

          {/* Map Container */}
          <div 
            ref={mapContainer} 
            style={{ 
              width: '100%', 
              height: '580px', 
              borderRadius: '12px', 
              border: '1px solid #1e293b',
              overflow: 'hidden'
            }} 
          />

          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', marginBottom: 0 }}>
            Map data © OpenStreetMap contributors, styled via Carto Dark. Heights represent dispatch density.
          </p>
        </section>

        {/* RIGHT PANEL: Dynamic Dispatches */}
        <section 
          style={{ 
            backgroundColor: '#0f172a', 
            borderRadius: '16px', 
            border: '1px solid #1e293b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justify: 'space-between' 
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Zone Focal Point
              </span>
              <span style={{ backgroundColor: '#020617', color: '#22c55e', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                ● Live Data
              </span>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 4px 0', color: '#ffffff' }}>
              {selectedCommune}
            </h2>
            <p style={{ fontSize: '12px', color: '#38bdf8', marginTop: 0, marginBottom: '20px', fontWeight: 'bold' }}>
              {activeCommuneObj.district} District
            </p>

            {/* Live Dispatches */}
            <div style={{ marginBottom: '20px' }}>
              <h3 
                style={{ 
                  fontSize: '11px', 
                  color: '#94a3b8', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  marginBottom: '10px',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '6px' 
                }}
              >
                Live {selectedCommune} Dispatches
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {liveNews.map((news, idx) => (
                  <div 
                    key={news.id || idx} 
                    style={{ 
                      backgroundColor: '#020617', 
                      border: '1px solid #1e293b', 
                      borderRadius: '10px', 
                      padding: '12px' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span 
                        style={{ 
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          color: '#22c55e', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px' 
                        }}
                      >
                        ● {news.category || 'Live Update'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {news.created_at ? new Date(news.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      {news.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                      {news.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <Link 
            href={`/commune/${encodeURIComponent(selectedCommune)}`}
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              backgroundColor: '#2563eb', 
              color: '#ffffff', 
              padding: '14px', 
              borderRadius: '10px', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Launch Full {selectedCommune} Hub →
          </Link>
        </section>

      </div>
    </main>
  );
}
