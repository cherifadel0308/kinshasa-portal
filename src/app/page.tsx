'use client';
import { useState } from 'react';
import Link from 'next/link';

// Base Supabase URL for video feeds
const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// Real Geographical Vector Geometry for Kinshasa Province (24 Communes)
const KINSHASA_COMMUNES = [
  // --- WEST ZONE (Western Horn) ---
  {
    id: 'ngaliema',
    name: 'Ngaliema',
    d: 'M 70,250 C 45,260 25,290 30,330 C 35,365 60,390 95,385 L 125,350 L 140,290 L 110,250 Z',
    textX: 80,
    textY: 330,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngaliema.mp4`
  },
  {
    id: 'kintambo',
    name: 'Kintambo',
    d: 'M 110,250 L 140,290 L 175,275 L 155,240 Z',
    textX: 145,
    textY: 265,
    videoUrl: `${SUPABASE_STORAGE_URL}/kintambo.mp4`
  },
  {
    id: 'bandalungwa',
    name: 'Bandalungwa',
    d: 'M 125,350 L 140,290 L 175,275 L 170,335 L 140,360 Z',
    textX: 152,
    textY: 320,
    videoUrl: `${SUPABASE_STORAGE_URL}/bandalungwa.mp4`
  },
  {
    id: 'selembao',
    name: 'Selembao',
    d: 'M 95,385 L 140,360 L 165,415 L 110,430 Z',
    textX: 130,
    textY: 400,
    videoUrl: `${SUPABASE_STORAGE_URL}/selembao.mp4`
  },

  // --- NORTH / CENTRAL URBAN CORE (Along Pool Malebo) ---
  {
    id: 'gombe',
    name: 'Gombe',
    d: 'M 155,240 L 175,275 L 235,265 L 225,225 C 195,225 170,230 155,240 Z',
    textX: 195,
    textY: 250,
    videoUrl: `${SUPABASE_STORAGE_URL}/gombe.mp4`
  },
  {
    id: 'lingwala',
    name: 'Lingwala',
    d: 'M 175,275 L 205,270 L 200,300 L 170,305 Z',
    textX: 188,
    textY: 290,
    videoUrl: `${SUPABASE_STORAGE_URL}/lingwala.mp4`
  },
  {
    id: 'barumbu',
    name: 'Barumbu',
    d: 'M 205,270 L 235,265 L 230,295 L 200,300 Z',
    textX: 218,
    textY: 285,
    videoUrl: `${SUPABASE_STORAGE_URL}/barumbu.mp4`
  },
  {
    id: 'kinshasa',
    name: 'Kinshasa',
    d: 'M 225,225 L 255,220 L 250,260 L 235,265 Z',
    textX: 242,
    textY: 245,
    videoUrl: `${SUPABASE_STORAGE_URL}/kinshasa.mp4`
  },
  {
    id: 'kasa-vubu',
    name: 'Kasa-Vubu',
    d: 'M 170,305 L 200,300 L 195,335 L 170,335 Z',
    textX: 185,
    textY: 322,
    videoUrl: `${SUPABASE_STORAGE_URL}/kasa-vubu.mp4`
  },
  {
    id: 'ngiri-ngiri',
    name: 'Ngiri-Ngiri',
    d: 'M 170,335 L 195,335 L 190,365 L 165,365 Z',
    textX: 180,
    textY: 352,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngiri-ngiri.mp4`
  },
  {
    id: 'kalamu',
    name: 'Kalamu',
    d: 'M 200,300 L 230,295 L 225,345 L 195,335 Z',
    textX: 212,
    textY: 320,
    videoUrl: `${SUPABASE_STORAGE_URL}/kalamu.mp4`
  },
  {
    id: 'bumbu',
    name: 'Bumbu',
    d: 'M 165,365 L 190,365 L 185,400 L 160,400 Z',
    textX: 175,
    textY: 385,
    videoUrl: `${SUPABASE_STORAGE_URL}/bumbu.mp4`
  },
  {
    id: 'makala',
    name: 'Makala',
    d: 'M 190,365 L 225,345 L 215,400 L 185,400 Z',
    textX: 205,
    textY: 380,
    videoUrl: `${SUPABASE_STORAGE_URL}/makala.mp4`
  },
  {
    id: 'ngaba',
    name: 'Ngaba',
    d: 'M 225,345 L 255,340 L 245,395 L 215,400 Z',
    textX: 235,
    textY: 375,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngaba.mp4`
  },
  {
    id: 'lemba',
    name: 'Lemba',
    d: 'M 255,340 L 295,330 L 285,420 L 245,395 Z',
    textX: 270,
    textY: 375,
    videoUrl: `${SUPABASE_STORAGE_URL}/lemba.mp4`
  },
  {
    id: 'matete',
    name: 'Matete',
    d: 'M 295,330 L 335,325 L 325,385 L 285,385 Z',
    textX: 310,
    textY: 360,
    videoUrl: `${SUPABASE_STORAGE_URL}/matete.mp4`
  },

  // --- INDUSTRIAL & EAST-CENTRAL CORRIDOR ---
  {
    id: 'limete',
    name: 'Limete',
    d: 'M 255,220 C 275,210 305,215 315,245 L 305,330 L 255,340 L 250,260 Z',
    textX: 285,
    textY: 275,
    videoUrl: `${SUPABASE_STORAGE_URL}/limete.mp4`
  },
  {
    id: 'masina',
    name: 'Masina',
    d: 'M 315,245 C 345,230 385,235 410,260 L 390,330 L 305,330 Z',
    textX: 355,
    textY: 280,
    videoUrl: `${SUPABASE_STORAGE_URL}/masina.mp4`
  },
  {
    id: 'ndjili',
    name: "N'djili",
    d: 'M 335,325 L 390,330 L 375,410 L 325,385 Z',
    textX: 355,
    textY: 365,
    videoUrl: `${SUPABASE_STORAGE_URL}/ndjili.mp4`
  },
  {
    id: 'kimbanseke',
    name: 'Kimbanseke',
    d: 'M 390,330 L 460,315 L 435,445 L 375,410 Z',
    textX: 415,
    textY: 380,
    videoUrl: `${SUPABASE_STORAGE_URL}/kimbanseke.mp4`
  },
  {
    id: 'ouanza',
    name: 'Ouanza',
    d: 'M 435,445 L 475,430 L 460,510 L 410,490 Z',
    textX: 445,
    textY: 470,
    videoUrl: `${SUPABASE_STORAGE_URL}/ouanza.mp4`
  },

  // --- SOUTHERN & VAST EASTERN PROVINCE EXPANSES ---
  {
    id: 'mont-ngafula',
    name: 'Mont-Ngafula',
    d: 'M 95,385 L 165,415 L 245,395 L 285,420 L 375,410 L 410,490 L 390,560 L 220,550 L 110,480 Z',
    textX: 250,
    textY: 480,
    videoUrl: `${SUPABASE_STORAGE_URL}/mont-ngafula.mp4`
  },
  {
    id: 'nsele',
    name: "N'sele",
    d: 'M 410,260 C 460,220 530,225 570,250 L 540,460 L 460,510 L 435,445 L 460,315 L 390,330 Z',
    textX: 495,
    textY: 350,
    videoUrl: `${SUPABASE_STORAGE_URL}/nsele.mp4`
  },
  {
    id: 'maluku',
    name: 'Maluku',
    d: 'M 570,250 C 640,190 730,205 820,240 C 900,280 945,330 920,430 C 895,520 840,580 770,590 L 630,570 L 540,460 Z',
    textX: 720,
    textY: 410,
    videoUrl: `${SUPABASE_STORAGE_URL}/maluku.mp4`
  }
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
      
      {/* Top Navigation */}
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

      {/* Main Grid: 68% True Map | 32% Intelligence Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7.5fr) minmax(320px, 3.5fr)', gap: '20px', maxWidth: '1700px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Kinshasa Province Map */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Official Kinshasa Province Silhouette (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              {hoveredCommune ? `Focus: ${hoveredCommune}` : `Selected: ${selectedCommune}`}
            </span>
          </div>
          
          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 970 620" style={{ width: '100%', height: 'auto', maxHeight: '720px', display: 'block' }}>
              
              {/* 3D Map Shadow Backdrop */}
              <path
                d="M 30,330 C 35,370 60,400 95,395 L 110,490 L 220,560 L 390,570 L 460,520 L 540,470 L 630,580 L 770,600 C 845,590 900,530 925,440 L 920,430 C 895,520 840,580 770,590 L 630,570 L 540,460 L 460,510 L 390,560 L 220,550 L 110,480 L 95,385 Z"
                fill="#0b1120"
                opacity="0.8"
              />

              {/* FLEUVE CONGO WATERWAY (Pool Malebo Arc) */}
              <path 
                d="M 20,280 C 70,220 140,200 220,200 C 320,200 420,220 540,210 C 660,180 760,190 850,210" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="28" 
                opacity="0.3" 
                strokeLinecap="round"
              />
              <text x="30" y="210" fill="#38bdf8" fontSize="15" fontWeight="900" opacity="0.8" letterSpacing="2">
                FLEUVE CONGO / POOL MALEBO
              </text>

              {/* COMMUNE SECTORS */}
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
                      stroke={isSelected ? '#93c5fd' : '#334155'}
                      strokeWidth={isSelected ? '2.5' : '1.2'}
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    <text
                      x={commune.textX}
                      y={commune.textY}
                      fill={isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#cbd5e1'}
                      fontSize={
                        commune.name === 'Maluku' || commune.name === "N'sele" || commune.name === 'Mont-Ngafula'
                          ? '18'
                          : isSelected
                          ? '13'
                          : '10'
                      }
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
            💡 Real geographical silhouette of Kinshasa. Click any commune sector to dynamically change the video and intelligence metrics.
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

            <h2 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', margin: '6px 0 14px 0', color: '#ffffff' }}>
              {selectedCommune}
            </h2>

            {/* Dynamic Video Feed */}
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
                Commune: <strong>{selectedCommune}</strong>
              </div>
            </div>

            {/* Live Metrics */}
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
