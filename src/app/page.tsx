'use client';
import { useState } from 'react';
import Link from 'next/link';

// All 24 official communes of Kinshasa
const KINSHASA_COMMUNES = [
  { id: 'bandalungwa', name: 'Bandalungwa', x: 220, y: 180, w: 90, h: 60 },
  { id: 'barumbu', name: 'Barumbu', x: 220, y: 110, w: 80, h: 60 },
  { id: 'bumbu', name: 'Bumbu', x: 220, y: 250, w: 90, h: 60 },
  { id: 'gombe', name: 'Gombe', x: 120, y: 110, w: 90, h: 60 },
  { id: 'kalamu', name: 'Kalamu', x: 320, y: 180, w: 90, h: 60 },
  { id: 'kasa-vubu', name: 'Kasa-Vubu', x: 120, y: 180, w: 90, h: 60 },
  { id: 'kimbanseke', name: 'Kimbanseke', x: 520, y: 250, w: 110, h: 70 },
  { id: 'kinshasa', name: 'Kinshasa', x: 310, y: 110, w: 90, h: 60 },
  { id: 'kintambo', name: 'Kintambo', x: 20, y: 110, w: 90, h: 60 },
  { id: 'lemba', name: 'Lemba', x: 420, y: 250, w: 90, h: 60 },
  { id: 'limete', name: 'Limete', x: 410, y: 110, w: 100, h: 130 },
  { id: 'lingwala', name: 'Lingwala', x: 120, y: 250, w: 90, h: 60 },
  { id: 'makala', name: 'Makala', x: 320, y: 250, w: 90, h: 60 },
  { id: 'maluku', name: 'Maluku', x: 640, y: 110, w: 140, h: 210 },
  { id: 'masina', name: 'Masina', x: 520, y: 110, w: 110, h: 60 },
  { id: 'matete', name: 'Matete', x: 420, y: 330, w: 90, h: 60 },
  { id: 'mont-ngafula', name: 'Mont-Ngafula', x: 20, y: 330, w: 390, h: 100 },
  { id: 'ndjili', name: 'N'djili', x: 520, y: 180, w: 110, h: 60 },
  { id: 'ngaba', name: 'Ngaba', x: 320, y: 330, w: 90, h: 60 },
  { id: 'ngaliema', name: 'Ngaliema', x: 20, y: 180, w: 90, h: 130 },
  { id: 'ngiri-ngiri', name: 'Ngiri-Ngiri', x: 220, y: 320, w: 90, h: 60 },
  { id: 'nsele', name: 'N'sele', x: 640, y: 330, w: 140, h: 100 },
  { id: 'ouanza', name: 'Ouanza', x: 520, y: 330, w: 90, h: 60 },
  { id: 'selembao', name: 'Selembao', x: 120, y: 320, w: 90, h: 70 },
];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* Top Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Kinshasa Urban Intelligence Portal
          </h1>
        </div>
        <Link 
          href="/login" 
          style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
        >
          Journalist Access
        </Link>
      </nav>

      {/* Main Grid: Map + Intelligence Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Interactive 24-Commune Vector Map */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Interactive Vector Map (24 Communes)
            </h2>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>
              {hoveredCommune ? `Hovering: ${hoveredCommune}` : `Selected: ${selectedCommune}`}
            </span>
          </div>
          
          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '12px', overflowX: 'auto' }}>
            <svg viewBox="0 0 800 450" style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}>
              
              {/* Background River Kinshasa Indicator */}
              <path d="M 0 80 Q 200 40, 400 70 T 800 50" fill="none" stroke="#0284c7" strokeWidth="18" opacity="0.3" />
              <text x="20" y="55" fill="#38bdf8" fontSize="12" fontWeight="bold" opacity="0.6">FLEUVE CONGO</text>

              {/* Render All 24 Communes */}
              {KINSHASA_COMMUNES.map((commune) => {
                const isSelected = selectedCommune.toLowerCase() === commune.name.toLowerCase();
                const isHovered = hoveredCommune === commune.name;

                return (
                  <g 
                    key={commune.id} 
                    onClick={() => setSelectedCommune(commune.name)}
                    onMouseEnter={() => setHoveredCommune(commune.name)}
                    onMouseLeave={() => setHoveredCommune(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    <rect
                      x={commune.x}
                      y={commune.y}
                      width={commune.w}
                      height={commune.h}
                      rx="6"
                      fill={isSelected ? '#2563eb' : isHovered ? '#1e3a8a' : '#1e293b'}
                      stroke={isSelected ? '#60a5fa' : '#334155'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                    />
                    <text
                      x={commune.x + commune.w / 2}
                      y={commune.y + commune.h / 2 + 4}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {commune.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
            💡 Click any commune sector to dynamically filter real-time security alerts and local points of interest.
          </p>
        </section>

        {/* RIGHT PANEL: Dynamic Zone Intelligence Feed */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Zone Focal Point
              </span>
              <span style={{ backgroundColor: '#1e293b', color: '#22c55e', fontSize: '11px', padding: '4px 8px', borderRadius: '12px', border: '1px solid #334155' }}>
                ● Live Data
              </span>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', margin: '8px 0 16px 0', color: '#ffffff' }}>
              {selectedCommune}
            </h2>

            {/* Video / Visual Asset Placeholder */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', backgroundColor: '#020617', marginBottom: '20px' }}>
              <video 
                src="https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos/Cinematic_smooth_drone_sweep.mp4"
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
                Commune Sector: <strong>{selectedCommune}</strong>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Security Level</span>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e', margin: '4px 0 0 0' }}>Normal / Monitored</p>
              </div>
              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Economic Activity</span>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', margin: '4px 0 0 0' }}>High Density</p>
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
              fontSize: '14px',
              transition: 'background-color 0.2s ease'
            }}
          >
            Launch Full {selectedCommune} Dashboard →
          </Link>
        </section>

      </div>
    </main>
  );
}
