import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldAlert,
  Truck,
  AlertTriangle,
  Flame,
  MapPin,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Search,
  Check,
  XCircle,
  FileText,
  Building2,
  CloudRain,
  ShieldCheck,
  Activity,
  Sliders,
  Scale,
  HelpCircle,
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { OperationsMapView } from '../components/map/OperationsMapView';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MOCK_VEHICLES } from '../data/mockVehicles';
import { MOCK_ROUTES } from '../data/mockRoutes';
import { MOCK_INCIDENTS } from '../data/mockIncidents';
import { predictDisruption } from '../services/aiPredictionService';
import { evaluateRouteDecision } from '../services/routeDecisionEngine';
import { evaluateSupplyImpact } from '../services/supplyImpactEngine';
import { generateDecisionEvidence, createDecisionRecord } from '../services/decisionEvidenceEngine';
import { useToast } from '../hooks/useToast';

export const OperationsPage = () => {
  const { addToast } = useToast();

  const [commandMode, setCommandMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingEntity, setRejectingEntity] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const [scenarioInputs] = useState({
    rainfall24h: 140,
    rainfallForecast: 154,
    terrainRisk: 0.85,
    roadConditionScore: 3.8,
    floodProbability: 72,
    landslideProbability: 88,
    riverLevelPercent: 89,
    activeIncidentCount: 3,
    vehicleCount: 38,
    supplyUrgency: 9.2
  });

  const [aiPrediction, setAiPrediction] = useState(null);
  const [routeDecision, setRouteDecision] = useState(null);
  const [supplyImpactResult, setSupplyImpactResult] = useState(null);
  const [decisionEvidence, setDecisionEvidence] = useState(null);

  const [auditLog, setAuditLog] = useState([
    {
      decisionId: 'DEC-9001',
      timestamp: '10:15:30 IST',
      officerName: 'COMMANDER SHARMA (HQ)',
      entity: 'V-NER-8891 (Oxygen Tanker)',
      officerAction: 'AUTHORIZED_REROUTE',
      previousRoute: 'Route A: Direct Highway Corridor',
      recommendedRoute: 'Route B: Paved Ridge Bypass',
      riskBefore: 100,
      riskAfter: 39,
      riskReductionPct: 61,
      criticalSupplyAffected: 'Cryogenic Liquid Medical Oxygen',
      stockBuffer: '1.8 Days',
      decisionReason: 'Command officer approved AI recommendation: reroute via Route B to reduce disruption risk by 61%.',
      rejectionReason: null,
      aiSource: 'FASTAPI_ML',
      modelVersion: 'prototype-v1.1',
      status: 'APPROVED'
    }
  ]);

  const [activeFilters] = useState({
    vehicles: true,
    roads: true,
    incidents: true,
    riskAreas: true,
    accessibility: true,
    supplies: true,
    weather: false,
    blockedOnly: false
  });

  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_VEHICLES[0]);
  const [selectedRoad, setSelectedRoad] = useState(null);

  useEffect(() => {
    let isMounted = true;

    predictDisruption(scenarioInputs).then((pred) => {
      if (isMounted) {
        setAiPrediction(pred);
        const rDecision = evaluateRouteDecision(MOCK_ROUTES[0] || {}, MOCK_ROUTES[0]?.routes || [], pred, scenarioInputs);
        setRouteDecision(rDecision);
        const sImpact = evaluateSupplyImpact(rDecision, MOCK_ROUTES[0] || {}, scenarioInputs);
        setSupplyImpactResult(sImpact);

        const evidence = generateDecisionEvidence(pred, rDecision, sImpact, scenarioInputs);
        setDecisionEvidence(evidence);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [scenarioInputs]);

  const handleApproveAction = (entity = selectedVehicle) => {
    const record = createDecisionRecord(
      'APPROVED',
      entity || selectedVehicle || { regNumber: 'Convoy V-NER-8891' },
      { ...decisionEvidence, routeDecision, supplyImpactResult },
      'COMMAND OFFICER (CURRENT USER)',
      ''
    );

    setAuditLog((prev) => [record, ...prev]);

    addToast({
      title: 'Command Action Executed & Audited',
      message: `Officer authorized decision ${record.decisionId} for ${record.entity}. Recorded in Command Audit Trail.`,
      type: 'success'
    });
  };

  const handleInitiateReject = (entity = selectedVehicle) => {
    setRejectingEntity(entity || selectedVehicle);
    setRejectionReasonInput('');
  };

  const handleConfirmReject = () => {
    if (!rejectingEntity) return;

    const record = createDecisionRecord(
      'REJECTED',
      rejectingEntity,
      { ...decisionEvidence, routeDecision, supplyImpactResult },
      'COMMAND OFFICER (CURRENT USER)',
      rejectionReasonInput
    );

    setAuditLog((prev) => [record, ...prev]);
    setRejectingEntity(null);

    addToast({
      title: 'AI Recommendation Rejected by Command Officer',
      message: `Rejection recorded (${record.decisionId}). Reason: ${rejectionReasonInput || 'Tactical override'}.`,
      type: 'warning'
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full text-[#0F172A] bg-[#F8FAFC] space-y-6 pb-12 font-sans">
      {/* 1. CENTRAL COMMAND HEADER BAR */}
      <div
        className={`p-4 md:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] rounded-2xl bg-white shadow-2xs transition-colors ${
          commandMode ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              commandMode
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                : 'bg-[#CCFBF1] border-[#99F6E4] text-[#0F766E]'
            }`}
          >
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-extrabold tracking-tight text-[#0F172A] flex items-center gap-2 font-sans">
                LIVE OPERATIONS & DECISION EVIDENCE
                {commandMode && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#DC2626] text-white rounded-full uppercase shadow-2xs">
                    CRISIS COMMAND ACTIVE
                  </span>
                )}
              </h1>
              {aiPrediction && (
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${
                    aiPrediction.source === 'FASTAPI_ML'
                      ? 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]'
                      : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                  }`}
                >
                  {aiPrediction.statusMessage || (aiPrediction.source === 'FASTAPI_ML' ? 'AI MODEL • FASTAPI v1.1' : 'LOCAL FALLBACK ACTIVE')}
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] font-sans mt-0.5">
              Explainable AI decision justification, candidate trade-off matrix, sensitivity policy, and audited human command action logging.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Convoy, Incident, Corridor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#0F766E] w-60 font-sans"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2 rounded-xl hover:border-[#0F766E] transition-all">
            <Zap className={`w-4 h-4 ${commandMode ? 'text-[#DC2626] animate-bounce' : 'text-[#64748B]'}`} />
            <span className="text-xs font-bold text-[#0F172A]">
              {commandMode ? 'Exit Command Mode' : 'Enter Command Mode'}
            </span>
            <input
              type="checkbox"
              checked={commandMode}
              onChange={(e) => {
                setCommandMode(e.target.checked);
                addToast({
                  title: e.target.checked ? 'EMERGENCY COMMAND MODE ACTIVATED' : 'Returned to Standard Operations',
                  message: e.target.checked
                    ? 'Highlighting critical blockages, interrupted medical convoys, and high-risk corridors.'
                    : 'Standard operations command view restored.',
                  type: e.target.checked ? 'warning' : 'info'
                });
              }}
              className="sr-only"
            />
            <div className={`w-8 h-4 rounded-full transition-colors relative ${commandMode ? 'bg-[#DC2626]' : 'bg-[#CBD5E1]'}`}>
              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${commandMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* 2. CURRENT AI RECOMMENDATION & HUMAN AUTHORIZATION BAR */}
      <div className="px-1">
        <div className="bg-white border-2 border-[#0F766E] p-5 rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-sans font-bold text-[#0F766E] tracking-wider uppercase block">
                  AI RECOMMENDATION — HUMAN AUTHORIZATION REQUIRED
                </span>
                <h2 className="text-base md:text-lg font-extrabold text-[#0F172A] font-sans flex items-center gap-2">
                  Execute Priority Reroute via {routeDecision?.recommendedRoute?.name || 'Route B: Paved Ridge Bypass'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                Predicted Disruption: {aiPrediction?.riskScore ?? 87}/100 ({aiPrediction?.riskCategory || 'CRITICAL'})
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]">
                Risk Reduction: -{routeDecision?.riskReductionPct ?? 61}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">RECOMMENDED ACTION</span>
              <p className="text-sm font-extrabold text-[#0F766E] mt-1 font-sans">
                Reroute Convoy V-NER-8891 to {routeDecision?.recommendedRoute?.name?.split(':')[0] || 'Route B Bypass'}
              </p>
              <p className="text-[11px] text-[#64748B] font-sans mt-1">
                Avoids Sonapur mudslide portal. ETA: {routeDecision?.recommendedRoute?.etaDisplay || '7h 30m'}
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase block font-bold">CRITICAL CARGO AT RISK</span>
              <p className="text-sm font-extrabold text-[#DC2626] mt-1 font-sans">
                {supplyImpactResult?.highestPrioritySupply?.supplyType || 'Cryogenic Medical Oxygen'}
              </p>
              <p className="text-[11px] text-[#64748B] font-sans mt-1">
                Facility: {supplyImpactResult?.highestPrioritySupply?.facility || 'SMCH Silchar'} ({supplyImpactResult?.highestPrioritySupply?.stockBufferDays || 1.8} days buffer)
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#99F6E4] flex flex-col justify-between">
              <span className="text-[10px] text-[#0F766E] uppercase font-bold block">OFFICER AUTHORIZATION</span>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={() => handleApproveAction(selectedVehicle)}
                  className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold"
                >
                  APPROVE ACTION
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  icon={XCircle}
                  onClick={() => handleInitiateReject(selectedVehicle)}
                  className="flex-1 text-[#DC2626] border border-[#FECACA] hover:bg-[#FEF2F2] font-bold"
                >
                  REJECT ACTION
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GEOSPATIAL MAP & INSPECTOR */}
      <div className="px-1">
        <div className="h-[460px] w-full relative rounded-2xl border border-[#E2E8F0] overflow-hidden flex shadow-2xs">
          <div className="flex-1 h-full w-full relative">
            <OperationsMapView
              activeFilters={activeFilters}
              commandMode={commandMode}
              selectedVehicle={selectedVehicle}
              selectedRoad={selectedRoad}
              onSelectVehicle={(veh) => {
                setSelectedVehicle(veh);
                setSelectedRoad(null);
              }}
              onSelectRoad={(road) => {
                setSelectedRoad(road);
                setSelectedVehicle(null);
              }}
            />
          </div>

          {/* Vehicle Inspector Drawer */}
          {selectedVehicle && (
            <aside className="w-full sm:w-96 bg-white border-l border-[#E2E8F0] flex flex-col shadow-md z-40 absolute right-0 inset-y-0 overflow-y-auto">
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#0F766E] uppercase font-bold">Vehicle Inspector</span>
                  <h3 className="text-base font-extrabold text-[#0F172A] font-sans">{selectedVehicle.regNumber}</h3>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3 text-xs font-sans">
                <Badge status={selectedVehicle.status} size="lg" />

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold">Cargo Manifest</span>
                  <p className="text-sm font-bold text-[#0F172A] mt-0.5">{selectedVehicle.cargoCategory}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#99F6E4] space-y-2 font-sans">
                  <span className="text-[10px] text-[#0F766E] uppercase font-bold">Command Review</span>
                  <p className="text-xs text-[#0F172A] leading-relaxed">
                    AI directive: Reroute {selectedVehicle.regNumber} via {routeDecision?.recommendedRoute?.name?.split(':')[0] || 'Route B Bypass'}.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button variant="primary" size="sm" icon={Check} onClick={() => handleApproveAction(selectedVehicle)}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" icon={XCircle} className="text-[#DC2626] border-[#FECACA]" onClick={() => handleInitiateReject(selectedVehicle)}>
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* 4. "WHY THIS DECISION?" EVIDENCE PANEL */}
      <div className="px-1">
        <Card title="WHY THIS DECISION?" subtitle="Dynamic evidence breakdown across environment, AI, supply, and route dimensions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#0F766E] flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2">
                <CloudRain className="w-3.5 h-3.5" /> Environmental Evidence
              </span>
              <div className="space-y-1.5 text-[11px]">
                {decisionEvidence?.environmentalEvidence?.map((ev, i) => (
                  <div key={i} className="flex justify-between border-b border-[#E2E8F0]/60 pb-1">
                    <span className="text-[#64748B]">{ev.label}:</span>
                    <span className="font-bold text-[#0F172A]">{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#2563EB] flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Prediction Evidence
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Disruption Prob:</span>
                  <span className="font-bold text-[#2563EB]">{decisionEvidence?.aiEvidence?.disruptionProbabilityPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Risk Score:</span>
                  <span className="font-bold text-[#0F172A]">{decisionEvidence?.aiEvidence?.riskScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Risk Category:</span>
                  <span className="font-bold text-[#DC2626]">{decisionEvidence?.aiEvidence?.riskCategory}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#D97706] flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2">
                <Building2 className="w-3.5 h-3.5" /> Supply Stream Evidence
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Priority Stream:</span>
                  <span className="font-bold text-[#D97706] truncate max-w-[130px]">{decisionEvidence?.supplyEvidence?.highestPrioritySupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Stock Buffer:</span>
                  <span className="font-bold text-[#DC2626]">{decisionEvidence?.supplyEvidence?.stockBufferDays} Days</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#0F766E] flex items-center gap-1.5 border-b border-[#E2E8F0] pb-2">
                <Scale className="w-3.5 h-3.5" /> Route Evaluation Evidence
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Recommended:</span>
                  <span className="font-bold text-[#0F766E] truncate max-w-[130px]">{decisionEvidence?.recommendedRoute?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Risk Reduction:</span>
                  <span className="font-bold text-[#0F766E]">-{routeDecision?.riskReductionPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. CANDIDATE ROUTE TRADE-OFF MATRIX */}
      <div className="px-1">
        <Card title="CANDIDATE ROUTE TRADE-OFF MATRIX" subtitle="Comparative analysis across candidate corridors">
          <div className="space-y-4 font-sans text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] uppercase text-[11px]">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Route Name</th>
                    <th className="py-2.5 px-3 text-center">Risk Score</th>
                    <th className="py-2.5 px-3 text-center">Category</th>
                    <th className="py-2.5 px-3 text-center">ETA</th>
                    <th className="py-2.5 px-3 text-center">Distance</th>
                    <th className="py-2.5 px-3 text-center">Decision Score</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {decisionEvidence?.routeTradeoffs?.map((rt) => (
                    <tr
                      key={rt.id}
                      className={`transition-colors ${
                        rt.isRecommended ? 'bg-[#CCFBF1]/40 border-l-4 border-l-[#0F766E] font-bold' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <Badge status={rt.isRecommended ? 'rerouted' : 'low'} size="sm">
                          {rt.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-[#0F172A] font-bold">{rt.name}</td>
                      <td className="py-3 px-3 text-center font-bold">{rt.riskScore} / 100</td>
                      <td className="py-3 px-3 text-center">
                        <Badge status={rt.riskCategory.toLowerCase()} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-center text-[#0F172A]">{rt.eta}</td>
                      <td className="py-3 px-3 text-center text-[#64748B]">{rt.distance}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-extrabold text-[#0F766E]">{rt.overallDecisionScore}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {rt.isRecommended ? (
                          <span className="px-2 py-1 rounded-full bg-[#0F766E] text-white font-bold text-[10px] uppercase">
                            RECOMMENDED
                          </span>
                        ) : (
                          <span className="text-[#64748B] text-[11px]">ALTERNATE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. COMMAND AUDIT LOG */}
      <div className="px-1">
        <Card title="COMMAND ACTION AUDIT TRAIL LOG" subtitle="Audited human operational decision records">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] uppercase text-[11px]">
                  <th className="py-2.5 px-3">Decision ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {auditLog.map((log) => (
                  <tr key={log.decisionId} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 text-[#0F766E] font-bold font-mono">{log.decisionId}</td>
                    <td className="py-2.5 px-3 text-[#64748B] font-mono">{log.timestamp}</td>
                    <td className="py-2.5 px-3 text-[#0F172A] font-bold">{log.officerName}</td>
                    <td className="py-2.5 px-3 text-[#0F172A]">{log.entity}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0F766E]">{log.officerAction}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'APPROVED'
                            ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]'
                            : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* REJECTION MODAL */}
      {rejectingEntity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl font-sans">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                Reject AI Recommendation
              </h3>
              <button onClick={() => setRejectingEntity(null)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              You are rejecting the AI recommendation for <span className="font-bold text-[#0F172A]">{rejectingEntity.regNumber || 'Convoy'}</span>. Provide an optional reason for the audit log.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#64748B] uppercase font-bold">Rejection Reason</label>
              <textarea
                rows={3}
                placeholder="Tactical field override..."
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setRejectingEntity(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReject} className="bg-[#DC2626] text-white font-bold">
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
