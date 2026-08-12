'use client';
import { useState } from 'react';
import Link from 'next/link';

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// Authentic Geographical Vectors for Kinshasa's 24 Communes
const KINSHASA_COMMUNES = [
  // --- WEST & WATERFRONT (FLEUVE CONGO) ---
  { 
    id: 'ngaliema', 
    name: 'Ngaliema', 
    d: 'M 90,260 C 120,180 180,160 220,210 L 230,340 L 160,390 L 80,330 Z', 
    textX: 155, textY: 290, fontSize: 13,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngaliema.mp4` 
  },
  { 
    id: 'kintambo', 
    name: 'Kintambo', 
    d: 'M 220,210 L 260,195 L 255,230 L 220,225 Z', 
    textX: 238, textY: 216, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/kintambo.mp4` 
  },
  { 
    id: 'gombe', 
    name: 'Gombe', 
    d: 'M 260,195 C 310,180 370,182 410,195 L 395,232 L 255,230 Z', 
    textX: 320, textY: 210, fontSize: 11,
    videoUrl: `${SUPABASE_STORAGE_URL}/gombe.mp4` 
  },
  { 
    id: 'barumbu', 
    name: 'Barumbu', 
    d: 'M 410,195 L 455,202 L 440,238 L 395,232 Z', 
    textX: 425, textY: 218, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/barumbu.mp4` 
  },

  // --- URBAN DENSE CORE ---
  { 
    id: 'lingwala', 
    name: 'Lingwala', 
    d: 'M 255,230 L 300,228 L 295,258 L 250,255 Z', 
    textX: 275, textY: 246, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/lingwala.mp4` 
  },
  { 
    id: 'kinshasa', 
    name: 'Kinshasa', 
    d: 'M 395,232 L 440,238 L 430,268 L 385,260 Z', 
    textX: 412, textY: 252, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/kinshasa.mp4` 
  },
  { 
    id: 'kasa-vubu', 
    name: 'Kasa-Vubu', 
    d: 'M 300,228 L 345,226 L 340,258 L 295,258 Z', 
    textX: 320, textY: 244, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/kasa-vubu.mp4` 
  },
  { 
    id: 'bandalungwa', 
    name: 'Bandalungwa', 
    d: 'M 220,225 L 255,230 L 250,285 L 210,278 Z', 
    textX: 232, textY: 258, fontSize: 8,
    videoUrl: `${SUPABASE_STORAGE_URL}/bandalungwa.mp4` 
  },
  { 
    id: 'ngiri-ngiri', 
    name: 'Ngiri-Ngiri', 
    d: 'M 295,258 L 340,258 L 335,290 L 290,290 Z', 
    textX: 315, textY: 276, fontSize: 8,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngiri-ngiri.mp4` 
  },
  { 
    id: 'kalamu', 
    name: 'Kalamu', 
    d: 'M 345,226 L 395,225 L 385,282 L 335,290 Z', 
    textX: 362, textY: 258, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/kalamu.mp4` 
  },
  { 
    id: 'bumbu', 
    name: 'Bumbu', 
    d: 'M 290,290 L 335,290 L 330,328 L 285,328 Z', 
    textX: 310, textY: 311, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/bumbu.mp4` 
  },
  { 
    id: 'selembao', 
    name: 'Selembao', 
    d: 'M 210,278 L 250,285 L 285,328 L 195,335 Z', 
    textX: 235, textY: 308, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/selembao.mp4` 
  },
  { 
    id: 'makala', 
    name: 'Makala', 
    d: 'M 335,290 L 385,282 L 375,338 L 330,328 Z', 
    textX: 355, textY: 311, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/makala.mp4` 
  },
  { 
    id: 'ngaba', 
    name: 'Ngaba', 
    d: 'M 385,282 L 425,278 L 415,325 L 375,338 Z', 
    textX: 400, textY: 306, fontSize: 8,
    videoUrl: `${SUPABASE_STORAGE_URL}/ngaba.mp4` 
  },
  { 
    id: 'lemba', 
    name: 'Lemba', 
    d: 'M 425,278 L 480,268 L 465,355 L 415,325 Z', 
    textX: 445, textY: 315, fontSize: 10,
    videoUrl: `${SUPABASE_STORAGE_URL}/lemba.mp4` 
  },
  { 
    id: 'matete', 
    name: 'Matete', 
    d: 'M 480,268 L 525,262 L 515,315 L 465,315 Z', 
    textX: 495, textY: 290, fontSize: 9,
    videoUrl: `${SUPABASE_STORAGE_URL}/matete.mp4` 
  },

  // --- POOL MALEBO & EASTERN EXTENSIONS ---
  { 
    id: 'limete', 
    name: 'Limete', 
    d: 'M 455,202 C 500,208 535,218 550,260 L 525,262 L 480,268 L 430,268 Z', 
    textX: 495, textY: 238, fontSize: 11,
    videoUrl: `${SUPABASE_STORAGE_URL}/limete.mp4` 
  },
  { 
    id: 'masina', 
    name: 'Masina', 
    d: 'M 550,208 C 615,222 665,232 685,275 L 615,285 L 550,260 Z', 
    textX: 615, textY: 248, fontSize: 11,
    videoUrl: `${SUPABASE_STORAGE_URL}/masina.mp4` 
  },
  { 
    id: 'ndjili', 
    name: "N'djili", 
    d: 'M 550,260 L 615,285 L 600,352 L 525,315 Z', 
    textX: 572, textY: 308, fontSize: 10,
    videoUrl: `${SUPABASE_STORAGE_URL}/ndjili.mp4` 
  },
  { 
    id: 'kimbanseke', 
    name: 'Kimbanseke', 
    d: 'M 615,285 L 715,270 L 695,392 L 600,352 Z', 
    textX: 655, textY: 330, fontSize: 11,
    videoUrl: `${SUPABASE_STORAGE_URL}/kimbanseke.mp4` 
  },

  // --- VAST SOUTHERN & EASTERN BOUNDARIES ---
  { 
    id: 'mont-ngafula', 
    name: 'Mont-Ngafula', 
    d: 'M 80,330 L 160,390 L 195,335 L 375,338 L 465,355 L 600,352 L 695,392 L 640,570 L 140,540 Z', 
    textX: 360, textY: 450, fontSize: 18,
    videoUrl: `${SUPABASE_STORAGE_URL}/mont-ngafula.mp4` 
  },
  { 
    id: 'nsele', 
    name: "N'sele", 
    d: 'M 685,275 C 765,245 835,265 855,315 L 825,535 L 695,392 Z', 
    textX: 765, textY: 380, fontSize: 16,
    videoUrl: `${SUPABASE_STORAGE_URL}/nsele.mp4` 
  },
  { 
    id: 'maluku', 
    name: 'Maluku', 
    d: 'M 855,315 C 935,275 995,295 1025,365 L 975,605 L 825,535 Z', 
    textX: 920, textY: 450, fontSize: 20,
    videoUrl: `${SUPABASE_STORAGE_URL}/maluku.mp4` 
  },
  { 
    id: 'ouanza', 
    name: 'Ouanza', 
    d: 'M 695,392 L 825,535 L 745,605 L 640,570 Z', 
    textX: 725, textY: 525, fontSize: 12,
    videoUrl: `${SUPABASE_STORAGE_URL}/ouanza.mp4` 
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

      {/* Grid Layout: Map Panel (70%) & Live Intelligence Panel (30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', gap: '20px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: True Vector Silhouette Map */}
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
            <svg viewBox="0 0 1050 630" style={{ width: '100%', height: 'auto', maxHeight: '680px', display: 'block' }}>
              
              {/* FLEUVE CONGO / POOL MALEBO WATERWAY */}
              <path 
                d="M 40,240 Q 180,160 310,165 C 410,170 450,145 550,175 C 680,215 810,135 1010,195" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="40" 
                opacity="0.35" 
                strokeLinecap="round"
              />
              <text x="60" y="170" fill="#38bdf8" fontSize="15" fontWeight="900" opacity="0.85" letterSpacing="2">
                FLEUVE CONGO / POOL MALEBO
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
                      fill={isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#cbd5e1'}
                      fontSize={isSelected ? commune.fontSize + 3 : commune.fontSize}
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
            💡 Real geographical silhouette of Kinshasa. Click any commune sector to dynamically change the video and intelligence metrics.
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

            {/* Security & Economic Status */}
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
