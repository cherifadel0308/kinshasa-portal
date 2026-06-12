'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function BackofficePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commune, setCommune] = useState('Gombe');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('low');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); } else { setUser(session.user); }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Publishing update...');
    const { error } = await supabase.from('security_alerts').insert([
      { commune, title, description, severity, journalist_id: user.id }
    ]);
    if (error) { setStatusMsg(`Error: ${error.message}`); } 
    else { setStatusMsg('Alert published live!'); setTitle(''); setDescription(''); }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Verifying session token...</div>;

  return (
    <main className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-xl w-full bg-white p-6 rounded-xl shadow-md space-y-4 border-t-8 border-drcRed">
        <h1 className="text-xl font-bold text-slate-900">Publish Security Broadcast</h1>
        <p className="text-xs text-gray-500">Logged in as: {user?.email}</p>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commune</label>
          <select value={commune} onChange={(e) => setCommune(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 text-gray-900">
            {['Bandalungwa', 'Barumbu', 'Bumbu', 'Gombe', 'Kalamu', 'Kasa-Vubu', 'Limete', 'Lingwala', 'Ngaliema', 'Ndjili'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headline</label>
          <input type="text" required placeholder="e.g. Flooding on main road" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 text-gray-900"/>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Details</label>
          <textarea rows={3} required placeholder="Provide clear descriptions..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 text-gray-900"/>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Severity</label>
          <div className="flex gap-4 text-sm text-gray-900">
            {['low', 'medium', 'high'].map((l) => (
              <label key={l} className="flex items-center gap-1 capitalize">
                <input type="radio" name="severity" value={l} checked={severity === l} onChange={() => setSeverity(l)} /> {l}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-drcRed text-white p-2.5 rounded-lg text-sm font-bold">Publish Update</button>
        {statusMsg && <p className="text-center text-xs mt-2 text-blue-600 font-bold">{statusMsg}</p>}
      </form>
    </main>
  );
}