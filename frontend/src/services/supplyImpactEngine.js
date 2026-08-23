/**
 * SUPPLY IMPACT ENGINE - NER-SmartRoute AI (SIH26002)
 * Connects upstream Route Decision Engine outputs to essential supply inventory & district stockout risks.
 * 
 * PROTOTYPE DATA DISCLAIMER:
 * -------------------------------------------------------------------------
 * Stockout indicators and supply priorities are prototype decision-support calculations 
 * using simulated scenario data. They are not real-world inventory forecasts.
 */

import { supplyData } from '../data/ai/supplyData.js';
import { MOCK_SUPPLIES } from '../data/mockSupplies.js';

// Urgency weighting map for priority scoring
const SUPPLY_URGENCY_MAP = {
  Critical: 1.5,
  High: 1.2,
  Medium: 1.0,
  Normal: 0.8
};

/**
 * Main Supply Impact Engine Calculation
 * @param {Object} routeDecision Output from routeDecisionEngine.evaluateRouteDecision()
 * @param {Object} selectedDelivery Selected delivery manifest
 * @param {Object} scenarioInputs Environmental scenario inputs
 */
export function evaluateSupplyImpact(routeDecision = {}, selectedDelivery = {}, scenarioInputs = {}) {
  const recommendedRoute = routeDecision.recommendedRoute || { routeRiskScore: 50, etaHours: 7.5, etaDisplay: '7h 30m', roadAccessibilityPct: 88 };
  const routeA = routeDecision.routeA || { routeRiskScore: 80, etaHours: 19.5 };
  const source = routeDecision.source || 'LOCAL_FALLBACK';

  const routeRiskScore = recommendedRoute.routeRiskScore ?? 50;
  const routeDisruptionProb = recommendedRoute.routeDisruptionProb ?? 0.50;

  // Calculate actual ETA delay compared to optimal corridor baseline
  const delayHours = Math.max(Math.round((recommendedRoute.etaHours - (routeA.etaHours < recommendedRoute.etaHours ? routeA.etaHours : 4.0)) * 10) / 10, 0.5);

  // 1. Process Supply Inventory Items & Calculate Stockout Risk + Priority Score
  const processedSupplies = supplyData.map((item) => {
    // Calculate stock buffer in days (currentStock / dailyDemand)
    const stockBufferDays = item.currentStockDays;
    const urgencyVal = SUPPLY_URGENCY_MAP[item.priority] || 1.0;

    // Prototype Stockout-Risk Impact Index:
    // impactIndex = (delayHours / (stockBufferDays + 0.1)) * (routeRiskScore / 50) * urgencyVal
    const impactIndex = (delayHours / (stockBufferDays + 0.1)) * (routeRiskScore / 50) * urgencyVal;

    // Stockout Risk Category Classification
    let stockoutRisk = 'SAFE';
    let riskBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

    if (impactIndex >= 2.0 || (stockBufferDays <= 2.0 && routeRiskScore >= 50)) {
      stockoutRisk = 'CRITICAL';
      riskBadgeStyle = 'bg-rose-600 text-white border-rose-400 shadow-glow-rose font-extrabold animate-pulse';
    } else if (impactIndex >= 1.0 || stockBufferDays <= 4.0) {
      stockoutRisk = 'HIGH';
      riskBadgeStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';
    } else if (impactIndex >= 0.5 || stockBufferDays <= 7.0) {
      stockoutRisk = 'WATCH';
      riskBadgeStyle = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }

    // Dynamic Explainable Priority Score (Higher score = higher replenishment priority)
    const priorityScore = Math.round(
      (100 / Math.max(stockBufferDays, 0.5)) * 0.40 +
      (routeRiskScore * 0.30) +
      (delayHours * 5 * 0.15) +
      (urgencyVal * 15 * 0.15)
    );

    return {
      ...item,
      stockBufferDays,
      expectedDelayHours: delayHours,
      impactIndex: Math.round(impactIndex * 100) / 100,
      stockoutRisk,
      riskBadgeStyle,
      priorityScore
    };
  });

  // Sort supplies dynamically by Priority Score descending
  processedSupplies.sort((a, b) => b.priorityScore - a.priorityScore);

  const highestPrioritySupply = processedSupplies[0];

  // Determine overall supply shortage risk category
  const criticalCount = processedSupplies.filter((s) => s.stockoutRisk === 'CRITICAL').length;
  const highCount = processedSupplies.filter((s) => s.stockoutRisk === 'HIGH').length;
  const overallSupplyRisk = criticalCount > 0 ? 'CRITICAL' : highCount > 0 ? 'HIGH' : 'MEDIUM';

  // 2. Build 5-Stage Visual Impact Chain Data Structure
  const fiveStageImpactChain = {
    disruption: `Corridor ${recommendedRoute.name ? recommendedRoute.name.split(':')[0] : 'NH-27'} Disruption Risk: ${routeRiskScore}/100`,
    vehicles: `${routeRiskScore > 70 ? 5 : routeRiskScore > 40 ? 3 : 1} Convoys En Route`,
    deliveries: `${processedSupplies.length} Essential Supply Streams (${delayHours}h Max Delay)`,
    districtImpact: `${highestPrioritySupply.district} Buffer Depleting to ${highestPrioritySupply.stockBufferDays} Days`,
    recommendedAction: `Prioritize resupply convoy for ${highestPrioritySupply.supplyType} at ${highestPrioritySupply.facility}`
  };

  // 3. Explainability Rationale for Highest Priority Supply
  const whyPrioritizedBullets = [
    `✓ Cargo Urgency: ${highestPrioritySupply.priority} (${highestPrioritySupply.supplyType})`,
    `✓ Stock Buffer: Only ${highestPrioritySupply.stockBufferDays} days of inventory remaining at ${highestPrioritySupply.facility}`,
    `✓ Route Disruption Risk: ${routeRiskScore}/100 score on assigned corridor (${recommendedRoute.name ? recommendedRoute.name.split(':')[0] : 'NH-27'})`,
    `✓ Delivery Delay Exposure: +${delayHours} hours estimated transit delay`,
    `✓ Shortage Threshold: Below critical ${highestPrioritySupply.shortageThresholdDays}-day buffer limit`
  ];

  const dynamicAdvisoryText = `Prioritize supply stream ${highestPrioritySupply.id} (${highestPrioritySupply.supplyType}) for ${highestPrioritySupply.facility}. Current inventory buffer is ${highestPrioritySupply.stockBufferDays} days with an expected transit delay of +${delayHours} hours due to ${routeRiskScore}/100 corridor risk.`;

  return {
    affectedVehiclesCount: routeRiskScore > 70 ? 5 : routeRiskScore > 40 ? 3 : 1,
    delayedDeliveriesCount: processedSupplies.length,
    affectedDistrictsCount: new Set(processedSupplies.map((s) => s.district)).size,
    highestPrioritySupply,
    rankedSupplies: processedSupplies,
    fiveStageImpactChain,
    whyPrioritizedBullets,
    dynamicAdvisoryText,
    overallSupplyRisk,
    source,
    evaluatedAt: new Date().toISOString()
  };
}
