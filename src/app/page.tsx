'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { supabase } from '../lib/supabase';
import communesData from '../data/communes.json';

const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!;
const DEFAULT_VIDEO = `${STORAGE_URL}/Cinematic_smooth_drone_sweep.mp4`;

// Approximate radius (km) used to draw each commune's 3D zone since we only
// have a center point per commune, not real boundary polygons. Swap this
// approach out for real boundary GeoJSON when you have it, for exact shapes.
const ZONE_RADIUS_KM = 1.1;
const ZONE_SOURCE_ID = 'commune-zones';
const ZONE_FILL_LAYER_ID = 'commune-zones-fill';
const ZONE_LINE_LAYER_ID = 'commune-zones-outline';

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
  commune?: string;
};

const COMMUNES: Commune[] = communesData.communes;
const KINSHASA_CENTER: [number, number] = [15.3057, -4.3245];

// Build the static zone geometry once. Per-feature state (selected / live /
// dispatch count) is applied afterwards via setFeatureState, so we never
// have to rebuild this GeoJSON on selection or data changes.
function buildZoneGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: COMMUNES.map((commune, index) => {
      const polygon = turf.circle([commune.lng, commune.lat], ZONE_RADIUS_KM, {
        steps: 48,
        units: 'kilometers',
      });
      return {
        ...polygon,
        id: index,
        properties: {
          slug: commune.slug,
          name: commune.name,
        },
      };
    }),
  };
}

export default function HomePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const hoveredIdRef = useRef<number | null>(null);
  const slugToIdRef = useRef<Record<string, number>>({});

  const [selected, setSelected] = useState<Commune>(
    COMMUNES.find((c) => c.slug === 'gombe') ?? COMMUNES[0]
  );
  const [is3D, setIs3D] = useState(true);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [dispatchCounts, setDispatchCounts] = useState<Record<string, number>>({});

  const videoSrc = `${STORAGE_URL}/${selected.slug}.mp4`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`;

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    COMMUNES.forEach((commune, index) => {
      slugToIdRef.current[commune.slug] = index;
    });

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: KINSHASA_CENTER,
      zoom: 10.6,
      pitch: 50,
      bearing: -15,
      antialias: true,
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      map.addSource(ZONE_SOURCE_ID, {
        type: 'geojson',
        data: buildZoneGeoJSON(),
      });

      map.addLayer({
        id: ZONE_FILL_LAYER_ID,
        type: 'fill-extrusion',
        source: ZONE_SOURCE_ID,
        paint: {
          'fill-extrusion-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#F59E0B',
            ['boolean', ['feature-state', 'live'], false],
            '#10B981',
            '#94A3B8',
          ],
          'fill-extrusion-height': [
            '+',
            40,
            ['*', ['coalesce', ['feature-state', 'dispatchCount'], 0], 45],
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.92,
            0.62,
          ],
        },
      });

      map.addLayer({
        id: ZONE_LINE_LAYER_ID,
        type: 'line',
        source: ZONE_SOURCE_ID,
        paint: {
          'line-color': '#2E7D6B',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      // Mark the initially-selected commune as selected once the layer exists.
      const initialId = slugToIdRef.current[selected.slug];
      if (initialId !== undefined) {
        map.setFeatureState({ source: ZONE_SOURCE_ID, id: initialId }, { selected: true });
      }

      map.on('mousemove', ZONE_FILL_LAYER_ID, (e) => {
        if (!e.features || e.features.length === 0) return;
        const id = e.features[0].id as number;
        if (hoveredIdRef.current !== null && hoveredIdRef.current !== id) {
          map.setFeatureState({ source: ZONE_SOURCE_ID, id: hoveredIdRef.current }, { hover: false });
        }
        hoveredIdRef.current = id;
        map.setFeatureState({ source: ZONE_SOURCE_ID, id }, { hover: true });
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', ZONE_FILL_LAYER_ID, () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: ZONE_SOURCE_ID, id: hoveredIdRef.current }, { hover: false });
          hoveredIdRef.current = null;
        }
        map.getCanvas().style.cursor = '';
      });

      map.on('click', ZONE_FILL_LAYER_ID, (e) => {
        if (!e.features || e.features.length === 0) return;
        const slug = e.features[0].properties?.slug as string | undefined;
        const commune = COMMUNES.find((c) => c.slug === slug);
        if (commune) selectCommune(commune);
      });
    });

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

  // Fetch dispatches for the selected commune (unchanged behavior)
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

  // Fetch city-wide dispatch counts to drive 3D zone heights + "live" color.
  // Refreshes periodically so the extruded skyline reflects current activity.
  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      const { data } = await supabase
        .from('dispatches')
        .select('commune')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (cancelled || !data) return;

      const counts: Record<string, number> = {};
      data.forEach((row: { commune?: string }) => {
        if (!row.commune) return;
        const match = COMMUNES.find(
          (c) => c.name.toLowerCase() === row.commune!.toLowerCase()
        );
        if (match) counts[match.slug] = (counts[match.slug] ?? 0) + 1;
      });
      setDispatchCounts(counts);
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 45000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Push dispatch counts into feature-state so extrusion heights / live color update.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyCounts = () => {
      COMMUNES.forEach((commune) => {
        const id = slugToIdRef.current[commune.slug];
        if (id === undefined) return;
        const count = dispatchCounts[commune.slug] ?? 0;
        map.setFeatureState(
          { source: ZONE_SOURCE_ID, id },
          { dispatchCount: count, live: count > 0 }
        );
      });
    };

    if (map.isStyleLoaded() && map.getSource(ZONE_SOURCE_ID)) {
      applyCounts();
    } else {
      map.once('load', applyCounts);
    }
  }, [dispatchCounts]);

  // Fly map to selected commune, update marker styling + feature-state selection
  useEffect(() => {
    const map = mapRef.current;
    map?.flyTo({ center: [selected.lng, selected.lat], zoom: 12.5, duration: 900 });

    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      const el = marker.getElement();
      el.className =
        'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-colors duration-150 ' +
        (slug === selected.slug ? 'bg-emerald-600' : 'bg-emerald-400 hover:bg-emerald-500');
    });

    if (map && map.getSource(ZONE_SOURCE_ID)) {
      COMMUNES.forEach((commune) => {
        const id = slugToIdRef.current[commune.slug];
        if (id === undefined) return;
        map.setFeatureState(
          { source: ZONE_SOURCE_ID, id },
          { selected: commune.slug === selected.slug }
        );
      });
    }
  }, [selected]);

  const selectCommune = (commune: Commune) => setSelected(commune);

  const toggle3D = () => {
    const next = !is3D;
    setIs3D(next);
    mapRef.current?.easeTo({ pitch: next ? 50 : 18, bearing: next ? -15 : 0, duration: 800 });
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
              Kinshasa — 24 communes, live activity in 3D
            </h2>
            <span className="text-sm font-medium text-[#2E7D6B]">{selected.name}</span>
          </div>

          <button
            onClick={toggle3D}
            className="absolute top-14 right-8 z-10 bg-white border border-[#E5E2D9] rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-[#F7F6F2]"
          >
            {is3D ? 'Top view' : '3D view'}
          </button>

          <div ref={mapContainer} className="w-full h-[520px] rounded-xl overflow-hidden bg-[#EAF5F1]" />

          <div className="flex items-center gap-4 mt-3 text-[10px] text-[#5C6B6D]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Live dispatches
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#94A3B8]" /> Quiet zone
            </span>
            <span className="ml-auto">Height = dispatch activity</span>
          </div>

          <p className="text-xs text-[#5C6B6D] mt-2">
            Map data © OpenStreetMap contributors, styled via OpenFreeMap. Zones are approximate
            radius markers, not exact commune boundaries.{' '}
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
