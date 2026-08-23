import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Award,
  Clock,
  Activity,
  Building2
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { DataTable } from '../components/common/DataTable';
import { MOCK_ANALYTICS } from '../data/mockAnalytics';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';
import { NER_STATES } from '../data/mockRegions';

export const AnalyticsPage = () => {
  const { addToast } = useToast();
  const { selectedState } = useApp();

  // Active Time Range Filter: '7d', '30d', '90d'
  const [timeRange, setTimeRange] = useState('30d');
  const metrics = MOCK_ANALYTICS.timeRangeMetrics[timeRange] || MOCK_ANALYTICS.timeRangeMetrics['30d'];

  const currentStateName = NER_STATES.find((s) => s.id === selectedState)?.name || 'All NER States';

  // Filter district rankings if a specific state is selected
  const filteredDistricts = selectedState === 'all'
    ? MOCK_ANALYTICS.districtRankings
    : MOCK_ANALYTICS.districtRankings.filter((d) => {
        const s = NER_STATES.find((st) => st.id === selectedState);
        return d.state.toLowerCase().includes(s?.name.toLowerCase() || '') ||
               s?.name.toLowerCase().includes(d.state.toLowerCase());
      });

  const displayDistricts = filteredDistricts.length > 0 ? filteredDistricts : MOCK_ANALYTICS.districtRankings;

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    addToast({
      title: 'Analytics Filter Updated',
      message: `Updated metrics for ${range === '7d' ? 'Past 7 Days' : range === '30d' ? 'Past 30 Days' : 'Past 90 Days'}.`,
      type: 'info'
    });
  };

  const districtColumns = [
    {
      key: 'rank',
      label: 'Rank',
      render: (val) => <span className="font-mono font-extrabold text-[#0F766E] text-xs">#{val}</span>
    },
    {
      key: 'district',
      label: 'District HQ & State',
      render: (val, row) => (
        <div>
          <p className="font-extrabold text-[#0F172A] text-xs font-sans">{val}</p>
          <p className="text-[10px] text-[#64748B] font-mono">{row.state}</p>
        </div>
      )
    },
    {
      key: 'accessibilityIndex',
      label: 'Accessibility Index',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-extrabold text-xs ${
              val < 30 ? 'text-[#DC2626]' : val < 70 ? 'text-[#D97706]' : 'text-[#16A34A]'
            }`}
          >
            {val}%
          </span>
          <div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden hidden sm:block">
            <div
              className={`h-full ${val < 30 ? 'bg-[#DC2626]' : val < 70 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`}
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'isolationRisk',
      label: 'Isolation Risk',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          val.toLowerCase() === 'high'
            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
            : val.toLowerCase() === 'medium'
            ? 'bg-[#FFF7ED] text-[#D97706] border border-[#FFEDD5]'
            : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
        }`}>
          {val} RISK
        </span>
      )
    },
    {
      key: 'primaryCorridor',
      label: 'Primary Lifeline Route',
      render: (val, row) => (
        <span className="font-mono text-[#475569] text-xs font-bold">
          {val || (row.district.includes('Silchar') ? 'NH-27 / Haflong Detour' : row.district.includes('Gangtok') ? 'NH-10 Teesta Corridor' : 'NH-29 / NH-8 Trunk')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#0F172A]">
      {/* Header Bar */}
      <PageHeader
        category="NORTH EAST REGIONAL LOGISTICS ANALYTICS"
        title="Regional Logistics & Route Performance Analytics"
        subtitle={`Historical corridor reliability trends, district isolation risk rankings, and AI disruption statistics for ${currentStateName}.`}
        badgeText={`${timeRange.toUpperCase()} ANALYTICS`}
        actionButton={
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] font-sans text-xs shadow-2xs">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => handleTimeRangeChange(r)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="AVG ROUTE RELIABILITY"
          value={`${metrics.routeReliabilityPct}%`}
          unit="Network Score"
          change="+2.4% vs Last Month"
          changeType="positive"
          icon={Activity}
          accentColor="teal"
          subtitle="47 Monitored NER Highways"
        />
        <StatCard
          title="TOTAL DISRUPTIONS"
          value={metrics.disruptionEventsCount}
          unit="Events"
          change="48% Landslides"
          changeType="neutral"
          icon={ShieldAlert}
          accentColor="amber"
          subtitle="Monsoonal Debris & Inflow"
        />
        <StatCard
          title="AVG CLEARANCE TIME"
          value={`${metrics.avgClearanceResponseHours}h`}
          unit="Response"
          change="-2.1h vs 2024 Baseline"
          changeType="positive"
          icon={Clock}
          accentColor="blue"
          subtitle="BRO & PWD Task Forces"
        />
        <StatCard
          title="AI REROUTE EFFICIENCY"
          value={`${metrics.supplyDeliverySuccessPct}%`}
          unit="Success Rate"
          change="+14.2h Saved / Convoy"
          changeType="positive"
          icon={Award}
          accentColor="purple"
          subtitle="94.2% AI Model Accuracy"
        />
      </div>

      {/* District Accessibility Rankings Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0F766E]" />
            District Isolation Risk & Lifeline Rankings ({currentStateName})
          </h3>
        </div>

        <DataTable
          columns={districtColumns}
          data={displayDistricts}
          searchPlaceholder="Search district HQ, state, or lifeline corridor..."
        />
      </div>
    </div>
  );
};
