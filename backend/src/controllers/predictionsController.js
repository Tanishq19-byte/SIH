import { successResponse } from '../utils/responseFormatter.js';

let predictionsData = [
  {
    corridorId: 'R-NH27-SILCHAR',
    corridorName: 'NH-27 Sonapur Tunnel Corridor',
    riskScore: 87,
    category: 'HIGH',
    disruptionProbability: 88.5,
    contributingFactors: [
      { factor: 'Heavy rainfall intensity (220mm/24h)', points: 31 },
      { factor: 'Terrain vulnerability (Slope 42°)', points: 22 },
      { factor: 'Historical disruption frequency', points: 18 },
      { factor: 'Recent field incident report', points: 16 }
    ],
    recommendation: 'Avoid this corridor for the next 4 hours. Route B via Lumding-Haflong is recommended.',
    evaluatedAt: new Date().toISOString()
  }
];

export const getAllPredictions = async (req, res, next) => {
  try {
    return successResponse(res, predictionsData, 'Fetched AI route disruption predictions');
  } catch (err) {
    next(err);
  }
};

export const evaluateCorridor = async (req, res, next) => {
  try {
    const { rainfallMm = 180, terrainVulnerability = 8, historicalFrequency = 7 } = req.body;

    const riskScore = Math.min(Math.round(rainfallMm * 0.25 + terrainVulnerability * 4.5 + historicalFrequency * 3.0), 98);
    const category = riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : 'MEDIUM';

    const evaluation = {
      corridorId: req.body.corridorId || 'R-CUSTOM-EVAL',
      riskScore,
      category,
      disruptionProbability: Math.min(riskScore * 0.95, 99.0),
      contributingFactors: [
        { factor: `Rainfall input (${rainfallMm}mm)`, points: Math.round(rainfallMm * 0.25) },
        { factor: `Terrain index (${terrainVulnerability}/10)`, points: Math.round(terrainVulnerability * 4.5) },
        { factor: `Historical frequency (${historicalFrequency})`, points: Math.round(historicalFrequency * 3.0) }
      ],
      recommendation: riskScore >= 75 ? 'Enforce immediate detour via Corridor B.' : 'Maintain normal monitoring.',
      evaluatedAt: new Date().toISOString()
    };

    return successResponse(res, evaluation, 'Evaluated corridor risk score via Prototype Risk Engine');
  } catch (err) {
    next(err);
  }
};
