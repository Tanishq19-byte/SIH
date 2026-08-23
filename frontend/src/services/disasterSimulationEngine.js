/**
 * DISASTER SIMULATION ENGINE - NER-SmartRoute AI (SIH26002)
 * Orchestrates upstream AI Services (aiPredictionService, routeDecisionEngine, supplyImpactEngine)
 * into a unified what-if disaster simulation cascade for emergency decision makers.
 * 
 * PROTOTYPE DATA DISCLAIMER:
 * -------------------------------------------------------------------------
 * Simulation metrics, risk transitions, and preparedness directives are prototype
 * decision-support calculations for SIH proof-of-concept development.
 * They do not represent real-world meteorological forecasts.
 */

import { predictDisruption } from './aiPredictionService.js';
import { evaluateRouteDecision } from './routeDecisionEngine.js';
import { evaluateSupplyImpact } from './supplyImpactEngine.js';
import { MOCK_DELIVERIES_ROUTES } from '../data/mockRoutes.js';

// Baseline Normal Weather Parameters for BEFORE vs AFTER comparison
export const BASELINE_SCENARIO_INPUTS = {
  rainfall24h: 24.5,
  rainfallForecast: 28.0,
  terrainRisk: 0.15,
  roadConditionScore: 8.5,
  historicalDisruptionCount: 2,
  floodProbability: 18.0,
  landslideProbability: 12.0,
  trafficScore: 3.4,
  riverLevelPercent: 32.0,
  activeIncidentCount: 0,
  vehicleCount: 12,
  supplyUrgency: 4.1
};

/**
 * Main Disaster Simulation Orchestration Pipeline
 * @param {Object} scenarioInputs Current simulated scenario inputs
 * @param {Object} deliveryManifest Selected delivery manifest (default MOCK_DELIVERIES_ROUTES[0])
 */
export async function runDisasterSimulation(scenarioInputs = {}, deliveryManifest = MOCK_DELIVERIES_ROUTES[0]) {
  const candidateRoutes = deliveryManifest.routes || [];

  // 1. Run Baseline Evaluation (BEFORE Disaster)
  const baselinePrediction = await predictDisruption(BASELINE_SCENARIO_INPUTS);
  const baselineRouteDecision = evaluateRouteDecision(deliveryManifest, candidateRoutes, baselinePrediction, BASELINE_SCENARIO_INPUTS);
  const baselineSupplyImpact = evaluateSupplyImpact(baselineRouteDecision, deliveryManifest, BASELINE_SCENARIO_INPUTS);

  // 2. Run Simulated Scenario Evaluation (AFTER Disaster)
  const simulatedPrediction = await predictDisruption(scenarioInputs);
  const simulatedRouteDecision = evaluateRouteDecision(deliveryManifest, candidateRoutes, simulatedPrediction, scenarioInputs);
  const simulatedSupplyImpact = evaluateSupplyImpact(simulatedRouteDecision, deliveryManifest, scenarioInputs);

  // 3. Compute Risk Transition Metrics
  const baseRiskScore = baselinePrediction.riskScore ?? 1;
  const simRiskScore = simulatedPrediction.riskScore ?? 87;
  const riskDiff = simRiskScore - baseRiskScore;

  let transitionStatus = 'RISK STABLE';
  let transitionStyle = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';

  if (riskDiff > 0) {
    transitionStatus = `RISK ESCALATING (+${riskDiff} PTS)`;
    transitionStyle = 'text-rose-400 border-rose-500/40 bg-rose-950/40 shadow-glow-rose font-bold animate-pulse';
  } else if (riskDiff < 0) {
    transitionStatus = `RISK IMPROVING (${riskDiff} PTS)`;
    transitionStyle = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 font-bold';
  }

  // 4. Compute Route Recommendation Shift
  const baseRec = baselineRouteDecision.recommendedRoute || candidateRoutes[0];
  const simRec = simulatedRouteDecision.recommendedRoute || candidateRoutes[0];
  const hasRouteShifted = baseRec.id !== simRec.id;

  const routeShift = {
    hasShifted: hasRouteShifted,
    fromRoute: baseRec,
    toRoute: simRec,
    riskBefore: `${baseRec.routeRiskScore}%`,
    riskAfter: `${simRec.routeRiskScore}%`,
    riskReductionPct: `${simulatedRouteDecision.riskReductionPct}%`,
    etaChange: simRec.etaDisplay,
    decisionReason: simulatedRouteDecision.decisionReason
  };

  // 5. Compute Network Accessibility & Impact Indicators
  const numBlockages = Number(scenarioInputs.activeIncidentCount ?? 2);
  const rainfallMm = Number(scenarioInputs.rainfall24h ?? 140);
  const landslideProb = Number(scenarioInputs.landslideProbability ?? 88);

  const blockedPct = Math.min(Math.round(numBlockages * 3.5 + (rainfallMm / 300) * 14), 45);
  const atRiskPct = Math.min(Math.round((landslideProb / 100) * 24 + (rainfallMm / 300) * 12), 38);
  const accessiblePct = Math.max(100 - blockedPct - atRiskPct, 17);

  const affectedVehicles = Math.round(numBlockages * 9 + (rainfallMm / 20) * 2);
  const delayedDeliveries = Math.round(affectedVehicles * 1.6);
  const affectedDistrictsList = ['Cachar (Silchar HQ)', 'Kolasib / Aizawl', 'Gangtok District', 'Pakyong'];

  // 6. Generate Dynamic AI-Assisted Preparedness Directives
  const preparedActions = [];

  if (scenarioInputs.landslideProbability >= 65 || scenarioInputs.terrainRisk >= 0.65) {
    preparedActions.push(
      `Pre-position emergency slope clearance machinery & 3 heavy excavators at Sonapur Tunnel / Melli slope portals.`
    );
  }

  if (scenarioInputs.floodProbability >= 65 || scenarioInputs.rainfall24h >= 150) {
    preparedActions.push(
      `Pre-position medical oxygen & critical pharmaceutical stocks in District Cachar (SMCH) & Kolasib HQ before weather landfall.`
    );
  }

  if (simulatedRouteDecision.recommendedRoute) {
    preparedActions.push(
      `Enforce priority AI reroute directive: Dispatch essential convoys via ${simulatedRouteDecision.recommendedRoute.name.split(':')[0]} (${simulatedRouteDecision.recommendedRoute.routeRiskScore}/100 risk score).`
    );
  }

  if (simulatedSupplyImpact.highestPrioritySupply) {
    preparedActions.push(
      `Authorize immediate priority resupply escort for ${simulatedSupplyImpact.highestPrioritySupply.supplyType} at ${simulatedSupplyImpact.highestPrioritySupply.facility} (${simulatedSupplyImpact.highestPrioritySupply.stockBufferDays} days stock remaining).`
    );
  }

  // 7. Build 5-Stage Impact Chain Sequence
  const fiveStageImpactChain = {
    disruption: `Weather Escalation (${scenarioInputs.rainfall24h}mm Rain, ${scenarioInputs.landslideProbability}% Landslide Prob)`,
    vehicles: `${affectedVehicles} Fleets & Convoys Affected Across ${numBlockages} Blocked Passes`,
    deliveries: `${delayedDeliveries} Essential Manifests Delayed (Max Delay: +${simulatedSupplyImpact.highestPrioritySupply?.expectedDelayHours || 3.5}h)`,
    districtImpact: `Cachar & Kolasib Districts Stock Buffer Depleting to ${simulatedSupplyImpact.highestPrioritySupply?.stockBufferDays || 1.8} Days`,
    recommendedAction: `Execute AI Resupply Directive via ${simRec.name ? simRec.name.split(':')[0] : 'Route B Bypass'}`
  };

  return {
    baselinePrediction,
    baselineRouteDecision,
    baselineSupplyImpact,

    simulatedPrediction,
    simulatedRouteDecision,
    simulatedSupplyImpact,

    riskTransition: {
      baseRiskScore,
      simRiskScore,
      riskDiff,
      transitionStatus,
      transitionStyle
    },

    routeShift,

    networkImpact: {
      accessiblePct,
      atRiskPct,
      blockedPct,
      affectedVehicles,
      delayedDeliveries,
      affectedDistrictsCount: affectedDistrictsList.length,
      affectedDistrictsList,
      totalCorridorsEvaluated: 5,
      highRiskCorridorsCount: 3
    },

    fiveStageImpactChain,
    preparedActions,
    source: simulatedPrediction.source || 'FASTAPI_ML',
    evaluatedAt: new Date().toISOString()
  };
}
