export const MOCK_ANALYTICS = {
  executiveInsights: [
    {
      id: 1,
      title: 'District Disruption Spike',
      text: 'District Cachar (Silchar HQ) experienced 23% more disruptions this month due to Sonapur mudslides.',
      category: 'Disruption Alert',
      severity: 'high'
    },
    {
      id: 2,
      title: 'Cargo Priority Delay Pattern',
      text: 'Medicine & Cryogenic Oxygen deliveries had the highest priority-delay rate during cloudburst events.',
      category: 'Logistics Vulnerability',
      severity: 'critical'
    },
    {
      id: 3,
      title: 'Most Disrupted Corridor',
      text: 'Corridor NH-27 (Guwahati-Silchar) is the most frequently disrupted route in the North Eastern Region.',
      category: 'Corridor Performance',
      severity: 'warning'
    },
    {
      id: 4,
      title: 'AI Rerouting Efficiency',
      text: 'AI dynamic rerouting saved an estimated 112 hours of total transit delay over the past 30 days.',
      category: 'AI ROI Metric',
      severity: 'success'
    }
  ],
  timeRangeMetrics: {
    '7d': {
      routeReliabilityPct: 81.2,
      districtAccessibilityIndex: 82.5,
      avgDeliveryDelayHours: 3.8,
      disruptionEventsCount: 5,
      avgClearanceResponseHours: 3.4,
      vehicleUtilizationPct: 88.5,
      supplyDeliverySuccessPct: 99.5
    },
    '30d': {
      routeReliabilityPct: 78.4,
      districtAccessibilityIndex: 78.4,
      avgDeliveryDelayHours: 8.5,
      disruptionEventsCount: 14,
      avgClearanceResponseHours: 4.2,
      vehicleUtilizationPct: 91.2,
      supplyDeliverySuccessPct: 99.2
    },
    '90d': {
      routeReliabilityPct: 72.1,
      districtAccessibilityIndex: 71.0,
      avgDeliveryDelayHours: 12.4,
      disruptionEventsCount: 42,
      avgClearanceResponseHours: 5.8,
      vehicleUtilizationPct: 93.8,
      supplyDeliverySuccessPct: 98.4
    }
  },
  monthlyAccessibilityTrends: [
    { month: 'Jan', score: 88, incidents: 4, avgDelayHours: 1.2 },
    { month: 'Feb', score: 91, incidents: 3, avgDelayHours: 0.9 },
    { month: 'Mar', score: 85, incidents: 6, avgDelayHours: 1.8 },
    { month: 'Apr', score: 79, incidents: 11, avgDelayHours: 3.4 },
    { month: 'May', score: 71, incidents: 19, avgDelayHours: 6.8 },
    { month: 'Jun', score: 62, incidents: 28, avgDelayHours: 12.4 },
    { month: 'Jul', score: 54, incidents: 36, avgDelayHours: 18.2 },
    { month: 'Aug (Current)', score: 78, incidents: 14, avgDelayHours: 8.5 }
  ],
  corridorRiskMatrix: [
    { id: 'R-1', name: 'NH-27 Guwahati-Silchar', terrain: 'Hilly / Slime', monsoonRisk: 'Extremely High', bottleneckFreq: 14, responseHours: 6.5 },
    { id: 'R-2', name: 'NH-54 Silchar-Aizawl', terrain: 'Clayey Soil Slip', monsoonRisk: 'Critical', bottleneckFreq: 16, responseHours: 8.2 },
    { id: 'R-3', name: 'NH-10 Siliguri-Gangtok', terrain: 'Gorge / Riverine', monsoonRisk: 'High', bottleneckFreq: 9, responseHours: 4.8 },
    { id: 'R-4', name: 'NH-08 Guwahati-Agartala', terrain: 'Valley Waterlogging', monsoonRisk: 'Medium', bottleneckFreq: 6, responseHours: 3.2 },
    { id: 'R-5', name: 'NH-29 Dimapur-Kohima', terrain: 'Tectonic Basins', monsoonRisk: 'Medium-High', bottleneckFreq: 7, responseHours: 4.0 }
  ],
  disruptionCategoryShare: [
    { category: 'Landslides & Debris Slips', percentage: 48, count: 68, color: '#EF4444' },
    { category: 'Flash Flood Submersion', percentage: 24, count: 34, color: '#F59E0B' },
    { category: 'Bridge & Culvert Washouts', percentage: 16, count: 22, color: '#6366F1' },
    { category: 'Road Subsidence', percentage: 12, count: 17, color: '#00F0FF' }
  ],
  districtRankings: [
    { rank: 1, district: 'Kohima District', state: 'Nagaland', accessibilityIndex: 92, status: 'Healthy', isolationRisk: 'Low' },
    { rank: 2, district: 'East Khasi Hills (Shillong)', state: 'Meghalaya', accessibilityIndex: 88, status: 'Healthy', isolationRisk: 'Low' },
    { rank: 3, district: 'West Tripura (Agartala)', state: 'Tripura', accessibilityIndex: 65, status: 'Moderate', isolationRisk: 'Medium' },
    { rank: 4, district: 'Gangtok District', state: 'Sikkim', accessibilityIndex: 58, status: 'Warning', isolationRisk: 'Medium' },
    { rank: 5, district: 'Cachar (Silchar HQ)', state: 'Assam', accessibilityIndex: 22, status: 'Critical', isolationRisk: 'High' },
    { rank: 6, district: 'Kolasib / Aizawl North', state: 'Mizoram', accessibilityIndex: 18, status: 'Critical', isolationRisk: 'High' }
  ]
};
