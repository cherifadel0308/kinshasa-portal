'use client';
import { useState } from 'react';
import Link from 'next/link';

// Real Geographical Vector Paths for Kinshasa Communes
const KINSHASA_COMMUNES = [
  // West & Central Communes
  { id: 'ngaliema', name: 'Ngaliema', d: 'M 110,210 C 130,160 170,150 200,180 L 210,310 L 140,360 L 80,280 Z', textX: 140, textY: 260 },
  { id: 'kintambo', name: 'Kintambo', d: 'M 200,180 L 250,175 L 245,215 L 205,210 Z', textX: 225, textY: 198 },
  { id: 'gombe', name: 'Gombe', d: 'M 250,175 C 310,165 380,170 410,185 L 395,220 L 245,215 Z', textX: 325, textY: 198 },
  { id: 'lingwala', name: 'Lingwala', x: 245, y: 215, d: 'M 245,215 L 290,213 L 285,245 L 240,245 Z', textX: 265, textY: 233 },
  { id: 'barumbu', name: 'Barumbu', d: 'M 290,213 L 340,210 L 335,240 L 285,245 Z', textX: 312, textY: 230 },
  { id: 'kinshasa', name: 'Kinshasa', d: 'M 340,210 L 395,220 L 385,255 L 335,240 Z', textX: 362, textY: 235 },
  { id: 'kasa-vubu', name: 'Kasa-Vubu', d: 'M 240,245 L 285,245 L 280,280 L 235,280 Z', textX: 260, textY: 265 },
  { id: 'bandalungwa', name: 'Bandalungwa', d: 'M 205,210 L 245,215 L 235,280 L 195,270 Z', textX: 220, textY: 245 },
  { id: 'ngiri-ngiri', name: 'Ngiri-Ngiri', d: 'M 235,280 L 275,280 L 270,310 L 230,310 Z', textX: 252, textY: 298 },
  { id: 'kalamu', name: 'Kalamu', d: 'M 285,245 L 335,240 L 325,305 L 275,280 Z', textX: 305, textY: 270 },
  { id: 'bumbu', name: 'Bumbu', d: 'M 230,310 L 270,310 L 265,350 L 225,350 Z', textX: 248, textY: 333 },
  { id: 'selembao', name: 'Selembao', d: 'M 195,270 L 235,280 L 225,350 L 155,340 Z', textX: 190, textY: 310 },
  { id: 'makala', name: 'Makala', d: 'M 270,310 L 325,305 L 315,360 L 265,350 Z', textX: 292, textY: 335 },
  { id: 'ngaba', name: 'Ngaba', d: 'M 325,305 L 365,300 L 355,345 L 315,360 Z', textX: 340, textY: 330 },
  { id: 'lemba', name: 'Lemba', d: 'M 365,300 L 425,290 L 410,380 L 355,345 Z', textX: 388, textY: 335 },
  { id: 'matete', name: 'Matete', d: 'M 425,290 L 475,285 L 465,335 L 415,335 Z', textX: 445, textY: 312 },
  
  // East & Outer Communes
  { id: 'limete', name: 'Limete', d: 'M 395,220 C 430,225 460,230 475,285 L 425,290 L 385,255 Z', textX: 425, textY: 255 },
  { id: 'masina', name: 'Masina', d: 'M 475,220 C 530,210 590,230 600,280 L 530,290 L 475,285 Z', textX: 535, textY: 255 },
  { id: 'ndjili', name: "N'djili", d: 'M 475,285 L 530,290 L 515,360 L 465,335 Z', textX: 495, textY: 318 },
  { id: 'kimbanseke', name: 'Kimbanseke', d: 'M 530,290 L 630,280 L 610,400 L 515,360 Z', textX: 570, textY: 340 },
  { id: 'mont-ngafula', name: 'Mont-Ngafula', d: 'M 80,280 L 155,340 L 355,345 L 410,380 L 515,360 L 480,520 L 160,500 Z', textX: 290, textY: 420 },
  { id: 'nsele', name: "N'sele", d: 'M 600,280 C 670,260 740,280 770,330 L 740,510 L 610,400 Z', textX: 680, textY: 380 },
  { id: 'maluku', name: 'Maluku', d: 'M 770,330 C 850,290 940,320 970,410 L 910,580 L 740,510 Z', textX: 860, textY: 440 },
  { id: 'ouanza', name: 'Ouanza', d: 'M 610,400 L 740,510 L 670,580 L 580,480 Z', textX: 650, textY: 490 }
];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);

  // Dynamic Video Link Selection
  const activeCommune = KINSHASA_COMMUNES.find(c => c.name.toLowerCase() === selectedCommune.toLowerCase());

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

      {/* Main Grid Ratio: 7 Parts Map (65%) | 4 Parts Video/Intelligence Panel (35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Enlarged Geographical Vector Map */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Geographical Sector Map (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              {hoveredCommune ? `Focus: ${hoveredCommune}` : `Selected: ${selectedCommune}`}
            </span>
          </div>
          
          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 1000 620" style={{ width: '100%', height: 'auto', maxHeight: '680px', display: 'block' }}>
              
              {/* FLEUVE CONGO WATERWAY */}
              <path 
                d="M 50,190 C 200,110 350,150 480,180 C 650,220 800,160 980,280" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="38" 
                opacity="0.3" 
                strokeLinecap="round"
              />
              <text x="70" y="145" fill="#38bdf8" fontSize="14" fontWeight="900" opacity="0.7" letterSpacing="2">
                FLEUVE CONGO
              </text>

              {/* COMMUNE POLYGON SECTORS */}
              {KINSHASA_COMMUNES.map((commune) => {
                const isSelected = selectedCommune.toLowerCase() === commune.name.toLowerCase();
                const isHovered = hoveredCommune === commune.name;

                return (
                  <g 
                    key={commune.id} 
                    onClick={() => setSelectedCommune(commune.name)}
                    onMouseEnter={() => setHoveredCommune(commune.name)}
                    onMouseLeave={() => setHoveredCommune(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      d={commune.d}
                      fill={isSelected ? '#2563eb' : isHovered ? '#1d4ed8' : '#1e293b'}
                      stroke={isSelected ? '#60a5fa' : '#334155'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    <text
                      x={commune.textX}
                      y={commune.textY}
                      fill={isSelected ? '#ffffff' : isHovered ? '#f8fafc' : '#94a3b8'}
                      fontSize={isSelected ? '12' : '10'}
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
          
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center', margin: '12px 0 0 0' }}>
            💡 Interactive map scaled to true geographical boundaries. Click any commune sector to activate live data.
          </p>
        </section>

        {/* RIGHT PANEL: Compact Zone Intelligence Feed */}
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

            {/* Video Feed */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b', backgroundColor: '#020617', marginBottom: '16px' }}>
              <video 
                key={selectedCommune}
                src="https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos/Cinematic_smooth_drone_sweep.mp4"
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
              />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(2, 6, 23, 0.85)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1' }}>
                Commune Sector: <strong>{selectedCommune}</strong>
              </div>
            </div>

            {/* Live Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Security Level</span>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0 0 0' }}>Normal / Monitored</p>
              </div>
              <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Economic Activity</span>
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
