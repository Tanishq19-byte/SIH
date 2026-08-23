export const NER_STATES = [
  { id: 'all', name: 'All NER States', code: 'NER', capital: 'Regional Overview' },
  { id: 'AS', name: 'Assam', code: 'AS', capital: 'Dispur', priority: 'High Hub', corridors: 12 },
  { id: 'ML', name: 'Meghalaya', code: 'ML', capital: 'Shillong', priority: 'Monsoon High Risk', corridors: 6 },
  { id: 'AR', name: 'Arunachal Pradesh', code: 'AR', capital: 'Itanagar', priority: 'Border Corridor Critical', corridors: 8 },
  { id: 'NL', name: 'Nagaland', code: 'NL', capital: 'Kohima', priority: 'Hilly Terrain Risk', corridors: 5 },
  { id: 'MN', name: 'Manipur', code: 'MN', capital: 'Imphal', priority: 'Critical Supply Lifeline', corridors: 4 },
  { id: 'MZ', name: 'Mizoram', code: 'MZ', capital: 'Aizawl', priority: 'Landslide Vulnerable', corridors: 4 },
  { id: 'TR', name: 'Tripura', code: 'TR', capital: 'Agartala', priority: 'International Transit', corridors: 5 },
  { id: 'SK', name: 'Sikkim', code: 'SK', capital: 'Gangtok', priority: 'NH-10 Lifeline', corridors: 3 }
];

export const SYSTEM_STATUS = {
  overallAccessibilityScore: 78.4, // out of 100
  activeMonitoredCorridors: 47,
  blockedCorridors: 3,
  warningCorridors: 8,
  activeEnRouteConvoys: 142,
  essentialSuppliesInTransitTonnes: 3450,
  activeIncidentsCount: 14,
  highRiskPredictions24h: 5,
  lastUpdated: new Date().toISOString()
};
