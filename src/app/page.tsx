'use client';
import { useState } from 'react';
import Link from 'next/link';

const KINSHASA_COMMUNES = [
  'Bandalungwa', 'Barumbu', 'Bumbu', 'Gombe', 'Kalamu', 'Kasa-Vubu', 
  'Kimbanseke', 'Kinshasa', 'Kintambo', 'Lemba', 'Limete', 'Lingwala', 
  'Makala', 'Maluku', 'Masina', 'Matete', 'Mont-Ngafula', 'Ndjili', 
  'Ngaba', 'Ngaliema', 'Ngiri-Ngiri', 'Nsele', 'Ouanza', 'Selembao'
];

export default function HomePage() {
  const [hoveredCommune, setHoveredCommune] = useState<string | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string>('Gombe');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-black tracking-wider text-sm uppercase">Kinshasa Flag Portal</span>
          </div>
          <Link href="/login" className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500">
            Journalist Access
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Map */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Vector Geographic Interface</h2>
            <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative">
               {/* Simplified SVG Map */}
              <svg viewBox="0 0 800 600" className="w-full h-full max-h-[450px]">
                <path d="M 280 180 L 420 180 L 400 240 L 260 240 Z" className={selectedCommune === 'Gombe' ? 'fill-blue-600' : 'fill-slate-800'} onClick={() => setSelectedCommune('Gombe')} />
                <path d="M 400 240 L 520 220 L 550 360 L 410 340 Z" className={selectedCommune === 'Limete' ? 'fill-blue-600' : 'fill-slate-800'} onClick={() => setSelectedCommune('Limete')} />
                {/* Add more paths as needed */}
              </svg>
            </div>
          </div>

          {/* RIGHT: Sidebar with Integrated Video */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-black">Zone Focal Point</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1 mb-4">{selectedCommune}</h3>

              {/* DYNAMIC VIDEO FEED */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 my-4 group">
                <video 
                  src="https://wsadnbdgqanmjhfhjyhx.supabase.co/storage/v1/object/public/commune-videos/Cinematic_smooth_drone_sweep.mp4"
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="text-[9px] font-mono uppercase text-yellow-400 font-bold">Drone Recon Zone</span>
                  <h4 className="text-sm font-black text-white">{selectedCommune}</h4>
                </div>
              </div>

              <Link 
                href={`/commune/${encodeURIComponent(selectedCommune)}`}
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition"
              >
                Launch Metrics Hub →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
