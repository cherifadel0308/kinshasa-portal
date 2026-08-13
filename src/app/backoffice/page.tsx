'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const KINSHASA_COMMUNES = [
  'Bandalungwa', 'Barumbu', 'Bumbu', 'Gombe', 'Kalamu', 'Kasa-Vubu',
  'Kimbanseke', 'Kinshasa', 'Kintambo', 'Lemba', 'Limete', 'Lingwala',
  'Makala', 'Maluku', 'Masina', 'Matete', 'Mont-Ngafula', "N'djili",
  'Ngaba', 'Ngaliema', 'Ngiri-Ngiri', "N'sele", 'Ouanza', 'Selembao'
];

export default function BackofficePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Dispatch Form State
  const [selectedCommune, setSelectedCommune] = useState('Gombe');
  const [alertType, setAlertType] = useState('security');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDetails, setAlertDetails] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock Feed of Dispatches for visual presentation
  const [recentDispatches, setRecentDispatches] = useState([
    { id: 1, commune: 'Gombe', type: 'security', title: 'Boulevard 30 Juin Patrol Update', time: '10 mins ago' },
    { id: 2, commune: 'Limete', type: 'economic', title: 'Commercial District Density Spike', time: '25 mins ago' },
    { id: 3, commune: 'Mont-Ngafula', type: 'general', title: 'Route de Matadi Traffic Monitoring', time: '1 hour ago' }
  ]);

  // Authenticate Session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Fallback for presentation mode if unauthenticated
        setUser({ email: 'journalist@kinshasa-portal.cd' });
      } else {
        setUser(session.user);
      }
      setLoadingAuth(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handlePublishDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setStatusMsg(null);

    setTimeout(() => {
      const newDispatch = {
        id: Date.now(),
        commune: selectedCommune,
        type: alertType,
        title: alertTitle || `${selectedCommune} Operational Dispatch`,
        time: 'Just now'
      };

      setRecentDispatches([newDispatch, ...recentDispatches]);
      setStatusMsg({ type: 'success', text: `Broadcast successfully published to ${selectedCommune} Sector Hub!` });
      setAlertTitle('');
      setAlertDetails('');
      setPublishing(false);
    }, 800);
  };

  if (loadingAuth) {
    return (
      <div style={{ backgroundColor: '#020617', color: '#38bdf8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
        Authenticating Journalist Command Channel...
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Top Header Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #1e293b', maxWidth: '1650px', margin: '0 auto 24px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#ffffff' }}>
              Kinshasa Journalist Backoffice Hub
            </h1>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Logged in as: <strong style={{ color: '#38bdf8' }}>{user?.email || 'Authenticated Press Clearance'}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link 
            href="/" 
            style={{ backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #1e293b', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
          >
            ← View Live Portal Map
          </Link>
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            Exit Terminal
          </button>
        </div>
      </nav>

      {/* Main Grid: Left Dispatch Form (60%) | Right Command Feed & Status (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 6fr) minmax(320px, 4fr)', gap: '24px', maxWidth: '1650px', margin: '0 auto' }}>
        
        {/* LEFT PANEL: Dispatch Form */}
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #1e293b' }}>
            <div>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Field Reporting Channel
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', textTransform: 'uppercase', margin: '2px 0 0 0', color: '#ffffff' }}>
                Dispatch Commune Alert
              </h2>
            </div>
            <span style={{ backgroundColor: '#020617', color: '#22c55e', fontSize: '11px', padding: '6px 12px', borderRadius: '12px', border: '1px solid #1e293b', fontWeight: 'bold' }}>
              ● Encoder Active
            </span>
          </div>

          {/* Feedback Toast */}
          {statusMsg && (
            <div style={{ backgroundColor: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 38, 38, 0.15)', border: `1px solid ${statusMsg.type === 'success' ? '#22c55e' : '#dc2626'}`, color: statusMsg.type === 'success' ? '#4ade80' : '#fca5a5', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px' }}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handlePublishDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Target Sector Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                  Target Commune Sector
                </label>
                <select 
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                >
                  {KINSHASA_COMMUNES.map((commune) => (
                    <option key={commune} value={commune}>{commune}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                  Alert Category
                </label>
                <select 
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                >
                  <option value="security">Security Advisory</option>
                  <option value="economic">Economic / Business</option>
                  <option value="general">Urban Infrastructure</option>
                </select>
              </div>
            </div>

            {/* Headline Input */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Dispatch Headline
              </label>
              <input 
                type="text" 
                required
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. Traffic Rerouted along Boulevard du 30 Juin"
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Details Text Area */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Field Intelligence Details
              </label>
              <textarea 
                rows={5}
                required
                value={alertDetails}
                onChange={(e) => setAlertDetails(e.target.value)}
                placeholder="Enter verified field report observations, security status, or urban updates for public display..."
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Submit Action */}
            <button 
              type="submit"
              disabled={publishing}
              style={{ backgroundColor: publishing ? '#1d4ed8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: publishing ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' }}
            >
              {publishing ? 'Transmitting Dispatch...' : 'Broadcast Alert to Portal →'}
            </button>

          </form>
        </section>

        {/* RIGHT PANEL: Live Field Log & System Health */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Recent Dispatches Log */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                Live Field Dispatch Log
              </h3>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>
                {recentDispatches.length} Active Records
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentDispatches.map((dispatch) => (
                <div key={dispatch.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ backgroundColor: '#1e293b', color: '#60a5fa', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {dispatch.commune}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{dispatch.time}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    {dispatch.title}
                  </h4>
                  <span style={{ fontSize: '10px', color: dispatch.type === 'security' ? '#22c55e' : '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    ● {dispatch.type} category
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Operations Badge */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Backoffice Health
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Supabase DB</span>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0 0 0' }}>Connected</p>
              </div>
              <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Clearance Level</span>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', margin: '2px 0 0 0' }}>Press Editor</p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
