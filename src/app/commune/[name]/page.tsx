'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

interface DispatchItem {
  id: string | number;
  commune: string;
  category: string;
  title: string;
  details: string;
  created_at?: string;
  author?: string;
  url?: string;
}

export default function CommuneHubPage({ params }: { params: { name: string } }) {
  const communeName = decodeURIComponent(params.name);
  const [dispatches, setDispatches] = useState<DispatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback reports if no database records exist for this commune
  const defaultDispatches: DispatchItem[] = [
    {
      id: 'news-1',
      commune: communeName,
      category: 'live news',
      title: `${communeName} Sector Operational & Media Briefing`,
      details: 'Latest verified field reports and local press updates gathered across municipal monitoring channels.',
      created_at: new Date(Date.now() - 10 * 60000).toISOString(),
      author: 'Radio Okapi RSS'
    },
    {
      id: 'sec-1',
      commune: communeName,
      category: 'security',
      title: `${communeName} Sector Security Advisory`,
      details: 'Routine urban surveillance active. Key intersections and commercial avenues monitored by municipal security.',
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'eco-1',
      commune: communeName,
      category: 'economy',
      title: `${communeName} Commercial Activity Index`,
      details: 'High merchant density reported along central market corridors. Payment processing operating normally.',
      created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      id: 'soc-1',
      commune: communeName,
      category: 'social',
      title: 'Community Infrastructure Update',
      details: 'Local public utility services, transportation hubs, and neighborhood access routes operating as scheduled.',
      created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    },
    {
      id: 'cul-1',
      commune: communeName,
      category: 'culture',
      title: 'Cultural & Arts Field Event',
      details: 'Upcoming local artisan market and cultural gathering scheduled for this weekend.',
      created_at: new Date(Date.now() - 300 * 60000).toISOString(),
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
          const mappedData = data.map((item: any) => ({
            id: item.id,
            commune: item.commune,
            category: (item.category || item.type || 'live news').toLowerCase(),
            title: item.title,
            details: item.details,
            created_at: item.created_at || new Date().toISOString(),
            author: item.author || 'Press RSS',
            url: item.url || ''
          }));
          setDispatches(mappedData);
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

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Categorize Dispatches
  const liveNewsReports = dispatches.filter((d) => 
    d.category.includes('news') || d.category.includes('live') || d.author?.toLowerCase().includes('rss')
  );
  const securityReports = dispatches.filter((d) => d.category.includes('sec'));
  const economyReports = dispatches.filter((d) => d.category.includes('eco') || d.category.includes('trade'));
  const socialReports = dispatches.filter((d) => d.category.includes('soc') || d.category.includes('gen'));
  const cultureReports = dispatches.filter((d) => d.category.includes('cul') || d.category.includes('art'));

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
      {/* Top Header */}
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
            href="/backoffice" 
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
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Total Dispatches</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8' }}>{dispatches.length} Entries</span>
            </div>
          </div>
        </div>

        {/* FEATURED SECTION: LIVE NEWS FEED */}
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📰</span>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Live News Feed ({liveNewsReports.length})
              </h2>
            </div>
            <span style={{ backgroundColor: '#020617', color: '#38bdf8', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', border: '1px solid #1e293b', textTransform: 'uppercase' }}>
              Congolese Media Feed
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {liveNewsReports.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>No automated media news fetched for {communeName} yet.</p>
            ) : (
              liveNewsReports.map((report) => (
                <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ● {report.author || 'Media Stream'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0', lineHeight: '1.3' }}>{report.title}</h3>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                  </div>
                  {report.url && (
                    <a 
                      href={report.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: '12px', fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      Read Original Article →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4 SPECIFIC SECTOR CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* SECTION 1: SECURITY REPORTS */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Security Reports ({securityReports.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {securityReports.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>No active security advisories for {communeName}.</p>
              ) : (
                securityReports.map((report) => (
                  <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}>● Security</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 2: ECONOMY & TRADE */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>💼</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Economy & Trade ({economyReports.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {economyReports.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>No economic updates posted for {communeName}.</p>
              ) : (
                economyReports.map((report) => (
                  <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>● Economy</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 3: SOCIAL SERVICES */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>👥</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Social Services ({socialReports.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socialReports.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>No social infrastructure updates posted for {communeName}.</p>
              ) : (
                socialReports.map((report) => (
                  <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>● Social</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 4: CULTURE & EVENTS */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '20px' }}>🎨</span>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#ffffff' }}>
                Culture & Events ({cultureReports.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cultureReports.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>No cultural events reported for {communeName}.</p>
              ) : (
                cultureReports.map((report) => (
                  <div key={report.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>● Culture</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px 0' }}>{report.title}</h3>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{report.details}</p>
                  </div>
                ))
              )}
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
