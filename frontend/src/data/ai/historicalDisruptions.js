/**
 * SIMULATED / PROTOTYPE DATASET - NER-SmartRoute AI (SIH26002)
 * 
 * DISCLAIMER: This dataset contains simulated historical disruption events across North East India
 * highways intended for SIH proof-of-concept and ML training target validation.
 * It does NOT represent official government disaster records.
 */

export const historicalDisruptions = [
  {
    id: 'HIST-2025-01',
    corridorId: 'R-NH27-SILCHAR',
    date: '2025-07-14',
    district: 'East Jaintia Hills',
    disruptionType: 'Major Landslide & Debris Slump',
    rainfall24h: 245.0,
    severity: 'Critical',
    durationHours: 36.0,
    affectedRoadKm: 0.35,
    vehiclesAffected: 84,
    deliveriesDelayed: 42,
    causedByFlood: false,
    causedByLandslide: true,
    actualDisruption: 1 // ML Target: 1 = Disruption occurred
  },
  {
    id: 'HIST-2025-02',
    corridorId: 'R-NH10-GANGTOK',
    date: '2025-08-02',
    district: 'Gangtok District',
    disruptionType: 'Teesta River Overflow Submersion',
    rainfall24h: 180.0,
    severity: 'High',
    durationHours: 18.5,
    affectedRoadKm: 1.2,
    vehiclesAffected: 45,
    deliveriesDelayed: 19,
    causedByFlood: true,
    causedByLandslide: false,
    actualDisruption: 1
  },
  {
    id: 'HIST-2025-03',
    corridorId: 'R-NH08-AGARTALA',
    date: '2025-06-20',
    district: 'West Tripura (Agartala)',
    disruptionType: 'Minor Highway Waterlogging',
    rainfall24h: 42.0,
    severity: 'Low',
    durationHours: 1.5,
    affectedRoadKm: 0.1,
    vehiclesAffected: 8,
    deliveriesDelayed: 2,
    causedByFlood: false,
    causedByLandslide: false,
    actualDisruption: 0 // ML Target: 0 = No major disruption
  },
  {
    id: 'HIST-2025-04',
    corridorId: 'R-NH54-AIZAWL',
    date: '2025-09-11',
    district: 'Kolasib',
    disruptionType: 'Box Culvert Collapse & Washout',
    rainfall24h: 210.0,
    severity: 'Critical',
    durationHours: 48.0,
    affectedRoadKm: 0.6,
    vehiclesAffected: 62,
    deliveriesDelayed: 31,
    causedByFlood: true,
    causedByLandslide: true,
    actualDisruption: 1
  },
  {
    id: 'HIST-2025-05',
    corridorId: 'R-NH29-KOHIMA',
    date: '2025-05-18',
    district: 'Kohima District',
    disruptionType: 'Pagala Pahar Sinking Zone Slump',
    rainfall24h: 125.0,
    severity: 'Medium',
    durationHours: 8.0,
    affectedRoadKm: 0.25,
    vehiclesAffected: 24,
    deliveriesDelayed: 11,
    causedByFlood: false,
    causedByLandslide: true,
    actualDisruption: 1
  },
  {
    id: 'HIST-2025-06',
    corridorId: 'R-NH415-ITANAGAR',
    date: '2025-10-04',
    district: 'Papum Pare (Itanagar)',
    disruptionType: 'Normal Monsoonal Flow',
    rainfall24h: 35.0,
    severity: 'Low',
    durationHours: 0.0,
    affectedRoadKm: 0.0,
    vehiclesAffected: 0,
    deliveriesDelayed: 0,
    causedByFlood: false,
    causedByLandslide: false,
    actualDisruption: 0
  }
];
