export const MOCK_PREDICTIONS = [
  {
    id: 'PRED-101',
    targetCorridor: 'NH-27 Guwahati - Silchar (Sonapur Stretch)',
    predictionType: 'Landslide Vulnerability Alert',
    riskScore: 94.2, // 0 - 100
    confidenceInterval: '91.5% - 96.8%',
    timeWindowHours: 'Next 12 Hours',
    predictedCause: 'Precipitation exceeding 140mm/24h on saturated hill slope (Soil Saturation Index 89%)',
    impactSeverity: 'Critical Blockage',
    recommendedIntervention: 'Pre-position 2 Heavy Excavators at Sonapur South Portal & Issue Divert Order to Oxygen Tanker V-NER-8891.',
    alternativeRoute: 'Haflong - Jatinga Valley Bypass',
    timeSavedByBypassHours: 14.5,
    modelName: 'NER-TerrainRisk-Transformer-v2',
    evaluatedAt: new Date().toISOString()
  },
  {
    id: 'PRED-102',
    targetCorridor: 'NH-10 Siliguri - Gangtok (29th Mile Stretch)',
    predictionType: 'Flash Flood Overflow Risk',
    riskScore: 81.6,
    confidenceInterval: '78.0% - 85.2%',
    timeWindowHours: 'Next 24 Hours',
    predictedCause: 'Glacial Melt Accumulation + Heavy Downpour in Upper Teesta Catchment',
    impactSeverity: 'Submersion of Lower Lane',
    recommendedIntervention: 'Restrict multi-axle freight trucks between 18:00 and 06:00. Route medical cargo via Gorubathan.',
    alternativeRoute: 'Gorubathan - Lava - Pakyong Route',
    timeSavedByBypassHours: 3.2,
    modelName: 'Teesta-Hydrology-GNN',
    evaluatedAt: new Date().toISOString()
  },
  {
    id: 'PRED-103',
    targetCorridor: 'NH-29 Dimapur - Kohima (Pagala Pahar)',
    predictionType: 'Rockfall & Debris Slip',
    riskScore: 68.4,
    confidenceInterval: '62.1% - 74.0%',
    timeWindowHours: 'Next 36 Hours',
    predictedCause: 'Minor Seismic Tremors (M3.2) + High Water Table Saturation',
    impactSeverity: 'Partial Single Lane Disruption',
    recommendedIntervention: 'Deploy Mobile Patrol Unit to monitor rock catcher nets.',
    alternativeRoute: 'Old Kohima Road',
    timeSavedByBypassHours: 1.5,
    modelName: 'NER-TerrainRisk-Transformer-v2',
    evaluatedAt: new Date().toISOString()
  },
  {
    id: 'PRED-104',
    targetCorridor: 'NH-54 Silchar - Aizawl Corridor',
    predictionType: 'Bridge Structural Stress Risk',
    riskScore: 89.0,
    confidenceInterval: '85.4% - 92.1%',
    timeWindowHours: 'Immediate / Active',
    predictedCause: 'Abutment scouring from elevated river velocity',
    impactSeverity: 'Complete Axle-weight Restriction',
    recommendedIntervention: 'Enforce maximum load limit of 15 Metric Tonnes per vehicle.',
    alternativeRoute: 'Bhairabi Rail Transit Link',
    timeSavedByBypassHours: 8.0,
    modelName: 'Structural-Health-LSTM',
    evaluatedAt: new Date().toISOString()
  }
];
