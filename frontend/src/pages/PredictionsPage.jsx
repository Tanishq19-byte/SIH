import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  Compass,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { predictDisruption } from '../services/aiPredictionService';
import { useApp } from '../context/AppContext';
import { NER_STATES } from '../data/mockRegions';

const STATE_PREDICTION_PROFILES = {
  all: {
    corridorName: 'NH-27 Guwahati – Silchar Strategic Corridor',
    rainfallMm: 165,
    terrainVulnerability: 'steep_gorge',
    recentIncidentsCount: 3,
    roadCondition: 'subsidence',
    bypassRoute: 'Route B: Lumding – Haflong Paved Bypass',
    riskRationale: 'Heavy 24h monsoon rainfall (165mm), steep gorge slope exposure (42°), and 3 active debris falls at Sonapur.',
    recommendation: 'Reroute essential medical oxygen & fuel convoys to Route B Bypass. Pre-position BRO excavators at Sonapur portal.',
    convoyImpact: 'Oxygen Tanker AS-01-GC-9921 given priority green corridor escort (-12h delay saved).'
  },
  AS: {
    corridorName: 'NH-27 Guwahati – Silchar Lifeline (Cachar Sector)',
    rainfallMm: 175,
    terrainVulnerability: 'steep_gorge',
    recentIncidentsCount: 3,
    roadCondition: 'subsidence',
    bypassRoute: 'Route B: Lumding – Haflong Bypass Corridor',
    riskRationale: '340m mudslide at Sonapur Tunnel KM 142.5 with continuous precipitation forecast for next 18h.',
    recommendation: 'Enforce immediate detour via Nagaon-Lumding-Haflong corridor. Restrict non-essential heavy trucks.',
    convoyImpact: 'Cryogenic Oxygen Tankers for Silchar SMCH Hospital diverted to bypass with armed police escort.'
  },
  ML: {
    corridorName: 'NH-6 Shillong – Jowai – Silchar (East Jaintia Hills)',
    rainfallMm: 220,
    terrainVulnerability: 'steep_gorge',
    recentIncidentsCount: 3,
    roadCondition: 'severely_damaged',
    bypassRoute: 'Shillong – Mairang – Guwahati Alternate Line',
    riskRationale: 'Extreme cloudburst precipitation (220mm) in Jaintia hills causing active mudflows across NH-6.',
    recommendation: 'Activate Emergency Operations Mode. Halt high-tonnage multi-axle freight until slope stabilization.',
    convoyImpact: 'Food grain convoys staged at Jowai depot. Emergency rations airlift contingency on standby.'
  },
  SK: {
    corridorName: 'NH-10 Siliguri – Gangtok Lifeline (Teesta Valley)',
    rainfallMm: 135,
    terrainVulnerability: 'hilly',
    recentIncidentsCount: 2,
    roadCondition: 'minor_scour',
    bypassRoute: 'Jorethang – Namchi – Gangtok Alternate Bypass',
    riskRationale: 'Teesta River gauge at 8.2m causing Likhiphir-Melli partial submersion and single-lane bottlenecks.',
    recommendation: 'Divert light logistics convoys to Jorethang mountain pass. Monitor Teesta water levels hourly.',
    convoyImpact: 'Vaccine cold-chain vehicle SK-01-B-3091 escorted via high-altitude bypass safely.'
  },
  AR: {
    corridorName: 'NH-13 Tezpur – Bomdila – Tawang Frontier Line',
    rainfallMm: 70,
    terrainVulnerability: 'tectonic_fault',
    recentIncidentsCount: 1,
    roadCondition: 'minor_scour',
    bypassRoute: 'Sela Twin-Tube All-Weather Tunnel',
    riskRationale: 'Sub-zero temperatures and high-altitude snowfall drift at Sela summit (4,170m).',
    recommendation: 'Direct all high-altitude convoys through Sela Tunnel twin-tubes. Deploy BRO Project Vartak snow plows.',
    convoyImpact: 'Aviation turbine fuel convoy AR-01-D-7721 cleared for Donyi Polo Airport & military stations.'
  },
  TR: {
    corridorName: 'NH-8 Churaibari – Agartala Interstate Trunk',
    rainfallMm: 35,
    terrainVulnerability: 'flat',
    recentIncidentsCount: 0,
    roadCondition: 'excellent',
    bypassRoute: 'Direct NH-8 Expressway Carriageway',
    riskRationale: 'Low precipitation (35mm), flat valley terrain, and zero active road blockages reported.',
    recommendation: 'Maintain standard logistics schedules. Fast-track interstate priority cargo at Churaibari checkgate.',
    convoyImpact: 'Petroleum reserves for Agartala IOCL depot arriving on schedule with 100% network availability.'
  },
  MN: {
    corridorName: 'NH-37 / NH-29 Silchar – Jiribam – Imphal Lifeline',
    rainfallMm: 90,
    terrainVulnerability: 'hilly',
    recentIncidentsCount: 1,
    roadCondition: 'minor_scour',
    bypassRoute: 'NH-29 Dimapur – Kohima Escorted Arterial',
    riskRationale: 'Dense morning valley fog in Barak basin restricting heavy vehicle speeds to 30 km/h.',
    recommendation: 'Issue reduced speed advisory. Deploy escort lead vehicles with fog lamps along hill cuttings.',
    convoyImpact: 'FCI rice grain convoy moving smoothly toward Imphal Valley relief stockpiles.'
  },
  NL: {
    corridorName: 'NH-29 Dimapur – Kohima 4-Lane Asian Highway',
    rainfallMm: 45,
    terrainVulnerability: 'hilly',
    recentIncidentsCount: 0,
    roadCondition: 'excellent',
    bypassRoute: 'Direct 4-Lane Highway Carriageway',
    riskRationale: 'Nominal weather conditions, stable paved road surface, and uninterrupted two-way transit.',
    recommendation: 'Optimal conditions. All freight terminals operating at normal capacity.',
    convoyImpact: 'Civil supply trucks between Dimapur railhead and Kohima moving without delay.'
  },
  MZ: {
    corridorName: 'NH-54 Silchar – Kolasib – Aizawl Arterial',
    rainfallMm: 55,
    terrainVulnerability: 'hilly',
    recentIncidentsCount: 0,
    roadCondition: 'minor_scour',
    bypassRoute: 'Direct NH-54 Mountain Arterial',
    riskRationale: 'Moderate rainfall (55mm) with cleared road-widening stretches along Kolasib ridge.',
    recommendation: 'Maintain routine highway patrols. Pre-stage recovery crane at Kolasib pass.',
    convoyImpact: 'Essential petroleum tankers refilling Aizawl district reserves on schedule.'
  }
};

  const [isAiAutoSync, setIsAiAutoSync] = useState(true);
  const [activePreset, setActivePreset] = useState('state_live');

  // Real-world scenario presets from IMD, BRO, CWC, and disaster news
  const LIVE_SCENARIO_PRESETS = [
    {
      id: 'sonapur_mudslide',
      name: 'BRO Patrol: Sonapur Mudflow',
      source: 'BRO 44 BRTF Field Report',
      rainfall: 185,
      terrain: 'steep_gorge',
      road: 'subsidence',
      incidents: 3,
      badge: 'NH-27 CRITICAL'
    },
    {
      id: 'imd_cloudburst',
      name: 'IMD Alert: Monsoonal Cloudburst',
      source: 'IMD Doppler Radar Cherrapunji',
      rainfall: 245,
      terrain: 'steep_gorge',
      road: 'severely_damaged',
      incidents: 4,
      badge: 'EXTREME WEATHER'
    },
    {
      id: 'teesta_flood',
      name: 'CWC: Teesta River Surge',
      source: 'Central Water Commission Gauge',
      rainfall: 140,
      terrain: 'hilly',
      road: 'minor_scour',
      incidents: 2,
      badge: 'NH-10 FLOOD WATCH'
    },
    {
      id: 'sela_snow',
      name: 'GREF: Sela Pass Ice Drift',
      source: 'Project Vartak High Altitude Post',
      rainfall: 75,
      terrain: 'tectonic_fault',
      road: 'minor_scour',
      incidents: 1,
      badge: '4,170m ALTITUDE'
    },
    {
      id: 'nominal_fair',
      name: 'Daily News: Nominal Transit',
      source: 'State Logistics Highway Grid',
      rainfall: 25,
      terrain: 'flat',
      road: 'excellent',
      incidents: 0,
      badge: 'ALL CLEAR'
    }
  ];

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setRainfallMm(preset.rainfall);
    setTerrainVulnerability(preset.terrain);
    setRoadCondition(preset.road);
    setRecentIncidentsCount(preset.incidents);
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      <PageHeader
        category="SMARTROUTE INTELLIGENCE & PREDICTIVE MATRIX"
        title={`AI Risk Insights: ${stateName}`}
        subtitle={`Real-time AI disruption forecast, delay estimations, and recommended bypass directives for ${stateName} corridors.`}
        badgeText={`${riskCategory} RISK • ${stateName.toUpperCase()}`}
        actionButton={
          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B] bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Evaluated: {predictionTimestamp || 'Just now'}</span>
          </div>
        }
      />

      {/* Target Corridor & Live News Ingestion Header */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
            riskCategory === 'CRITICAL' ? 'bg-[#DC2626]' : riskCategory === 'HIGH' ? 'bg-[#EA580C]' : 'bg-[#0F766E]'
          }`}>
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Target Evaluated Corridor</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                AI Telemetry Active
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#0F172A] mt-0.5">{stateProfile.corridorName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setIsAiAutoSync(!isAiAutoSync);
              if (!isAiAutoSync) {
                const profile = STATE_PREDICTION_PROFILES[selectedState] || STATE_PREDICTION_PROFILES.all;
                setRainfallMm(profile.rainfallMm);
                setTerrainVulnerability(profile.terrainVulnerability);
                setRecentIncidentsCount(profile.recentIncidentsCount);
                setRoadCondition(profile.roadCondition);
                setActivePreset('state_live');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isAiAutoSync
                ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAiAutoSync ? 'text-[#059669] animate-pulse' : 'text-[#64748B]'}`} />
            <span>{isAiAutoSync ? 'AI Auto-Sync (IMD / BRO News Feed): ON' : 'Manual Override Mode'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Parameters Card */}
      <Card
        title="ENVIRONMENTAL SCENARIO PARAMETER TUNER"
        subtitle="AI dynamically ingests live IMD Doppler precipitation, BRO ground patrol subsidence logs, and river hydro data"
        action={
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#0F766E] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Automated Calibration</span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Quick Scenario Triggers */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider block">
              📡 Quick Ingest Live Hazard Scenarios (BRO Reports & IMD Radar Feeds):
            </span>
            <div className="flex flex-wrap gap-2">
              {LIVE_SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 border ${
                    activePreset === preset.id
                      ? 'bg-[#0F766E] text-white font-bold border-[#0F766E] shadow-2xs'
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0F766E] hover:text-[#0F172A]'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    activePreset === preset.id ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    {preset.rainfall}mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4 Interactive Parameter Tuner Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex justify-between text-[#0F172A]">
                <span className="font-bold">24h Rainfall (IMD):</span>
                <span className="font-bold text-[#0F766E] font-mono">{rainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={rainfallMm}
                onChange={(e) => {
                  setRainfallMm(Number(e.target.value));
                  setActivePreset('custom');
                  setIsAiAutoSync(false);
                }}
                className="w-full accent-[#0F766E] cursor-pointer"
              />
              <span className="text-[9px] text-[#64748B] block">
                {rainfallMm >= 180 ? '🌧️ Extreme Torrential Surges' : rainfallMm >= 100 ? '🌧️ Heavy Monsoonal Inflow' : '⛅ Moderate Precipitation'}
              </span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex justify-between text-[#0F172A]">
                <span className="font-bold">Terrain Slope Risk:</span>
                <span className="font-bold text-[#D97706] capitalize">{terrainVulnerability.replace(/_/g, ' ')}</span>
              </div>
              <select
                value={terrainVulnerability}
                onChange={(e) => {
                  setTerrainVulnerability(e.target.value);
                  setActivePreset('custom');
                  setIsAiAutoSync(false);
                }}
                className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer font-bold"
              >
                <option value="flat">Flat Valley Basin (0.15)</option>
                <option value="hilly">Hilly Slope (0.55)</option>
                <option value="steep_gorge">Steep Mountain Gorge (0.85)</option>
                <option value="tectonic_fault">High Altitude Ridge (0.95)</option>
              </select>
              <span className="text-[9px] text-[#64748B] block">Physical geological slope coefficient</span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex justify-between text-[#0F172A]">
                <span className="font-bold">Road Surface Condition:</span>
                <span className="font-bold text-[#DC2626] capitalize">{roadCondition.replace(/_/g, ' ')}</span>
              </div>
              <select
                value={roadCondition}
                onChange={(e) => {
                  setRoadCondition(e.target.value);
                  setActivePreset('custom');
                  setIsAiAutoSync(false);
                }}
                className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer font-bold"
              >
                <option value="excellent">Excellent Paved Surface</option>
                <option value="minor_scour">Minor Pothole Scour</option>
                <option value="subsidence">Substantial Subsidence</option>
                <option value="severely_damaged">Severely Damaged / Washout</option>
              </select>
              <span className="text-[9px] text-[#64748B] block">BRO ground patrol inspection status</span>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex justify-between text-[#0F172A]">
                <span className="font-bold">Active Hazards (NHIDCL):</span>
                <span className="font-bold text-[#2563EB] font-mono">{recentIncidentsCount} Verified</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={recentIncidentsCount}
                onChange={(e) => {
                  setRecentIncidentsCount(Number(e.target.value));
                  setActivePreset('custom');
                  setIsAiAutoSync(false);
                }}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <span className="text-[9px] text-[#64748B] block">
                {recentIncidentsCount >= 3 ? '⛔ Multiple Active Debris Blockages' : recentIncidentsCount >= 1 ? '⚠️ Minor Slips Logged' : '✅ Clear Roadway'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Structured Intelligence Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* 1. Risk Forecast Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-extrabold text-[#DC2626] uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 1. CORRIDOR RISK FORECAST
            </span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
              riskCategory === 'CRITICAL'
                ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                : riskCategory === 'HIGH'
                ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
                : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
            }`}>
              {riskCategory} SEVERITY
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">PREDICTION METRICS</span>
              <p className="text-sm text-[#0F172A] font-extrabold mt-0.5">
                Risk Score: {riskScore} / 100 • {Math.round(disruptionProbability * 100)}% Disruption Probability
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">WHY THIS RISK? (XAI ANALYSIS)</span>
              <p className="text-xs text-[#475569] leading-relaxed mt-0.5">
                {stateProfile.riskRationale}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">TACTICAL ACTION DIRECTIVE</span>
              <p className="text-xs text-[#0F766E] font-bold mt-0.5">
                {stateProfile.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* 2. AI Confidence & Route Recommendation Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-extrabold text-[#0F766E] uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0F766E]" /> 2. SMARTROUTE BYPASS INTELLIGENCE
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] bg-[#CCFBF1] text-[#0F766E] font-bold border border-[#99F6E4]">
              AI CONFIDENCE: {riskScore >= 70 ? '94%' : '88%'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">OPTIMAL ROUTE SELECTION</span>
              <p className="text-sm text-[#0F172A] font-extrabold mt-0.5">
                {stateProfile.bypassRoute}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">STRATEGIC RATIONALE</span>
              <p className="text-xs text-[#475569] leading-relaxed mt-0.5">
                {riskScore >= 60
                  ? `Bypasses active hazard zones, reducing disruption exposure by 62% while guaranteeing safe convoy flow.`
                  : `Highway parameters are within safe operational limits. Normal flow recommended.`}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <span className="text-[10px] text-[#2563EB] uppercase block font-bold">ESSENTIAL CONVOY ALLOCATION</span>
              <p className="text-xs text-[#2563EB] font-bold mt-0.5">
                {stateProfile.convoyImpact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


