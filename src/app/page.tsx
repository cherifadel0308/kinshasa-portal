'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to prevent Next.js SSR build errors
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((m) => m.GeoJSON), { ssr: false });

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// Embedded Kinshasa 24-Communes GeoJSON Boundary Dataset
const KINSHASA_GEOJSON: any = {
  type: 'FeatureCollection',
  features: [
    // Waterfront / Central Communes
    { type: 'Feature', properties: { name: 'Gombe' }, geometry: { type: 'Polygon', coordinates: [[[15.28, -4.30], [15.33, -4.30], [15.32, -4.32], [15.27, -4.32], [15.28, -4.30]]] } },
    { type: 'Feature', properties: { name: 'Kintambo' }, geometry: { type: 'Polygon', coordinates: [[[15.25, -4.31], [15.28, -4.30], [15.27, -4.32], [15.25, -4.32], [15.25, -4.31]]] } },
    { type: 'Feature', properties: { name: 'Ngaliema' }, geometry: { type: 'Polygon', coordinates: [[[15.20, -4.32], [15.25, -4.31], [15.26, -4.38], [15.18, -4.39], [15.20, -4.32]]] } },
    { type: 'Feature', properties: { name: 'Barumbu' }, geometry: { type: 'Polygon', coordinates: [[[15.31, -4.30], [15.34, -4.30], [15.33, -4.32], [15.31, -4.32], [15.31, -4.30]]] } },
    { type: 'Feature', properties: { name: 'Kinshasa' }, geometry: { type: 'Polygon', coordinates: [[[15.31, -4.32], [15.33, -4.32], [15.33, -4.34], [15.31, -4.34], [15.31, -4.32]]] } },
    { type: 'Feature', properties: { name: 'Lingwala' }, geometry: { type: 'Polygon', coordinates: [[[15.29, -4.32], [15.31, -4.32], [15.31, -4.34], [15.29, -4.34], [15.29, -4.32]]] } },
    { type: 'Feature', properties: { name: 'Kasa-Vubu' }, geometry: { type: 'Polygon', coordinates: [[[15.29, -4.34], [15.31, -4.34], [15.31, -4.36], [15.29, -4.36], [15.29, -4.34]]] } },
    { type: 'Feature', properties: { name: 'Bandalungwa' }, geometry: { type: 'Polygon', coordinates: [[[15.27, -4.32], [15.29, -4.32], [15.29, -4.36], [15.27, -4.36], [15.27, -4.32]]] } },
    { type: 'Feature', properties: { name: 'Ngiri-Ngiri' }, geometry: { type: 'Polygon', coordinates: [[[15.29, -4.36], [15.31, -4.36], [15.31, -4.38], [15.29, -4.38], [15.29, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Kalamu' }, geometry: { type: 'Polygon', coordinates: [[[15.31, -4.34], [15.34, -4.34], [15.33, -4.38], [15.31, -4.38], [15.31, -4.34]]] } },
    
    // Central South
    { type: 'Feature', properties: { name: 'Bumbu' }, geometry: { type: 'Polygon', coordinates: [[[15.28, -4.36], [15.30, -4.36], [15.30, -4.39], [15.28, -4.39], [15.28, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Selembao' }, geometry: { type: 'Polygon', coordinates: [[[15.25, -4.36], [15.28, -4.36], [15.27, -4.41], [15.23, -4.40], [15.25, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Makala' }, geometry: { type: 'Polygon', coordinates: [[[15.30, -4.36], [15.33, -4.36], [15.32, -4.40], [15.30, -4.40], [15.30, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Ngaba' }, geometry: { type: 'Polygon', coordinates: [[[15.33, -4.36], [15.35, -4.36], [15.35, -4.39], [15.33, -4.39], [15.33, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Lemba' }, geometry: { type: 'Polygon', coordinates: [[[15.35, -4.36], [15.38, -4.36], [15.37, -4.43], [15.34, -4.42], [15.35, -4.36]]] } },
    { type: 'Feature', properties: { name: 'Matete' }, geometry: { type: 'Polygon', coordinates: [[[15.35, -4.39], [15.38, -4.39], [15.38, -4.42], [15.35, -4.42], [15.35, -4.39]]] } },

    // East & Pool Malebo Waterfront
    { type: 'Feature', properties: { name: 'Limete' }, geometry: { type: 'Polygon', coordinates: [[[15.33, -4.31], [15.38, -4.32], [15.38, -4.37], [15.33, -4.36], [15.33, -4.31]]] } },
    { type: 'Feature', properties: { name: 'Masina' }, geometry: { type: 'Polygon', coordinates: [[[15.38, -4.32], [15.44, -4.33], [15.43, -4.38], [15.38, -4.37], [15.38, -4.32]]] } },
    { type: 'Feature', properties: { name: "N'djili" }, geometry: { type: 'Polygon', coordinates: [[[15.38, -4.37], [15.42, -4.38], [15.41, -4.43], [15.37, -4.42], [15.38, -4.37]]] } },
    { type: 'Feature', properties: { name: 'Kimbanseke' }, geometry: { type: 'Polygon', coordinates: [[[15.42, -4.38], [15.48, -4.36], [15.47, -4.45], [15.41, -4.43], [15.42, -4.38]]] } },

    // Southern & Outer Eastern Territories
    { type: 'Feature', properties: { name: 'Mont-Ngafula' }, geometry: { type: 'Polygon', coordinates: [[[15.18, -4.39], [15.34, -4.42], [15.41, -4.43], [15.40, -4.55], [15.20, -4.55], [15.18, -4.39]]] } },
    { type: 'Feature', properties: { name: "N'sele" }, geometry: { type: 'Polygon', coordinates: [[[15.44, -4.33], [15.65, -4.30], [15.60, -4.50], [15.47, -4.45], [15.44, -4.33]]] } },
    { type: 'Feature', properties: { name: 'Maluku' }, geometry: { type: 'Polygon', coordinates: [[[15.65, -4.30], [16.10, -4.10], [16.05, -4.60], [15.60, -4.50], [15.65, -4.30]]] } },
    { type: 'Feature', properties: { name: 'Ouanza' }, geometry: { type: 'Polygon', coordinates: [[[15.47, -4.45], [15.60, -4.50], [15.55, -4.58], [15.40, -4.55], [15.47, -4.45]]] } }
  ]
};

// Outer Perimeter Border defining the entire Province of Kinshasa
const KINSHASA_OUTER_BORDER: any = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [15.20, -4.32], [15.28, -4.30], [15.34, -4.30], [15.44, -4.33], [15.65, -4.30], 
      [16.10, -4.10], [16.05, -4.60], [15.55, -4.58], [15.40, -4.55], [15.20, -4.55], 
      [15.18, -4.39], [15.20, -4.32]
    ]]
  }
};

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');

  const cleanVideoName = selectedCommune.toLowerCase().replace("'", "");
  const activeVideoSrc = `${SUPABASE_STORAGE_URL}/${cleanVideoName}.mp4`;

  // Styling for individual commune polygons
  const getCommuneStyle = (feature: any) => {
    const isSelected = feature.properties.name?.toLowerCase() === selectedCommune.toLowerCase();
    return {
      fillColor: isSelected ? '#2563eb' : '#1e293b',
      weight: isSelected ? 2.5 : 1,
      opacity: 1,
      color: isSelected ? '#60a5fa' : '#334155',
      fillOpacity: isSelected ? 0.85 : 0.6,
    };
  };

  // Click & tooltip handler
  const onEachFeature = (feature: any, layer: any) => {
    const communeName = feature.properties.name;
    
    layer.on({
      click: () => {
        if (communeName) setSelectedCommune(communeName);
      },
    });

    if (communeName) {
      layer.bindTooltip(communeName, {
        permanent: true,
        direction: 'center',
        className: 'commune-map-label'
      });
    }
  };

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Remove tile lines and style labels */}
      <style jsx global>{`
        .leaflet-container {
          background-color: #020617 !important;
        }
        .commune-map-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          font-size: 11px !important;
          text-shadow: 0px 2px 4px rgba(0,0,0,0.95);
        }
      `}</style>

      {/* Navigation Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
            Kinshasa Urban Intelligence Portal
          </h1>
        </div>
        <Link 
          href="/login" 
          style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}
        >
          Journalist Access
        </Link>
      </nav>

      {/* Main Grid Layout: 70% Clean Map | 30% Dynamic Intelligence Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Clean Vector Map with Glowing Boundary */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Kinshasa Vector Boundary Map (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              Active Zone: {selectedCommune}
            </span>
          </div>
          
          <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', backgroundColor: '#020617' }}>
            <MapContainer 
              center={[-4.35, 15.38]} 
              zoom={11} 
              minZoom={10}
              maxZoom={14}
              zoomControl={false}
              attributionControl={false}
              maxBounds={[[-4.70, 15.00], [-3.90, 16.20]]}
              style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}
            >
              {/* Outer Glowing Perimeter Border of Kinshasa */}
              <GeoJSON 
                data={KINSHASA_OUTER_BORDER}
                style={{
                  fillColor: 'transparent',
                  fillOpacity: 0,
                  color: '#38bdf8',
                  weight: 3.5,
                  opacity: 0.9,
                }}
              />

              {/* Interactive Commune Polygons */}
              <GeoJSON 
                key={selectedCommune}
                data={KINSHASA_GEOJSON} 
                style={getCommuneStyle} 
                onEachFeature={onEachFeature} 
              />
            </MapContainer>
          </div>
          
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center', margin: '12px 0 0 0' }}>
            💡 Clean vector map view with highlighted Kinshasa province perimeter. Click any commune area to switch live intelligence data.
          </p>
        </section>

        {/* RIGHT PANEL: Dynamic Zone Intelligence Feed */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Zone Focal Point
              </span>
              <span style={{ backgroundColor: '#020617', color: '#22c55e', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                ● Live Data
              </span>
            </div>

            <h2 style={{ fontSize: '30px', fontWeight: '900', textTransform: 'uppercase', margin: '6px 0 14px 0', color: '#ffffff' }}>
              {selectedCommune}
            </h2>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', backgroundColor: '#020617', marginBottom: '16px' }}>
              <video 
                key={selectedCommune}
                src={activeVideoSrc}
                onError={(e) => {
                  (e.target as HTMLVideoElement).src = DEFAULT_VIDEO;
                }}
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
              />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(2, 6, 23, 0.85)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1' }}>
                Commune Sector: <strong>{selectedCommune}</strong>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Security Status</span>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0 0 0' }}>Monitored</p>
              </div>
              <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Zone Activity</span>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', margin: '2px 0 0 0' }}>High Density</p>
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
              padding: '12px', 
              borderRadius: '10px', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              fontSize: '13px'
            }}
          >
            Launch Full {selectedCommune} Hub →
          </Link>
        </section>

      </div>
    </main>
  );
}
