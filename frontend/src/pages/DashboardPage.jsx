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
import { evaluateRouteDecision } from '../services/routeDecisionEngine';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isEmergencyMode, setIsEmergencyMode, setIsNewIncidentModalOpen } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected Route for Route Intelligence Panel
  const [selectedRoute, setSelectedRoute] = useState({
    id: 'route-tawang',
    name: 'Guwahati → Tawang',
    distanceKm: 447,
    normalTravelHours: '11h 42m',
    currentRisk: 'Moderate',
    weatherImpact: '+42 min',
    terrainRisk: 'High',
    roadDisruptionsCount: 2,
    aiConfidencePct: 87,
    status: 'warning'
  });

  // "Why This Route?" Risk Factors
  const riskFactors = [
    { label: 'Rainfall Risk', value: 82, color: 'bg-[#DC2626]' },
    { label: 'Historical Disruptions', value: 74, color: 'bg-[#D97706]' },
    { label: 'Terrain Slope', value: 68, color: 'bg-[#EA580C]' },
    { label: 'Road Surface Condition', value: 61, color: 'bg-[#0F766E]' },
    { label: 'Traffic Congestion', value: 43, color: 'bg-[#2563EB]' }
  ];

  // "WHAT CHANGED?" Dynamic Intelligence Stream
  const whatChangedItems = [
    { type: 'up', title: '3 new road disruptions reported in East Jaintia Hills', text: 'Landslide activity triggered by monsoon surge', color: 'text-[#DC2626]' },
    { type: 'up', title: 'Rainfall risk increased to 82% on NH-27', text: 'Continuous precipitation forecast for next 18 hours', color: 'text-[#D97706]' },
    { type: 'down', title: '2 previously blocked routes reopened', text: 'NH-10 Siliguri-Gangtok line cleared by BRO 44 BRTF', color: 'text-[#16A34A]' },
    { type: 'up', title: 'Route delay probability increased by 12%', text: 'Heavy convoy slowdowns near Sonapur portal', color: 'text-[#DC2626]' }
  ];

  // Disruption Vertical Timeline Events
  const timelineEvents = [
    { time: '08:42 IST', title: 'Heavy rainfall detected', detail: '140mm 24h intensity registered in Cachar sector', type: 'warning' },
    { time: '09:10 IST', title: 'Route risk increased', detail: 'NH-27 vulnerability score escalated to 87/100', type: 'critical' },
    { time: '09:26 IST', title: 'Landslide reported', detail: 'BRO field patrol confirmed 120m roadway blockage', type: 'critical' },
    { time: '09:34 IST', title: 'AI recalculated routes', detail: 'Evaluated 3 alternate corridors via Haflong Ridge', type: 'info' },
    { time: '09:41 IST', title: 'Alternative route recommended', detail: 'Route B preferred (-61% disruption exposure)', type: 'success' }
  ];

  // Priority Emergency Dispatch List
  const emergencyPriorities = [
    { rank: 1, category: 'Critical', supply: 'Medicine & Oxygen', destination: 'Tawang Civil Hospital', route: 'Route B Paved Bypass', eta: '6h 15m' },
    { rank: 2, category: 'High', supply: 'Ration Food Supplies', destination: 'Upper Siang Relief Hub', route: 'NH-29 Safe Corridor', eta: '8h 40m' },
    { rank: 3, category: 'High', supply: 'Diesel & Fuel Tankers', destination: 'Changlang Power Station', route: 'NH-08 Alternate', eta: '9h 10m' }
  ];

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        title: 'Telemetry Synced',
        message: 'Refreshed active GPS positions for 128 shipments across 47 corridors.',
        type: 'success'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      {/* Overview Header */}
      <PageHeader
        category="NORTH EAST LOGISTICS & ROUTE INTELLIGENCE"
        title="Good morning, Logistics Control"
        subtitle="Regional logistics intelligence and operational overview for North East India."
        badgeText="SYSTEM OPERATIONAL"
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

      {/* 4 KPI CARDS (Section 5 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ACTIVE ROUTES"
          value="128"
          unit="Corridors"
          change="Monitored"
          changeType="neutral"
          icon={Compass}
          accentColor="teal"
          subtitle="8 North East States"
        />
        <StatCard
          title="DELAYED ROUTES"
          value="17"
          unit="Corridors"
          change="+3 vs yesterday"
          changeType="negative"
          icon={AlertTriangle}
          accentColor="amber"
          subtitle="Monsoon Impact"
        />
        <StatCard
          title="CRITICAL ALERTS"
          value="08"
          unit="Active Hazards"
          change="Sonapur & Tawang"
          changeType="negative"
          icon={ShieldAlert}
          accentColor="red"
          subtitle="Immediate Action Req."
        />
        <StatCard
          title="NETWORK AVAILABILITY"
          value="94%"
          unit="Accessibility"
          change="+1.2% this week"
          changeType="positive"
          icon={Activity}
          accentColor="green"
          subtitle="Overall Resilience"
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
              <p className="text-xl font-extrabold text-[#DC2626] mt-0.5">12 Routes</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">MEDICAL SHIPMENTS</span>
              <p className="text-xl font-extrabold text-[#0F766E] mt-0.5">07 Shipments</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">FOOD SUPPLY ROUTES</span>
              <p className="text-xl font-extrabold text-[#D97706] mt-0.5">04 Corridors</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#FECACA]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">ROADS CLOSED</span>
              <p className="text-xl font-extrabold text-[#0F172A] mt-0.5">03 Passes</p>
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
