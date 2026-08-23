/**
 * INPUT SANITIZER & NORMALIZER — NER-SmartRoute AI (Step 13)
 * Sanitizes extreme numerical inputs, neutralizes NaN / Infinity, 
 * and enforces safe boundary clamping across prediction payloads.
 */

export function sanitizeNumber(value, fallback = 0.0, min = 0.0, max = 1000.0) {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

export function sanitizeString(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.trim() || fallback;
}

export function sanitizePredictionInput(params = {}) {
  const rainfall24h = sanitizeNumber(
    params.rainfall24h ?? params.rainfallMm,
    140.0,
    0.0,
    500.0
  );

  const rainfallForecast = sanitizeNumber(
    params.rainfallForecast,
    Math.min(Math.round(rainfall24h * 1.1 * 10) / 10, 500.0),
    0.0,
    500.0
  );

  const terrainRisk = sanitizeNumber(params.terrainRisk, 0.85, 0.0, 1.0);
  const roadConditionScore = sanitizeNumber(params.roadConditionScore, 3.8, 0.0, 10.0);
  const historicalDisruptionCount = Math.round(
    sanitizeNumber(params.historicalDisruptionCount ?? params.historicalFrequency, 14, 0, 100)
  );
  const floodProbability = sanitizeNumber(params.floodProbability, 72.0, 0.0, 100.0);
  const landslideProbability = sanitizeNumber(params.landslideProbability, 88.0, 0.0, 100.0);
  const trafficScore = sanitizeNumber(params.trafficScore, 6.5, 0.0, 10.0);
  const riverLevelPercent = sanitizeNumber(params.riverLevelPercent, 89.0, 0.0, 100.0);
  const activeIncidentCount = Math.round(
    sanitizeNumber(params.activeIncidentCount ?? params.recentIncidentsCount, 3, 0, 50)
  );
  const vehicleCount = Math.round(sanitizeNumber(params.vehicleCount, 38, 0, 500));
  const supplyUrgency = sanitizeNumber(params.supplyUrgency, 9.2, 0.0, 10.0);

  const routeId = sanitizeString(params.routeId, 'NH-27');
  const origin = sanitizeString(params.origin, 'Guwahati Logistics Hub');
  const destination = sanitizeString(params.destination, 'Silchar SMCH Hospital');
  const distanceKm = sanitizeNumber(params.distanceKm, 340.0, 1.0, 3000.0);
  const elevation = sanitizeNumber(params.elevation, 1200.0, 0.0, 6000.0);
  const shipmentPriority = ['Critical', 'High', 'Normal', 'Low'].includes(params.shipmentPriority)
    ? params.shipmentPriority
    : 'Critical';
  const scenario = sanitizeString(params.scenario, null);

  return {
    routeId,
    origin,
    destination,
    distanceKm,
    elevation,
    rainfall24h,
    rainfallForecast,
    terrainRisk,
    roadConditionScore,
    historicalDisruptionCount,
    floodProbability,
    landslideProbability,
    trafficScore,
    riverLevelPercent,
    activeIncidentCount,
    vehicleCount,
    supplyUrgency,
    shipmentPriority,
    scenario
  };
}
