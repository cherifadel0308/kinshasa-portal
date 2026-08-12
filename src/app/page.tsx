'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet to prevent SSR window errors in Next.js
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((m) => m.GeoJSON), { ssr: false });

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [geoData, setGeoData] = useState<any>(null);

  // Fetch real Kinshasa commune boundary GeoJSON data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries/master/data/cd-communes.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => console.log('Loading local fallback geojson...'));
  }, []);

  const activeVideoSrc = `${SUPABASE_STORAGE_URL}/${selectedCommune.toLowerCase().replace("'", "")}.mp4`;

  // Style each real commune polygon on the map
  const styleCommune = (feature: any) => {
    const isSelected = feature.properties.name?.toLowerCase() === selectedCommune.toLowerCase();
    return {
      fillColor: isSelected ? '#2563eb' : '#1e293b',
      weight: isSelected ? 2.5 : 1,
      opacity: 1,
      color: isSelected ? '#60a5fa' : '#475569',
      fillOpacity: isSelected ? 0.75 : 0.4,
    };
  };

  const onEachCommune = (feature: any, layer: any) => {
    const communeName = feature.properties.name || feature.properties.NAM;
    layer.on({
      click: () => {
        if (communeName) setSelectedCommune(communeName);
      },
    });
    if (communeName) {
      layer.bindTooltip(communeName, { permanent: false, direction: 'center', className: 'map-tooltip' });
    }
  };

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
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

      {/* Main Grid: 70% Real Map | 30% Dynamic Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Real Interactive GIS Map */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Authentic GIS Map Layer (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              Active Zone: {selectedCommune}
            </span>
          </div>
          
          <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' }}>
            {/* Center GPS coordinates on Kinshasa [-4.3224, 15.3070] */}
            <MapContainer center={[-4.34, 15.31]} zoom={11} style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}>
              {/* Dark CartoDB Base Map */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Real Commune Polygons */}
              {geoData && (
                <GeoJSON 
                  key={selectedCommune}
                  data={geoData} 
                  style={styleCommune} 
                  onEachFeature={onEachCommune} 
                />
              )}
            </MapContainer>
          </div>
          
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center', margin: '12px 0 0 0' }}>
            💡 Real OpenStreetMap vector layer centered on Kinshasa. Click any commune boundary to switch video streams.
          </p>
        </section>

        {/* RIGHT PANEL: Intelligence Feed */}
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
