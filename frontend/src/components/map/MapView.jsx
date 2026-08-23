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
  MapPin
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
  all: { center: [92.9376, 26.2006], zoom: 6.2 },
  AS: { center: [92.7927, 26.2006], zoom: 7.2 },
  ML: { center: [91.8933, 25.5788], zoom: 8.0 },
  SK: { center: [88.6138, 27.3389], zoom: 8.8 },
  AR: { center: [92.5000, 27.5865], zoom: 7.8 },
  TR: { center: [91.2868, 23.8315], zoom: 8.5 },
  MN: { center: [93.9368, 24.8170], zoom: 8.2 },
  NL: { center: [94.1086, 25.6751], zoom: 8.5 },
  MZ: { center: [92.7176, 23.7271], zoom: 8.2 }
};

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

  const [activeTab, setActiveTab] = useState('standard');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showAIReroute, setShowAIReroute] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  const currentStateName = NER_STATES.find((s) => s.id === selectedState)?.name || 'All NER States';

  // Initialize MapLibre GL
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

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Tile Style when clicking standard / terrain / satellite
  useEffect(() => {
    if (mapInstanceRef.current && MAP_STYLES[activeTab]) {
      mapInstanceRef.current.setStyle(MAP_STYLES[activeTab]);
    }
  }, [activeTab]);

  // Fly to state when selectedState changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = STATE_COORDINATES[selectedState] || STATE_COORDINATES.all;
    mapInstanceRef.current.flyTo({
      center: target.center,
      zoom: target.zoom,
      speed: 1.4,
      curve: 1.2
    });
  }, [selectedState]);

  return (
    <div className={`relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs ${height} flex flex-col`}>
      {/* Top Map Toolbar Overlays */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs">
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showRoutes ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Corridors
        </button>

        <button
          onClick={() => setShowAIReroute(!showAIReroute)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showAIReroute ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
          AI Bypass Rerouting
        </button>

        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showVehicles ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Fleet
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
            showIncidents ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Hazards
        </button>
      </div>

      {/* Layer Selector Top Right (Standard / Terrain / Satellite) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs text-xs font-sans">
        <span className="text-[10px] uppercase font-bold text-[#64748B] px-1 hidden sm:inline">Layer:</span>
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

      {/* Main MapLibre GL Tile Canvas Container */}
      <div ref={mapContainerRef} className="w-full flex-1 relative z-0 min-h-[360px]" />

      {/* Floating Tactical Overlay Information HUD on Top of Map */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-extrabold text-[#0F172A] uppercase text-[11px] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            {currentStateName} Tactical GIS
          </span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> NH-27 Sonapur Blocked</span>
          <span className="flex items-center gap-1.5 font-bold text-[#059669]"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Haflong AI Detour Active</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Teesta Flood Advisory</span>
        </div>

        <div className="flex items-center gap-2 text-[#0F766E] font-mono text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-time Map Telemetry Active</span>
        </div>
      </div>
    </div>
  );
};
