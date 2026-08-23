import { evaluateCorridorRisk, MODEL_METADATA } from './riskEngine.js';
import { sanitizePredictionInput } from '../utils/inputSanitizer.js';

// Uses Vercel Serverless API (relative URL — works in prod AND dev via Vite proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const EXPRESS_API_URL = `${API_BASE_URL}/api/v1/ai/predict-disruption`;
const EXPRESS_HEALTH_URL = `${API_BASE_URL}/api/v1/ai/health`;

/**
 * AI Prediction Service Abstraction Layer (Step 13 Resilient Architecture)
 * - Input Sanitization & Clamping
 * - 3s Timeout AbortController
 * - Graceful Local Fallback Engine
 * - Data Provenance Tagging (REAL_TIME | SIMULATED | DERIVED)
 */
export async function predictDisruption(params = {}) {
  const payload = sanitizePredictionInput(params);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout limit

    const response = await fetch(EXPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data && json.data.prediction) {
        const pred = json.data.prediction;
        return {
          source: 'FASTAPI_ML',
          statusMessage: 'AI MODEL • FASTAPI (v1.2)',
          statusStyle: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4] font-bold',
          routeId: pred.routeId || payload.routeId,
          disruptionProbability: pred.disruptionProbability,
          riskScore: pred.riskScore,
          riskCategory: pred.riskLevel || pred.riskCategory,
          confidenceLevel: pred.confidenceLevel || 'VERY_HIGH',
          confidence: pred.confidence || 87,
          predictionLabel: pred.predictionLabel || pred.prediction,
          recommendation: pred.recommendation,
          explanation: pred.explanation || json.data.explanation?.narrative,
          dataProvenance: pred.dataProvenance || (payload.scenario ? 'SIMULATED' : 'DERIVED'),
          topFactors: json.data.explanation?.topFactors || [],
          riskFactors: json.data.explanation?.riskFactors || {},
          modelName: json.data.model?.name || 'Random Forest Classifier',
          modelVersion: json.data.model?.version || 'v1.2.0',
          rawPayload: payload
        };
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[AI Service Timeout] Request exceeded 3s timeout limit. Activating local fallback engine.');
    } else {
      console.warn('[AI Service Failure] API request failed. Activating local fallback engine:', err.message);
    }
  }

  // GRACEFUL LOCAL FALLBACK VIA riskEngine.js
  const fallback = evaluateCorridorRisk(params);
  return {
    source: 'LOCAL_FALLBACK',
    statusMessage: 'AI SERVICE OFFLINE • LOCAL FALLBACK ACTIVE',
    statusStyle: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] font-bold',
    routeId: payload.routeId,
    disruptionProbability: Math.min(Math.round(fallback.riskScore * 0.96) / 100, 0.99),
    riskScore: fallback.riskScore,
    riskCategory: fallback.category,
    confidenceLevel: 'LOCAL_PROTOTYPE',
    confidence: 78,
    predictionLabel: fallback.riskScore >= 50 ? 'LIKELY_DISRUPTION' : 'NO_MAJOR_DISRUPTION',
    recommendation: fallback.riskScore >= 75 ? 'REROUTE_IMMEDIATELY' : fallback.riskScore >= 55 ? 'USE_ALTERNATIVE_ROUTE' : 'SAFE_TO_PROCEED',
    explanation: fallback.recommendation,
    dataProvenance: 'DERIVED',
    topFactors: fallback.contributingFactors.slice(0, 3).map(f => ({
      factor: f.name,
      value: f.points,
      weightPct: 20,
      points: f.points,
      impact: f.points > 20 ? 'HIGH' : 'MEDIUM'
    })),
    riskFactors: {
      rainfall: Math.round(fallback.riskScore * 0.35),
      terrain: Math.round(fallback.riskScore * 0.25),
      historicalDisruption: Math.round(fallback.riskScore * 0.20),
      roadCondition: Math.round(fallback.riskScore * 0.15)
    },
    modelName: MODEL_METADATA.name,
    modelVersion: MODEL_METADATA.version,
    recommendedBypass: fallback.recommendedBypass,
    rawPayload: payload
  };
}

export async function retryAIPrediction(params = {}) {
  return await predictDisruption(params);
}

export async function checkAIHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(EXPRESS_HEALTH_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      return json.success ? json.data : { aiService: 'unavailable' };
    }
  } catch (e) {
    // return unavailable
  }
  return { aiService: 'unavailable' };
}
