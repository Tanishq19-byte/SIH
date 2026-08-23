import React, { useState, useEffect } from 'react';
import { Layers, ZoomIn, ZoomOut, Compass, MapPin, Truck, AlertTriangle, CheckCircle, Maximize2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_ROUTES } from '../../data/mockRoutes';
import { MOCK_VEHICLES } from '../../data/mockVehicles';
import { MOCK_INCIDENTS } from '../../data/mockIncidents';
import { useApp } from '../../context/AppContext';
import { NER_STATES } from '../../data/mockRegions';

export const MapView = ({
  height = 'h-[540px]',
  selectedRouteId,
  onSelectRoute,
  onSelectVehicle,
  onSelectIncident
}) => {
  const { selectedState, setSelectedState, isEmergencyMode } = useApp();
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showAIReroute, setShowAIReroute] = useState(true);
  const [activeTab, setActiveTab] = useState('standard');
  const [activeItemDetails, setActiveItemDetails] = useState(null);

  const currentStateName = NER_STATES.find(s => s.id === selectedState)?.name || 'All NER States';

  return (
    <div className={`relative bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs ${height} flex flex-col`}>
      {/* Map Control Bar Overlay Top Left */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] p-1.5 rounded-xl shadow-xs">
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showRoutes ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Corridors
        </button>

        <button
          onClick={() => setShowAIReroute(!showAIReroute)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showAIReroute ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
          AI Bypass Rerouting
        </button>

        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showVehicles ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Fleet
        </button>

        <button
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-2.5 py-1 text-xs rounded-lg font-sans flex items-center gap-1.5 transition-colors ${
            showIncidents ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Hazards
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

      {/* Interactive GIS Vector Canvas */}
      <div className="relative flex-1 bg-[#F8FAFC] bg-topo-pattern overflow-hidden p-6 flex flex-col justify-between">
        {/* Top Information Banner inside Canvas */}
        <div className="z-10 flex items-center justify-between text-xs font-sans text-[#64748B] mt-12 md:mt-0">
          <span className="flex items-center gap-1.5 font-bold text-[#0F766E]">
            <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse"></span>
            Geospatial Viewport: <span className="text-[#0F172A]">{currentStateName}</span>
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#64748B]">
            GPS Feed: 25.5788° N, 93.2473° E • AI Multi-Corridor Analysis Active
          </span>
        </div>

        {/* Vector SVG Mesh Canvas */}
        <div className="relative w-full h-full min-h-[340px] flex items-center justify-center">
          <svg className="w-full h-full absolute inset-0 z-0 opacity-95" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="routeBlockedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="1" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="routeSafeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="routeBypassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* HIGHWAY CORRIDOR PATHS */}
            {showRoutes && (
              <g>
                {/* 1. PRIMARY BLOCKED CORRIDOR: NH-27 Sonapur Portal (Assam/Meghalaya) */}
                {(selectedState === 'all' || selectedState === 'AS' || selectedState === 'ML') && (
                  <g>
                    {/* Primary Blocked Red Line */}
                    <path
                      d="M 220,180 Q 320,220 440,310"
                      fill="none"
                      stroke="url(#routeBlockedGrad)"
                      strokeWidth={selectedState !== 'all' ? '6' : '4.5'}
                      strokeDasharray="8 4"
                      className="animate-pulse cursor-pointer"
                      onClick={() => onSelectRoute && onSelectRoute(MOCK_ROUTES[0])}
                    />
                    {/* Blockage Cross Marker */}
                    <circle cx="340" cy="245" r="14" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2.5" />
                    <text x="340" y="249" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">✕</text>
                    <text x="340" y="272" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      Sonapur Mudslide (340m Blocked)
                    </text>
                  </g>
                )}

                {/* 2. AI RECOMMENDED BYPASS CORRIDOR: Lumding-Haflong Bypass (Green Glowing Path) */}
                {showAIReroute && (selectedState === 'all' || selectedState === 'AS' || selectedState === 'ML') && (
                  <g>
                    <path
                      d="M 220,180 Q 360,290 440,310"
                      fill="none"
                      stroke="url(#routeBypassGrad)"
                      strokeWidth={selectedState !== 'all' ? '5.5' : '4'}
                      strokeDasharray="6 3"
                      className="cursor-pointer"
                    />
                    {/* Bypass Waypoint Node (Haflong Ridge) */}
                    <circle cx="370" cy="275" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="382" y="280" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      Haflong AI Bypass (+74km, -12h Delay)
                    </text>
                  </g>
                )}

                {/* 3. NH-10 Siliguri - Gangtok (Sikkim Lifeline) */}
                {(selectedState === 'all' || selectedState === 'SK') && (
                  <g>
                    <path
                      d="M 90,140 Q 140,110 180,80"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth={selectedState === 'SK' ? '6' : '3.5'}
                      strokeDasharray={selectedState === 'SK' ? '6 3' : 'none'}
                    />
                    {showAIReroute && selectedState === 'SK' && (
                      <path
                        d="M 90,140 Q 120,60 180,80"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4.5"
                        strokeDasharray="4 2"
                      />
                    )}
                  </g>
                )}

                {/* 4. NH-13 / NH-715B Tezpur - Tawang (Arunachal Corridor) */}
                {(selectedState === 'all' || selectedState === 'AR') && (
                  <g>
                    <path
                      d="M 220,180 L 240,130 L 260,90"
                      fill="none"
                      stroke={selectedState === 'AR' ? '#D97706' : '#EA580C'}
                      strokeWidth={selectedState === 'AR' ? '5.5' : '3.5'}
                    />
                    {showAIReroute && selectedState === 'AR' && (
                      <g>
                        <circle cx="250" cy="110" r="4" fill="#10B981" />
                        <text x="260" y="114" fill="#047857" fontSize="10" fontWeight="bold">
                          Sela Twin-Tunnel Active
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* 5. NH-29 Dimapur - Kohima - Imphal (Nagaland / Manipur) */}
                {(selectedState === 'all' || selectedState === 'NL' || selectedState === 'MN') && (
                  <g>
                    <path
                      d="M 520,240 L 600,290 L 640,380"
                      fill="none"
                      stroke="url(#routeSafeGrad)"
                      strokeWidth={selectedState !== 'all' ? '5.5' : '3.5'}
                    />
                  </g>
                )}

                {/* 6. NH-08 Guwahati - Agartala (Tripura) */}
                {(selectedState === 'all' || selectedState === 'TR') && (
                  <g>
                    <path
                      d="M 220,180 L 290,260 L 320,440"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth={selectedState === 'TR' ? '5.5' : '3'}
                    />
                  </g>
                )}

                {/* 7. NH-54 Silchar - Aizawl (Mizoram) */}
                {(selectedState === 'all' || selectedState === 'MZ') && (
                  <g>
                    <path
                      d="M 440,310 L 450,470"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth={selectedState === 'MZ' ? '5.5' : '3.5'}
                    />
                  </g>
                )}
              </g>
            )}

            {/* STRATEGIC REGIONAL NODES */}
            <g className="text-[#0F172A] font-sans text-[11px] font-bold">
              {/* Guwahati Central Hub */}
              <circle cx="220" cy="180" r="8" fill="#0F766E" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="232" y="184" fill="#0F766E" fontWeight="extrabold">Guwahati Main Hub</text>

              {/* Silchar Destination Portal */}
              <circle cx="440" cy="310" r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="454" y="314" fill="#DC2626" fontWeight="extrabold">Silchar (SMCH Hospital Refill)</text>

              {/* Gangtok Node */}
              <circle cx="180" cy="80" r="6" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
              <text x="192" y="84" fill="#0F172A">Gangtok (NH-10)</text>

              {/* Tawang Node */}
              <circle cx="260" cy="90" r="6" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
              <text x="272" y="94" fill="#0F172A">Tawang (Frontier)</text>

              {/* Kohima Node */}
              <circle cx="600" cy="290" r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
              <text x="612" y="294" fill="#0F172A">Kohima (NH-29)</text>

              {/* Imphal Node */}
              <circle cx="640" cy="380" r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
              <text x="652" y="384" fill="#0F172A">Imphal (Lifeline)</text>

              {/* Agartala Node */}
              <circle cx="320" cy="440" r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
              <text x="332" y="444" fill="#0F172A">Agartala Depot</text>

              {/* Aizawl Node */}
              <circle cx="450" cy="470" r="6" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
              <text x="462" y="474" fill="#0F172A">Aizawl Depot</text>
            </g>
          </svg>

          {/* INTERACTIVE VEHICLE TELEMETRY PINS */}
          {showVehicles && (
            <div className="absolute inset-0 pointer-events-auto">
              {/* Oxygen Tanker at Haflong Bypass */}
              <div
                onClick={() => setActiveItemDetails(MOCK_VEHICLES[0])}
                className="absolute top-[48%] left-[41%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-[#10B981] opacity-40"></span>
                  <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] flex items-center justify-center text-[#059669] shadow-md">
                    <Truck className="w-4 h-4" />
                  </div>
                  {/* Tooltip Overlay */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-[#E2E8F0] p-3 rounded-2xl shadow-xl text-xs whitespace-nowrap z-40">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <p className="font-extrabold text-[#0F172A]">AS-01-GC-9921 (Oxygen Mission)</p>
                    </div>
                    <p className="text-[11px] text-[#059669] font-bold mt-0.5">Rerouted via Haflong Bypass • Speed 42 km/h</p>
                    <p className="text-[10px] text-[#64748B]">Destination: Silchar SMCH Hospital (ETA: 7h 15m)</p>
                  </div>
                </div>
              </div>

              {/* Vaccine Truck in Sikkim / North Assam */}
              <div
                onClick={() => setActiveItemDetails(MOCK_VEHICLES[1])}
                className="absolute top-[34%] left-[26%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
              >
                <div className="w-7 h-7 rounded-full bg-[#DCFCE7] border-2 border-[#16A34A] flex items-center justify-center text-[#16A34A] shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-lg text-xs whitespace-nowrap z-40">
                  <p className="font-bold text-[#0F172A]">ML-05-E-4412 (FCI Rice & Wheat)</p>
                  <p className="text-[10px] text-[#16A34A]">Shillong Central Warehouse • On Duty</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Legend Bar */}
        <div className="z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans shadow-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-[#64748B] uppercase text-[10px]">Geospatial Status:</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> Blocked Corridor (NH-27)</span>
            <span className="flex items-center gap-1.5 font-bold text-[#059669]"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span> AI Reroute (Lumding-Haflong)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Weather Risk</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Nominal Flow</span>
          </div>

          <div className="flex items-center gap-2 text-[#0F766E] font-mono text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Real-time Rerouting Engine Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

