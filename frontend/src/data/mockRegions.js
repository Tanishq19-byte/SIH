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
  overallAccessibilityScore: 78.4,
  activeMonitoredCorridors: 47,
  blockedCorridors: 3,
  warningCorridors: 8,
  activeEnRouteConvoys: 142,
  essentialSuppliesInTransitTonnes: 3450,
  activeIncidentsCount: 14,
  highRiskPredictions24h: 5,
  lastUpdated: new Date().toISOString()
};

export const STATE_DASHBOARD_DATA = {
  all: {
    kpis: {
      activeRoutes: { value: '128', change: 'Monitored', changeType: 'neutral', subtitle: '8 North East States' },
      delayedRoutes: { value: '17', change: '+3 vs yesterday', changeType: 'negative', subtitle: 'Monsoon Impact' },
      criticalAlerts: { value: '08', change: 'Sonapur & Tawang', changeType: 'negative', subtitle: 'Immediate Action Req.' },
      networkAvailability: { value: '94%', change: '+1.2% this week', changeType: 'positive', subtitle: 'Overall Resilience' }
    },
    emergencyMetrics: { critical: 12, medical: 7, food: 4, closed: 3 },
    route: {
      id: 'route-tawang',
      name: 'Guwahati → Tawang (NH-13 / NH-715B)',
      distanceKm: 447,
      normalTravelHours: '11h 42m',
      currentRisk: 'Moderate',
      weatherImpact: '+42 min',
      terrainRisk: 'High',
      roadDisruptionsCount: 2,
      aiConfidencePct: 87,
      status: 'warning'
    },
    whatChanged: [
      { type: 'up', title: '3 new road disruptions reported in East Jaintia Hills', text: 'Landslide activity triggered by monsoon surge', color: 'text-[#DC2626]' },
      { type: 'up', title: 'Rainfall risk increased to 82% on NH-27', text: 'Continuous precipitation forecast for next 18 hours', color: 'text-[#D97706]' },
      { type: 'down', title: '2 previously blocked routes reopened', text: 'NH-10 Siliguri-Gangtok line cleared by BRO 44 BRTF', color: 'text-[#16A34A]' },
      { type: 'up', title: 'Route delay probability increased by 12%', text: 'Heavy convoy slowdowns near Sonapur portal', color: 'text-[#DC2626]' }
    ],
    timeline: [
      { time: '08:42 IST', title: 'Heavy rainfall detected', detail: '140mm 24h intensity registered in Cachar sector', type: 'warning' },
      { time: '09:10 IST', title: 'Route risk increased', detail: 'NH-27 vulnerability score escalated to 87/100', type: 'critical' },
      { time: '09:26 IST', title: 'Landslide reported', detail: 'BRO field patrol confirmed 120m roadway blockage', type: 'critical' },
      { time: '09:34 IST', title: 'AI recalculated routes', detail: 'Evaluated 3 alternate corridors via Haflong Ridge', type: 'info' },
      { time: '09:41 IST', title: 'Alternative route recommended', detail: 'Route B preferred (-61% disruption exposure)', type: 'success' }
    ]
  },
  AS: {
    kpis: {
      activeRoutes: { value: '38', change: 'Assam Trunk Hub', changeType: 'neutral', subtitle: 'Brahmaputra & Barak Valley' },
      delayedRoutes: { value: '06', change: '+2 near Cachar', changeType: 'negative', subtitle: 'Heavy Precipitation' },
      criticalAlerts: { value: '03', change: 'Sonapur & Haflong', changeType: 'negative', subtitle: 'Oxygen Convoy Escorts' },
      networkAvailability: { value: '89%', change: '+0.8% this week', changeType: 'positive', subtitle: 'State Highway Grid' }
    },
    emergencyMetrics: { critical: 4, medical: 3, food: 2, closed: 1 },
    route: {
      id: 'R-NH27-SILCHAR',
      name: 'Guwahati → Silchar (NH-27 / NH-6)',
      distanceKm: 340,
      normalTravelHours: '9h 30m',
      currentRisk: 'Critical',
      weatherImpact: '+11h 30m',
      terrainRisk: 'High',
      roadDisruptionsCount: 2,
      aiConfidencePct: 94,
      status: 'critical'
    },
    whatChanged: [
      { type: 'up', title: '340m debris fall on NH-27 KM 142.5', text: '38 Oxygen & POL tankers rerouted via Lumding-Haflong', color: 'text-[#DC2626]' },
      { type: 'up', title: 'Barak Valley waterlogging warning', text: 'Low-lying NH-54 sections under flood watch', color: 'text-[#D97706]' },
      { type: 'down', title: 'Guwahati-Tezpur 4-lane trunk clear', text: 'NH-37 operating with zero congestion', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '07:15 IST', title: 'Cachar Valley Monsoon Influx', detail: 'Rainfall exceeds 160mm threshold near Silchar SMCH', type: 'warning' },
      { time: '08:15 IST', title: 'Sonapur Tunnel Debris Fall', detail: 'NH-27 blocked, 38 essential trucks stranded', type: 'critical' },
      { time: '08:45 IST', title: 'AI Bypass Active', detail: 'Rerouted Tanker AS-01-GC-9921 via Lumding-Haflong', type: 'success' }
    ]
  },
  ML: {
    kpis: {
      activeRoutes: { value: '18', change: 'Meghalaya Sector', changeType: 'neutral', subtitle: 'East Jaintia & Khasi Hills' },
      delayedRoutes: { value: '05', change: '+2 Sonapur stretch', changeType: 'negative', subtitle: 'Active Mudflows' },
      criticalAlerts: { value: '02', change: 'NH-27 South Portal', changeType: 'negative', subtitle: 'Immediate Clearance' },
      networkAvailability: { value: '74%', change: '-3.1% this week', changeType: 'negative', subtitle: 'Monsoon Heavy Influx' }
    },
    emergencyMetrics: { critical: 3, medical: 2, food: 1, closed: 1 },
    route: {
      id: 'R-NH27-SILCHAR',
      name: 'Shillong → Jowai → Silchar (NH-6)',
      distanceKm: 215,
      normalTravelHours: '6h 15m',
      currentRisk: 'Critical',
      weatherImpact: '+8h 45m',
      terrainRisk: 'Very High',
      roadDisruptionsCount: 2,
      aiConfidencePct: 96,
      status: 'critical'
    },
    whatChanged: [
      { type: 'up', title: 'Sonapur Tunnel Portal mudflow active', text: 'Debris clearance in progress by BRO 44 BRTF', color: 'text-[#DC2626]' },
      { type: 'down', title: 'Shillong-Guwahati Expressway clear', text: 'NH-40 smooth dual carriageway flow', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '08:00 IST', title: 'Heavy Cloudburst at Jowai', detail: 'Over 210mm precipitation registered in 24h', type: 'warning' },
      { time: '08:30 IST', title: 'South Portal Blockage Confirmed', detail: 'Excavators deployed at Sonapur tunnel', type: 'critical' }
    ]
  },
  SK: {
    kpis: {
      activeRoutes: { value: '11', change: 'Sikkim Lifeline', changeType: 'neutral', subtitle: 'NH-10 & Teesta Corridor' },
      delayedRoutes: { value: '03', change: 'Teesta River Rise', changeType: 'negative', subtitle: 'Melli Submersion' },
      criticalAlerts: { value: '01', change: 'Likhiphir Stretch', changeType: 'negative', subtitle: 'Single Lane Alternating' },
      networkAvailability: { value: '68%', change: '-1.5% this week', changeType: 'negative', subtitle: 'Riverbank Vulnerability' }
    },
    emergencyMetrics: { critical: 2, medical: 2, food: 1, closed: 1 },
    route: {
      id: 'R-NH10-GANGTOK',
      name: 'Siliguri → Gangtok Lifeline (NH-10)',
      distanceKm: 114,
      normalTravelHours: '3h 45m',
      currentRisk: 'High',
      weatherImpact: '+2h 30m',
      terrainRisk: 'High',
      roadDisruptionsCount: 1,
      aiConfidencePct: 91,
      status: 'warning'
    },
    whatChanged: [
      { type: 'up', title: 'Teesta River gauge at 8.2m near Melli', text: 'Flood advisory issued for NH-10 valley stretch', color: 'text-[#DC2626]' },
      { type: 'down', title: 'Jorethang-Namchi bypass fully functional', text: 'Light commercial vehicles diverted to alternate pass', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '06:30 IST', title: 'Teesta River Swelling', detail: 'Likhiphir debris slip reported by NHIDCL patrol', type: 'warning' },
      { time: '07:45 IST', title: 'Vaccine Convoy Pre-positioned', detail: 'SK-01-B-3091 cold-chain escorted safely', type: 'success' }
    ]
  },
  AR: {
    kpis: {
      activeRoutes: { value: '24', change: 'Frontier Network', changeType: 'neutral', subtitle: 'Tawang & Siang Corridors' },
      delayedRoutes: { value: '02', change: 'Sela Pass Snowfall', changeType: 'negative', subtitle: 'Altitude 4170m' },
      criticalAlerts: { value: '01', change: 'Sela Tunnel Bypass', changeType: 'negative', subtitle: 'Snow Clearance Active' },
      networkAvailability: { value: '88%', change: '+2.0% this week', changeType: 'positive', subtitle: 'Border Highway Paving' }
    },
    emergencyMetrics: { critical: 2, medical: 1, food: 2, closed: 0 },
    route: {
      id: 'route-tawang',
      name: 'Tezpur → Bomdila → Tawang (NH-13)',
      distanceKm: 330,
      normalTravelHours: '8h 30m',
      currentRisk: 'Moderate',
      weatherImpact: '+1h 15m',
      terrainRisk: 'Very High',
      roadDisruptionsCount: 1,
      aiConfidencePct: 88,
      status: 'warning'
    },
    whatChanged: [
      { type: 'up', title: 'Snowfall advisory at Sela Pass summit', text: 'BRO Project Vartak snow plows operational', color: 'text-[#D97706]' },
      { type: 'down', title: 'Sela Tunnel twin-tube bypass open', text: 'All-weather connectivity maintained', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '05:30 IST', title: 'High Altitude Snow Drift', detail: 'Temperature -3°C registered at Sela summit', type: 'warning' },
      { time: '06:45 IST', title: 'Convoy Clearance Cleared', detail: 'GREF escorts leading fuel convoy AR-01-D-7721', type: 'success' }
    ]
  },
  TR: {
    kpis: {
      activeRoutes: { value: '14', change: 'Tripura Transit Hub', changeType: 'neutral', subtitle: 'Churaibari - Agartala' },
      delayedRoutes: { value: '01', change: 'Border Checkpost', changeType: 'neutral', subtitle: 'Minor Stagnation' },
      criticalAlerts: { value: '00', change: 'All Clear', changeType: 'positive', subtitle: 'Corridors Nominal' },
      networkAvailability: { value: '98%', change: '+0.5% this week', changeType: 'positive', subtitle: 'Optimal Resilience' }
    },
    emergencyMetrics: { critical: 0, medical: 1, food: 1, closed: 0 },
    route: {
      id: 'R-NH8-AGARTALA',
      name: 'Guwahati → Badarpur → Agartala (NH-8)',
      distanceKm: 550,
      normalTravelHours: '14h 00m',
      currentRisk: 'Low',
      weatherImpact: '+15 min',
      terrainRisk: 'Low',
      roadDisruptionsCount: 0,
      aiConfidencePct: 95,
      status: 'safe'
    },
    whatChanged: [
      { type: 'down', title: 'Churaibari interstate corridor nominal', text: 'Fast-track priority freight lane active', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '08:00 IST', title: 'Daily Freight Dispatch', detail: 'Fuel and ration trucks cleared for Agartala depot', type: 'success' }
    ]
  },
  MN: {
    kpis: {
      activeRoutes: { value: '12', change: 'Manipur Lifeline', changeType: 'neutral', subtitle: 'Jiribam - Imphal Line' },
      delayedRoutes: { value: '02', change: 'Barak Fog Layer', changeType: 'negative', subtitle: 'Speed Advisory 35km/h' },
      criticalAlerts: { value: '01', change: 'NH-37 Hill Cuttings', changeType: 'negative', subtitle: 'Cautionary Convoy' },
      networkAvailability: { value: '82%', change: '+1.0% this week', changeType: 'positive', subtitle: 'Armed Escort Active' }
    },
    emergencyMetrics: { critical: 1, medical: 1, food: 2, closed: 0 },
    route: {
      id: 'R-NH37-IMPHAL',
      name: 'Silchar → Jiribam → Imphal (NH-37)',
      distanceKm: 250,
      normalTravelHours: '7h 30m',
      currentRisk: 'Moderate',
      weatherImpact: '+1h 45m',
      terrainRisk: 'High',
      roadDisruptionsCount: 1,
      aiConfidencePct: 86,
      status: 'warning'
    },
    whatChanged: [
      { type: 'up', title: 'Dense morning valley fog in Barak basin', text: 'Speed limits restricted to 30km/h for heavy tankers', color: 'text-[#D97706]' }
    ],
    timeline: [
      { time: '07:30 IST', title: 'Convoy Flag-off from Jiribam', detail: 'Ration supplies moving toward Imphal Valley', type: 'info' }
    ]
  },
  NL: {
    kpis: {
      activeRoutes: { value: '10', change: 'Nagaland Arterials', changeType: 'neutral', subtitle: 'Dimapur - Kohima Corridor' },
      delayedRoutes: { value: '01', change: 'Kohima Bypass', changeType: 'neutral', subtitle: 'Pavement Maintenance' },
      criticalAlerts: { value: '00', change: 'Normal Flow', changeType: 'positive', subtitle: 'Safe Transit' },
      networkAvailability: { value: '92%', change: '+0.5% this week', changeType: 'positive', subtitle: 'Highway 4-Lane' }
    },
    emergencyMetrics: { critical: 0, medical: 1, food: 1, closed: 0 },
    route: {
      id: 'R-NH29-KOHIMA',
      name: 'Dimapur → Kohima → Mao (NH-29)',
      distanceKm: 74,
      normalTravelHours: '2h 15m',
      currentRisk: 'Low',
      weatherImpact: '+10 min',
      terrainRisk: 'Moderate',
      roadDisruptionsCount: 0,
      aiConfidencePct: 93,
      status: 'safe'
    },
    whatChanged: [
      { type: 'down', title: 'NH-29 4-lane Asian Highway stretch clear', text: 'Smooth transit between Dimapur depot and Kohima', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '08:15 IST', title: 'Highway Patrol Update', detail: 'Zero blockages reported along Dimapur-Kohima ridge', type: 'success' }
    ]
  },
  MZ: {
    kpis: {
      activeRoutes: { value: '09', change: 'Mizoram Corridors', changeType: 'neutral', subtitle: 'Silchar - Aizawl Arterial' },
      delayedRoutes: { value: '01', change: 'Kolasib Landslip', changeType: 'neutral', subtitle: 'Cleared Single Lane' },
      criticalAlerts: { value: '00', change: 'Moderate Rain', changeType: 'positive', subtitle: 'Monitored Travel' },
      networkAvailability: { value: '91%', change: '+0.8% this week', changeType: 'positive', subtitle: 'Stable Ridges' }
    },
    emergencyMetrics: { critical: 0, medical: 1, food: 1, closed: 0 },
    route: {
      id: 'R-NH54-AIZAWL',
      name: 'Silchar → Kolasib → Aizawl (NH-54)',
      distanceKm: 180,
      normalTravelHours: '5h 30m',
      currentRisk: 'Low',
      weatherImpact: '+20 min',
      terrainRisk: 'Moderate',
      roadDisruptionsCount: 0,
      aiConfidencePct: 92,
      status: 'safe'
    },
    whatChanged: [
      { type: 'down', title: 'Kolasib sector road widening cleared', text: 'Two-way freight movement operational', color: 'text-[#16A34A]' }
    ],
    timeline: [
      { time: '07:00 IST', title: 'Routine Patrol Check', detail: 'Aizawl petroleum reserves refilled on schedule', type: 'success' }
    ]
  }
};

