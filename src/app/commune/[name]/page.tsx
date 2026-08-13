'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

interface DispatchItem {
  id: string | number;
  commune: string;
  category: 'security' | 'economy' | 'social' | 'culture';
  title: string;
  details: string;
  time: string;
  author: string;
}

export default function CommuneHubPage({ params }: { params: { name: string } }) {
  const communeName = decodeURIComponent(params.name);
  const [dispatches, setDispatches] = useState<DispatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback reports if no custom records are stored in Supabase yet
  const defaultDispatches: DispatchItem[] = [
    {
      id: 'sec-1',
      commune: communeName,
      category: 'security',
      title: `${communeName} Sector Security Advisory`,
      details: 'Routine urban surveillance active. Key intersections and commercial avenues monitored by municipal security.',
      time: '15 mins ago',
      author: 'Journalist Dispatch'
    },
    {
      id: 'eco-1',
      commune: communeName,
      category: 'economy',
      title: `${communeName} Commercial Activity Index`,
      details: 'High merchant density reported along central market corridors. Payment processing operating normally.',
      time: '1 hour ago',
      author: 'Press Office'
    },
    {
      id: 'soc-1',
      commune: communeName,
      category: 'social',
      title: 'Community Infrastructure Update',
      details: 'Local public utility services, transportation hubs, and neighborhood access routes operating as scheduled.',
      time: '3 hours ago',
      author: 'Municipal Bulletin'
    },
    {
      id: 'cul-1',
      commune: communeName,
      category: 'culture',
      title: 'Cultural & Arts Field Event',
      details: 'Upcoming local artisan market and cultural gathering scheduled for this weekend.',
      time: '5 hours ago',
      author: 'Culture Desk'
    }
  ];

  useEffect(() => {
    const fetchDispatches = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dispatches')
          .select('*')
          .ilike('commune', communeName)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setDispatches(data);
        } else {
          setDispatches(defaultDispatches);
        }
      } catch (err) {
        setDispatches(defaultDispatches);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatches();
  }, [communeName]);

  const securityReports = dispatches.filter((d) => d.category === 'security');
  const economyReports = dispatches.filter((d) => d.category === 'economy');
  const socialReports = dispatches.filter((d) => d.category === 'social');
  const cultureReports = dispatches.filter((d) => d.category === 'culture');

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
      {/* Top Navigation Bar */}
      <nav 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid #1e293b',
          maxWidth: '1650px',
          margin: '0 auto 28px auto'
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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link 
            href="/login" 
            style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
          >
            Journalist Backoffice
          </Link>
          <Link 
            href="/" 
            style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
          >
            ← Portal Map
          </Link>
        </div>
      </nav>

      {/* Main Hub Container */}
      <div style={{ maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* Banner Header */}
        <div 
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Commune Sector Intelligence
              </span>
              <span style={{ backgroundColor: '#020617', color: '#22c55e', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                ● Live Feed Active
              </span>
            </div>
            <h1 style={{ fontSize: '38px', fontWeight: '900', textTransform: 'uppercase', margin: 0, color: '#ffffff', letterSpacing: '1px' }}>
              {communeName} Sector Hub
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: '#020617', padding: '12px 18px', borderRadius: '10px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Status</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e' }}>Monitored</span>
            </div>
            <div style={{ backgroundColor: '#020617', padding: '12px 18px', borderRadius: '10px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Reports Count</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8' }}>{dispatches.length} Entries</span>
            </div>
          </div>
        </div>

        {/* 4 Categorized Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* SECTION 1: SECURITY REPORTS */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Security Reports
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {securityReports.map((report) => (
                <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}>● Advisory</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{report.time}</span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: ECONOMY & BUSINESS */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>💼</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Economy & Trade
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {economyReports.map((report) => (
                <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>● Market Feed</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{report.time}</span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: SOCIAL & INFRASTRUCTURE */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>👥</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Social Services
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socialReports.map((report) => (
                <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>● Utility Log</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{report.time}</span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: CULTURE & COMMUNITY */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Culture & Events
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cultureReports.map((report) => (
                <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>● Community</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{report.time}</span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Footer Line */}
      <footer 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '20px', 
          marginTop: '40px',
          borderTop: '1px solid #1e293b', 
          fontSize: '11px', 
          color: '#64748b',
          maxWidth: '1650px',
          margin: '40px auto 0 auto'
        }}
      >
        <span>KINSHASA URBAN OPERATIONS PLATFORM — {communeName.toUpperCase()} HUB</span>
        <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>LIVE FIELD DISPATCHES ONLINE</span>
      </footer>

    </main>
  );
}
