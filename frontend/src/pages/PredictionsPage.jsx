import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  Compass,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { predictDisruption } from '../services/aiPredictionService';
import { MOCK_ROUTES } from '../data/mockRoutes';

export const PredictionsPage = () => {
  const [selectedCorridor] = useState(MOCK_ROUTES[0]);

  const [rainfallMm, setRainfallMm] = useState(140);
  const [terrainVulnerability, setTerrainVulnerability] = useState('steep_gorge');
  const [recentIncidentsCount, setRecentIncidentsCount] = useState(2);
  const [roadCondition, setRoadCondition] = useState('subsidence');

  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionTimestamp, setPredictionTimestamp] = useState('');

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
    selectedCorridor
  ]);

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      <PageHeader
        category="SMARTROUTE INTELLIGENCE & PREDICTIVE MATRIX"
        title="AI Insights & Disruption Forecasts"
        subtitle="Operational risk forecasts, disruption predictions, delay estimations, and recommended command actions for North East logistics corridors."
        badgeText={predictionResult?.statusMessage || 'INTELLIGENCE LAYER ACTIVE'}
        actionButton={
          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Evaluated: {predictionTimestamp || 'Just now'}</span>
          </div>
        }
      />

      {/* Scenario Parameters */}
      <Card title="SCENARIO PARAMETER TUNER" subtitle="Adjust real-time rainfall, slope terrain vulnerability, and road condition indicators">
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
              className="w-full accent-[#0F766E]"
            />
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">Terrain Risk:</span>
              <span className="font-bold text-[#D97706]">{terrainVulnerability}</span>
            </div>
            <select
              value={terrainVulnerability}
              onChange={(e) => setTerrainVulnerability(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="flat">Flat Terrain (0.15)</option>
              <option value="hilly">Hilly Slope (0.55)</option>
              <option value="steep_gorge">Steep Gorge (0.85)</option>
              <option value="tectonic_fault">Tectonic Fault Zone (0.95)</option>
            </select>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex justify-between text-[#0F172A]">
              <span className="font-bold">Road Surface:</span>
              <span className="font-bold text-[#DC2626]">{roadCondition}</span>
            </div>
            <select
              value={roadCondition}
              onChange={(e) => setRoadCondition(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1.5 rounded-lg focus:outline-none"
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
              className="w-full accent-[#2563EB]"
            />
          </div>
        </div>
      </Card>

      {/* Structured Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
        {/* Risk Forecast */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#DC2626] uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> 1. CORRIDOR RISK FORECAST
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#FECACA]">
              {predictionResult?.riskCategory || 'CRITICAL'} RISK
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">PREDICTION FACTORS</span>
              <p className="text-xs text-[#0F172A] font-bold">
                Risk Score: {predictionResult?.riskScore ?? 87} / 100 ({Math.round((predictionResult?.disruptionProbability ?? 0.87) * 100)}% disruption probability)
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">WHY THIS RISK?</span>
              <p className="text-xs text-[#64748B]">
                High 24h rainfall intensity ({rainfallMm}mm), steep gorge slope exposure ({terrainVulnerability}), and {recentIncidentsCount} active field incidents.
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">RECOMMENDED ACTION</span>
              <p className="text-xs text-[#0F766E] font-semibold">
                Reroute essential medical convoys to Route B Bypass. Pre-position BRO excavators at Sonapur portal.
              </p>
            </div>
          </div>
        </div>

        {/* AI Confidence & Route Recommendation */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F766E] uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0F766E]" /> 2. SMARTROUTE INTELLIGENCE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#CCFBF1] text-[#0F766E] font-bold border border-[#99F6E4]">
              AI CONFIDENCE: 91%
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-[#0F766E] uppercase block font-bold">AI RECOMMENDATION</span>
              <p className="text-xs text-[#0F172A] font-bold">
                Route B (Haflong Paved Ridge Bypass) selected as optimal path (Overall Decision Score: 78/100).
              </p>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">WHY THIS ROUTE?</span>
              <p className="text-xs text-[#64748B]">
                Reduces predicted disruption risk by 61% (39/100 vs 100/100 on Route A) while guaranteeing 88% corridor accessibility.
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="text-[10px] text-[#2563EB] uppercase block font-bold">SHIPMENT PRIORITY IMPACT</span>
              <p className="text-xs text-[#2563EB] font-semibold">
                Oxygen Tanker AS-01-GC-9921 given priority green corridor escort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
