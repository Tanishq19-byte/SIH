/**
 * PROTOTYPE RISK MODEL - NER-SmartRoute AI (SIH26002)
 * 
 * NOTE: This is a transparent, explainable prototype weighted risk engine.
 * The architecture is decoupled so this model can later be replaced with
 * a trained Machine Learning service (e.g., Python/FastAPI GNN model).
 */

import { weatherData, corridorData, historicalDisruptions, trainingData, supplyData } from '../data/ai/index.js';

// Re-export structured AI datasets for consumption
export { weatherData, corridorData, historicalDisruptions, trainingData, supplyData };

export const MODEL_METADATA = {
  name: 'Prototype Risk Model',
  version: '1.2.0-prototype',
  type: 'Weighted Factor Multi-Attribute Decision Model',
  lastCalibrated: '2026-08-20',
  disclaimer: 'Prototype weighted engine for demonstration. Prepared for Python FastAPI ML service integration.',
  trainingDataStats: {
    totalRecords: trainingData.length,
    featuresCount: 12,
    targetVariable: 'actualDisruption (0 or 1)'
  }
};

/**
 * Calculates risk score, category, disruption probability, contributing factors breakdown,
 * and explainable AI recommendation for a corridor.
 */
export function evaluateCorridorRisk(params = {}) {
  const {
    rainfallMm = 140, // 0 - 300 mm/24h
    weatherSeverity = 'heavy', // normal, moderate, heavy, cloudburst
    terrainVulnerability = 'steep_gorge', // flat, hilly, steep_gorge, tectonic_fault
    historicalFrequency = 14, // 0 - 30 events/month
    recentIncidentsCount = 2, // 0 - 10 recent field reports
    roadCondition = 'subsidence', // excellent, minor_scour, subsidence, severely_damaged
    trafficCongestion = 'moderate' // low, moderate, heavy
  } = params;

  // Factor 1: Rainfall Intensity & Weather Severity (+0 to +35 pts)
  const rainfallPts = Math.min(Math.round((rainfallMm / 300) * 25), 25);
  const weatherMult = { normal: 0, moderate: 4, heavy: 7, cloudburst: 10 }[weatherSeverity] || 5;
  const rainfallTotal = Math.min(rainfallPts + weatherMult, 35);

  // Factor 2: Terrain Vulnerability (+5 to +25 pts)
  const terrainPts = {
    flat: 5,
    hilly: 14,
    steep_gorge: 22,
    tectonic_fault: 25
  }[terrainVulnerability] || 15;

  // Factor 3: Historical Disruption Frequency (+0 to +20 pts)
  const historyPts = Math.min(Math.round((historicalFrequency / 25) * 20), 20);

  // Factor 4: Recent Field Incidents (+0 to +20 pts)
  const incidentsPts = Math.min(recentIncidentsCount * 8, 20);

  // Factor 5: Road Structural Condition (+0 to +15 pts)
  const roadPts = {
    excellent: 0,
    minor_scour: 5,
    subsidence: 11,
    severely_damaged: 15
  }[roadCondition] || 5;

  // Factor 6: Traffic Congestion (+0 to +10 pts)
  const trafficPts = {
    low: 2,
    moderate: 6,
    heavy: 10
  }[trafficCongestion] || 4;

  // Total Raw Risk Score (Capped at 100)
  const rawScore = rainfallTotal + terrainPts + historyPts + incidentsPts + roadPts + trafficPts;
  const riskScore = Math.min(Math.max(rawScore, 5), 99);

  // Risk Category
  let category = 'LOW';
  let categoryStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (riskScore >= 85) {
    category = 'CRITICAL';
    categoryStyle = 'bg-rose-600 text-white border-rose-400 shadow-glow-rose animate-pulse';
  } else if (riskScore >= 70) {
    category = 'HIGH';
    categoryStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  } else if (riskScore >= 40) {
    category = 'MEDIUM';
    categoryStyle = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  }

  // Estimated Disruption Probability %
  const disruptionProbability = Math.min(Math.round(riskScore * 0.96), 98);

  // Contributing Factors Breakdown Array
  const contributingFactors = [
    { name: 'Rainfall & Downpour Severity', points: rainfallTotal, max: 35, percentage: Math.round((rainfallTotal / 35) * 100) },
    { name: 'Terrain Vulnerability', points: terrainPts, max: 25, percentage: Math.round((terrainPts / 25) * 100) },
    { name: 'Historical Incidents Frequency', points: historyPts, max: 20, percentage: Math.round((historyPts / 20) * 100) },
    { name: 'Recent Field Incident Reports', points: incidentsPts, max: 20, percentage: Math.round((incidentsPts / 20) * 100) },
    { name: 'Road Structural Condition', points: roadPts, max: 15, percentage: Math.round((roadPts / 15) * 100) },
    { name: 'Traffic & Corridor Congestion', points: trafficPts, max: 10, percentage: Math.round((trafficPts / 10) * 100) }
  ].sort((a, b) => b.points - a.points);

  // AI Explainable Narrative Recommendation
  let recommendation = 'Corridor is operational. Maintain standard highway patrol and telemetry monitoring.';
  let hoursWindow = 'Safe Next 24 Hours';
  let recommendedBypass = 'Direct Highway Route Operational';

  if (category === 'CRITICAL') {
    recommendation = `CRITICAL RISK: Avoid this corridor for the next 6-12 hours due to severe landslide & structural collapse probability. Authorize immediate AI bypass detour for essential medical & fuel convoys.`;
    hoursWindow = 'Immediate Action Required (0-4 Hours)';
    recommendedBypass = 'Haflong - Jatinga Valley Detour / Alternate Rail Transit';
  } else if (category === 'HIGH') {
    recommendation = `HIGH RISK: High slope instability and river flooding risk. Restrict heavy multi-axle freight trucks between 18:00 and 06:00. Route high-priority medical trucks via bypass.`;
    hoursWindow = 'Avoid Next 4-8 Hours';
    recommendedBypass = 'Gorubathan - Lava Corridor Bypass';
  } else if (category === 'MEDIUM') {
    recommendation = `MODERATE RISK: Minor waterlogging and soil slumping reported. Proceed with caution at 30 km/h speed limit. Pre-position heavy clearance machinery.`;
    hoursWindow = 'Monitor Next 12 Hours';
    recommendedBypass = 'Direct Corridor with Speed Cap';
  }

  return {
    riskScore,
    category,
    categoryStyle,
    disruptionProbability,
    contributingFactors,
    recommendation,
    hoursWindow,
    recommendedBypass,
    evaluatedAt: new Date().toISOString()
  };
}
