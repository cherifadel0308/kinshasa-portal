'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const SUPABASE_STORAGE_URL = 'https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos';
const DEFAULT_VIDEO = `${SUPABASE_STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

const KINSHASA_COMMUNES = [
  // Waterfront / West
  { id: 'ngaliema', name: 'Ngaliema', d: 'M 100,240 C 130,170 190,150 230,200 L 240,330 L 170,380 L 90,320 Z', textX: 165, textY: 280, fontSize: 13, videoUrl: `${SUPABASE_STORAGE_URL}/ngaliema.mp4` },
  { id: 'kintambo', name: 'Kintambo', d: 'M 230,200 L 270,185 L 265,220 L 230,215 Z', textX: 248, textY: 206, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kintambo.mp4` },
  { id: 'gombe', name: 'Gombe', d: 'M 270,185 C 320,170 380,172 420,185 L 405,222 L 265,220 Z', textX: 335, textY: 198, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/gombe.mp4` },
  { id: 'barumbu', name: 'Barumbu', d: 'M 420,185 L 465,192 L 450,228 L 405,222 Z', textX: 435, textY: 208, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/barumbu.mp4` },

  // Urban Central Core
  { id: 'lingwala', name: 'Lingwala', d: 'M 265,220 L 310,218 L 305,248 L 260,245 Z', textX: 285, textY: 236, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/lingwala.mp4` },
  { id: 'kinshasa', name: 'Kinshasa', d: 'M 405,222 L 450,228 L 440,258 L 395,250 Z', textX: 422, textY: 242, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kinshasa.mp4` },
  { id: 'kasa-vubu', name: 'Kasa-Vubu', d: 'M 310,218 L 355,216 L 305,248 L 305,248 Z', textX: 330, textY: 234, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kasa-vubu.mp4` },
  { id: 'bandalungwa', name: 'Bandalungwa', d: 'M 230,215 L 265,220 L 260,275 L 220,268 Z', textX: 242, textY: 248, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/bandalungwa.mp4` },
  { id: 'ngiri-ngiri', name: 'Ngiri-Ngiri', d: 'M 305,248 L 350,248 L 345,280 L 300,280 Z', textX: 325, textY: 266, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/ngiri-ngiri.mp4` },
  { id: 'kalamu', name: 'Kalamu', d: 'M 355,216 L 405,215 L 395,272 L 345,280 Z', textX: 372, textY: 248, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/kalamu.mp4` },
  { id: 'bumbu', name: 'Bumbu', d: 'M 300,280 L 345,280 L 340,318 L 295,318 Z', textX: 320, textY: 301, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/bumbu.mp4` },
  { id: 'selembao', name: 'Selembao', d: 'M 220,268 L 260,275 L 295,318 L 205,325 Z', textX: 245, textY: 298, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/selembao.mp4` },
  { id: 'makala', name: 'Makala', d: 'M 345,280 L 395,272 L 385,328 L 340,318 Z', textX: 365, textY: 301, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/makala.mp4` },
  { id: 'ngaba', name: 'Ngaba', d: 'M 395,272 L 435,268 L 425,315 L 385,328 Z', textX: 410, textY: 296, fontSize: 8, videoUrl: `${SUPABASE_STORAGE_URL}/ngaba.mp4` },
  { id: 'lemba', name: 'Lemba', d: 'M 435,268 L 490,258 L 475,345 L 425,315 Z', textX: 455, textY: 305, fontSize: 10, videoUrl: `${SUPABASE_STORAGE_URL}/lemba.mp4` },
  { id: 'matete', name: 'Matete', d: 'M 490,258 L 535,252 L 525,305 L 475,305 Z', textX: 505, textY: 280, fontSize: 9, videoUrl: `${SUPABASE_STORAGE_URL}/matete.mp4` },

  // Eastern & Pool Malebo
  { id: 'limete', name: 'Limete', d: 'M 465,192 C 510,198 545,208 560,250 L 535,252 L 490,258 L 440,258 Z', textX: 505, textY: 228, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/limete.mp4` },
  { id: 'masina', name: 'Masina', d: 'M 560,198 C 625,212 675,222 695,265 L 625,275 L 560,250 Z', textX: 625, textY: 238, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/masina.mp4` },
  { id: 'ndjili', name: "N'djili", d: 'M 560,250 L 625,275 L 610,342 L 535,305 Z', textX: 582, textY: 298, fontSize: 10, videoUrl: `${SUPABASE_STORAGE_URL}/ndjili.mp4` },
  { id: 'kimbanseke', name: 'Kimbanseke', d: 'M 625,275 L 725,260 L 705,382 L 610,342 Z', textX: 665, textY: 320, fontSize: 11, videoUrl: `${SUPABASE_STORAGE_URL}/kimbanseke.mp4` },

  // Outer Regional Extents
  { id: 'mont-ngafula', name: 'Mont-Ngafula', d: 'M 90,320 L 170,380 L 205,325 L 385,328 L 475,345 L 610,342 L 705,382 L 650,560 L 150,530 Z', textX: 370, textY: 440, fontSize: 18, videoUrl: `${SUPABASE_STORAGE_URL}/mont-ngafula.mp4` },
  { id: 'nsele', name: "N'sele", d: 'M 695,265 C 775,235 845,255 865,305 L 835,525 L 705,382 Z', textX: 775, textY: 370, fontSize: 16, videoUrl: `${SUPABASE_STORAGE_URL}/nsele.mp4` },
  { id: 'maluku', name: 'Maluku', d: 'M 865,305 C 945,265 1005,285 1035,355 L 985,595 L 835,525 Z', textX: 930, textY: 440, fontSize: 20, videoUrl: `${SUPABASE_STORAGE_URL}/maluku.mp4` },
  { id: 'ouanza', name: 'Ouanza', d: 'M 705,382 L 835,525 L 755,595 L 650,560 Z', textX: 735, textY: 515, fontSize: 12, videoUrl: `${SUPABASE_STORAGE_URL}/ouanza.mp4` }
];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [liveNews, setLiveNews] = useState<any[]>([]);

  const activeCommuneObj = KINSHASA_COMMUNES.find(
    (c) => c.name.toLowerCase() === selectedCommune.toLowerCase()
  );

  const cleanVideoName = selectedCommune.toLowerCase().replace("'", "");
  const activeVideoSrc = activeCommuneObj?.videoUrl || `${SUPABASE_STORAGE_URL}/${cleanVideoName}.mp4`;

  // Fetch Live Dispatches for Active Commune from Supabase
  useEffect(() => {
    const fetchCommuneNews = async () => {
      try {
        const { data, error } = await supabase
          .from('dispatches')
          .select('*')
          .ilike('commune', selectedCommune)
          .order('created_at', { ascending: false })
          .limit(3);

        if (data && data.length > 0) {
          setLiveNews(data);
        } else {
          // Default fallbacks if no Supabase records exist yet
          setLiveNews([
            { id: 1, title: `${selectedCommune} Urban Surveillance Active`, details: 'Security forces and municipal teams operating routine surveillance.', category: 'security', time: 'Live' },
            { id: 2, title: `${selectedCommune} Commercial Activity Normal`, details: 'Local markets reporting standard high-volume density.', category: 'economy', time: 'Live' }
          ]);
        }
      } catch (err) {
        setLiveNews([]);
      }
    };

    fetchCommuneNews();
  }, [selectedCommune]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

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
      
      {/* Top Header Bar */}
      <nav 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px', 
          paddingBottom: '12px', 
          borderBottom: '1px solid #1e293b',
          maxWidth: '1650px',
          width: '100%',
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
            Kinshasa Urban Intelligence Portal
          </h1>
        </div>
        <Link 
          href="/login" 
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

      {/* Main Grid: 70% Map | 30% Dynamic Feed */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 7fr) minmax(320px, 4fr)', 
          gap: '20px', 
          maxWidth: '1650px', 
          margin: '0 auto' 
        }}
      >
        
        {/* LEFT PANEL: Responsive Vector Map */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Official Kinshasa Commune Silhouette (24 Communes)
            </h2>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
              {hoveredCommune ? `Hover: ${hoveredCommune}` : `Selected: ${selectedCommune}`}
            </span>
          </div>

          {/* Map Controls */}
          <div style={{ position: 'absolute', top: '55px', right: '35px', zIndex: 10, display: 'flex', gap: '6px' }}>
            <button onClick={handleZoomIn} style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
            <button onClick={handleZoomOut} style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer' }}>−</button>
            <button onClick={handleResetZoom} style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '0 8px', height: '32px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Reset</button>
          </div>
          
          <div 
            style={{ 
              backgroundColor: '#020617', 
              borderRadius: '12px', 
              border: '1px solid #1e293b', 
              padding: '16px', 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden' 
            }}
          >
            <svg 
              viewBox="0 0 1080 630" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '620px', 
                display: 'block',
                transform: `scale(${zoomLevel})`,
                transformOrigin: '350px 250px',
                transition: 'transform 0.3s ease-out'
              }}
            >
              
              {/* FLEUVE CONGO WATERWAY */}
              <path 
                d="M 30,230 Q 170,150 300,155 C 400,160 440,135 540,165 C 670,205 800,125 1000,185" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="38" 
                opacity="0.35" 
                strokeLinecap="round"
              />
              <text x="50" y="160" fill="#38bdf8" fontSize="15" fontWeight="900" opacity="0.8" letterSpacing="2">
                FLEUVE CONGO / POOL MALEBO
              </text>

              {/* 24 COMMUNE POLYGONS */}
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
        </section>

        {/* RIGHT PANEL: Video & Live Sector News Dispatches */}
        <section 
          style={{ 
            backgroundColor: '#0f172a', 
            borderRadius: '16px', 
            border: '1px solid #1e293b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
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
                Sector Stream: <strong>{selectedCommune}</strong>
              </div>
            </div>

            {/* THE FIX: LIVE COMMUNE NEWS DISPATCHES STABILIZED WITH INLINE STYLES */}
            <div style={{ marginBottom: '16px' }}>
              <h3 
                style={{ 
                  fontSize: '11px', 
                  color: '#94a3b8', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  marginBottom: '8px',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '6px' 
                }}
              >
                Live {selectedCommune} Dispatches
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {liveNews.map((news, idx) => (
                  <div 
                    key={news.id || idx} 
                    style={{ 
                      backgroundColor: '#020617', 
                      border: '1px solid #1e293b', 
                      borderRadius: '8px', 
                      padding: '10px' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span 
                        style={{ 
                          fontSize: '9px', 
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
                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 2px 0' }}>
                      {news.title}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.3' }}>
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
              padding: '12px', 
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
