'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { supabase } from '../lib/supabase';
import communesData from '../data/communes.json';

const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!;
const DEFAULT_VIDEO = `${STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

type Commune = {
  slug: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
};

type Dispatch = {
  id: number | string;
  title: string;
  details: string;
  category?: string;
  created_at?: string;
};

const COMMUNES: Commune[] = communesData.communes;
const KINSHASA_CENTER: [number, number] = [15.3057, -4.3245];

export default function HomePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});

  const [selected, setSelected] = useState<Commune>(
    COMMUNES.find((c) => c.slug === 'gombe') ?? COMMUNES[0]
  );
  const [is3D, setIs3D] = useState(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [hasLiveData, setHasLiveData] = useState(false);

  const videoSrc = `${STORAGE_URL}/${selected.slug}.mp4`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`;

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: KINSHASA_CENTER,
      zoom: 10.6,
      pitch: 0,
      bearing: 0,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    COMMUNES.forEach((commune) => {
      const el = document.createElement('button');
      el.setAttribute('aria-label', `Select ${commune.name}`);
      el.className =
        'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-colors duration-150 ' +
        (commune.slug === selected.slug ? 'bg-emerald-600' : 'bg-emerald-400 hover:bg-emerald-500');

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([commune.lng, commune.lat])
        .addTo(map);

      el.addEventListener('click', () => selectCommune(commune));
      markersRef.current[commune.slug] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch dispatches for the selected commune
  useEffect(() => {
    let cancelled = false;

    const fetchDispatches = async () => {
      const { data } = await supabase
        .from('dispatches')
        .select('*')
        .ilike('commune', selected.name)
        .order('created_at', { ascending: false })
        .limit(3);

      if (cancelled) return;

      if (data && data.length > 0) {
        setDispatches(data);
        setHasLiveData(true);
      } else {
        setDispatches([]);
        setHasLiveData(false);
      }
    };

    fetchDispatches();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  // Fly map to selected commune + update marker styling
  useEffect(() => {
    mapRef.current?.flyTo({ center: [selected.lng, selected.lat], zoom: 12.5, duration: 900 });
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      const el = marker.getElement();
      el.className =
        'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-colors duration-150 ' +
        (slug === selected.slug ? 'bg-emerald-600' : 'bg-emerald-400 hover:bg-emerald-500');
    });
  }, [selected]);

  const selectCommune = (commune: Commune) => setSelected(commune);

  const toggle3D = () => {
    const next = !is3D;
    setIs3D(next);
    mapRef.current?.easeTo({ pitch: next ? 55 : 0, bearing: next ? -17 : 0, duration: 800 });
  };

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#1F2A2E] font-sans">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600" />
          Kinshasa Portal
        </div>
        <Link
          href="/login"
          className="bg-[#2E7D6B] hover:bg-[#3F9A82] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          Journalist Access
        </Link>
      </nav>

      {/* Main grid: map hero + commune detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_4fr] gap-5 px-6 pb-8 max-w-[1400px] mx-auto">
        {/* MAP */}
        <section className="bg-white border border-[#E5E2D9] rounded-2xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-wide text-[#5C6B6D] font-medium">
              Kinshasa — 24 communes
            </h2>
            <span className="text-sm font-medium text-[#2E7D6B]">{selected.name}</span>
          </div>

          <button
            onClick={toggle3D}
            className="absolute top-14 right-8 z-10 bg-white border border-[#E5E2D9] rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-[#F7F6F2]"
          >
            {is3D ? 'Flatten to 2D' : 'Tilt to 3D'}
          </button>

          <div ref={mapContainer} className="w-full h-[520px] rounded-xl overflow-hidden bg-[#EAF5F1]" />

          <p className="text-xs text-[#5C6B6D] mt-2">
            Map data © OpenStreetMap contributors, styled via OpenFreeMap.{' '}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E7D6B] underline"
            >
              Open {selected.name} in Google Maps ↗
            </a>
          </p>
        </section>

        {/* COMMUNE DETAIL */}
        <section className="bg-white border border-[#E5E2D9] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wide text-[#2E7D6B] font-medium">
                Zone focal point
              </span>
              <span
                className={
                  'text-xs px-2.5 py-1 rounded-full border ' +
                  (hasLiveData
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#F7F6F2] text-[#5C6B6D] border-[#E5E2D9]')
                }
              >
                {hasLiveData ? '● Live data' : 'No live updates yet'}
              </span>
            </div>
            <h1 className="text-2xl font-semibold mb-1">{selected.name}</h1>
            <p className="text-xs text-[#5C6B6D] mb-4">{selected.district} district</p>

            {/* Video */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#E5E2D9] bg-[#F7F6F2] mb-4">
              <video
                key={selected.slug}
                src={videoSrc}
                onError={(e) => {
                  (e.target as HTMLVideoElement).src = DEFAULT_VIDEO;
                }}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                Sector stream: <strong>{selected.name}</strong>
              </div>
            </div>

            {/* Dispatches */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-[#5C6B6D] font-medium mb-2 pb-1.5 border-b border-[#E5E2D9]">
                Live {selected.name} dispatches
              </h3>
              {hasLiveData ? (
                <div className="flex flex-col gap-2">
                  {dispatches.map((d, i) => (
                    <div key={d.id ?? i} className="bg-[#F7F6F2] border border-[#E5E2D9] rounded-lg p-2.5">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                          ● {d.category || 'Update'}
                        </span>
                        <span className="text-[10px] text-[#8C8B85]">
                          {d.created_at
                            ? new Date(d.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold mb-0.5">{d.title}</h4>
                      <p className="text-xs text-[#5C6B6D] leading-snug">{d.details}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5C6B6D]">
                  No dispatches filed for {selected.name} yet — check back soon or launch the full
                  hub below.
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/commune/${selected.slug}`}
            className="block text-center bg-[#2E7D6B] hover:bg-[#3F9A82] text-white font-medium text-sm py-2.5 rounded-full mt-4 transition-colors"
          >
            Launch full {selected.name} hub →
          </Link>
        </section>
      </div>
    </main>
  );
}
