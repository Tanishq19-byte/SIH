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

export const PredictionsPage = () => {
  const { selectedState } = useApp();

  const stateProfile = STATE_PREDICTION_PROFILES[selectedState] || STATE_PREDICTION_PROFILES.all;
  const stateName = NER_STATES.find(s => s.id === selectedState)?.name || 'All NER States';

  const [rainfallMm, setRainfallMm] = useState(stateProfile.rainfallMm);
  const [terrainVulnerability, setTerrainVulnerability] = useState(stateProfile.terrainVulnerability);
  const [recentIncidentsCount, setRecentIncidentsCount] = useState(stateProfile.recentIncidentsCount);
  const [roadCondition, setRoadCondition] = useState(stateProfile.roadCondition);

  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionTimestamp, setPredictionTimestamp] = useState('');

  // Automatically update input parameters whenever selectedState changes
  useEffect(() => {
    const profile = STATE_PREDICTION_PROFILES[selectedState] || STATE_PREDICTION_PROFILES.all;
    setRainfallMm(profile.rainfallMm);
    setTerrainVulnerability(profile.terrainVulnerability);
    setRecentIncidentsCount(profile.recentIncidentsCount);
    setRoadCondition(profile.roadCondition);
  }, [selectedState]);

  // Run AI prediction whenever inputs change
  useEffect(() => {
    let isMounted = true;

    predictDisruption({
      rainfallMm,
      terrainVulnerability,
      recentIncidentsCount,
      roadCondition
    }).then((res) => {
      if (isMounted) {
        setPredictionResult(res);
        setPredictionTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    rainfallMm,
    terrainVulnerability,
    recentIncidentsCount,
    roadCondition,
    selectedState
  ]);

  const riskScore = predictionResult?.riskScore ?? Math.min(Math.round(rainfallMm * 0.35 + (recentIncidentsCount * 12) + 20), 99);
  const disruptionProbability = predictionResult?.disruptionProbability ?? (riskScore / 100);
  const riskCategory = riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';

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

      {/* Target Corridor Information Banner */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
            riskCategory === 'CRITICAL' ? 'bg-[#DC2626]' : riskCategory === 'HIGH' ? 'bg-[#EA580C]' : 'bg-[#0F766E]'
          }`}>
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider block">Target Evaluated Corridor</span>
            <h3 className="text-sm font-extrabold text-[#0F172A]">{stateProfile.corridorName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#64748B]">Region: <strong className="text-[#0F172A]">{stateName}</strong></span>
          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
            riskCategory === 'CRITICAL'
              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
              : riskCategory === 'HIGH'
              ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
              : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
          }`}>
            {riskCategory} DISRUPTION PROBABILITY
          </span>
        </div>
      </div>

      {/* Scenario Parameters */}
      <Card title="ENVIRONMENTAL SCENARIO PARAMETER TUNER" subtitle="Adjust real-time rainfall, slope terrain vulnerability, and road condition indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">24h Rainfall:</span>
              <span className="font-bold text-[#0F766E]">{rainfallMm} mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(Number(e.target.value))}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">Terrain Risk:</span>
              <span className="font-bold text-[#D97706] capitalize">{terrainVulnerability.replace(/_/g, ' ')}</span>
            </div>
            <select
              value={terrainVulnerability}
              onChange={(e) => setTerrainVulnerability(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="flat">Flat Valley (0.15)</option>
              <option value="hilly">Hilly Slope (0.55)</option>
              <option value="steep_gorge">Steep Gorge (0.85)</option>
              <option value="tectonic_fault">High Altitude / Fault (0.95)</option>
            </select>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">Road Surface:</span>
              <span className="font-bold text-[#DC2626] capitalize">{roadCondition.replace(/_/g, ' ')}</span>
            </div>
            <select
              value={roadCondition}
              onChange={(e) => setRoadCondition(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="excellent">Excellent Paved Surface</option>
              <option value="minor_scour">Minor Pothole Scour</option>
              <option value="subsidence">Substantial Subsidence</option>
              <option value="severely_damaged">Severely Damaged / Washout</option>
            </select>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">Active Hazards:</span>
              <span className="font-bold text-[#2563EB]">{recentIncidentsCount} Verified</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={recentIncidentsCount}
              onChange={(e) => setRecentIncidentsCount(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Structured Intelligence Cards */}
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

