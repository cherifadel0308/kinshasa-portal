'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { supabase } from '../../../lib/supabase';

const COMMUNE_DETAILS: Record<string, {
  tagline: string;
  specification: string;
  history: string;
  economy: string;
  keyDistricts: string[];
  lat: number;
  lng: number;
  zoom: number;
}> = {
  Gombe: {
    tagline: 'Le centre névralgique des affaires, du pouvoir et de la haute gastronomie.',
    specification: 'Gombe (anciennement Kalina) est le Centre d\'Affaires Central (CBD) de Kinshasa. Elle abrite les ministères, ambassades, sièges de banques internationales, hôtels 5 étoiles et restaurants gastronomiques.',
    history: 'Fondée à l\'époque coloniale autour de la baie de Ngaliema et du fleuve Congo, la commune tire son nom de la rivière Gombe. Elle a longtemps été le quartier européen exclusif avant d\'évoluer en cœur administratif et financier du pays.',
    economy: 'Secteur tertiaire dominant : services financiers, diplomatie, sièges d\'entreprises multinationales, hôtellerie de luxe et restauration haut de gamme. C\'est la zone à plus forte valeur foncière de RDC.',
    keyDistricts: ['Blvd du 30 Juin', 'Golf', 'Gare Centrale', 'Socimat', 'Fleuve Congo Hotel'],
    lat: -4.305,
    lng: 15.302,
    zoom: 13.5
  },
  Limete: {
    tagline: 'Entre pôle industriel, galeries d\'art et résidences de prestige.',
    specification: 'Séparée par le Boulevard Lumumba en zones Industrielle et Résidentielle, Limete est réputée pour sa verdure, ses brasseries, ses galeries d\'art contemporain et la célèbre Tour de l\'Échangeur.',
    history: 'Aménagée dans les années 1950 pour concentrer l\'activité industrielle de la capitale, Limete est devenue le symbole de la modernité industrielle congolaise avec ses larges avenues arborées.',
    economy: 'Lourde présence industrielle (Brasseries Bralima/Haggar, transformation agro-alimentaire, usines textiles), ateliers d\'art, concessions automobiles et secteur résidentiel aisé.',
    keyDistricts: ['Limete Résidentiel', 'Zone Industrielle', 'Échangeur', 'Météo'],
    lat: -4.350,
    lng: 15.330,
    zoom: 13.0
  },
  Ngaliema: {
    tagline: 'Le sommet diplomatique et résidentiel surplombant le Fleuve Congo.',
    specification: 'Surplombant le fleuve Congo depuis ses collines verdoyantes, Ngaliema abrite le Palais de la Nation, la Cité de l\'Union Africaine ainsi que les résidences huppées de Binza.',
    history: 'C\'est ici qu\'Henry Morton Stanley établit son campement en 1881 face au chef Ngaliema. Le Mont Ngaliema conserve les vestiges du passé colonial et présidentiel (Parc de la N\'Sele, Musée National).',
    economy: 'Immobilier de très haut standing (Binza Macampagne, Pigeon, IPN), tourisme historique, institutions gouvernementales et complexes hôteliers panoramiques.',
    keyDistricts: ['Binza Macampagne', 'Binza Pigeon', 'Binza Ozone', 'Mont Ngaliema', 'Kintambo Magasin'],
    lat: -4.335,
    lng: 15.260,
    zoom: 12.8
  },
  Bandalungwa: {
    tagline: 'Le temple de la sapologie, de la musique et de la vie nocturne kinois.',
    specification: 'Surnommée "Bandal c\'est Paris", cette commune festive est le cœur battant de la jeunesse, des maquis traditionnels, du couper-décaler et des tendances culinaires urbaines.',
    history: 'Conçue dans les années 1950 comme une cité ouvrière modèle avec un plan en damier rigoureux, Bandal a progressivement été investie par les artistes et musiciens de la Rumba Congolaise.',
    economy: 'Économie créative et de divertissement : centaines de bars/maquis, terrasses lounge, salons de coiffure de luxe, boutiques de mode et restauration rapide locale.',
    keyDistricts: ['Bandal Synfact', 'Makelele', 'Bandal Moulaert', 'Tshibangu'],
    lat: -4.340,
    lng: 15.285,
    zoom: 14.0
  },
  Kalamu: {
    tagline: 'Berceau mythique de la Rumba Congolaise et carrefour culturel.',
    specification: 'Inscrite au patrimoine culturel avec le mythique quartier Matonge et la Place Victoire, Kalamu est la capitale de l\'expression musicale et populaire de Kinshasa.',
    history: 'Nommée en hommage à la rivière Kalamu, elle s\'est développée dès 1940. Matonge y est devenu mondialement connu comme le sanctuaire des orchestres de rumba et des stars de la musique.',
    economy: 'Commerce de proximité, bars musicaux historiques, studios d\'enregistrement, marchés de tissus et confection de mode urbaine.',
    keyDistricts: ['Matonge', 'Place Victoire', 'Yolo Nord', 'Yolo Sud', 'Stade Tata Raphaël'],
    lat: -4.345,
    lng: 15.310,
    zoom: 13.8
  },
  Kintambo: {
    tagline: 'Carrefour historique et carrefour commercial stratégique.',
    specification: 'Une des plus anciennes communes de la ville, située à la jonction entre Gombe, Ngaliema et le fleuve, réputée pour son pôle commercial de Kintambo Magasin.',
    history: 'Lieu de contact initial entre les populations autochtones Teke/Humbu et les expéditions européennes à la fin du XIXe siècle.',
    economy: 'Commerce de transit, grands marchés de vêtements, centres de transport en commun et petits métiers d\'artisanat.',
    keyDistricts: ['Kintambo Magasin', 'Velodrome', 'Jamaique'],
    lat: -4.318,
    lng: 15.280,
    zoom: 14.0
  },
  Lemba: {
    tagline: 'La cité universitaire intellectuelle et estudiantine.',
    specification: 'Commune académique abritant l\'Université de Kinshasa (UNIKIN) et le Commissariat Général à l\'Énergie Atomique (CGEA).',
    history: 'Planifiée dans les années 1960 pour accueillir l\'élite universitaire et le personnel enseignant de la première université du pays.',
    economy: 'Économie du savoir, logements étudiants, papeteries, bars estudiantins, centres de recherche et commerces de restauration populaire.',
    keyDistricts: ['UNIKIN', 'Lemba Super', 'Righini', 'Echangeur'],
    lat: -4.410,
    lng: 15.315,
    zoom: 13.2
  },
  "N'sele": {
    tagline: 'L\'oasis champêtre, éco-touristique et fluviale de Kinshasa.',
    specification: 'Immense commune peri-urbaine située à l\'Est, réputée pour le Parc de la N\'Sele, ses domaines aquatiques et ses résidences secondaires au bord de l\'eau.',
    history: 'Créée sous la 2ème République pour abriter la cité agro-industrielle présidentielle et le Domaine de la N\'Sele.',
    economy: 'Tourisme vert, hébergement de weekend, complexes hôteliers au bord du fleuve Congo, agriculture maraîchère et pisciculture.',
    keyDistricts: ['Kinkole', 'Domaine de la N\'Sele', 'Mikonga'],
    lat: -4.380,
    lng: 15.550,
    zoom: 11.5
  }
};

const DEFAULT_COMMUNE_BRIEF = {
  tagline: 'Une commune vivante et authentique du grand Kinshasa.',
  specification: 'Commune intégrante du tissu urbain de Kinshasa, caractérisée par une vie communautaire dynamique, des marchés locaux animés et une population accueillante.',
  history: 'Développée au cours de la grande expansion démographique de la capitale congolaise au XXe siècle.',
  economy: 'Commerce de détail, marchés publics de vivres frais, services de proximité et petites entreprises artisanales.',
  keyDistricts: ['Centre Commune', 'Grand Marché', 'Avenue Principale'],
  lat: -4.325,
  lng: 15.300,
  zoom: 12.5
};

export default function CommuneDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawName = (params?.name as string) || 'Gombe';
  const communeName = decodeURIComponent(rawName).trim();
  const communeInfo = COMMUNE_DETAILS[communeName] || DEFAULT_COMMUNE_BRIEF;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [places, setPlaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: placeData } = await supabase
        .from('places')
        .select('*')
        .ilike('commune', `%${communeName}%`)
        .order('created_at', { ascending: false });

      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .ilike('commune', `%${communeName}%`)
        .order('event_date', { ascending: true });

      setPlaces(placeData || []);
      setEvents(eventData || []);
      setLoading(false);
    };

    fetchData();
  }, [communeName]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (map.current) {
      map.current.flyTo({
        center: [communeInfo.lng, communeInfo.lat],
        zoom: communeInfo.zoom,
        essential: true
      });
    } else {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [communeInfo.lng, communeInfo.lat],
        zoom: communeInfo.zoom,
        pitch: 35
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    // Add markers for places
    places.forEach((p) => {
      const lat = p.lat ? parseFloat(p.lat) : communeInfo.lat;
      const lng = p.lng ? parseFloat(p.lng) : communeInfo.lng;

      const el = document.createElement('div');
      el.style.backgroundColor = '#2563eb';
      el.style.color = '#ffffff';
      el.style.padding = '4px 8px';
      el.style.borderRadius = '12px';
      el.style.fontSize = '10px';
      el.style.fontWeight = 'bold';
      el.style.border = '2px solid #38bdf8';
      el.style.boxShadow = '0 0 8px rgba(56, 189, 248, 0.6)';
      el.innerText = `📍 ${p.name}`;

      const popup = new maplibregl.Popup({ offset: 20 }).setHTML(`
        <div style="color: #0f172a; font-family: system-ui; padding: 4px;">
          <h4 style="margin:0 0 4px 0; font-weight:800;">${p.name}</h4>
          <p style="margin:0; font-size:11px; color:#475569;">${p.description || ''}</p>
        </div>
      `);

      new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

  }, [communeName, communeInfo, places]);

  const foodPlaces = places.filter(p => p.vertical === 'kin_food');
  const otherPlaces = places.filter(p => p.vertical === 'kin_places');
  const culturePlaces = places.filter(p => p.vertical === 'kin_culture');
  const stylePlaces = places.filter(p => p.vertical === 'kin_style');

  const allCommuneKeys = Object.keys(COMMUNE_DETAILS);

  const renderPlaceCard = (p: any) => (
    <div key={p.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
      {p.image_url && (
        <img 
          src={p.image_url} 
          alt={p.name} 
          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '1px solid #1e293b' }} 
        />
      )}
      <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '2px' }}>
        {p.name} {p.budget ? `(${p.budget})` : ''}
      </strong>
      {p.address && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>📍 {p.address}</span>}
      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: '1.4' }}>{p.description}</p>
      {p.google_maps_url && (
        <a href={p.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}>
          📍 Google Maps Itinéraire →
        </a>
      )}
    </div>
  );

  return (
    <main style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Global CSS for grid responsiveness */}
      <style jsx global>{`
        .commune-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .main-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; max-width: 1650px; margin: 0 auto; }
        @media (max-width: 1024px) {
          .main-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Top Header Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1650px', margin: '0 auto 20px auto', borderBottom: '1px solid #1e293b', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
            🏠 Accueil
          </Link>
          <span style={{ color: '#64748b', fontSize: '12px' }}>/ Communes /</span>
          <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
            Commune de {communeName}
          </h1>
        </div>

        {/* Commune Selector Dropdown */}
        <select 
          value={allCommuneKeys.includes(communeName) ? communeName : ''} 
          onChange={(e) => router.push(`/commune/${encodeURIComponent(e.target.value)}`)}
          style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <option value="" disabled>📍 Choisir une commune...</option>
          {allCommuneKeys.map(c => (
            <option key={c} value={c}>📍 Commune de {c}</option>
          ))}
        </select>
      </nav>

      {/* Main Grid: Content Column + Map Sidebar */}
      <div className="main-layout">
        
        {/* Left Column: Briefs & Vertical Listings */}
        <div>
          
          {/* Banner Tagline & Header */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #2563eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Fiche Officielle Kinshasa Label
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: '8px 0 4px 0', textTransform: 'uppercase' }}>
              Le Meilleur de {communeName}
            </h1>
            <p style={{ fontSize: '15px', color: '#38bdf8', fontWeight: 'bold', margin: 0, fontStyle: 'italic' }}>
              "{communeInfo.tagline}"
            </p>
          </div>

          {/* 3 Encyclopedic Brief Pillars: Spécificité, Histoire, Économie */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            
            {/* Spécificités */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>✨</span>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                  Spécificités & Identité
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                {communeInfo.specification}
              </p>
            </div>

            {/* Histoire */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>🏛️</span>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                  Aperçu Historique
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                {communeInfo.history}
              </p>
            </div>

            {/* Économie */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>💼</span>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                  Économie & Activités
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                {communeInfo.economy}
              </p>
            </div>

          </div>

          {/* Quartiers Phares Badges */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 0, marginBottom: '8px' }}>
              📍 Quartiers & Repères Clés :
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {communeInfo.keyDistricts.map(d => (
                <span key={d} style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                  • {d}
                </span>
              ))}
            </div>
          </div>

          {/* KIN WEEKEND HIGHLIGHT */}
          <section style={{ backgroundColor: '#0f172a', border: '1px solid #a855f7', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#a855f7', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              🎉 KIN WEEKEND — À faire ce weekend à {communeName} ({events.length})
            </h2>
            <div className="commune-grid">
              {events.length === 0 ? (
                <p style={{ fontSize: '11px', color: '#64748b' }}>Aucun événement ce weekend dans cette commune.</p>
              ) : (
                events.map(e => (
                  <div key={e.id} style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                    <span style={{ fontSize: '9px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase' }}>{e.category} ● {e.event_date}</span>
                    <h3 style={{ fontSize: '14px', color: '#fff', margin: '4px 0' }}>{e.title}</h3>
                    <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>{e.description}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 4 VERTICAL CARDS */}
          <div className="commune-grid">
            <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' }}>
              <h2 style={{ fontSize: '15px', color: '#22c55e', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                🍔 KIN FOOD ({foodPlaces.length})
              </h2>
              {foodPlaces.length === 0 ? <p style={{ fontSize: '11px', color: '#64748b' }}>Aucune adresse pour le moment.</p> : foodPlaces.map(renderPlaceCard)}
            </section>

            <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' }}>
              <h2 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                📍 KIN PLACES ({otherPlaces.length})
              </h2>
              {otherPlaces.length === 0 ? <p style={{ fontSize: '11px', color: '#64748b' }}>Aucun lieu répertorié.</p> : otherPlaces.map(renderPlaceCard)}
            </section>

            <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' }}>
              <h2 style={{ fontSize: '15px', color: '#f59e0b', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                🎨 KIN CULTURE ({culturePlaces.length})
              </h2>
              {culturePlaces.length === 0 ? <p style={{ fontSize: '11px', color: '#64748b' }}>Aucun espace culturel.</p> : culturePlaces.map(renderPlaceCard)}
            </section>

            <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' }}>
              <h2 style={{ fontSize: '15px', color: '#ec4899', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                👗 KIN STYLE ({stylePlaces.length})
              </h2>
              {stylePlaces.length === 0 ? <p style={{ fontSize: '11px', color: '#64748b' }}>Aucune adresse mode.</p> : stylePlaces.map(renderPlaceCard)}
            </section>
          </div>

        </div>

        {/* Sidebar Interactive Map */}
        <aside>
          <div style={{ position: 'sticky', top: '16px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '14px' }}>
            <h3 style={{ fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold', marginTop: 0, marginBottom: '10px' }}>
              🗺️ Carte Interactive de {communeName}
            </h3>
            <div ref={mapContainer} style={{ width: '100%', height: '440px', borderRadius: '10px', overflow: 'hidden' }} />
            <p style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', marginBottom: 0, textAlign: 'center' }}>
              {places.length} lieu(x) certifié(s) géolocalisé(s)
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
