import React, { useState, useEffect } from 'react';
import {
  Route,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Fuel,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  History,
  FileCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Scale,
  Send,
  MapPin,
  Truck,
  Filter
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MOCK_DELIVERIES_ROUTES } from '../data/mockRoutes';
import { predictDisruption } from '../services/aiPredictionService';
import { evaluateRouteDecision, getDynamicDecisionWeights } from '../services/routeDecisionEngine';
import { useToast } from '../hooks/useToast';

export const RoutesPage = () => {
  const { addToast } = useToast();

  // Active Tab View: 'matrix' vs 'planner'
  const [activeTab, setActiveTab] = useState('matrix');

  // Active Selected Delivery Manifest
  const [selectedDelivery] = useState(MOCK_DELIVERIES_ROUTES[0]);

  // Route Planner Input Form State
  const [plannerOrigin, setPlannerOrigin] = useState('Guwahati Logistics Hub');
  const [plannerDestination, setPlannerDestination] = useState('Silchar SMCH Hospital');
  const [plannerCargo, setPlannerCargo] = useState('Medicines & Cold Chain');
  const [plannerPriority, setPlannerPriority] = useState('Critical');
  const [plannerVehicle, setPlannerVehicle] = useState('Heavy Tanker Convoy');
  const [plannerIsEvaluating, setPlannerIsEvaluating] = useState(false);

  // Scenario Presets State
  const [scenarioInputs] = useState({
    rainfallMm: 140,
    weatherSeverity: 'heavy',
    terrainVulnerability: 'steep_gorge',
    historicalFrequency: 14,
    recentIncidentsCount: 2,
    roadCondition: 'subsidence',
    trafficCongestion: 'moderate'
  });

  // AI Prediction & Route Decision Engine Output State
  const [aiPrediction, setAiPrediction] = useState(null);
  const [decisionResult, setDecisionResult] = useState(null);

  useEffect(() => {
    let isMounted = true;

    predictDisruption(scenarioInputs).then((pred) => {
      if (isMounted) {
        setAiPrediction(pred);

        const decision = evaluateRouteDecision(
          selectedDelivery,
          selectedDelivery.routes,
          pred,
          scenarioInputs
        );

        setDecisionResult(decision);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDelivery, scenarioInputs]);

  const handlePlanRoute = (e) => {
    e?.preventDefault();
    setPlannerIsEvaluating(true);

    setTimeout(() => {
      setPlannerIsEvaluating(false);
      addToast({
        title: 'Route Intelligence Evaluation Complete',
        message: `Argmax route planner evaluated 3 corridors for ${plannerCargo} from ${plannerOrigin} to ${plannerDestination}. Recommended: Route B Bypass.`,
        type: 'success'
      });
      setActiveTab('matrix');
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      {/* Header Bar */}
      <PageHeader
        category="LOGISTICS CORRIDOR RESILIENCE & ARGMAX ROUTE PLANNER"
        title="Live Corridors & Route Comparison Matrix"
        subtitle="Multi-factor weighted evaluation comparing direct highways vs bypass corridors based on predicted disruption risk, ETA, distance, and accessibility."
        badgeText="ROUTE ENGINE ACTIVE"
        actionButton={
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E4EAF2]">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'matrix' ? 'bg-[#155EEF] text-white shadow-xs' : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Corridor Matrix
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'planner' ? 'bg-[#155EEF] text-white shadow-xs' : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Route Planner
            </button>
          </div>
        }
      />

      {/* TAB 1: INTERACTIVE ROUTE PLANNER FORM */}
      {activeTab === 'planner' && (
        <Card title="ROUTE PLANNER INTERFACE" subtitle="Configure cargo manifest, priority level, and vehicle type to run Argmax route decision evaluation">
          <form onSubmit={handlePlanRoute} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Origin Depot</label>
                <input
                  type="text"
                  value={plannerOrigin}
                  onChange={(e) => setPlannerOrigin(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Destination Hub</label>
                <input
                  type="text"
                  value={plannerDestination}
                  onChange={(e) => setPlannerDestination(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Cargo Category</label>
                <select
                  value={plannerCargo}
                  onChange={(e) => setPlannerCargo(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Medicines & Cold Chain">Medicines & Cryogenic Oxygen</option>
                  <option value="Food & Ration Grains">Food & Ration Grains</option>
                  <option value="Construction Materials">Construction & Fuel Supplies</option>
                  <option value="Emergency Equipment">Emergency Rescue Machinery</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Priority Level</label>
                <select
                  value={plannerPriority}
                  onChange={(e) => setPlannerPriority(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Critical">Critical (55% Risk Weight)</option>
                  <option value="High">High (48% Risk Weight)</option>
                  <option value="Normal">Normal (40% Risk Weight)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Vehicle / Transport Type</label>
                <select
                  value={plannerVehicle}
                  onChange={(e) => setPlannerVehicle(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                >
                  <option value="Heavy Tanker Convoy">Heavy Tanker Convoy</option>
                  <option value="Refrigerated Cold Chain Van">Refrigerated Cold Chain Van</option>
                  <option value="4x4 Escort Vehicle">4x4 Escort Vehicle</option>
                  <option value="Flatbed Truck">Flatbed Cargo Truck</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Compass}
                  isLoading={plannerIsEvaluating}
                  className="w-full bg-[#155EEF] hover:bg-[#124BCE] text-white font-bold"
                >
                  PLAN ROUTE
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: CANDIDATE ROUTE COMPARISON MATRIX TABLE */}
      <Card title="CANDIDATE ROUTE COMPARISON MATRIX" subtitle="Dynamic side-by-side trade-off evaluation generated by routeDecisionEngine">
        <div className="space-y-4 font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] bg-[#F1F5F9] text-[#667085] uppercase text-[11px]">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <th
                      key={rt.id}
                      className={`py-3 px-4 text-center ${
                        rt.id === decisionResult.recommendedRouteId
                          ? 'bg-[#E6F6F4] text-[#0F9D8A] font-bold border-t-2 border-t-[#0F9D8A]'
                          : 'text-[#172033]'
                      }`}
                    >
                      {rt.name}
                      {rt.id === decisionResult.recommendedRouteId && (
                        <span className="block text-[9px] uppercase text-[#0F9D8A] font-extrabold mt-0.5">
                          ★ RECOMMENDED
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF2]">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Travel Time (ETA)</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#172033] font-bold">
                      {rt.etaDisplay}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Predicted Risk Score</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center">
                      <Badge status={rt.riskCategory.toLowerCase()} size="sm">
                        {rt.routeRiskScore} / 100 ({rt.riskCategory})
                      </Badge>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Corridor Reliability (%)</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#0F9D8A] font-bold">
                      {rt.roadAccessibilityPct}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Distance & Fuel Cost</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center text-[#667085]">
                      {rt.distanceKm} km (₹{(rt.totalCostINR || 12000).toLocaleString('en-IN')})
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">Disruption Exposure</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-3.5 px-4 text-center">
                      <span className={`font-bold ${rt.routeRiskScore > 70 ? 'text-[#E5484D]' : 'text-[#16A34A]'}`}>
                        {rt.routeRiskScore > 70 ? 'High Exposure' : 'Low Exposure'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#F8FAFC]">
                  <td className="py-4 px-4 font-extrabold text-[#155EEF]">Overall Decision Score</td>
                  {decisionResult?.candidateRoutes?.map((rt) => (
                    <td key={rt.id} className="py-4 px-4 text-center">
                      <span className={`text-base font-extrabold ${rt.id === decisionResult.recommendedRouteId ? 'text-[#0F9D8A] text-lg' : 'text-[#172033]'}`}>
                        {rt.overallDecisionScore} / 100
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#EAF2FF] rounded-xl border border-[#B2CCFF] text-xs font-sans font-semibold text-[#155EEF] leading-relaxed">
            "{decisionResult?.decisionReason}"
          </div>
        </div>
      </Card>
    </div>
  );
};
