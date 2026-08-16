'use client';
import { useState } from 'react';
import Link from 'next/link';

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// Resized Vector Map Coordinates Matching the Silhouette of image_50525d.png
const KINSHASA_COMMUNES = [
  // --- WESTERN BULB ---
  { id: 'ngaliema', name: 'Ngaliema', d: 'M 35,240 C 65,180 125,165 165,210 L 175,305 L 115,350 L 45,310 Z', textX: 110, textY: 265, fontSize: 13, videoUrl: `${SUPABASE_STORAGE_URL}/ngaliema.mp4` },
  { id: 'kintambo', name: 'Kintambo', d: 'M 165,210 L 205,195 L 200,225 L 165,220 Z', textX: 184, textY: 212, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kintambo.mp4` },
  { id: 'gombe', name: 'Gombe', d: 'M 205,195 C 255,180 305,182 340,195 L 325,228 L 200,225 Z', textX: 265, textY: 205, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/gombe.mp4` },
  { id: 'barumbu', name: 'Barumbu', d: 'M 340,195 L 380,200 L 365,232 L 325,228 Z', textX: 353, textY: 212, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/barumbu.mp4` },

  // --- URBAN DENSE CORE ---
  { id: 'lingwala', name: 'Lingwala', d: 'M 200,225 L 240,223 L 235,250 L 195,248 Z', textX: 218, textY: 236, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/lingwala.mp4` },
  { id: 'kinshasa', name: 'Kinshasa', d: 'M 325,228 L 365,232 L 355,258 L 315,252 Z', textX: 340, textY: 242, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kinshasa.mp4` },
  { id: 'kasa-vubu', name: 'Kasa-Vubu', d: 'M 240,223 L 280,221 L 275,250 L 235,250 Z', textX: 258, textY: 235, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kasa-vubu.mp4` },
  { id: 'bandalungwa', name: 'Bandalungwa', d: 'M 175,220 L 200,225 L 195,270 L 160,265 Z', textX: 183, textY: 245, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/bandalungwa.mp4` },
  { id: 'ngiri-ngiri', name: 'Ngiri-Ngiri', d: 'M 235,250 L 275,250 L 270,278 L 230,278 Z', textX: 252, textY: 264, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/ngiri-ngiri.mp4` },
  { id: 'kalamu', name: 'Kalamu', d: 'M 280,221 L 325,228 L 315,278 L 270,278 Z', textX: 298, textY: 248, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kalamu.mp4` },
  { id: 'bumbu', name: 'Bumbu', d: 'M 230,278 L 270,278 L 265,312 L 225,312 Z', textX: 248, textY: 295, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/bumbu.mp4` },
  { id: 'selembao', name: 'Selembao', d: 'M 160,265 L 195,270 L 225,312 L 145,318 Z', textX: 180, textY: 292, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/selembao.mp4` },
  { id: 'makala', name: 'Makala', d: 'M 270,278 L 315,278 L 305,322 L 265,312 Z', textX: 288, textY: 298, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/makala.mp4` },
  { id: 'ngaba', name: 'Ngaba', d: 'M 315,278 L 350,274 L 340,315 L 305,322 Z', textX: 328, textY: 295, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/ngaba.mp4` },
  { id: 'lemba', name: 'Lemba', d: 'M 350,274 L 400,265 L 385,345 L 340,315 Z', textX: 368, textY: 302, fontSize: 10, videoUrl: `${SUPABASE_STORAGE_URL}/lemba.mp4` },
  { id: 'matete', name: 'Matete', d: 'M 400,265 L 440,260 L 430,308 L 385,308 Z', textX: 414, textY: 282, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/matete.mp4` },

  // --- WATERFRONT & EASTERN EXTENSION ---
  { id: 'limete', name: 'Limete', d: 'M 380,200 C 420,205 450,215 465,252 L 440,260 L 400,265 L 365,232 Z', textX: 418, textY: 230, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/limete.mp4` },
  { id: 'masina', name: 'Masina', d: 'M 465,252 C 525,220 575,230 595,270 L 530,280 L 465,252 Z', textX: 525, textY: 248, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/masina.mp4` },
  { id: 'ndjili', name: "N'djili", d: 'M 465,252 L 530,280 L 515,340 L 440,308 Z', textX: 488, textY: 295, fontSize: 10, videoUrl: `${SUPABASE_STORAGE_URL}/ndjili.mp4` },
  { id: 'kimbanseke', name: 'Kimbanseke', d: 'M 530,280 L 625,265 L 605,375 L 515,340 Z', textX: 568, textY: 318, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/kimbanseke.mp4` },

  // --- MASSIVE SOUTHERN & EASTERN MASS (MATCHING REFERENCE SILHOUETTE) ---
  { id: 'mont-ngafula', name: 'Mont-Ngafula', d: 'M 115,350 L 145,318 L 340,315 L 385,345 L 515,340 L 605,375 L 555,510 L 285,500 L 115,350 Z', textX: 345, textY: 420, fontSize: 18, videoUrl: `${SUPABASE_STORAGE_URL}/mont-ngafula.mp4` },
  { id: 'nsele', name: "N'sele", d: 'M 595,270 C 665,240 725,260 745,305 L 715,500 L 605,375 Z', textX: 665, textY: 360, fontSize: 16, videoUrl: `${SUPABASE_STORAGE_URL}/nsele.mp4` },
  { id: 'maluku', name: 'Maluku', d: 'M 745,305 C 775,280 790,290 795,340 L 775,515 L 715,500 Z', textX: 758, textY: 400, fontSize: 18, videoUrl: `${SUPABASE_STORAGE_URL}/maluku.mp4` },
  { id: 'ouanza', name: 'Ouanza', d: 'M 605,375 L 715,500 L 645,520 L 555,510 Z', textX: 630, textY: 475, fontSize: 12, videoUrl: `${SUPABASE_STORAGE_URL}/ouanza.mp4` }
];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeCommuneObj = KINSHASA_COMMUNES.find(
    (c) => c.name.toLowerCase() === selectedCommune.toLowerCase()
  );

  const cleanVideoName = selectedCommune.toLowerCase().replace("'", "");
  const activeVideoSrc = activeCommuneObj?.videoUrl || `${SUPABASE_STORAGE_URL}/${cleanVideoName}.mp4`;

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Top Header */}
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

      {/* Grid Layout: 70% Map Panel | 30% Dynamic Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Scaled Vector Map Matching Silhouette Ratio */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Official Kinshasa Commune Silhouette (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              {hoveredCommune ? `Focus: ${hoveredCommune}` : `Selected: ${selectedCommune}`}
            </span>
          </div>

          {/* Interactive Zoom Controls */}
          <div style={{ position: 'absolute', top: '55px', right: '35px', zIndex: 10, display: 'flex', gap: '6px' }}>
            <button 
              onClick={handleZoomIn}
              style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}
              title="Zoom In"
            >
              +
            </button>
            <button 
              onClick={handleZoomOut}
              style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}
              title="Zoom Out"
            >
              −
            </button>
            <button 
              onClick={handleResetZoom}
              style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '0 8px', height: '32px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
          
          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <svg 
              viewBox="0 0 820 540" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '600px', 
                display: 'block',
                transform: `scale(${zoomLevel})`,
                transformOrigin: '320px 260px',
                transition: 'transform 0.3s ease-out'
              }}
            >
              
              {/* FLEUVE CONGO WATERWAY */}
              <path 
                d="M 25,230 Q 150,150 280,155 C 370,160 410,135 500,165 C 620,205 730,125 810,185" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="34" 
                opacity="0.3" 
                strokeLinecap="round"
              />
              <text x="45" y="160" fill="#38bdf8" fontSize="14" fontWeight="900" opacity="0.8" letterSpacing="2">
                FLEUVE CONGO / POOL MALEBO
              </text>

              {/* 24 COMMUNE POLYGON SECTORS */}
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
                      style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
                    />
                    <text
                      x={commune.textX}
                      y={commune.textY}
                      fill={isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#cbd5e1'}
                      fontSize={isSelected ? commune.fontSize + 2 : commune.fontSize}
                      fontWeight="900"
                      textAnchor="middle"
                      style={{ 
                        pointerEvents: 'none', 
                        userSelect: 'none',
                        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.95)'
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
            💡 Vector map scaled directly to official Kinshasa province proportions. Click any commune sector to activate live stream data.
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

            {/* Dynamic Video Player */}
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
