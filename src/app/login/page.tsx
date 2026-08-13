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
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between p-4 md:p-6 font-sans select-none">
      
      {/* Top Header Bar matching Homepage */}
      <nav className="w-full max-w-[1650px] mx-auto flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_10px_#22c55e]" />
          <h1 className="text-sm md:text-base font-black tracking-wider uppercase text-white">
            Kinshasa Urban Intelligence Portal
          </h1>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
        >
          Return to Portal Map
        </Link>
      </nav>

      {/* Center Command Card matching Homepage Card Styling */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-between space-y-6">
          
          {/* Section Sub-header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#60a5fa] text-[11px] font-bold uppercase tracking-widest">
                Zone Access Control
              </span>
              <span className="bg-[#020617] text-[#22c55e] text-[11px] px-2.5 py-1 rounded-full border border-[#1e293b] font-medium">
                ● Live System
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase text-white tracking-wide mb-1">
              Press Gate
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Authorized journalist login for dispatching real-time sector alerts.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs text-center font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Form Container Panel */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-[#020617] border border-[#1e293b] rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-1.5">
                  Press Clearance Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="press@kinshasa-portal.cd"
                  className="w-full bg-[#0f172a] border border-[#1e293b] focus:border-[#2563eb] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-1.5">
                  Security Key
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0f172a] border border-[#1e293b] focus:border-[#2563eb] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Action Button styled like "Launch Full Hub" */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Authenticating Credentials...' : 'Launch Backoffice Hub →'}
            </button>
          </form>

          {/* Security Status Box matching Bottom Right Metrics */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#1e293b]">
            <div className="bg-[#020617] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[10px] text-[#64748b] uppercase block">Security Protocol</span>
              <p className="text-xs font-bold text-[#22c55e] mt-0.5">Encrypted / Active</p>
            </div>
            <div className="bg-[#020617] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[10px] text-[#64748b] uppercase block">Clearance Level</span>
              <p className="text-xs font-bold text-[#38bdf8] mt-0.5">Level 2 Journalist</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Line */}
      <footer className="w-full max-w-[1650px] mx-auto pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#64748b]">
        <span>KINSHASA URBAN OPERATIONS PLATFORM</span>
        <span className="text-[#38bdf8] font-mono">SUPABASE AUTH CONNECTED</span>
      </footer>

    </main>
  );
}
