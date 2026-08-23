/**
 * SIMULATED / PROTOTYPE DATASET - NER-SmartRoute AI (SIH26002)
 * 
 * DISCLAIMER: This dataset contains simulated prototype weather records for North Eastern Region
 * logistics corridors intended for SIH proof-of-concept and ML model development.
 * It does NOT represent official government meteorological measurements.
 */

export const weatherData = [
  {
    id: 'WX-2026-001',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'East Jaintia Hills',
    corridorId: 'R-NH27-SILCHAR',
    rainfall24h: 220.5,
    rainfallIntensity: 'Extremely Heavy Downpour',
    weatherSeverity: 'cloudburst',
    temperature: 21.4,
    riverLevel: '8.4m',
    riverLevelPercent: 94.2,
    floodProbability: 88.5,
    cloudburstAlert: true
  },
  {
    id: 'WX-2026-002',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Cachar (Silchar HQ)',
    corridorId: 'R-NH27-SILCHAR',
    rainfall24h: 185.0,
    rainfallIntensity: 'Heavy Torrential',
    weatherSeverity: 'heavy',
    temperature: 24.2,
    riverLevel: '14.8m',
    riverLevelPercent: 91.0,
    floodProbability: 82.0,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-003',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Gangtok District',
    corridorId: 'R-NH10-GANGTOK',
    rainfall24h: 142.8,
    rainfallIntensity: 'Heavy Rainfall',
    weatherSeverity: 'heavy',
    temperature: 16.5,
    riverLevel: '6.2m',
    riverLevelPercent: 86.4,
    floodProbability: 76.5,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-004',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Kolasib',
    corridorId: 'R-NH54-AIZAWL',
    rainfall24h: 165.2,
    rainfallIntensity: 'Continuous Heavy Downpour',
    weatherSeverity: 'heavy',
    temperature: 22.8,
    riverLevel: '7.8m',
    riverLevelPercent: 89.1,
    floodProbability: 79.2,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-005',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Kohima District',
    corridorId: 'R-NH29-KOHIMA',
    rainfall24h: 92.4,
    rainfallIntensity: 'Moderate to Heavy Shower',
    weatherSeverity: 'moderate',
    temperature: 19.1,
    riverLevel: '4.1m',
    riverLevelPercent: 62.0,
    floodProbability: 45.0,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-006',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'West Tripura (Agartala)',
    corridorId: 'R-NH08-AGARTALA',
    rainfall24h: 64.0,
    rainfallIntensity: 'Moderate Rainfall',
    weatherSeverity: 'moderate',
    temperature: 27.5,
    riverLevel: '3.9m',
    riverLevelPercent: 54.2,
    floodProbability: 32.0,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-007',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Imphal West',
    corridorId: 'R-NH37-IMPHAL',
    rainfall24h: 78.5,
    rainfallIntensity: 'Moderate Rain',
    weatherSeverity: 'moderate',
    temperature: 23.0,
    riverLevel: '5.2m',
    riverLevelPercent: 58.6,
    floodProbability: 41.5,
    cloudburstAlert: false
  },
  {
    id: 'WX-2026-008',
    timestamp: '2026-08-23T08:00:00Z',
    district: 'Papum Pare (Itanagar)',
    corridorId: 'R-NH415-ITANAGAR',
    rainfall24h: 110.2,
    rainfallIntensity: 'Heavy Spells',
    weatherSeverity: 'heavy',
    temperature: 20.8,
    riverLevel: '6.9m',
    riverLevelPercent: 74.0,
    floodProbability: 61.0,
    cloudburstAlert: false
  }
];
