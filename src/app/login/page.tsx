'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErrorMsg(error.message); } 
    else { router.push('/backoffice'); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
      <form onSubmit={handleLogin} className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-4 border-t-8 border-blue-500">
        <h2 className="text-xl font-black text-slate-900 text-center">Press Login Gate</h2>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border text-gray-900 rounded" placeholder="Email" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border text-gray-900 rounded" placeholder="Password" />
        {errorMsg && <p className="text-xs text-red-600 font-bold">{errorMsg}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded font-bold">Sign In</button>
      </form>
    </main>
  );
}
