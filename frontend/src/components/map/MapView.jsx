import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Compass,
  Truck,
  AlertTriangle,
  Zap,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  MapPin,
  X,
  Info,
  Clock,
  Activity,
  ArrowRight
} from 'lucide-react';
import { MOCK_ROUTES } from '../../data/mockRoutes';
import { MOCK_VEHICLES } from '../../data/mockVehicles';
import { MOCK_INCIDENTS } from '../../data/mockIncidents';
import { useApp } from '../../context/AppContext';
import { NER_STATES } from '../../data/mockRegions';

const MAP_STYLES = {
  standard: {
    version: 8,
    sources: {
      'carto-voyager': {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors, © CARTO'
      }
    },
    layers: [{ id: 'carto-layer', type: 'raster', source: 'carto-voyager', minzoom: 0, maxzoom: 19 }]
  },
  terrain: {
    version: 8,
    sources: {
      'esri-topo': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles © Esri Topographic'
      }
    },
    layers: [{ id: 'topo-layer', type: 'raster', source: 'esri-topo', minzoom: 0, maxzoom: 19 }]
  },
  satellite: {
    version: 8,
    sources: {
      'esri-imagery': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: '© Esri World Imagery'
      }
    },
    layers: [{ id: 'imagery-layer', type: 'raster', source: 'esri-imagery', minzoom: 0, maxzoom: 19 }]
  }
};

const STATE_COORDINATES = {
  all: { center: [92.9376, 26.2006], zoom: 6.5 },
  AS: { center: [92.7927, 26.2006], zoom: 7.4 },
  ML: { center: [91.8933, 25.5788], zoom: 8.2 },
  SK: { center: [88.5138, 27.2389], zoom: 9.0 },
  AR: { center: [92.5000, 27.4865], zoom: 7.8 },
  TR: { center: [91.4868, 23.8315], zoom: 8.5 },
  MN: { center: [93.9368, 24.8170], zoom: 8.2 },
  NL: { center: [94.1086, 25.6751], zoom: 8.5 },
  MZ: { center: [92.7176, 23.7271], zoom: 8.2 }
};

// Real GPS Highway LineStrings
const CORRIDOR_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'NH-27-BLOCKED',
        name: 'NH-27 Guwahati – Silchar (Via Sonapur)',
        status: 'BLOCKED',
        color: '#DC2626',
        dashArray: [2, 2],
        details: '340m debris fall near Sonapur Tunnel South Portal (KM 142.5). 38 trucks stranded.',
        surface: 'Massive Debris & Highway Subsidence',
        slope: '42° Steep Gorge',
        travelTime: '21h (Normal: 9h 30m)',
        distance: '340 km',
        speed: '0 km/h (Halted)'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [91.7362, 26.1445], // Guwahati
          [92.1500, 25.9000],
          [92.2600, 25.4500], // Sonapur Tunnel Area
          [92.4500, 25.1000],
          [92.7927, 24.8333]  // Silchar
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'HAFLONG-BYPASS',
        name: 'Route B: Lumding – Haflong AI Smart Bypass',
        status: 'AI_RECOMMENDED',
        color: '#10B981',
        dashArray: [1],
        details: 'AI Recommended detour bypassing Sonapur debris zone via newly paved hill corridor.',
        surface: 'Smooth Paved Hill Carriageway with Escort',
        slope: '18° Rolling Ridge',
        travelTime: '7h 15m (-12h Delay Saved)',
        distance: '414 km (+74 km)',
        speed: '44 km/h (Optimal Flow)'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [91.7362, 26.1445], // Guwahati
          [92.6840, 26.3470], // Nagaon
          [93.1600, 25.8150], // Lumding
          [93.0200, 25.1800], // Haflong Ridge
          [92.7927, 24.8333]  // Silchar
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'NH-10-GANGTOK',
        name: 'NH-10 Siliguri – Gangtok Lifeline',
        status: 'WEATHER_WATCH',
        color: '#D97706',
        dashArray: [1],
        details: 'Teesta River at 8.2m near Melli Bridge causing partial waterlogging. Single-lane convoy active.',
        surface: 'River Basin Road with GREF Clearance',
        slope: '28° Valley Slope',
        travelTime: '6h 15m (Normal: 3h 45m)',
        distance: '114 km',
        speed: '24 km/h (Slowed)'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [88.4200, 26.7100], // Siliguri
          [88.4500, 26.9000],
          [88.4700, 27.1000], // Melli Teesta Bridge
          [88.5500, 27.2500],
          [88.6138, 27.3389]  // Gangtok
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'NH-13-TAWANG',
        name: 'NH-13 / NH-715B Tezpur – Tawang Frontier Line',
        status: 'WEATHER_WATCH',
        color: '#EA580C',
        dashArray: [1],
        details: 'High-altitude snowfall at Sela Pass (4,170m). Sela Twin-Tube tunnel bypass operational.',
        surface: 'Mountain Asphalt with Snow Ploughs',
        slope: '36° High Himalayan Ridge',
        travelTime: '9h 45m (Normal: 8h 30m)',
        distance: '330 km',
        speed: '32 km/h'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [92.7900, 26.6300], // Tezpur
          [92.5000, 27.1000],
          [92.4200, 27.3500], // Bomdila
          [92.1000, 27.5000], // Sela Pass
          [91.8600, 27.5865]  // Tawang
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'NH-29-IMPHAL',
        name: 'NH-29 Dimapur – Kohima – Imphal Lifeline',
        status: 'NOMINAL',
        color: '#0F766E',
        dashArray: [1],
        details: 'Four-lane Asian Highway corridor operational. Armed freight escort convoy on schedule.',
        surface: 'Four-Lane Paved Highway',
        slope: '14° Moderate Ridge',
        travelTime: '6h 30m (Nominal)',
        distance: '212 km',
        speed: '50 km/h (Nominal Flow)'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [93.7200, 25.9000], // Dimapur
          [94.1086, 25.6751], // Kohima
          [94.0200, 25.2500],
          [93.9368, 24.8170]  // Imphal
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'NH-8-TRIPURA',
        name: 'NH-8 Guwahati – Badarpur – Agartala',
        status: 'NOMINAL',
        color: '#16A34A',
        dashArray: [1],
        details: 'Churaibari interstate priority freight lane open. Fuel and ration supplies flowing smoothly.',
        surface: 'Paved Interstate Trunk',
        slope: '10° Low Valley',
        travelTime: '14h 00m (Nominal)',
        distance: '550 km',
        speed: '48 km/h'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [91.7362, 26.1445], // Guwahati
          [92.3000, 25.3000],
          [92.5500, 24.8000],
          [92.2000, 24.1000],
          [91.2868, 23.8315]  // Agartala
        ]
      }
    }
  ]
};

// Strategic Key Nodes
const STRATEGIC_NODES = [
  { name: 'Guwahati Logistics Hub', coords: [91.7362, 26.1445], type: 'HUB', desc: 'Central Supply & Oxygen Depot' },
  { name: 'Silchar SMCH Hospital', coords: [92.7927, 24.8333], type: 'HOSPITAL', desc: 'Medical Oxygen Refill Target (1.8 Days Buffer)' },
  { name: 'Sonapur Tunnel Portal', coords: [92.2600, 25.4500], type: 'BLOCKAGE', desc: '⛔ NH-27 KM 142.5: 340m Debris Fall' },
  { name: 'Haflong AI Bypass Node', coords: [93.0200, 25.1800], type: 'BYPASS_WAYPOINT', desc: '🟢 Escorted Priority Detour Corridor' },
  { name: 'Gangtok STNM Hospital', coords: [88.6138, 27.3389], type: 'HOSPITAL', desc: 'Vaccine Cold-Chain Destination' },
  { name: 'Melli Teesta Bridge', coords: [88.4700, 27.1000], type: 'HAZARD', desc: '🌊 Teesta River 8.2m Flood Watch' },
  { name: 'Tawang Frontier Relief', coords: [91.8600, 27.5865], type: 'HUB', desc: 'Aviation Fuel & High-Altitude Rations' },
  { name: 'Kohima Central Depot', coords: [94.1086, 25.6751], type: 'HUB', desc: 'Nagaland Civil Supplies Distribution' },
  { name: 'Imphal Lifeline Terminal', coords: [93.9368, 24.8170], type: 'HUB', desc: 'Manipur Food Grain Stockpile Hub' },
  { name: 'Agartala Main IOCL Depot', coords: [91.2868, 23.8315], type: 'HUB', desc: 'Tripura Petroleum Strategic Reserve' }
];

export const MapView = ({
  height = 'h-[540px]',
  selectedRouteId,
  onSelectRoute,
  onSelectVehicle,
  onSelectIncident
}) => {
  const { selectedState } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeTab, setActiveTab] = useState('standard');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showAIReroute, setShowAIReroute] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [inspectedRoad, setInspectedRoad] = useState(null);

  const currentStateName = NER_STATES.find((s) => s.id === selectedState)?.name || 'All NER States';

  // Helper to add Highway GeoJSON Layers to Map
  const addCorridorLayers = (map) => {
    if (map.getSource('ner-corridors')) {
      map.removeLayer('corridor-lines-glow');
      map.removeLayer('corridor-lines');
      map.removeLayer('corridor-labels');
      map.removeSource('ner-corridors');
    }

    map.addSource('ner-corridors', {
      type: 'geojson',
      data: CORRIDOR_GEOJSON
    });

    // Outer Glow / Shadow Line
    map.addLayer({
      id: 'corridor-lines-glow',
      type: 'line',
      source: 'ner-corridors',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 10,
        'line-opacity': 0.25
      }
    });

    // Core Corridor Highway Line
    map.addLayer({
      id: 'corridor-lines',
      type: 'line',
      source: 'ner-corridors',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 4.5,
        'line-opacity': 0.95
      }
    });

    // Click handler on Corridor Lines to inspect road details
    map.on('click', 'corridor-lines', (e) => {
      if (e.features && e.features.length > 0) {
        const props = e.features[0].properties;
        setInspectedRoad(props);
      }
    });

    map.on('mouseenter', 'corridor-lines', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'corridor-lines', () => {
      map.getCanvas().style.cursor = '';
    });
  };

  // Helper to render HTML Markers for Nodes & Vehicles
  const renderMapMarkers = (map) => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Add Strategic Nodes
    STRATEGIC_NODES.forEach((node) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-transform hover:scale-125 z-10';

      let bgColor = '#0F766E';
      let iconText = '📍';

      if (node.type === 'BLOCKAGE') {
        bgColor = '#DC2626';
        iconText = '⛔';
      } else if (node.type === 'HAZARD') {
        bgColor = '#D97706';
        iconText = '🌊';
      } else if (node.type === 'BYPASS_WAYPOINT') {
        bgColor = '#10B981';
        iconText = '🟢';
      } else if (node.type === 'HOSPITAL') {
        bgColor = '#2563EB';
        iconText = '🏥';
      }

      el.innerHTML = `
        <div class="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md border-2 border-[${bgColor}] text-[10px] font-sans font-extrabold text-[#0F172A] whitespace-nowrap">
          <span>${iconText}</span>
          <span>${node.name}</span>
        </div>
      `;

      el.addEventListener('click', () => {
        setInspectedRoad({
          name: node.name,
          status: node.type,
          details: node.desc,
          surface: 'Strategic Public Infrastructure',
          travelTime: 'Monitored 24x7 by BRO / State Emergency Ops'
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(node.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 2. Add Live Vehicles on Corridors
    const vehiclePins = [
      {
        reg: 'AS-01-GC-9921',
        cargo: '22,000L Cryogenic Medical Oxygen',
        coords: [92.9500, 25.3500], // On Haflong Bypass
        driver: 'Biren Gogoi',
        status: 'REROUTED_BYPASS',
        color: '#10B981'
      },
      {
        reg: 'ML-05-E-4412',
        cargo: 'FCI Fortified Rice (42 MT)',
        coords: [92.1500, 25.9000],
        driver: 'Sangma Marak',
        status: 'ON_DUTY',
        color: '#2563EB'
      },
      {
        reg: 'SK-01-B-3091',
        cargo: '1,850 Vaccine Cold-Chain Kits',
        coords: [88.4800, 27.1500],
        driver: 'Tashi Bhutia',
        status: 'SLOWED',
        color: '#D97706'
      },
      {
        reg: 'AR-01-D-7721',
        cargo: '35,000L Aviation Turbine Fuel',
        coords: [92.2500, 27.4200],
        driver: 'Nabam Tuki',
        status: 'ESCORTED',
        color: '#10B981'
      }
    ];

    vehiclePins.forEach((v) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer group z-20';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[${v.color}] opacity-40"></span>
          <div class="w-8 h-8 rounded-full bg-white border-2 border-[${v.color}] shadow-lg flex items-center justify-center text-[12px]">
            🚛
          </div>
          <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0F172A] text-white px-3 py-1.5 rounded-xl text-[10px] whitespace-nowrap shadow-xl font-sans z-30">
            <p class="font-extrabold text-[#38BDF8]">${v.reg}</p>
            <p class="text-slate-300">${v.cargo}</p>
            <p class="text-[#4ADE80] font-bold mt-0.5">Driver: ${v.driver} (${v.status})</p>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setInspectedRoad({
          name: `Convoy Telemetry: ${v.reg}`,
          status: v.status,
          details: `Transporting ${v.cargo} with live GPS beacon. Assigned to priority emergency bypass escort.`,
          driver: v.driver,
          speed: '42 km/h',
          travelTime: 'ETA to Target: 7h 15m'
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(v.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initial = STATE_COORDINATES[selectedState] || STATE_COORDINATES.all;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[activeTab],
      center: initial.center,
      zoom: initial.zoom,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    map.on('load', () => {
      addCorridorLayers(map);
      renderMapMarkers(map);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Tile Style & Re-add GeoJSON Layers when tab changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !MAP_STYLES[activeTab]) return;

    map.setStyle(MAP_STYLES[activeTab]);

    map.once('style.load', () => {
      addCorridorLayers(map);
      renderMapMarkers(map);
    });
  }, [activeTab]);

  // Auto update road inspection and map features when selectedState changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = STATE_COORDINATES[selectedState] || STATE_COORDINATES.all;
    map.flyTo({
      center: target.center,
      zoom: target.zoom,
      speed: 1.4,
      curve: 1.2
    });

    // Auto inspect the state's most critical corridor
    if (selectedState === 'AS' || selectedState === 'ML') {
      setInspectedRoad(CORRIDOR_GEOJSON.features[0].properties);
    } else if (selectedState === 'SK') {
      setInspectedRoad(CORRIDOR_GEOJSON.features[2].properties);
    } else if (selectedState === 'AR') {
      setInspectedRoad(CORRIDOR_GEOJSON.features[3].properties);
    } else if (selectedState === 'MN' || selectedState === 'NL') {
      setInspectedRoad(CORRIDOR_GEOJSON.features[4].properties);
    } else if (selectedState === 'TR') {
      setInspectedRoad(CORRIDOR_GEOJSON.features[5].properties);
    } else {
      setInspectedRoad(CORRIDOR_GEOJSON.features[1].properties);
    }
  }, [selectedState]);

  return (
    <div className={`relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs ${height} flex flex-col`}>
      {/* Top Map Toolbar Overlays */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs">
        <button
          onClick={() => {
            const next = !showRoutes;
            setShowRoutes(next);
            if (mapInstanceRef.current?.getLayer('corridor-lines')) {
              mapInstanceRef.current.setLayoutProperty('corridor-lines', 'visibility', next ? 'visible' : 'none');
              mapInstanceRef.current.setLayoutProperty('corridor-lines-glow', 'visibility', next ? 'visible' : 'none');
            }
          }}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showRoutes ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Corridors (6 Trunk)
        </button>

        <button
          onClick={() => {
            const next = !showAIReroute;
            setShowAIReroute(next);
            // Focus on Haflong Bypass
            if (next && mapInstanceRef.current) {
              mapInstanceRef.current.flyTo({ center: [92.9000, 25.5000], zoom: 8.0 });
              setInspectedRoad(CORRIDOR_GEOJSON.features[1].properties);
            }
          }}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showAIReroute ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
          AI Bypass Rerouting Active
        </button>

        <span className="text-[10px] text-[#64748B] font-mono px-1 hidden md:inline">
          💡 Click any road/marker to inspect details
        </span>
      </div>

      {/* Layer Selector Top Right (Standard / Terrain / Satellite) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs text-xs font-sans">
        <span className="text-[10px] uppercase font-bold text-[#64748B] px-1 hidden sm:inline">Map Layer:</span>
        {['standard', 'terrain', 'satellite'].map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveTab(mode)}
            className={`px-3 py-1 rounded-lg capitalize font-sans transition-all cursor-pointer font-bold ${
              activeTab === mode
                ? mode === 'satellite'
                  ? 'bg-[#0B132B] text-[#38BDF8] shadow-xs'
                  : mode === 'terrain'
                  ? 'bg-[#78350F] text-amber-100 shadow-xs'
                  : 'bg-[#0F766E] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Main MapLibre GL Tile Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 relative z-0 min-h-[360px]" />

      {/* ROAD DETAILS FLOATING INSPECTOR CARD (Appears when road or marker is clicked) */}
      {inspectedRoad && (
        <div className="absolute top-16 left-4 z-30 max-w-sm w-full bg-white/98 backdrop-blur-md border-2 border-[#0F766E] rounded-2xl shadow-2xl p-4 text-xs font-sans animate-in fade-in slide-in-from-left-4 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-[#E2E8F0] pb-2.5 mb-3">
            <div className="space-y-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase font-mono ${
                inspectedRoad.status === 'BLOCKED'
                  ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                  : inspectedRoad.status === 'AI_RECOMMENDED'
                  ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]'
                  : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
              }`}>
                {inspectedRoad.status?.replace(/_/g, ' ')}
              </span>
              <h4 className="text-sm font-extrabold text-[#0F172A] mt-1">{inspectedRoad.name}</h4>
            </div>
            <button
              onClick={() => setInspectedRoad(null)}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-[#0F172A]">
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              {inspectedRoad.details}
            </p>

            <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-[11px]">
              {inspectedRoad.surface && (
                <div>
                  <span className="text-[9px] text-[#64748B] uppercase font-bold block">Surface</span>
                  <span className="font-bold text-[#0F172A]">{inspectedRoad.surface}</span>
                </div>
              )}
              {inspectedRoad.travelTime && (
                <div>
                  <span className="text-[9px] text-[#64748B] uppercase font-bold block">Travel Time</span>
                  <span className="font-bold text-[#0F766E]">{inspectedRoad.travelTime}</span>
                </div>
              )}
              {inspectedRoad.slope && (
                <div className="pt-1.5 border-t border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] uppercase font-bold block">Slope Risk</span>
                  <span className="font-bold text-[#D97706]">{inspectedRoad.slope}</span>
                </div>
              )}
              {inspectedRoad.speed && (
                <div className="pt-1.5 border-t border-[#E2E8F0]">
                  <span className="text-[9px] text-[#64748B] uppercase font-bold block">Avg Speed</span>
                  <span className="font-bold text-[#2563EB]">{inspectedRoad.speed}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-extrabold text-[#0F172A] uppercase text-[11px] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            {currentStateName} Corridor Telemetry
          </span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-3 h-1 bg-[#DC2626] rounded"></span> NH-27 (Sonapur 340m Blockage)</span>
          <span className="flex items-center gap-1.5 font-bold text-[#059669]"><span className="w-3 h-1 bg-[#10B981] rounded"></span> Haflong AI Detour (+74km, -12h)</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-3 h-1 bg-[#D97706] rounded"></span> NH-10 (Teesta Flood Watch)</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-3 h-1 bg-[#0F766E] rounded"></span> NH-29 (Nominal)</span>
        </div>

        <div className="flex items-center gap-2 text-[#0F766E] font-mono text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Click any highway line or convoy marker</span>
        </div>
      </div>
    </div>
  );
};
