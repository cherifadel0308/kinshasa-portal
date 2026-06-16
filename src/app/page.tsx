'use client';
import { useState } from 'react';
import Link from 'next/link';

// You will eventually add the coordinate paths for all 24 communes here
const KINSHASA_COMMUNES = ['Gombe', 'Limete', 'Ngaliema', 'Masina', 'Ndjili'];

export default function HomePage() {
  const [selectedCommune, setSelectedCommune] = useState('Gombe');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Map Layer */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <svg viewBox="0 0 800 600" className="w-full h-auto cursor-pointer">
            {/* Example: Gombe District Path */}
            <path 
              d="M 280 180 L 420 180 L 400 240 L 260 240 Z" 
              className={`stroke-slate-700 transition-all ${selectedCommune === 'Gombe' ? 'fill-blue-600' : 'fill-slate-800 hover:fill-blue-800'}`}
              onClick={() => setSelectedCommune('Gombe')}
            />
            {/* Add remaining 23 paths here */}
          </svg>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-5 space-y-6">
           <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <h2 className="text-2xl font-black">{selectedCommune} Metrics</h2>
              {/* Your existing video and metric components go here */}
           </div>
        </div>
      </div>
    </main>
  );
}
