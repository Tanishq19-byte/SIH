import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Truck,
  AlertTriangle,
  Compass,
  ArrowRight,
  BrainCircuit,
  Radio,
  Plus,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Fuel,
  CloudRain,
  TrendingUp,
  X,
  Info,
  Sparkles,
  Zap,
  TrendingDown,
  Check,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { MapView } from '../components/map/MapView';

import { MOCK_ROUTES } from '../data/mockRoutes';
import { STATE_DASHBOARD_DATA, NER_STATES } from '../data/mockRegions';
import { evaluateRouteDecision } from '../services/routeDecisionEngine';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isEmergencyMode, setIsEmergencyMode, setIsNewIncidentModalOpen, selectedState } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active state data based on dropdown selection
  const stateData = STATE_DASHBOARD_DATA[selectedState] || STATE_DASHBOARD_DATA.all;
  const stateName = NER_STATES.find(s => s.id === selectedState)?.name || 'All NER States';

  // Selected Route for Route Intelligence Panel (adapts when region changes)
  const [selectedRoute, setSelectedRoute] = useState(stateData.route);

  useEffect(() => {
    if (stateData?.route) {
      setSelectedRoute(stateData.route);
    }
  }, [selectedState]);

  // "Why This Route?" Risk Factors
  const riskFactors = [
    { label: 'Rainfall Risk', value: stateData.route.status === 'critical' ? 92 : stateData.route.status === 'warning' ? 74 : 22, color: 'bg-[#DC2626]' },
    { label: 'Historical Disruptions', value: stateData.route.status === 'critical' ? 88 : stateData.route.status === 'warning' ? 62 : 18, color: 'bg-[#D97706]' },
    { label: 'Terrain Slope', value: stateData.route.terrainRisk === 'Very High' ? 84 : stateData.route.terrainRisk === 'High' ? 68 : 32, color: 'bg-[#EA580C]' },
    { label: 'Road Surface Condition', value: stateData.route.status === 'critical' ? 78 : stateData.route.status === 'warning' ? 54 : 15, color: 'bg-[#0F766E]' },
    { label: 'Traffic Congestion', value: stateData.route.status === 'critical' ? 64 : 35, color: 'bg-[#2563EB]' }
  ];

  // Dynamic Intelligence Stream
  const whatChangedItems = stateData.whatChanged || STATE_DASHBOARD_DATA.all.whatChanged;

  // Disruption Vertical Timeline Events
  const timelineEvents = stateData.timeline || STATE_DASHBOARD_DATA.all.timeline;

  // Priority Emergency Dispatch List
  const emergencyPriorities = [
    { rank: 1, category: 'Critical', supply: 'Medicine & Oxygen', destination: `${stateName} Relief Center`, route: 'Priority Escort Corridor', eta: '4h 15m' },
    { rank: 2, category: 'High', supply: 'Ration Food Supplies', destination: `${stateName} Civil Supplies`, route: 'Safe Trunk Corridor', eta: '6h 40m' },
    { rank: 3, category: 'High', supply: 'Diesel & Fuel Tankers', destination: `${stateName} Power Station`, route: 'Standard Alternate', eta: '7h 10m' }
  ];

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        title: 'Telemetry Synced',
        message: `Refreshed telemetry for ${stateName} across monitored corridors.`,
        type: 'success'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      {/* Overview Header */}
      <PageHeader
        category="NORTH EAST LOGISTICS & ROUTE INTELLIGENCE"
        title={`Good morning, ${stateName} Logistics Control`}
        subtitle={`Operational intelligence and active corridor health for ${stateName}.`}
        badgeText={stateData.kpis.criticalAlerts.value !== '00' ? `${stateData.kpis.criticalAlerts.value} HAZARDS ACTIVE` : 'CORRIDORS NOMINAL'}
        actionButton={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              isLoading={isRefreshing}
              onClick={handleRefreshData}
            >
              Refresh Telemetry
            </Button>
            <Button
              variant={isEmergencyMode ? 'danger' : 'outline'}
              size="sm"
              icon={Zap}
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            >
              {isEmergencyMode ? 'Exit Emergency Mode' : 'Emergency Mode'}
            </Button>
          </div>
        }
      />

      {/* 4 DYNAMIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ACTIVE ROUTES"
          value={stateData.kpis.activeRoutes.value}
          unit="Corridors"
          change={stateData.kpis.activeRoutes.change}
          changeType={stateData.kpis.activeRoutes.changeType}
          icon={Compass}
          accentColor="teal"
          subtitle={stateData.kpis.activeRoutes.subtitle}
        />
        <StatCard
          title="DELAYED ROUTES"
          value={stateData.kpis.delayedRoutes.value}
          unit="Corridors"
          change={stateData.kpis.delayedRoutes.change}
          changeType={stateData.kpis.delayedRoutes.changeType}
          icon={AlertTriangle}
          accentColor="amber"
          subtitle={stateData.kpis.delayedRoutes.subtitle}
        />
        <StatCard
          title="CRITICAL ALERTS"
          value={stateData.kpis.criticalAlerts.value}
          unit="Active Hazards"
          change={stateData.kpis.criticalAlerts.change}
          changeType={stateData.kpis.criticalAlerts.changeType}
          icon={ShieldAlert}
          accentColor="red"
          subtitle={stateData.kpis.criticalAlerts.subtitle}
        />
        <StatCard
          title="NETWORK AVAILABILITY"
          value={stateData.kpis.networkAvailability.value}
          unit="Accessibility"
          change={stateData.kpis.networkAvailability.change}
          changeType={stateData.kpis.networkAvailability.changeType}
          icon={Activity}
          accentColor="green"
          subtitle={stateData.kpis.networkAvailability.subtitle}
        />
      </div>

      {/* EMERGENCY OPERATIONS PANEL OVERLAY (Section 10) */}
      {isEmergencyMode && (
        <div className="bg-[#FEF2F2] border-2 border-[#DC2626] p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#FECACA] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#DC2626] animate-bounce" />
              <h2 className="text-base font-extrabold text-[#991B1B] uppercase tracking-wide">
                EMERGENCY OPERATIONS ACTIVE
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#DC2626] text-white">
              PRIORITY DIRECTIVE DISPATCH
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">CRITICAL ROUTES</span>
              <p className="text-xl font-extrabold text-[#DC2626] mt-0.5">{stateData.emergencyMetrics.critical} Routes</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">MEDICAL SHIPMENTS</span>
              <p className="text-xl font-extrabold text-[#0F766E] mt-0.5">{stateData.emergencyMetrics.medical} Shipments</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">FOOD SUPPLY ROUTES</span>
              <p className="text-xl font-extrabold text-[#D97706] mt-0.5">{stateData.emergencyMetrics.food} Corridors</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">ROADS CLOSED</span>
              <p className="text-xl font-extrabold text-[#0F172A] mt-0.5">{stateData.emergencyMetrics.closed} Passes</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider block">
              AI Priority Recommendation Matrix
            </span>
            <div className="space-y-2 text-xs">
              {emergencyPriorities.map((item) => (
                <div key={item.rank} className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#DC2626] text-white font-mono font-bold flex items-center justify-center text-xs">
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-bold text-[#0F172A]">{item.supply} &rarr; <span className="text-[#0F766E]">{item.destination}</span></p>
                      <p className="text-[11px] text-[#64748B]">Assigned Path: {item.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#0F766E] font-bold">ETA: {item.eta}</span>
                    <Badge status="critical" size="sm">{item.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAP-CENTRIC LAYOUT GRID (Section 6 & Section 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Centerpiece (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0F766E]" />
              Geospatial Corridor Network
            </h3>

            {/* Semantic Risk Color Legend (Section 6) */}
            <div className="flex items-center gap-3 text-[11px] text-[#0F172A] bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs font-sans">
              <span className="text-[#64748B] font-bold uppercase text-[10px]">Legend:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Safe</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span> High Risk</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> Critical</span>
            </div>
          </div>

          <MapView
            height="h-[540px]"
            selectedRouteId={selectedRoute?.id}
            onSelectRoute={(rt) => setSelectedRoute(rt)}
          />
        </div>

        {/* ROUTE INTELLIGENCE PANEL (Section 7) (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title="ROUTE INTELLIGENCE"
            subtitle={selectedRoute.name}
            action={
              <Badge status={selectedRoute.status} size="sm">
                {selectedRoute.currentRisk.toUpperCase()} RISK
              </Badge>
            }
          >
            <div className="space-y-4 text-xs font-sans">
              {/* Route Summary Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Distance</span>
                  <span className="font-bold text-[#0F172A] text-sm">{selectedRoute.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Estimated Time</span>
                  <span className="font-bold text-[#0F766E] text-sm">{selectedRoute.normalTravelHours}</span>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Weather Impact</span>
                  <span className="font-bold text-[#D97706] text-xs">{selectedRoute.weatherImpact}</span>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">AI Confidence</span>
                  <span className="font-bold text-[#2563EB] text-xs">{selectedRoute.aiConfidencePct}%</span>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-3.5 rounded-xl bg-[#CCFBF1] border border-[#99F6E4] space-y-1.5">
                <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">
                  AI RECOMMENDATION
                </span>
                <p className="text-xs font-bold text-[#0F172A] leading-snug">
                  "Route B is currently preferred because the primary corridor has elevated landslide probability and heavy rainfall risk."
                </p>
              </div>

              {/* "Why This Route?" Factor Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">
                  WHY THIS ROUTE?
                </span>

                <div className="space-y-2 text-[11px]">
                  {riskFactors.map((factor) => (
                    <div key={factor.label} className="space-y-1">
                      <div className="flex justify-between text-[#0F172A] font-medium">
                        <span>{factor.label}</span>
                        <span className="font-bold">{factor.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div className={`h-full ${factor.color}`} style={{ width: `${factor.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold"
                onClick={() => navigate('/operations')}
              >
                Inspect Decision Evidence &rarr;
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* "WHAT CHANGED?" & DISRUPTION TIMELINE ROW (Section 8 & Section 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* "WHAT CHANGED?" Panel (Section 8) */}
        <Card title="WHAT CHANGED?" subtitle="Real-time situational intelligence and environmental event stream">
          <div className="space-y-3 text-xs font-sans">
            {whatChangedItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                <span className={`text-base font-bold ${item.color}`}>
                  {item.type === 'up' ? '↑' : '↓'}
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-[#0F172A]">{item.title}</p>
                  <p className="text-[11px] text-[#64748B]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Disruption Timeline (Section 9) */}
        <Card title="REGIONAL DISRUPTION TIMELINE" subtitle="Chronological sequence of verified field hazard events">
          <div className="relative pl-6 space-y-4 text-xs font-sans border-l-2 border-[#E2E8F0] ml-2">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    evt.type === 'critical'
                      ? 'bg-[#DC2626]'
                      : evt.type === 'warning'
                      ? 'bg-[#D97706]'
                      : evt.type === 'success'
                      ? 'bg-[#16A34A]'
                      : 'bg-[#2563EB]'
                  }`}
                />
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-[#0F172A]">{evt.title}</p>
                  <span className="font-mono text-[10px] text-[#64748B]">{evt.time}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5">{evt.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SHIPMENT PRIORITY INVENTORY (Section 11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#0F766E]" />
            Active Cargo Shipments & Priority Allocation
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')}>
            View All Shipments &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-[#FECACA] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#DC2626]">Critical Priority</span>
              <Badge status="critical" size="sm">CRITICAL</Badge>
            </div>
            <p className="text-base font-extrabold text-[#0F172A]">Medicine & Emergency Oxygen</p>
            <p className="text-[11px] text-[#64748B]">Assigned highest priority in route calculation</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#FDE68A] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D97706]">High Priority</span>
              <Badge status="warning" size="sm">HIGH</Badge>
            </div>
            <p className="text-base font-extrabold text-[#0F172A]">Ration Grains & Fuel Supplies</p>
            <p className="text-[11px] text-[#64748B]">Assigned secondary detour preference</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#BAE6FD] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0284C7]">Normal Priority</span>
              <Badge status="medium" size="sm">NORMAL</Badge>
            </div>
            <p className="text-base font-extrabold text-[#0F172A]">Construction & Infrastructure</p>
            <p className="text-[11px] text-[#64748B]">Standard scheduling allocation</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#64748B]">Low Priority</span>
              <Badge status="low" size="sm">LOW</Badge>
            </div>
            <p className="text-base font-extrabold text-[#0F172A]">Commercial Cargo & Goods</p>
            <p className="text-[11px] text-[#64748B]">Standard non-urgent freight</p>
          </div>
        </div>
      </div>
    </div>
  );
};
