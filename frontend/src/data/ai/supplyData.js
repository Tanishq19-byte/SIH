/**
 * SIMULATED / PROTOTYPE DATASET - NER-SmartRoute AI (SIH26002)
 * 
 * DISCLAIMER: This dataset contains simulated prototype critical-supply records for North East India
 * medical facilities and civil supply depots intended for SIH proof-of-concept and supply impact intelligence.
 * NOT OFFICIAL GOVERNMENT DATA.
 */

export const supplyData = [
  {
    id: 'SUP-MED-01',
    district: 'Cachar (Silchar HQ)',
    facility: 'Silchar Medical College & Hospital (SMCH)',
    supplyType: 'Cryogenic Liquid Medical Oxygen',
    currentStockDays: 1.8,
    dailyConsumption: '2,400 Liters/day',
    priority: 'Critical',
    routeCorridorId: 'R-NH27-SILCHAR',
    shortageThresholdDays: 3.0
  },
  {
    id: 'SUP-VAC-02',
    district: 'Gangtok District',
    facility: 'STNM Hospital Gangtok Cold Storage',
    supplyType: 'Pediatric Vaccines & Insulin Kits',
    currentStockDays: 2.1,
    dailyConsumption: '180 Kits/day',
    priority: 'Critical',
    routeCorridorId: 'R-NH10-GANGTOK',
    shortageThresholdDays: 4.0
  },
  {
    id: 'SUP-POL-03',
    district: 'Kolasib / Aizawl North',
    facility: 'Kolasib POL Depot',
    supplyType: 'High Speed POL Diesel & Petrol',
    currentStockDays: 2.8,
    dailyConsumption: '12,500 Liters/day',
    priority: 'High',
    routeCorridorId: 'R-NH54-AIZAWL',
    shortageThresholdDays: 5.0
  },
  {
    id: 'SUP-FCI-04',
    district: 'East Khasi Hills (Shillong)',
    facility: 'Shillong Central FCI Warehouse',
    supplyType: 'Fortified Rice & Wheat Food Grains',
    currentStockDays: 21.0,
    dailyConsumption: '42 Metric Tonnes/day',
    priority: 'Medium',
    routeCorridorId: 'R-NH27-SILCHAR',
    shortageThresholdDays: 7.0
  },
  {
    id: 'SUP-MED-05',
    district: 'Kohima District',
    facility: 'Naga Hospital Authority Kohima (NHAK)',
    supplyType: 'Emergency Trauma Surgical Kits',
    currentStockDays: 11.0,
    dailyConsumption: '45 Kits/day',
    priority: 'Medium',
    routeCorridorId: 'R-NH29-KOHIMA',
    shortageThresholdDays: 4.0
  }
];
