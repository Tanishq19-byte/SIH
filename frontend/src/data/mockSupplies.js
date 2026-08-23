export const MOCK_ROAD_DISRUPTIONS_SIMULATION = [
  {
    roadId: 'R-NH27-SILCHAR',
    roadName: 'NH-27 Guwahati - Silchar Corridor (Sonapur Tunnel)',
    disruptionType: 'Major Landslide & Highway Subsidence',
    affectedDeliveriesCount: 7,
    affectedVehiclesCount: 4,
    affectedDistrictsCount: 3,
    affectedDistrictsList: ['Cachar (Silchar HQ)', 'Hailakandi', 'Karimganj'],
    medicineUnitsDelayed: '3,400 Units (Cryogenic Oxygen + Meds)',
    maxDelayHours: 7,
    supplyShortageRisk: 'HIGH',
    aiRecommendation: 'Prioritize medicine delivery V-NER-8891 (Oxygen Tanker) and reroute through Lumding - Haflong Corridor B.',
    priorityVehicleId: 'V-NER-8891',
    impactChain: {
      disruption: 'Sonapur Tunnel 340m Mudslide (NH-27)',
      vehicles: '4 Essential Logistics Fleets Stuck at KM 142',
      deliveries: '3,400 Medicine Units & 22,000L Oxygen Delayed (+7.0h Max Delay)',
      districtImpact: 'Cachar & Hailakandi Stock Buffer Depleting to < 1.8 Days',
      recommendedAction: 'Reroute Oxygen Convoy V-NER-8891 via Haflong Detour B'
    }
  },
  {
    roadId: 'R-NH10-GANGTOK',
    roadName: 'NH-10 Siliguri - Gangtok Lifeline (Melli Stretch)',
    disruptionType: 'Teesta River Submersion & Roadbed Erosion',
    affectedDeliveriesCount: 4,
    affectedVehiclesCount: 2,
    affectedDistrictsCount: 2,
    affectedDistrictsList: ['Gangtok District', 'Pakyong'],
    medicineUnitsDelayed: '1,850 Units (Vaccines & Cold Chain)',
    maxDelayHours: 4.5,
    supplyShortageRisk: 'HIGH',
    aiRecommendation: 'Prioritize vaccine convoy V-NER-3091 and reroute through Gorubathan - Lava Corridor B.',
    priorityVehicleId: 'V-NER-3091',
    impactChain: {
      disruption: 'Teesta River Overflow at Melli 29th Mile (NH-10)',
      vehicles: '2 Refrigerated Vaccine Fleets Halted',
      deliveries: '1,850 Vaccine Kits & Insulin Packs Delayed (+4.5h Max Delay)',
      districtImpact: 'STNM Hospital Gangtok Cold Storage Buffer Depleting to 2.1 Days',
      recommendedAction: 'Reroute Vaccine Convoy V-NER-3091 via Gorubathan Ridge Pass'
    }
  },
  {
    roadId: 'R-NH54-AIZAWL',
    roadName: 'NH-54 Silchar - Aizawl Corridor (Vairengte Post)',
    disruptionType: 'Double-Cell Box Culvert Washout',
    affectedDeliveriesCount: 6,
    affectedVehiclesCount: 3,
    affectedDistrictsCount: 2,
    affectedDistrictsList: ['Kolasib', 'Aizawl North'],
    medicineUnitsDelayed: '2,100 Units & 38,000L POL Fuel',
    maxDelayHours: 16.0,
    supplyShortageRisk: 'CRITICAL',
    aiRecommendation: 'Prioritize POL Fuel Fleet V-NER-5510 and deploy Bhairabi Railhead Transshipment.',
    priorityVehicleId: 'V-NER-5510',
    impactChain: {
      disruption: 'Vairengte Culvert Collapse (NH-54 KM 45)',
      vehicles: '3 POL Fuel Tankers & Steel Girder Convoys Stranded',
      deliveries: '38,000L POL Diesel & Infrastructure Parts Delayed (+16.0h Delay)',
      districtImpact: 'Kolasib POL Fuel Buffer Depleting to < 2.8 Days',
      recommendedAction: 'Deploy Army Bailey Bridge & Transship via Bhairabi Rail'
    }
  }
];

export const MOCK_SUPPLIES = [
  {
    id: 'SUP-DIST-01',
    district: 'Cachar (Silchar HQ)',
    state: 'Assam',
    population: 1736000,
    hospitalsCount: 14,
    primaryHospital: 'Silchar Medical College & Hospital (SMCH)',
    isolationRisk: 'High (NH-27 Cut-off)',
    isolationStatusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    stockLevels: {
      medicalOxygen: { daysRemaining: 1.8, status: 'critical', totalUnits: '4,200 Liters' },
      fuelPOL: { daysRemaining: 3.5, status: 'warning', totalUnits: '85,000 Liters' },
      riceGrains: { daysRemaining: 12.0, status: 'healthy', totalUnits: '420 Metric Tonnes' },
      essentialMeds: { daysRemaining: 4.2, status: 'warning', totalUnits: '1,800 Kits' }
    },
    incomingConvoysCount: 3,
    criticalNeedAlert: 'Urgent Oxygen Refill Tanker V-NER-8891 Delayed by 11.5 Hours'
  },
  {
    id: 'SUP-DIST-02',
    district: 'East Khasi Hills (Shillong HQ)',
    state: 'Meghalaya',
    population: 825000,
    hospitalsCount: 9,
    primaryHospital: 'NEIGRIHMS Shillong',
    isolationRisk: 'Low',
    isolationStatusStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    stockLevels: {
      medicalOxygen: { daysRemaining: 8.5, status: 'healthy', totalUnits: '18,500 Liters' },
      fuelPOL: { daysRemaining: 14.0, status: 'healthy', totalUnits: '240,000 Liters' },
      riceGrains: { daysRemaining: 21.0, status: 'healthy', totalUnits: '890 Metric Tonnes' },
      essentialMeds: { daysRemaining: 11.0, status: 'healthy', totalUnits: '5,400 Kits' }
    },
    incomingConvoysCount: 5,
    criticalNeedAlert: 'None - Normal Distribution'
  },
  {
    id: 'SUP-DIST-03',
    district: 'Gangtok District',
    state: 'Sikkim',
    population: 285000,
    hospitalsCount: 5,
    primaryHospital: 'STNM Hospital Gangtok',
    isolationRisk: 'Medium (NH-10 Warning)',
    isolationStatusStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    stockLevels: {
      medicalOxygen: { daysRemaining: 5.2, status: 'warning', totalUnits: '6,100 Liters' },
      fuelPOL: { daysRemaining: 4.0, status: 'warning', totalUnits: '48,000 Liters' },
      riceGrains: { daysRemaining: 16.0, status: 'healthy', totalUnits: '180 Metric Tonnes' },
      essentialMeds: { daysRemaining: 2.1, status: 'critical', totalUnits: '450 Kits (Vaccines Halted at Melli)' }
    },
    incomingConvoysCount: 2,
    criticalNeedAlert: 'Cold Chain Vaccine Tanker V-NER-3091 Halted at Melli'
  },
  {
    id: 'SUP-DIST-04',
    district: 'Kolasib / Aizawl North',
    state: 'Mizoram',
    population: 400000,
    hospitalsCount: 6,
    primaryHospital: 'Civil Hospital Aizawl',
    isolationRisk: 'High (NH-54 Culvert Washout)',
    isolationStatusStyle: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    stockLevels: {
      medicalOxygen: { daysRemaining: 2.4, status: 'critical', totalUnits: '3,100 Liters' },
      fuelPOL: { daysRemaining: 2.8, status: 'critical', totalUnits: '38,000 Liters' },
      riceGrains: { daysRemaining: 8.0, status: 'warning', totalUnits: '210 Metric Tonnes' },
      essentialMeds: { daysRemaining: 6.0, status: 'healthy', totalUnits: '1,200 Kits' }
    },
    incomingConvoysCount: 1,
    criticalNeedAlert: 'Culvert Washout Blocking POL Fuel Tankers'
  }
];
