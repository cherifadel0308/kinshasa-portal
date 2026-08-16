'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const KINSHASA_COMMUNES = [
  'Gombe', 'Limete', 'Ngaliema', "N'sele", "N'djili", 'Kintambo', 
  'Barumbu', 'Kinshasa', 'Lingwala', 'Kasa-Vubu', 'Bandalungwa', 
  'Kalamu', 'Ngiri-Ngiri', 'Bumbu', 'Selembao', 'Makala', 'Ngaba', 
  'Lemba', 'Matete', 'Masina', 'Kimbanseke', 'Mont-Ngafula', 'Maluku', 'Ouanza'
];

const CATEGORIES = [
  { id: 'security', label: '🛡️ Security' },
  { id: 'economy', label: '💼 Economy & Trade' },
  { id: 'social', label: '👥 Social Services' },
  { id: 'culture', label: '🎨 Culture & Events' },
  { id: 'live news', label: '📰 Live News' }
];

export default function BackofficePage() {
  const [commune, setCommune] = useState('Gombe');
  const [category, setCategory] = useState('security');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [author, setAuthor] = useState('Field Journalist');
  const [url, setUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in both the title and details fields.' });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const dispatchPayload = {
        title: title.trim(),
        details: details.trim(),
        commune: commune.trim(),
        category: category.trim(),
        author: author.trim() || 'Field Journalist',
        url: url.trim() || null,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('dispatches')
        .insert([dispatchPayload])
        .select();

      if (error) {
        throw error;
      }

      setStatusMsg({ 
        type: 'success', 
        text: `Dispatch successfully published to ${commune}! View it on the ${commune} Sector Hub.` 
      });

      // Clear form
      setTitle('');
      setDetails('');
      setUrl('');
    } catch (err: any) {
      setStatusMsg({ 
        type: 'error', 
        text: err.message || 'Failed to submit dispatch. Check your Supabase database connection.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main 
      style={{
        backgroundColor: '#020617',
        color: '#f8fafc',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Bar */}
      <nav 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid #1e293b',
          maxWidth: '1000px',
          margin: '0 auto 32px auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#ffffff' }}>
            Journalist Command Backoffice
          </h1>
        </div>

        <Link 
          href="/" 
          style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}
        >
          ← Return to Portal Map
        </Link>
      </nav>

      {/* Form Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Status Alert Banner */}
        {statusMsg && (
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: statusMsg.type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444',
              color: statusMsg.type === 'success' ? '#4ade80' : '#f87171'
            }}
          >
            {statusMsg.type === 'success' ? '✓ ' : '⚠️ '} {statusMsg.text}
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginTop: 0, marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
            Publish New Field Dispatch
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Target Commune */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Target Commune
              </label>
              <select 
                value={commune} 
                onChange={(e) => setCommune(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                {KINSHASA_COMMUNES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Sector Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Author / Source */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Journalist / Source Name
              </label>
              <input 
                type="text" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                placeholder="e.g. Field Reporter, Radio Okapi"
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* External URL (Optional) */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                External Link URL (Optional)
              </label>
              <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://..."
                style={{
                  width: '100%',
                  backgroundColor: '#020617',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Dispatch Title *
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Infrastructure Maintenance along Boulevard du 30 Juin"
              required
              style={{
                width: '100%',
                backgroundColor: '#020617',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Content Details */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Detailed Report Content *
            </label>
            <textarea 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              placeholder="Enter verified field observations, sector status, or media summary..."
              rows={5}
              required
              style={{
                width: '100%',
                backgroundColor: '#020617',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            style={{
              width: '100%',
              backgroundColor: submitting ? '#334155' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {submitting ? 'Publishing Dispatch to Supabase...' : 'Submit Dispatch to Sector Hub →'}
          </button>
        </form>
      </div>
    </main>
  );
}
