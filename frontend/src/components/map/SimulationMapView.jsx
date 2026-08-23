import React from 'react';
import { Compass, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export const SimulationMapView = ({ simParams, simResults }) => {
  const isHighRisk = simParams.rainfallMm > 140 || simParams.floodSeverity === 'High' || simParams.floodSeverity === 'Extreme';

  return (
    <div className="relative w-full h-80 bg-[#0B0F17] bg-grid-pattern rounded-2xl border border-[#2A3B56] overflow-hidden select-none flex flex-col justify-between p-4 shadow-xl">
      {/* Radial Background */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Map Header Overlay */}
      <div className="z-10 flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          SIMULATION PROTOCOL MAP (WHAT-IF SCENARIO)
        </span>
        <span className="text-slate-400 text-[11px]">
          Simulated Blockages: {simParams.numBlockages} | Flood: {simParams.floodSeverity}
        </span>
      </div>

      {/* Vector Map Canvas */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        <svg className="w-full h-full absolute inset-0 z-0" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
          {/* Simulated Risk Clouds */}
          {isHighRisk && (
            <g opacity="0.4" className="animate-pulse">
              <ellipse cx="400" cy="230" rx="120" ry="80" fill="#EF4444" />
              <ellipse cx="140" cy="110" rx="90" ry="60" fill="#F59E0B" />
              <ellipse cx="450" cy="380" rx="100" ry="70" fill="#EF4444" />
            </g>
          )}

          {/* Highways Mesh */}
          <g>
            {/* NH-27 Guwahati - Silchar */}
            <path
              d="M 220,150 Q 320,190 440,260"
              fill="none"
              stroke={simParams.numBlockages > 0 || isHighRisk ? '#EF4444' : '#00F0FF'}
              strokeWidth="5"
              strokeDasharray={isHighRisk ? '8 4' : 'none'}
              className={isHighRisk ? 'animate-pulse' : ''}
            />

            {/* NH-10 Siliguri - Gangtok */}
            <path
              d="M 90,120 Q 140,90 180,60"
              fill="none"
              stroke={simParams.floodSeverity === 'Extreme' || simParams.floodSeverity === 'High' ? '#EF4444' : '#F59E0B'}
              strokeWidth="4"
            />

            {/* NH-29 Dimapur - Kohima */}
            <path
              d="M 520,200 L 600,240 L 640,320"
              fill="none"
              stroke={simParams.rainfallMm > 200 ? '#F59E0B' : '#10B981'}
              strokeWidth="4"
            />

            {/* NH-08 Guwahati - Agartala */}
            <path
              d="M 220,150 L 290,220 L 320,380"
              fill="none"
              stroke={simParams.rainfallMm > 160 ? '#F59E0B' : '#00F0FF'}
              strokeWidth="4"
            />

            {/* NH-54 Silchar - Aizawl */}
            <path
              d="M 440,260 L 450,400"
              fill="none"
              stroke={simParams.numBlockages > 1 ? '#EF4444' : '#F59E0B'}
              strokeWidth="5"
              strokeDasharray="6 3"
            />
          </g>

          {/* City Nodes */}
          <g className="text-slate-200 font-mono text-[10px]">
            <circle cx="220" cy="150" r="5" fill="#00F0FF" />
            <text x="230" y="154" fill="#00F0FF" fontWeight="bold">Guwahati</text>

            <circle cx="440" cy="260" r="6" fill={isHighRisk ? '#EF4444' : '#10B981'} />
            <text x="452" y="264" fill="#F8FAFC" fontWeight="bold">Silchar (Simulated Cut-off)</text>

            <circle cx="180" cy="60" r="5" fill="#F59E0B" />
            <text x="192" y="64" fill="#F8FAFC">Gangtok</text>

            <circle cx="600" cy="240" r="5" fill="#10B981" />
            <text x="612" y="244" fill="#F8FAFC">Kohima</text>

            <circle cx="450" cy="400" r="6" fill={simParams.numBlockages > 1 ? '#EF4444' : '#F59E0B'} />
            <text x="462" y="404" fill="#F8FAFC">Aizawl</text>
          </g>
        </svg>

        {/* Map Center Alert Marker */}
        {isHighRisk && (
          <div className="absolute top-[48%] left-[42%] transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="px-2.5 py-1 bg-rose-600 text-white font-mono text-[10px] font-bold rounded shadow-glow-rose flex items-center gap-1 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
              SIMULATED BLOCKAGE AT SONAPUR (NH-27)
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="z-10 bg-[#131B2A]/90 border border-[#2A3B56] p-2.5 rounded-xl flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-1 rounded bg-emerald-400"></span> Clear Bypass
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-1 rounded bg-amber-400"></span> Simulated At-Risk
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-1 rounded bg-rose-500"></span> Simulated Blocked
          </span>
        </div>

        <span className="text-rose-400 font-bold uppercase">
          {simResults ? `Simulated Network Score: ${simResults.afterStats.accessiblePct}%` : 'Ready to Run'}
        </span>
      </div>
    </div>
  );
};
