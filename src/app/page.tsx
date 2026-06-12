import Link from 'next/link';

const KINSHASA_COMMUNES = [
  'Bandalungwa', 'Barumbu', 'Bumbu', 'Gombe', 'Kalamu', 'Kasa-Vubu', 
  'Kimbanseke', 'Kinshasa', 'Kintambo', 'Lemba', 'Limete', 'Lingwala', 
  'Makala', 'Maluku', 'Masina', 'Matete', 'Mont-Ngafula', 'Ndjili', 
  'Ngaba', 'Ngaliema', 'Ngiri-Ngiri', 'Nsele', 'Ouanza', 'Selembao'
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-slate-900 text-white p-8 font-sans">
      <header className="max-w-6xl mx-auto text-center my-12">
        <span className="bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          Kinshasa Portal
        </span>
        <h1 className="text-5xl font-black mt-4 uppercase tracking-tight">
          Kinshasa <span className="text-yellow-400">Flag</span> Interactive Map
        </h1>
        <div className="mt-6">
          <Link href="/login" className="bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition">
            Journalist Backoffice Access
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto bg-slate-900 bg-opacity-60 p-8 rounded-2xl border border-blue-500 border-opacity-30 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {KINSHASA_COMMUNES.map((commune) => (
            <Link 
              key={commune} 
              href={`/commune/${encodeURIComponent(commune)}`}
              className="p-4 rounded-xl border border-slate-700 bg-slate-800 bg-opacity-50 text-center font-semibold hover:border-yellow-400 hover:scale-[1.02] transition-all"
            >
              <p className="hover:text-yellow-400">{commune}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
