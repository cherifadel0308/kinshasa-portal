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
      setErrorMsg('An unexpected error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Futuristic Background Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header Bar */}
      <nav className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
          <h1 className="text-sm md:text-base font-black tracking-widest uppercase text-slate-100">
            Kinshasa Urban Intelligence Portal
          </h1>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-xs font-bold bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800 hover:border-slate-700 rounded-lg transition-all"
        >
          ← Return to Portal Map
        </Link>
      </nav>

      {/* Central Login Command Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-slate-950/80 relative">
          
          {/* Header & Restricted Badge */}
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-950/80 text-red-400 border border-red-500/30 mb-3">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
              Journalist Access
            </h2>
            <p className="text-xs text-slate-400">
              Authenticate credentials to dispatch news alerts and publish commune field updates.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs text-center font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Press Badge / Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder="press@kinshasa-portal.cd"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Security Clearance Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-red-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Authenticating System...' : 'Enter Command Center →'}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500">
              🔒 Protected by Supabase Auth & Vercel Security Layer
            </p>
          </div>
        </div>
      </div>

      {/* Footer Status Line */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto pt-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 gap-2">
        <span>KINSHASA URBAN OPERATIONS PLATFORM v2.4</span>
        <span className="text-emerald-500 font-mono">SYSTEM ONLINE ● REAL-TIME FEED ACTIVE</span>
      </footer>
    </main>
  );
}
