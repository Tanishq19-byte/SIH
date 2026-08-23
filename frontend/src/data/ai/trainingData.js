/**
 * SIMULATED / PROTOTYPE TRAINING DATASET - NER-SmartRoute AI (SIH26002)
 * 
 * DISCLAIMER: This dataset contains 110 normalized synthetic feature vectors for North East India
 * logistics corridor disruption prediction, designed for SIH proof-of-concept and future ML training
 * (e.g. Scikit-Learn Random Forest / XGBoost / PyTorch GNN).
 * NOT OFFICIAL GOVERNMENT DATA.
 */

// Helper generator for realistic, logically correlated synthetic ML training samples
const generateSyntheticTrainingData = () => {
  const samples = [];
  const terrainTypes = [
    { type: 'flat', risk: 0.15 },
    { type: 'hilly', risk: 0.55 },
    { type: 'steep_gorge', risk: 0.85 },
    { type: 'tectonic_fault', risk: 0.95 }
  ];

  // Seeded deterministic PRNG for reproducible synthetic training records
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 1; i <= 110; i++) {
    const terrain = terrainTypes[Math.floor(pseudoRandom() * terrainTypes.length)];
    const rainfall24h = Math.round((pseudoRandom() * 260 + 10) * 10) / 10; // 10.0 to 270.0 mm
    const rainfallForecast = Math.round((rainfall24h * (0.8 + pseudoRandom() * 0.5)) * 10) / 10;
    const terrainRisk = terrain.risk;
    const roadConditionScore = Math.round((pseudoRandom() * 7.5 + 2.0) * 10) / 10; // 2.0 (Worst) to 9.5 (Best)
    const historicalDisruptionCount = Math.floor(pseudoRandom() * 20); // 0 to 20 events/month
    
    // Physical hydrology calculations
    const riverLevelPercent = Math.min(Math.round((rainfall24h / 250) * 60 + pseudoRandom() * 35 + 20), 99);
    const floodProbability = Math.min(Math.round((rainfall24h / 260) * 55 + (riverLevelPercent / 100) * 35 + pseudoRandom() * 10), 98);
    const landslideProbability = Math.min(Math.round(terrainRisk * 45 + (rainfall24h / 260) * 45 + (10 - roadConditionScore) * 3), 99);
    
    const trafficScore = Math.round((pseudoRandom() * 8.5 + 1.5) * 10) / 10; // 1.5 to 10.0
    const activeIncidentCount = pseudoRandom() > 0.6 ? Math.floor(pseudoRandom() * 4 + 1) : 0;
    const vehicleCount = Math.floor(pseudoRandom() * 40 + 5);
    const supplyUrgency = Math.round((pseudoRandom() * 8.0 + 2.0) * 10) / 10;

    // Logical Target Rule: Physical Road Disruption Target (0 = No Disruption, 1 = Major Disruption)
    const riskFactorScore = (rainfall24h / 260) * 0.35 + terrainRisk * 0.25 + (10 - roadConditionScore) * 0.03 + (historicalDisruptionCount / 20) * 0.15 + (activeIncidentCount / 4) * 0.15 + (pseudoRandom() - 0.5) * 0.1;
    const actualDisruption = riskFactorScore > 0.48 ? 1 : 0;

    samples.push({
      id: `TRAIN-${String(i).padStart(3, '0')}`,
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
      actualDisruption // ML Target Label: 0 or 1
    });
  }

  return samples;
};

export const trainingData = generateSyntheticTrainingData();
