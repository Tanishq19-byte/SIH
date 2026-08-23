export const MOCK_ALERTS = [
  {
    id: 'ALT-2026-001',
    category: 'Road blocked', // Road blocked, High disruption risk, Vehicle delayed, Essential supply risk, Severe weather, Incident reported, Reroute recommendation
    severity: 'Critical', // Critical, High, Medium, Low
    timeDisplay: '4 mins ago',
    timestamp: '2026-08-23T09:43:00Z',
    location: 'Sonapur Tunnel South Portal (NH-27 KM 142.5), Meghalaya',
    affectedVehicle: 'AS-01-GC-9921 (Cryogenic Oxygen Tanker 22,000L)',
    affectedDeliveryId: 'DEL-OXY-8891',
    recommendedAction: 'Reroute vehicle AS-01-GC-9921 via Lumding-Haflong Corridor B immediately. Save 14.5 hours delay.',
    isRead: false,
    summary: '340m debris fall completely blocked both lanes of NH-27. 38 essential freight trucks stranded.'
  },
  {
    id: 'ALT-2026-002',
    category: 'Reroute recommendation',
    severity: 'Critical',
    timeDisplay: '8 mins ago',
    timestamp: '2026-08-23T09:39:00Z',
    location: 'Haflong - Jatinga Valley Bypass, Assam',
    affectedVehicle: 'AS-01-GC-9921 (Liquid Medical Oxygen)',
    affectedDeliveryId: 'DEL-OXY-8891',
    recommendedAction: 'Execute AI Bypass Directive. Detour extra distance +74km reduces disruption probability by 62%.',
    isRead: false,
    summary: 'AI Engine calculated optimal bypass detour for oxygen convoy bound for Silchar Medical College.'
  },
  {
    id: 'ALT-2026-003',
    category: 'Essential supply risk',
    severity: 'Critical',
    timeDisplay: '15 mins ago',
    timestamp: '2026-08-23T09:32:00Z',
    location: 'Cachar District (Silchar HQ), Assam',
    affectedVehicle: 'SMCH Hospital Refill Convoy',
    affectedDeliveryId: 'DEL-OXY-8891',
    recommendedAction: 'Issue priority escort directive to Assam Highway Patrol & log emergency oxygen requisition.',
    isRead: false,
    summary: 'Silchar SMCH Hospital oxygen stock buffer reduced to < 1.8 days due to NH-27 tunnel blockade.'
  },
  {
    id: 'ALT-2026-004',
    category: 'Severe weather',
    severity: 'High',
    timeDisplay: '22 mins ago',
    timestamp: '2026-08-23T09:25:00Z',
    location: 'Upper Teesta Catchment & Kalimpong Ridge, Sikkim',
    affectedVehicle: 'SK-01-D-3091 (Refrigerated Vaccines)',
    affectedDeliveryId: 'DEL-VAC-3091',
    recommendedAction: 'Pre-stage 2 heavy excavators at Melli 29th Mile and restrict multi-axle freight trucks.',
    isRead: false,
    summary: 'IMD Doppler Radar detected 180mm/24h cloudburst precipitation. High risk of Teesta river overflow.'
  },
  {
    id: 'ALT-2026-005',
    category: 'Vehicle delayed',
    severity: 'High',
    timeDisplay: '35 mins ago',
    timestamp: '2026-08-23T09:12:00Z',
    location: 'Melli Bridge Junction (NH-10), Sikkim',
    affectedVehicle: 'SK-01-D-3091 (STNM Hospital Vaccine Convoy)',
    affectedDeliveryId: 'DEL-VAC-3091',
    recommendedAction: 'Divert vaccine transport SK-01-D-3091 via Gorubathan - Lava Ridge Pass.',
    isRead: true,
    summary: 'Vaccine transport halted at Melli due to riverbank submersion. Current delay +6.5 hours.'
  },
  {
    id: 'ALT-2026-006',
    category: 'High disruption risk',
    severity: 'Medium',
    timeDisplay: '1 hour ago',
    timestamp: '2026-08-23T08:47:00Z',
    location: 'Pagala Pahar Stretch (NH-29), Nagaland',
    affectedVehicle: 'NL-07-B-7120 (Disaster Relief Tents)',
    affectedDeliveryId: 'DEL-REL-7120',
    recommendedAction: 'Deploy mobile patrol unit to monitor rock catcher nets and maintain 40 km/h speed limit.',
    isRead: true,
    summary: 'Soil saturation index reached 84%. AI Model predicts 68% probability of rockfall in next 36 hours.'
  },
  {
    id: 'ALT-2026-007',
    category: 'Incident reported',
    severity: 'Medium',
    timeDisplay: '2 hours ago',
    timestamp: '2026-08-23T07:45:00Z',
    location: 'Churaibari Interstate Checkgate (NH-8), Tripura',
    affectedVehicle: 'TR-01-A-1029 (POL Fuel Tanker 18KL)',
    affectedDeliveryId: 'DEL-POL-9904',
    recommendedAction: 'Open fast-track lane for essential fuel bulkers and bypass main checkgate tailback.',
    isRead: true,
    summary: 'Waterlogged toll approach causing 4km freight truck tailback at Assam-Tripura interstate border.'
  }
];
