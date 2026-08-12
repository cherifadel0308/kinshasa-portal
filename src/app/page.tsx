'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* Top Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Kinshasa Operations Portal
          </h1>
        </div>
        <Link 
          href="/login" 
          style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}
        >
          Journalist Access
        </Link>
      </nav>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Interactive Vector Map */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '24px' }}>
          <h2 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Interactive Vector Map
          </h2>
          
          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px' }}>
            <svg viewBox="0 0 800 600" style={{ width: '100%', height: 'auto', display: 'block' }}>
              
              {/* GOMBE COMMUNE */}
              <g onClick={() => setSelectedCommune('Gombe')} style={{ cursor: 'pointer' }}>
                <path 
                  d="M 280 180 L 420 180 L 400 240 L 260 240 Z" 
                  fill={selectedCommune === 'Gombe' ? '#2563eb' : '#1e293b'} 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
                <text x="325" y="215" fill="#ffffff" fontSize="14" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                  GOMBE
                </text>
              </g>

              {/* LIMETE COMMUNE */}
              <g onClick={() => setSelectedCommune('Limete')} style={{ cursor: 'pointer' }}>
                <path 
                  d="M 400 240 L 540 220 L 570 360 L 410 340 Z" 
                  fill={selectedCommune === 'Limete' ? '#2563eb' : '#1e293b'} 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
                <text x="460" y="290" fill="#ffffff" fontSize="14" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                  LIMETE
                </text>
              </g>

            </svg>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
            Click on a commune zone to switch the intelligence feed.
          </p>
        </section>

        {/* RIGHT PANEL: Commune Intelligence Feed */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', padding: '24px' }}>
          <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Active Zone
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', margin: '4px 0 16px 0' }}>
            {selectedCommune}
          </h2>

          <div style={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>
              <strong>Status:</strong> Operational
            </p>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
              Select points of interest, live security alerts, and local business feeds for {selectedCommune}.
            </p>
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
              textDecoration: 'none' 
            }}
          >
            Launch {selectedCommune} Hub →
          </Link>
        </section>

      </div>
    </main>
  );
}
