import React, { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, Compass, MapPin, Truck, AlertTriangle, CheckCircle, Maximize2 } from 'lucide-react';
import { MOCK_ROUTES } from '../../data/mockRoutes';
import { MOCK_VEHICLES } from '../../data/mockVehicles';
import { MOCK_INCIDENTS } from '../../data/mockIncidents';

export const MapView = ({
  height = 'h-[540px]',
  selectedRouteId,
  onSelectRoute,
  onSelectVehicle,
  onSelectIncident
}) => {
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [activeTab, setActiveTab] = useState('standard');
  const [activeItemDetails, setActiveItemDetails] = useState(null);

  return (
    <div className={`relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs ${height} flex flex-col`}>
      {/* Map Control Bar Overlay Top Left */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs">
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showRoutes ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Corridors ({MOCK_ROUTES.length})
        </button>

        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showVehicles ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Vehicles ({MOCK_VEHICLES.length})
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showIncidents ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Incidents ({MOCK_INCIDENTS.length})
        </button>
      </div>

      {/* Layer Selector Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] p-1 rounded-xl shadow-xs text-xs">
        {['standard', 'terrain', 'satellite'].map(mode => (
          <button
            key={mode}
            onClick={() => setActiveTab(mode)}
            className={`px-2.5 py-1 rounded-lg capitalize font-sans transition-colors ${
              activeTab === mode ? 'bg-[#0F766E] text-white font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Interactive GIS Vector Canvas (Light Theme) */}
      <div className="relative flex-1 bg-[#F8FAFC] bg-topo-pattern overflow-hidden p-6 flex flex-col justify-between">
        {/* Top Information Banner inside Canvas */}
        <div className="z-10 flex items-center justify-between text-xs font-sans text-[#64748B]">
          <span className="flex items-center gap-1.5 font-semibold text-[#0F766E]">
            <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse"></span>
            North East Regional Logistics Map Feed (EPSG:4326)
          </span>
          <span>Coverage: Assam, Meghalaya, Sikkim, Nagaland, Manipur, Mizoram, Tripura, Arunachal</span>
        </div>

        {/* Vector SVG Mesh */}
        <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
          <svg className="w-full h-full absolute inset-0 z-0 opacity-95" viewBox="0 0 1000 600">
            <defs>
              <linearGradient id="routeBlocked" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="routeSafe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Highway Corridors */}
            {showRoutes && (
              <>
                {/* NH-27 Guwahati - Silchar (Red = Critical / Closed) */}
                <path
                  d="M 220,180 Q 320,220 440,310"
                  fill="none"
                  stroke="url(#routeBlocked)"
                  strokeWidth="4.5"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
                {/* NH-10 Siliguri - Gangtok (Yellow = Moderate) */}
                <path d="M 90,140 Q 140,110 180,80" fill="none" stroke="#D97706" strokeWidth="3" />
                {/* NH-29 Dimapur - Kohima - Imphal (Green = Safe) */}
                <path d="M 520,240 L 600,290 L 640,380" fill="none" stroke="url(#routeSafe)" strokeWidth="3.5" />
                {/* NH-08 Guwahati - Agartala (Orange = High Risk) */}
                <path d="M 220,180 L 290,260 L 320,440" fill="none" stroke="#EA580C" strokeWidth="3" />
                {/* NH-54 Silchar - Aizawl (Red = Critical) */}
                <path d="M 440,310 L 450,470" fill="none" stroke="#DC2626" strokeWidth="4" strokeDasharray="6 3" />
              </>
            )}

            {/* Regional Nodes */}
            <g className="text-[#0F172A] font-sans text-[11px] font-bold">
              {/* Guwahati Node */}
              <circle cx="220" cy="180" r="7" fill="#0F766E" />
              <text x="232" y="184" fill="#0F766E">Guwahati Hub</text>

              {/* Silchar Node */}
              <circle cx="440" cy="310" r="6" fill="#DC2626" />
              <text x="452" y="314" fill="#DC2626">Silchar (NH-27 Blocked)</text>

              {/* Gangtok Node */}
              <circle cx="180" cy="80" r="5" fill="#D97706" />
              <text x="192" y="84" fill="#0F172A">Gangtok</text>

              {/* Tawang Node */}
              <circle cx="260" cy="90" r="6" fill="#EA580C" />
              <text x="272" y="94" fill="#EA580C">Tawang</text>

              {/* Kohima Node */}
              <circle cx="600" cy="290" r="5" fill="#16A34A" />
              <text x="612" y="294" fill="#0F172A">Kohima</text>

              {/* Agartala Node */}
              <circle cx="320" cy="440" r="5" fill="#EA580C" />
              <text x="332" y="444" fill="#0F172A">Agartala</text>

              {/* Aizawl Node */}
              <circle cx="450" cy="470" r="6" fill="#DC2626" />
              <text x="462" y="474" fill="#DC2626">Aizawl</text>
            </g>
          </svg>

          {/* Interactive Vehicles */}
          {showVehicles && (
            <div className="absolute inset-0 pointer-events-auto">
              <div
                onClick={() => setActiveItemDetails(MOCK_VEHICLES[0])}
                className="absolute top-[48%] left-[42%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#DC2626] opacity-40"></span>
                  <div className="w-8 h-8 rounded-full bg-[#FEF2F2] border-2 border-[#DC2626] flex items-center justify-center text-[#DC2626] shadow-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-md text-xs whitespace-nowrap z-30">
                    <p className="font-bold text-[#DC2626]">AS-01-GC-9921 (Medicine Supply)</p>
                    <p className="text-[11px] text-[#64748B]">Delayed +11.5h at Sonapur Bypass</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveItemDetails(MOCK_VEHICLES[1])}
                className="absolute top-[38%] left-[28%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#DCFCE7] border-2 border-[#16A34A] flex items-center justify-center text-[#16A34A] shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
