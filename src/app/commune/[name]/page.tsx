'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function CommunePage() {
  const { name } = useParams();
  const communeName = decodeURIComponent(name as string);

  const [alerts, setAlerts] = useState<any[]>([]);
  const [places, setPlaces] = useState<{ economy: any[]; social: any[]; cultural: any[] }>({
    economy: [], social: [], cultural: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const { data: securityData } = await supabase
          .from('security_alerts')
          .select('*')
          .eq('commune', communeName)
          .order('created_at', { ascending: false });
        
        if (securityData) setAlerts(securityData);

        const categories = ['economy', 'social', 'cultural'];
        const placesData: any = {};

        for (const cat of categories) {
          const res = await fetch(`/api/places?commune=${communeName}&type=${cat}`);
          placesData[cat] = await res.json();
        }
        setPlaces(placesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (communeName) fetchAllData();
  }, [communeName]);

  if (loading) return <div className="p-8 text-center text-blue-500 font-bold">Loading {communeName}...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8 rounded-xl bg-blue-600 p-6 text-white shadow-md border-b-4 border-yellow-400">
        <h1 className="text-4xl font-black uppercase tracking-wide">{communeName} Hub</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="bg-white p-5 rounded-xl shadow border-t-4 border-red-600">
          <h2 className="text-xl font-bold text-red-600 mb-4">🛡️ Security Reports</h2>
          {alerts.length === 0 ? <p className="text-gray-500 text-sm">Clear</p> : (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="p-3 rounded border bg-red-50 text-gray-900">
                  <h3 className="font-bold text-sm">{a.title}</h3>
                  <p className="text-xs mt-1">{a.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {['economy', 'social', 'cultural'].map((cat) => (
          <section key={cat} className="bg-white p-5 rounded-xl shadow border-t-4 border-slate-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">{cat === 'economy' ? '💼 Economy' : cat === 'social' ? '👥 Social' : '🎨 Culture'}</h2>
            <div className="space-y-2">
              {(places as any)[cat]?.slice(0, 5).map((p: any) => (
                <div key={p.place_id} className="p-2 border-b text-sm text-gray-900">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.formatted_address}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
