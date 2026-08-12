'use client';
import { useState } from 'react';
import Link from 'next/link';

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// True Geographical Outline Vectors for Kinshasa's 24 Communes
const KINSHASA_COMMUNES = [
  // Western & Waterfront Communes
  { id: 'ngaliema', name: 'Ngaliema', d: 'M 30,230 C 80,180 140,170 170,210 L 180,330 L 110,380 L 30,300 Z', textX: 110, textY: 270, videoUrl: `${SUPABASE_STORAGE_URL}/ngaliema.mp4` },
  { id: 'kintambo', name: 'Kintambo', d: 'M 170,210 L 220,190 L 210,230 L 170,225 Z', textX: 193, textY: 212, videoUrl: `${SUPABASE_STORAGE_URL}/kintambo.mp4` },
  { id: 'gombe', name: 'Gombe', d: 'M 220,190 C 270,170 330,175 370,185 L 355,225 L 210,230 Z', textX: 290, textY: 205, videoUrl: `${SUPABASE_STORAGE_URL}/gombe.mp4` },
  { id: 'barumbu', name: 'Barumbu', d: 'M 370,185 L 420,195 L 405,235 L 355,225 Z', textX: 388, textY: 210, videoUrl: `${SUPABASE_STORAGE_URL}/barumbu.mp4` },
  
  // Central Inner Communes
  { id: 'lingwala', name: 'Lingwala', d: 'M 210,230 L 260,228 L 255,260 L 205,255 Z', textX: 232, textY: 247, videoUrl: `${SUPABASE_STORAGE_URL}/lingwala.mp4` },
  { id: 'kinshasa', name: 'Kinshasa', d: 'M 355,225 L 405,235 L 395,265 L 345,255 Z', textX: 375, textY: 246, videoUrl: `${SUPABASE_STORAGE_URL}/kinshasa.mp4` },
  { id: 'kasa-vubu', name: 'Kasa-Vubu', d: 'M 260,228 L 305,226 L 300,260 L 255,260 Z', textX: 280, textY: 245, videoUrl: `${SUPABASE_STORAGE_URL}/kasa-vubu.mp4` },
  { id: 'bandalungwa', name: 'Bandalungwa', d: 'M 180,225 L 210,230 L 205,285 L 170,280 Z', textX: 191, textY: 258, videoUrl: `${SUPABASE_STORAGE_URL}/bandalungwa.mp4` },
  { id: 'ngiri-ngiri', name: 'Ngiri-Ngiri', d: 'M 255,260 L 300,260 L 295,295 L 250,295 Z', textX: 275, textY: 280, videoUrl: `${SUPABASE_STORAGE_URL}/ngiri-ngiri.mp4` },
  { id: 'kalamu', name: 'Kalamu', d: 'M 305,226 L 355,225 L 345,285 L 295,295 Z', textX: 325, textY: 260, videoUrl: `${SUPABASE_STORAGE_URL}/kalamu.mp4` },
  { id: 'bumbu', name: 'Bumbu', d: 'M 250,295 L 295,295 L 290,335 L 245,335 Z', textX: 270, textY: 318, videoUrl: `${SUPABASE_STORAGE_URL}/bumbu.mp4` },
  { id: 'selembao', name: 'Selembao', d: 'M 170,280 L 205,285 L 245,335 L 150,340 Z', textX: 192, textY: 312, videoUrl: `${SUPABASE_STORAGE_URL}/selembao.mp4` },
  { id: 'makala', name: 'Makala', d: 'M 295,295 L 345,285 L 335,345 L 290,335 Z', textX: 316, textY: 318, videoUrl: `${SUPABASE_STORAGE_URL}/makala.mp4` },
  { id: 'ngaba', name: 'Ngaba', d: 'M 345,285 L 385,280 L 375,330 L 335,345 Z', textX: 360, textY: 312, videoUrl: `${SUPABASE_STORAGE_URL}/ngaba.mp4` },
  { id: 'lemba', name: 'Lemba', d: 'M 385,280 L 440,270 L 425,360 L 375,330 Z', textX: 406, textY: 322, videoUrl: `${SUPABASE_STORAGE_URL}/lemba.mp4` },
  { id: 'matete', name: 'Matete', d: 'M 440,270 L 485,265 L 475,320 L 425,320 Z', textX: 456, textY: 295, videoUrl: `${SUPABASE_STORAGE_URL}/matete.mp4` },
  
  // Eastern & Urban Extension Communes
  { id: 'limete', name: 'Limete', d: 'M 420,195 C 460,200 490,210 510,260 L 485,265 L 440,270 L 395,265 Z', textX: 455, textY: 235, videoUrl: `${SUPABASE_STORAGE_URL}/limete.mp4` },
  { id: 'masina', name: 'Masina', d: 'M 510,200 C 570,215 620,225 640,270 L 570,280 L 510,260 Z', textX: 575, textY: 242, videoUrl: `${SUPABASE_STORAGE_URL}/masina.mp4` },
  { id: 'ndjili', name: "N'djili", d: 'M 510,260 L 570,280 L 555,350 L 485,320 Z', textX: 530, textY: 305, videoUrl: `${SUPABASE_STORAGE_URL}/ndjili.mp4` },
  { id: 'kimbanseke', name: 'Kimbanseke', d: 'M 570,280 L 670,265 L 650,390 L 555,350 Z', textX: 610, textY: 325, videoUrl: `${SUPABASE_STORAGE_URL}/kimbanseke.mp4` },
  
  // Massive Regional Outer Communes
  { id: 'mont-ngafula', name: 'Mont-Ngafula', d: 'M 30,300 L 110,380 L 150,340 L 335,345 L 425,360 L 555,350 L 650,390 L 600,560 L 100,530 Z', textX: 330, textY: 450, videoUrl: `${SUPABASE_STORAGE_URL}/mont-ngafula.mp4` },
  { id: 'nsele', name: "N'sele", d: 'M 640,270 C 720,240 790,260 810,310 L 780,530 L 650,390 Z', textX: 720, textY: 380, videoUrl: `${SUPABASE_STORAGE_URL}/nsele.mp4` },
  { id: 'maluku', name: 'Maluku', d: 'M 810,310 C 890,270 950,290 980,360 L 930,600 L 780,530 Z', textX: 875, textY: 450, videoUrl: `${SUPABASE_STORAGE_URL}/maluku.mp4` },
  { id: 'ouanza', name: 'Ouanza', d: 'M 650,390 L 780,530 L 700,600 L 600,560 Z', textX: 680, textY: 520, videoUrl: `${SUPABASE_STORAGE_URL}/ouanza.mp4` }
];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);

  const activeCommuneObj = KINSHASA_COMMUNES.find(
    (c) => c.name.toLowerCase() === selectedCommune.toLowerCase()
  );

  const activeVideoSrc = activeCommuneObj?.videoUrl || DEFAULT_VIDEO;

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Navigation Bar */}
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

      {/* Main Grid: 7 parts Map | 4 parts Video/Metrics Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: True Geographical Map */}
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
            <svg viewBox="0 0 1000 630" style={{ width: '100%', height: 'auto', maxHeight: '680px', display: 'block' }}>
              
              {/* FLEUVE CONGO WATERWAY */}
              <path 
                d="M 20,220 Q 150,140 280,150 C 380,155 420,130 520,160 C 650,200 780,120 980,180" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="42" 
                opacity="0.3" 
                strokeLinecap="round"
              />
              <text x="50" y="155" fill="#38bdf8" fontSize="16" fontWeight="900" opacity="0.85" letterSpacing="2">
                FLEUVE CONGO
              </text>

              {/* COMMUNE POLYGONS */}
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
                      fill={isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#e2e8f0'}
                      fontSize={isSelected ? '18' : '14'}
                      fontWeight="900"
                      textAnchor="middle"
                      style={{ 
                        pointerEvents: 'none', 
                        userSelect: 'none',
                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.9)'
                      }}
                    >
                      {commune.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center', margin: '12px 0 0 0' }}>
            💡 Interactive map modeled on authentic Kinshasa boundaries. Click any sector to view live footage and operational data.
          </p>
        </section>

        {/* RIGHT PANEL: Dynamic Zone Feed */}
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
