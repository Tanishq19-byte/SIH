/**
 * SIMULATED / PROTOTYPE DATASET - NER-SmartRoute AI (SIH26002)
 * 
 * DISCLAIMER: This dataset contains simulated prototype corridor records for Northeast India logistics
 * highways intended for SIH proof-of-concept and ML model training.
 * It does NOT represent official government survey data.
 */

export const corridorData = [
  {
    id: 'R-NH27-SILCHAR',
    name: 'NH-27 Guwahati - Silchar Lifeline Corridor',
    origin: 'Guwahati Logistics Depot (Assam)',
    destination: 'Silchar Distribution Hub (Assam)',
    state: 'Assam / Meghalaya',
    distanceKm: 342.0,
    terrainType: 'steep_gorge',
    elevationRisk: 'High (Sonapur Slopes)',
    roadCondition: 'subsidence',
    roadConditionScore: 4.2, // 1 (Worst) - 10 (Best)
    accessibility: 22.0,
    trafficLevel: 'heavy',
    historicalDisruptionCount: 18,
    floodRisk: 82.5,
    landslideRisk: 94.0
  },
  {
    id: 'R-NH10-GANGTOK',
    name: 'NH-10 Siliguri - Gangtok Corridor',
    origin: 'Siliguri Railhead (West Bengal)',
    destination: 'Gangtok STNM Hub (Sikkim)',
    state: 'Sikkim / West Bengal',
    distanceKm: 114.0,
    terrainType: 'steep_gorge',
    elevationRisk: 'High (Teesta Gorge)',
    roadCondition: 'minor_scour',
    roadConditionScore: 5.8,
    accessibility: 58.0,
    trafficLevel: 'moderate',
    historicalDisruptionCount: 14,
    floodRisk: 78.0,
    landslideRisk: 88.0
  },
  {
    id: 'R-NH54-AIZAWL',
    name: 'NH-54 Silchar - Aizawl Arterial Corridor',
    origin: 'Silchar Supply Depot (Assam)',
    destination: 'Aizawl North Hub (Mizoram)',
    state: 'Assam / Mizoram',
    distanceKm: 180.0,
    terrainType: 'tectonic_fault',
    elevationRisk: 'Very High (Vairengte Ridges)',
    roadCondition: 'severely_damaged',
    roadConditionScore: 3.5,
    accessibility: 18.0,
    trafficLevel: 'heavy',
    historicalDisruptionCount: 16,
    floodRisk: 65.0,
    landslideRisk: 92.0
  },
  {
    id: 'R-NH08-AGARTALA',
    name: 'NH-08 Guwahati - Agartala Trunk Highway',
    origin: 'Guwahati Hub (Assam)',
    destination: 'Agartala Central Depot (Tripura)',
    state: 'Assam / Tripura',
    distanceKm: 540.0,
    terrainType: 'hilly',
    elevationRisk: 'Medium (Baramura Slopes)',
    roadCondition: 'minor_scour',
    roadConditionScore: 6.5,
    accessibility: 65.0,
    trafficLevel: 'moderate',
    historicalDisruptionCount: 9,
    floodRisk: 52.0,
    landslideRisk: 48.0
  },
  {
    id: 'R-NH29-KOHIMA',
    name: 'NH-29 Dimapur - Kohima Corridor',
    origin: 'Dimapur Freight Railhead (Nagaland)',
    destination: 'Kohima Army Depot (Nagaland)',
    state: 'Nagaland',
    distanceKm: 74.0,
    terrainType: 'tectonic_fault',
    elevationRisk: 'High (Pagala Pahar Sinking Zone)',
    roadCondition: 'subsidence',
    roadConditionScore: 4.8,
    accessibility: 72.0,
    trafficLevel: 'moderate',
    historicalDisruptionCount: 12,
    floodRisk: 38.0,
    landslideRisk: 84.0
  },
  {
    id: 'R-NH37-IMPHAL',
    name: 'NH-37 Jiribam - Imphal Highway',
    origin: 'Jiribam Border Gate (Manipur)',
    destination: 'Imphal Valley Depot (Manipur)',
    state: 'Manipur',
    distanceKm: 222.0,
    terrainType: 'hilly',
    elevationRisk: 'High (Noney Bridge Slopes)',
    roadCondition: 'minor_scour',
    roadConditionScore: 5.5,
    accessibility: 68.0,
    trafficLevel: 'low',
    historicalDisruptionCount: 11,
    floodRisk: 45.0,
    landslideRisk: 76.0
  },
  {
    id: 'R-NH415-ITANAGAR',
    name: 'NH-415 Banderdewa - Itanagar Express Corridor',
    origin: 'Banderdewa Checkpost (Assam/Arunachal)',
    destination: 'Itanagar Civil Depot (Arunachal Pradesh)',
    state: 'Arunachal Pradesh',
    distanceKm: 52.0,
    terrainType: 'hilly',
    elevationRisk: 'Medium (Karsingsa Cutting)',
    roadCondition: 'excellent',
    roadConditionScore: 8.2,
    accessibility: 84.0,
    trafficLevel: 'low',
    historicalDisruptionCount: 6,
    floodRisk: 32.0,
    landslideRisk: 58.0
  }
];
