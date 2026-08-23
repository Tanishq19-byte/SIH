/**
 * AUDITED & CORRECTED AI-ASSISTED ROUTE DECISION ENGINE - NER-SmartRoute AI (SIH26002 - Step 13 Resilient)
 * Multi-Factor Weighted Scoring Model evaluating candidate logistics routes.
 * 
 * PROTOTYPE DATA DISCLAIMER:
 * -------------------------------------------------------------------------
 * Route exposure attributes and decision weights are provisional prototype scenario parameters
 * designed for architecture & decision policy validation. They do not represent machine-learned weights.
 */

export const PROTOTYPE_ROUTE_PROFILES = {
  'route-a': {
    terrainExposure: 0.95,
    floodExposure: 0.85,
    landslideExposure: 0.94,
    roadConditionScore: 3.8,
    accessibility: 22,
    exposureMultiplier: 1.15,
    label: 'Direct Highway Corridor (High Mountain Slope & Mudslide Exposure)'
  },
  'route-b': {
    terrainExposure: 0.45,
    floodExposure: 0.35,
    landslideExposure: 0.30,
    roadConditionScore: 7.5,
    accessibility: 88,
    exposureMultiplier: 0.45,
    label: 'Paved Ridge Bypass (Moderate Altitude & Controlled Exposure)'
  },
  'route-c': {
    terrainExposure: 0.20,
    floodExposure: 0.15,
    landslideExposure: 0.12,
    roadConditionScore: 9.0,
    accessibility: 96,
    exposureMultiplier: 0.25,
    label: 'Four-lane Valley Lifeline Trunk (Low Mountain Exposure)'
  }
};

export function getDynamicDecisionWeights(urgencyKey = 'NORMAL') {
  if (urgencyKey === 'CRITICAL') {
    return {
      RISK_WEIGHT: 0.55,          // 55% Disruption Risk for Critical Medical/Fuel Cargo
      ETA_WEIGHT: 0.20,           // 20% Travel Time
      DISTANCE_WEIGHT: 0.08,      // 8% Total Distance
      FUEL_WEIGHT: 0.08,          // 8% Transit Cost
      ACCESSIBILITY_WEIGHT: 0.09  // 9% Corridor Accessibility
    };
  } else if (urgencyKey === 'HIGH') {
    return {
      RISK_WEIGHT: 0.48,          // 48% Disruption Risk
      ETA_WEIGHT: 0.22,           // 22% Travel Time
      DISTANCE_WEIGHT: 0.10,      // 10% Total Distance
      FUEL_WEIGHT: 0.10,          // 10% Transit Cost
      ACCESSIBILITY_WEIGHT: 0.10  // 10% Corridor Accessibility
    };
  } else {
    return {
      RISK_WEIGHT: 0.40,          // 40% Baseline Disruption Risk
      ETA_WEIGHT: 0.25,           // 25% Travel Time
      DISTANCE_WEIGHT: 0.12,      // 12% Total Distance
      FUEL_WEIGHT: 0.11,          // 11% Transit Cost
      ACCESSIBILITY_WEIGHT: 0.12  // 12% Corridor Accessibility
    };
  }
}

export function evaluateRouteDecision(delivery = {}, candidateRoutes = [], aiPrediction = {}, scenarioParams = {}) {
  if (!candidateRoutes || candidateRoutes.length === 0) {
    return { error: 'No candidate routes provided for evaluation' };
  }

  const baseRiskScore = aiPrediction.riskScore ?? 50;
  const baseDisruptionProb = aiPrediction.disruptionProbability ?? 0.50;
  const source = aiPrediction.source || 'LOCAL_FALLBACK';

  const priorityStr = (delivery.priority || 'NORMAL').toUpperCase();
  const urgencyKey = priorityStr.includes('CRITICAL') ? 'CRITICAL' : priorityStr.includes('HIGH') ? 'HIGH' : 'NORMAL';

  const weights = getDynamicDecisionWeights(urgencyKey);

  // 1. Calculate Route-Specific Risk Adjustments and Closure Status
  const evaluatedRoutes = candidateRoutes.map((route) => {
    const key = route.id.toLowerCase().includes('route-c')
      ? 'route-c'
      : route.id.toLowerCase().includes('route-b')
      ? 'route-b'
      : 'route-a';

    const profile = PROTOTYPE_ROUTE_PROFILES[key];

    // Check if route is marked CLOSED or has severe blockage
    const isClosed = route.status === 'blocked' || route.status === 'closed' || route.isClosed || (baseRiskScore >= 85 && key === 'route-a');
    
    const routeRiskScore = isClosed ? 100 : Math.min(Math.max(Math.round(baseRiskScore * profile.exposureMultiplier), 1), 99);
    const routeDisruptionProb = isClosed ? 1.0 : Math.min(Math.max(Math.round(baseDisruptionProb * profile.exposureMultiplier * 100) / 100, 0.01), 0.99);

    let riskCategory = 'LOW';
    let statusStyle = 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]';

    if (isClosed) {
      riskCategory = 'CLOSED';
      statusStyle = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] font-bold';
    } else if (routeRiskScore >= 75) {
      riskCategory = 'CRITICAL';
      statusStyle = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
    } else if (routeRiskScore >= 50) {
      riskCategory = 'HIGH';
      statusStyle = 'bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]';
    } else if (routeRiskScore >= 25) {
      riskCategory = 'MEDIUM';
      statusStyle = 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
    }

    return {
      ...route,
      isClosed,
      routeRiskScore,
      routeDisruptionProb,
      riskCategory,
      statusStyle,
      profile,
      terrainTag: profile.label,
      exposureMultiplier: profile.exposureMultiplier
    };
  });

  // 2. Min-Max Normalization across candidate routes
  const openRoutes = evaluatedRoutes.filter(r => !r.isClosed);
  const pool = openRoutes.length > 0 ? openRoutes : evaluatedRoutes;

  const risks = pool.map((r) => r.routeRiskScore);
  const etas = pool.map((r) => r.etaHours || 10);
  const dists = pool.map((r) => r.distanceKm || 300);
  const fuels = pool.map((r) => r.totalCostINR || r.fuelCostINR || 10000);
  const accs = pool.map((r) => r.roadAccessibilityPct || 50);

  const minRisk = Math.min(...risks), maxRisk = Math.max(...risks);
  const minEta = Math.min(...etas), maxEta = Math.max(...etas);
  const minDist = Math.min(...dists), maxDist = Math.max(...dists);
  const minFuel = Math.min(...fuels), maxFuel = Math.max(...fuels);
  const minAcc = Math.min(...accs), maxAcc = Math.max(...accs);

  // 3. Compute Sub-scores & Weighted Overall Score for each candidate
  const scoredRoutes = evaluatedRoutes.map((r) => {
    if (r.isClosed) {
      return {
        ...r,
        subScores: { riskScoreNorm: 0, etaScoreNorm: 0, distScoreNorm: 0, fuelScoreNorm: 0, accScoreNorm: 0 },
        overallDecisionScore: 0
      };
    }

    const normRisk = maxRisk === minRisk ? 0.5 : (r.routeRiskScore - minRisk) / (maxRisk - minRisk);
    const normEta = maxEta === minEta ? 0.5 : (r.etaHours - minEta) / (maxEta - minEta);
    const normDist = maxDist === minDist ? 0.5 : (r.distanceKm - minDist) / (maxDist - minDist);
    const normFuel = maxFuel === minFuel ? 0.5 : ((r.totalCostINR || r.fuelCostINR) - minFuel) / (maxFuel - minFuel);
    const normAcc = maxAcc === minAcc ? 0.5 : (r.roadAccessibilityPct - minAcc) / (maxAcc - minAcc);

    const riskScoreNorm = Math.round((1 - normRisk) * 100);
    const etaScoreNorm = Math.round((1 - normEta) * 100);
    const distScoreNorm = Math.round((1 - normDist) * 100);
    const fuelScoreNorm = Math.round((1 - normFuel) * 100);
    const accScoreNorm = Math.round(normAcc * 100);

    const overallScore = Math.round(
      riskScoreNorm * weights.RISK_WEIGHT +
      etaScoreNorm * weights.ETA_WEIGHT +
      distScoreNorm * weights.DISTANCE_WEIGHT +
      fuelScoreNorm * weights.FUEL_WEIGHT +
      accScoreNorm * weights.ACCESSIBILITY_WEIGHT
    );

    return {
      ...r,
      subScores: { riskScoreNorm, etaScoreNorm, distScoreNorm, fuelScoreNorm, accScoreNorm },
      overallDecisionScore: overallScore
    };
  });

  // 4. Argmax Selection excluding closed routes
  const sortedRoutes = [...scoredRoutes].sort((a, b) => b.overallDecisionScore - a.overallDecisionScore);
  const recommendedRoute = sortedRoutes[0];
  const routeA = scoredRoutes.find((r) => r.id.toLowerCase().includes('route-a')) || candidateRoutes[0];

  const riskDiff = routeA.routeRiskScore - recommendedRoute.routeRiskScore;
  const riskReductionPct = Math.max(Math.round((riskDiff / (routeA.routeRiskScore || 1)) * 100), 0);
  const etaDiffMins = Math.round((recommendedRoute.etaHours - routeA.etaHours) * 60);

  let decisionReason = '';
  if (routeA.isClosed) {
    decisionReason = `Primary Route A is CLOSED due to severe mudslide blockage. ${recommendedRoute.name.split(':')[0]} is recommended as the operational bypass.`;
  } else if (recommendedRoute.id === routeA.id) {
    decisionReason = `${recommendedRoute.name.split(':')[0]} is recommended because it provides the shortest travel time (${recommendedRoute.etaDisplay}) with low disruption risk (${recommendedRoute.routeRiskScore}/100).`;
  } else {
    decisionReason = `${recommendedRoute.name.split(':')[0]} is recommended because it reduces predicted disruption risk by ${riskReductionPct}% (${recommendedRoute.routeRiskScore}/100 vs ${routeA.routeRiskScore}/100 on ${routeA.name.split(':')[0]}).`;
  }

  const whyRecommendedBullets = [
    `✓ Highest overall decision score (${recommendedRoute.overallDecisionScore}/100)`,
    `✓ Predicted disruption risk: ${recommendedRoute.routeRiskScore}/100 (${recommendedRoute.riskCategory})`,
    `✓ Corridor operational accessibility rate: ${recommendedRoute.roadAccessibilityPct}%`,
    routeA.isClosed
      ? `✓ Replaces CLOSED primary corridor (Route A Sonapur mudslide portal)`
      : `✓ Reduces predicted disruption risk by ${riskReductionPct}% compared with Direct Route A`,
    `✓ Optimized for ${urgencyKey} priority cargo manifest (${delivery.cargoDescription || 'Essential Logistics'})`
  ];

  return {
    recommendedRouteId: recommendedRoute.id,
    recommendedRoute,
    candidateRoutes: scoredRoutes,
    routeA,
    riskReductionPct,
    etaDiffMins,
    decisionReason,
    whyRecommendedBullets,
    decisionWeights: weights,
    source,
    urgencyKey,
    evaluatedAt: new Date().toISOString()
  };
}
