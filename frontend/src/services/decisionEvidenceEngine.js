/**
 * DECISION EVIDENCE & ACCOUNTABILITY ENGINE - NER-SmartRoute AI (SIH26002)
 * Consumes upstream pipeline outputs (aiPredictionService, routeDecisionEngine, supplyImpactEngine)
 * and generates structured evidence, route trade-off comparisons, sensitivity explanations,
 * 7-stage visual decision timelines, and audited decision records for human command officers.
 * 
 * PROTOTYPE DATA DISCLAIMER:
 * -------------------------------------------------------------------------
 * Decision evidence metrics and sensitivity explanations are prototype decision-support
 * calculations generated from simulated scenario data. They require human operational validation.
 */

/**
 * Generates structured route trade-off matrix from routeDecision.candidateRoutes
 */
export function generateRouteTradeoffMatrix(routeDecision = {}) {
  const candidateRoutes = routeDecision.candidateRoutes || [];
  const recommendedId = routeDecision.recommendedRouteId || (routeDecision.recommendedRoute?.id);

  return candidateRoutes.map((rt) => {
    const isRecommended = rt.id === recommendedId;
    const isDirect = rt.id.toLowerCase().includes('route-a');

    let role = isRecommended
      ? 'AI RECOMMENDED ROUTE'
      : isDirect
      ? 'CURRENT / DIRECT ROUTE'
      : 'ALTERNATIVE BYPASS ROUTE';

    let statusStyle = isRecommended
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold shadow-glow-cyan'
      : isDirect
      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';

    return {
      id: rt.id,
      role,
      name: rt.name,
      riskScore: rt.routeRiskScore ?? 50,
      riskCategory: rt.riskCategory || 'MEDIUM',
      eta: rt.etaDisplay || `${rt.etaHours || 7}h 00m`,
      etaHours: rt.etaHours || 7,
      accessibility: `${rt.roadAccessibilityPct ?? 50}%`,
      accessibilityPct: rt.roadAccessibilityPct ?? 50,
      distance: `${rt.distanceKm || 350} km`,
      distanceKm: rt.distanceKm || 350,
      fuelCost: `₹${(rt.totalCostINR || rt.fuelCostINR || 12000).toLocaleString('en-IN')}`,
      totalCostINR: rt.totalCostINR || rt.fuelCostINR || 12000,
      overallDecisionScore: rt.overallDecisionScore ?? 75,
      isRecommended,
      isDirect,
      statusStyle
    };
  });
}

/**
 * Generates prototype decision-policy sensitivity analysis rules based on runtime values
 */
export function generateSensitivityAnalysis(aiPrediction = {}, routeDecision = {}, supplyImpact = {}, rawInputs = {}) {
  const recRoute = routeDecision.recommendedRoute || {};
  const routeA = routeDecision.routeA || {};
  const topSupply = supplyImpact.highestPrioritySupply || {};
  const urgencyKey = routeDecision.urgencyKey || 'NORMAL';
  const landslideProb = rawInputs.landslideProbability ?? 88;
  const floodProb = rawInputs.floodProbability ?? 72;
  const recRisk = recRoute.routeRiskScore ?? 39;

  const rules = [
    `• Recommended corridor (${recRoute.name ? recRoute.name.split(':')[0] : 'Route B'}) current risk is ${recRisk}/100. If corridor disruption risk increases substantially above 65/100, an alternate low-exposure corridor will be re-evaluated.`,
    `• Cargo urgency is evaluated as ${urgencyKey} (${topSupply.supplyType || 'Essential Supplies'} for ${topSupply.facility || 'Regional Hospital'}). If cargo priority escalates to CRITICAL, disruption risk penalty weight increases to 55%.`,
    `• Current recommended corridor accessibility is ${recRoute.roadAccessibilityPct ?? 88}%. If accessibility falls below 60%, alternate routes become preferable regardless of travel distance.`,
    `• Recommended route ETA is ${recRoute.etaDisplay || '7h 30m'} vs Direct Route ${routeA.etaDisplay || '7h 00m'} (+${routeDecision.etaDiffMins ?? 30} mins). If ETA delay exceeds 120 mins, the shorter direct route may regain priority if risk drops.`,
    `• Environmental saturation: Landslide probability at ${landslideProb}%, Flood probability at ${floodProb}%. If landslide probability drops below 40%, direct highway access will be re-selected.`
  ];

  return rules;
}

/**
 * Main unified decision evidence generator
 */
export function generateDecisionEvidence(aiPrediction = {}, routeDecision = {}, supplyImpact = {}, rawInputs = {}) {
  const predictedRisk = aiPrediction.riskScore ?? 87;
  const disruptionProbability = aiPrediction.disruptionProbability ?? 0.87;
  const riskCategory = aiPrediction.riskCategory || 'CRITICAL';
  const confidenceLevel = aiPrediction.confidenceLevel || 'VERY_HIGH';
  const source = aiPrediction.source || 'LOCAL_FALLBACK';
  const modelVersion = aiPrediction.modelVersion || 'prototype-v1.1';
  const modelName = aiPrediction.modelName || 'Random Forest Classifier';

  const recommendedRoute = routeDecision.recommendedRoute || { id: 'route-b', name: 'Route B: Bypass', routeRiskScore: 39, etaDisplay: '7h 30m', roadAccessibilityPct: 88, distanceKm: 410, totalCostINR: 13000 };
  const routeA = routeDecision.routeA || { id: 'route-a', name: 'Route A: Direct', routeRiskScore: 100, etaDisplay: '7h 00m', roadAccessibilityPct: 30, distanceKm: 340, totalCostINR: 11000 };

  const topSupply = supplyImpact.highestPrioritySupply || { supplyType: 'Cryogenic Liquid Medical Oxygen', facility: 'Silchar Medical College', stockBufferDays: 1.8, expectedDelayHours: 0.5, stockoutRisk: 'CRITICAL', priority: 'Critical' };

  // 1. Environmental Evidence
  const environmentalEvidence = [
    { label: 'Rainfall 24h', value: `${rawInputs.rainfall24h ?? 140} mm` },
    { label: 'Rainfall Forecast', value: `${rawInputs.rainfallForecast ?? 154} mm` },
    { label: 'Terrain Risk', value: `${rawInputs.terrainRisk ?? 0.85}` },
    { label: 'Road Condition Score', value: `${rawInputs.roadConditionScore ?? 3.8} / 10.0` },
    { label: 'Flood Probability', value: `${rawInputs.floodProbability ?? 72}%` },
    { label: 'Landslide Probability', value: `${rawInputs.landslideProbability ?? 88}%` },
    { label: 'River Level Saturation', value: `${rawInputs.riverLevelPercent ?? 89}%` },
    { label: 'Active Field Incidents', value: `${rawInputs.activeIncidentCount ?? 3} Reports` },
    { label: 'Traffic Score', value: `${rawInputs.trafficScore ?? 5.5} / 10.0` }
  ];

  // 2. AI Evidence
  const aiEvidence = {
    disruptionProbabilityPct: Math.round(disruptionProbability * 100),
    riskScore: predictedRisk,
    riskCategory,
    confidenceLevel,
    source,
    modelVersion,
    modelName
  };

  // 3. Supply Evidence
  const supplyEvidence = {
    highestPrioritySupply: topSupply.supplyType || 'Medical Supplies',
    facility: topSupply.facility || 'District Hospital',
    stockBufferDays: topSupply.stockBufferDays ?? 1.8,
    stockoutRisk: topSupply.stockoutRisk || 'CRITICAL',
    expectedDelayHours: topSupply.expectedDelayHours ?? 0.5,
    urgency: topSupply.priority || 'Critical'
  };

  // 4. Route Evidence & Tradeoffs Matrix
  const routeTradeoffs = generateRouteTradeoffMatrix(routeDecision);

  const riskReductionPct = routeDecision.riskReductionPct ?? 61;
  const etaDiffMins = routeDecision.etaDiffMins ?? 30;

  let tradeOffExplanation = '';
  if (recommendedRoute.id === routeA.id) {
    tradeOffExplanation = `${recommendedRoute.name} is recommended as the optimal path because it maintains the shortest travel duration (${recommendedRoute.etaDisplay}) with a low corridor risk score of ${recommendedRoute.routeRiskScore}/100.`;
  } else if (etaDiffMins > 0) {
    tradeOffExplanation = `${recommendedRoute.name} reduces predicted disruption risk by ${riskReductionPct}% compared with ${routeA.name} (${recommendedRoute.routeRiskScore}/100 vs ${routeA.routeRiskScore}/100), while adding ${etaDiffMins} minutes of travel time.`;
  } else {
    tradeOffExplanation = `${recommendedRoute.name} provides a superior overall decision score because it reduces predicted risk by ${riskReductionPct}% while saving ${Math.abs(etaDiffMins)} minutes of transit time compared with ${routeA.name}.`;
  }

  // 5. Sensitivity Analysis
  const decisionSensitivity = generateSensitivityAnalysis(aiPrediction, routeDecision, supplyImpact, rawInputs);

  // 6. 7-Stage Visual Decision Timeline Data
  const decisionTimeline = [
    { stage: 1, title: 'ENVIRONMENT', label: 'Rainfall / Saturation', value: `${rawInputs.rainfall24h ?? 140}mm Rain, ${rawInputs.landslideProbability ?? 88}% Landslide` },
    { stage: 2, title: 'ROAD CONDITION', label: 'Surface Status', value: `Score: ${rawInputs.roadConditionScore ?? 3.8}/10 (${rawInputs.activeIncidentCount ?? 3} Incidents)` },
    { stage: 3, title: 'AI DISRUPTION RISK', label: 'FastAPI / Local Model', value: `Risk: ${predictedRisk}/100 (${riskCategory})` },
    { stage: 4, title: 'CORRIDOR IMPACT', label: 'Convoys En Route', value: `${supplyImpact.affectedVehiclesCount || 3} Fleets / ${supplyImpact.delayedDeliveriesCount || 5} Streams` },
    { stage: 5, title: 'ROUTE EVALUATION', label: 'Argmax Decision', value: `Rec: ${recommendedRoute.name?.split(':')[0] || 'Route B'} (${recommendedRoute.routeRiskScore}/100)` },
    { stage: 6, title: 'SUPPLY IMPACT', label: 'Stock Buffer', value: `${topSupply.supplyType} (${topSupply.stockBufferDays}d Buffer)` },
    { stage: 7, title: 'COMMAND ACTION', label: 'Human Authorization', value: 'Pending Officer Review' }
  ];

  return {
    predictedRisk,
    disruptionProbability,
    riskCategory,
    confidenceLevel,
    source,
    modelVersion,
    environmentalEvidence,
    aiEvidence,
    supplyEvidence,
    routeTradeoffs,
    tradeOffExplanation,
    decisionSensitivity,
    decisionTimeline,
    topSupply,
    recommendedRoute,
    routeA,
    routeDecision,
    supplyImpact,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * Creates a structured, audited Decision Record upon Command Officer Action
 */
export function createDecisionRecord(
  officerAction = 'APPROVED',
  entity = {},
  evidence = {},
  officerName = 'COMMAND OFFICER',
  rejectionReason = ''
) {
  const isApproved = officerAction === 'APPROVED' || officerAction === 'APPROVE_REROUTE';
  const recRoute = evidence.recommendedRoute || {};
  const prevRoute = evidence.routeA || {};
  const topSupply = evidence.topSupply || {};

  const decisionId = `DEC-${Math.floor(10000 + Math.random() * 90000)}`;
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';

  const riskBefore = prevRoute.routeRiskScore ?? 100;
  const riskAfter = recRoute.routeRiskScore ?? 39;
  const riskReductionPct = evidence.routeDecision?.riskReductionPct ?? Math.max(Math.round(((riskBefore - riskAfter) / Math.max(riskBefore, 1)) * 100), 0);

  const etaBefore = prevRoute.etaDisplay || '7h 00m';
  const etaAfter = recRoute.etaDisplay || '7h 30m';
  const etaChange = `${etaAfter} vs ${etaBefore}`;

  const decisionReason = isApproved
    ? `Command officer approved AI recommendation: reroute via ${recRoute.name?.split(':')[0] || 'Route B'} to reduce disruption risk by ${riskReductionPct}%.`
    : `Command officer rejected AI recommendation based on tactical field review.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`;

  return {
    decisionId,
    timestamp,
    aiSource: evidence.source || 'FASTAPI_ML',
    modelVersion: evidence.modelVersion || 'prototype-v1.1',
    predictedRisk: evidence.predictedRisk || 87,
    riskCategory: evidence.riskCategory || 'CRITICAL',
    confidenceLevel: evidence.confidenceLevel || 'VERY_HIGH',
    recommendedRoute: recRoute.name || 'Route B: Bypass',
    previousRoute: prevRoute.name || 'Route A: Direct',
    riskBefore,
    riskAfter,
    riskReductionPct,
    etaBefore,
    etaAfter,
    etaChange,
    criticalSupplyAffected: topSupply.supplyType || 'Cryogenic Medical Oxygen',
    stockBuffer: topSupply.stockBufferDays ?? 1.8,
    stockoutRisk: topSupply.stockoutRisk || 'CRITICAL',
    decisionReason,
    rejectionReason: !isApproved ? (rejectionReason || 'Tactical officer override') : null,
    officerName,
    officerAction: isApproved ? 'AUTHORIZED_REROUTE' : 'REJECTED_RECOMMENDATION',
    status: isApproved ? 'APPROVED' : 'REJECTED',
    entity: entity.regNumber || entity.name || entity.id || 'Convoy V-NER-8891'
  };
}
