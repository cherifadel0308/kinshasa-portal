'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/backoffice');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      style={{
        backgroundColor: '#020617',
        color: '#f8fafc',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Navigation Bar */}
      <nav 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid #1e293b',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto'
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
          href="/" 
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
          Return to Portal Map
        </Link>
      </nav>

      {/* Center Command Access Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
        <div 
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
            boxSizing: 'border-box'
          }}
        >
          {/* Card Sub-header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Zone Access Control
              </span>
              <span style={{ backgroundColor: '#020617', color: '#22c55e', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', border: '1px solid #1e293b', fontWeight: 'bold' }}>
                ● Live System
              </span>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', margin: '4px 0 6px 0', color: '#ffffff', letterSpacing: '0.5px' }}>
              Press Gate
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              Authorized journalist login for dispatching real-time sector alerts.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid #dc2626', color: '#fca5a5', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Email Input */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Press Clearance Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="press@kinshasa-portal.cd"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Password Input */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Security Key
                </label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>

            {/* Launch Backoffice Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: loading ? '#1d4ed8' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontWeight: 'bold',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                marginTop: '4px'
              }}
            >
              {loading ? 'Authenticating Credentials...' : 'Launch Backoffice Hub →'}
            </button>
          </form>

          {/* Status Metrics Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Security Protocol</span>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e', margin: '2px 0 0 0' }}>Encrypted / Active</p>
            </div>
            <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Clearance Level</span>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', margin: '2px 0 0 0' }}>Level 2 Journalist</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Line */}
      <footer 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '12px', 
          borderTop: '1px solid #1e293b', 
          fontSize: '11px', 
          color: '#64748b',
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        <span>KINSHASA URBAN OPERATIONS PLATFORM</span>
        <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>SUPABASE AUTH CONNECTED</span>
      </footer>

    </main>
  );
}
