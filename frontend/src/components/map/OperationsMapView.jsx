import React, { useState } from 'react';
import {
  Compass,
  Truck,
  AlertTriangle,
  Flame,
  CloudRain,
  Building2,
  CheckCircle2,
  MapPin,
  Maximize2
} from 'lucide-react';
import { MOCK_ROUTES } from '../../data/mockRoutes';
import { MOCK_VEHICLES } from '../../data/mockVehicles';
import { MOCK_INCIDENTS } from '../../data/mockIncidents';
import { MOCK_SUPPLIES } from '../../data/mockSupplies';

export const OperationsMapView = ({
  activeFilters,
  commandMode = false,
  selectedVehicle,
  selectedRoad,
  onSelectVehicle,
  onSelectRoad,
  onSelectIncident
}) => {
  const [mapStyle, setMapStyle] = useState('light');

  const EXTRA_DEPOTS = [
    { id: 'DEP-1', name: 'Guwahati Oxygen Depot', type: 'Oxygen Plant', x: 220, y: 180 },
    { id: 'DEP-2', name: 'Changsari FCI Grain Depot', type: 'FCI Hub', x: 250, y: 170 },
    { id: 'DEP-3', name: 'Siliguri Medical Storage', type: 'Cold Chain', x: 90, y: 140 },
    { id: 'DEP-4', name: 'Silchar Goods Yard', type: 'Transshipment Hub', x: 440, y: 310 }
  ];

  const DISTRICT_POLYGONS = [
    { name: 'Cachar (Silchar HQ)', score: 22, color: 'rgba(229, 72, 77, 0.15)', border: '#E5484D', x: 440, y: 310, r: 45 },
    { name: 'East Khasi Hills (Shillong)', score: 88, color: 'rgba(22, 163, 74, 0.12)', border: '#16A34A', x: 280, y: 220, r: 50 },
    { name: 'Gangtok District', score: 58, color: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', x: 180, y: 80, r: 35 },
    { name: 'Kolasib / Aizawl North', score: 18, color: 'rgba(229, 72, 77, 0.15)', border: '#E5484D', x: 450, y: 470, r: 40 },
    { name: 'Kohima District', score: 92, color: 'rgba(22, 163, 74, 0.12)', border: '#16A34A', x: 600, y: 290, r: 35 },
    { name: 'West Tripura (Agartala)', score: 65, color: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', x: 320, y: 440, r: 35 }
  ];

  return (
    <div className={`relative w-full h-full bg-[#F8FAFC] bg-grid-pattern overflow-hidden select-none flex flex-col justify-between ${
      commandMode ? 'border-2 border-[#E5484D]' : ''
    }`}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Top Map Bar / Status Indicator */}
      <div className="z-10 p-3 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-[#E4EAF2] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#155EEF] font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#155EEF] animate-pulse"></span>
            NER Live Geospatial Operations Engine
          </span>
          {commandMode && (
            <span className="px-2 py-0.5 bg-[#FFEBEB] text-[#E5484D] font-bold rounded border border-[#FCA5A5] text-[10px]">
              CRISIS COMMAND MODE ACTIVE
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[#667085] text-[11px]">
          <span>Zoom: 8.5x</span>
          <span>Center: 25.5788° N, 93.2473° E</span>
          <span>EPSG:4326</span>
        </div>
      </div>

      {/* Main Interactive Tactical Vector Canvas */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        <svg className="w-full h-full absolute inset-0 z-0 opacity-90" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="opBlocked" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5484D" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="opOperational" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#155EEF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0F9D8A" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* District Isolation Heat Risk Zones */}
          {activeFilters.riskAreas && (
            <g>
              {DISTRICT_POLYGONS.map((dist, idx) => (
                <g key={idx}>
                  <circle cx={dist.x} cy={dist.y} r={dist.r} fill={dist.color} stroke={dist.border} strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x={dist.x} y={dist.y - dist.r - 4} textAnchor="middle" fill="#667085" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {dist.name} ({dist.score}%)
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Highway Route Polyline Connections */}
          {activeFilters.roads && (
            <g>
              {/* NH-27 Guwahati - Silchar (Blocked Corridor) */}
              <path
                d="M 220,180 Q 320,220 440,310"
                fill="none"
                stroke="url(#opBlocked)"
                strokeWidth={selectedRoad?.id === 'NH-27' ? '6' : '4'}
                strokeDasharray="8 4"
                className="animate-pulse cursor-pointer"
                onClick={() => onSelectRoad && onSelectRoad(MOCK_ROUTES[0])}
              />
              {/* Haflong Bypass Alternate Route */}
              <path
                d="M 220,180 Q 350,280 440,310"
                fill="none"
                stroke="#0F9D8A"
                strokeWidth="3.5"
                strokeDasharray="4 2"
                className="cursor-pointer"
              />
              {/* NH-10 Siliguri - Gangtok */}
              <path d="M 90,140 Q 140,110 180,80" fill="none" stroke="#F59E0B" strokeWidth="3" />
              {/* NH-29 Dimapur - Kohima - Imphal */}
              <path d="M 520,240 L 600,290 L 640,380" fill="none" stroke="url(#opOperational)" strokeWidth="3.5" />
              {/* NH-08 Guwahati - Agartala */}
              <path d="M 220,180 L 290,260 L 320,440" fill="none" stroke="#F59E0B" strokeWidth="3" />
              {/* NH-54 Silchar - Aizawl */}
              <path d="M 440,310 L 450,470" fill="none" stroke="#E5484D" strokeWidth="4" strokeDasharray="6 3" />
            </g>
          )}

          {/* Strategic Regional Nodes */}
          <g className="text-[#172033] font-mono text-[11px] font-bold">
            <circle cx="220" cy="180" r="7" fill="#155EEF" />
            <text x="232" y="184" fill="#155EEF">Guwahati Hub</text>

            <circle cx="440" cy="310" r="6" fill="#E5484D" />
            <text x="452" y="314" fill="#E5484D">Silchar Portal (Blocked)</text>

            <circle cx="180" cy="80" r="5" fill="#F59E0B" />
            <text x="192" y="84" fill="#172033">Gangtok</text>

            <circle cx="600" cy="290" r="5" fill="#0F9D8A" />
            <text x="612" y="294" fill="#172033">Kohima</text>

            <circle cx="320" cy="440" r="5" fill="#F59E0B" />
            <text x="332" y="444" fill="#172033">Agartala</text>

            <circle cx="450" cy="470" r="6" fill="#E5484D" />
            <text x="462" y="474" fill="#E5484D">Aizawl</text>
          </g>
        </svg>

        {/* Interactive Vehicle Fleet Pins */}
        {activeFilters.vehicles && (
          <div className="absolute inset-0 pointer-events-auto">
            {MOCK_VEHICLES.map((veh, idx) => {
              const positions = [
                { x: '42%', y: '48%' },
                { x: '28%', y: '38%' },
                { x: '18%', y: '16%' },
                { x: '58%', y: '46%' },
                { x: '44%', y: '72%' }
              ];
              const pos = positions[idx % positions.length];
              const isSelected = selectedVehicle?.id === veh.id;

              return (
                <div
                  key={veh.id}
                  onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                  style={{ top: pos.y, left: pos.x }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                >
                  <div className="relative flex items-center justify-center">
                    {veh.status === 'delayed' || veh.status === 'halted' ? (
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#E5484D] opacity-40"></span>
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-xs transition-transform ${
                        isSelected ? 'scale-125 ring-4 ring-[#155EEF]/30' : ''
                      } ${
                        veh.status === 'delayed' || veh.status === 'halted'
                          ? 'bg-[#FFEBEB] border-[#E5484D] text-[#E5484D]'
                          : veh.status === 'rerouted'
                          ? 'bg-[#F4F0FF] border-[#7C5CFC] text-[#7C5CFC]'
                          : 'bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-[#E4EAF2] p-2.5 rounded-xl shadow-lg text-xs whitespace-nowrap z-30 font-mono">
                      <p className="font-bold text-[#172033]">{veh.regNumber} ({veh.driverName})</p>
                      <p className="text-[10px] text-[#667085]">{veh.cargoCategory} • {veh.locationName}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Map Legend */}
      <div className="z-10 p-3 bg-white/95 backdrop-blur-md border-t border-[#E4EAF2] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4 text-[#172033]">
          <span className="font-bold text-[#667085] uppercase text-[10px]">Route Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#155EEF]"></span> Recommended</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0F9D8A]"></span> Alternative</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Moderate Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E5484D]"></span> Blocked Corridor</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[#667085] text-[11px]">
          <span>Convoys: 142 Active</span>
          <span>Incidents: 14 Verified</span>
        </div>
      </div>
    </div>
  );
};
