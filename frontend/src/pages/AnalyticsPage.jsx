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

export const AnalyticsPage = () => {
  const { addToast } = useToast();

  // Active Time Range Filter: '7d', '30d', '90d'
  const [timeRange, setTimeRange] = useState('30d');
  const metrics = MOCK_ANALYTICS.timeRangeMetrics[timeRange] || MOCK_ANALYTICS.timeRangeMetrics['30d'];

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
      render: (val) => <span className="font-mono font-bold text-[#155EEF] text-xs">#{val}</span>
    },
    {
      key: 'district',
      label: 'District HQ & State',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] text-xs font-sans">{val}</p>
          <p className="text-[10px] text-[#667085] font-mono">{row.state}</p>
        </div>
      )
    },
    {
      key: 'accessibilityIndex',
      label: 'Accessibility Index',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-bold text-xs ${
              val < 30 ? 'text-[#E5484D]' : val < 70 ? 'text-[#D97706]' : 'text-[#16A34A]'
            }`}
          >
            {val}%
          </span>
          <div className="w-20 h-1.5 bg-[#E4EAF2] rounded-full overflow-hidden hidden sm:block">
            <div
              className={`h-full ${val < 30 ? 'bg-[#E5484D]' : val < 70 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`}
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
        <Badge status={val.toLowerCase() === 'high' ? 'critical' : val.toLowerCase() === 'medium' ? 'warning' : 'operational'} size="sm">
          {val.toUpperCase()} RISK
        </Badge>
      )
    },
    {
      key: 'primaryCorridor',
      label: 'Primary Lifeline Route',
      render: (val) => <span className="font-mono text-[#667085] text-xs font-medium">{val}</span>
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      {/* Header Bar */}
      <PageHeader
        category="NORTH EAST REGIONAL LOGISTICS ANALYTICS"
        title="Regional Logistics & Route Performance Analytics"
        subtitle="Historical corridor reliability trends, district isolation risk rankings, disruption frequency, and AI model evaluation metrics."
        badgeText="30-DAY ANALYTICS"
        actionButton={
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E4EAF2] font-mono text-xs shadow-xs">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => handleTimeRangeChange(r)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                  timeRange === r ? 'bg-[#155EEF] text-white shadow-xs' : 'text-[#667085] hover:text-[#172033]'
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
          value={`${metrics.avgAccessibilityPct}%`}
          unit="Network Score"
          change={metrics.accessibilityTrend}
          changeType="positive"
          icon={Activity}
          accentColor="teal"
          subtitle="47 Monitored Highways"
        />
        <StatCard
          title="TOTAL DISRUPTIONS"
          value={metrics.totalDisruptionsCount}
          unit="Events"
          change={`${metrics.landslidePct}% Landslides`}
          changeType="neutral"
          icon={ShieldAlert}
          accentColor="amber"
          subtitle="Monsoon Impact"
        />
        <StatCard
          title="AVG CLEARANCE TIME"
          value={`${metrics.avgDisruptionHours}h`}
          unit="Clearance"
          change="-2.1h vs 2024 Baseline"
          changeType="positive"
          icon={Clock}
          accentColor="blue"
          subtitle="BRO & PWD Operations"
        />
        <StatCard
          title="AI REROUTE EFFICIENCY"
          value={`${metrics.aiRerouteSuccessRatePct}%`}
          unit="Success Rate"
          change="+14.2h Saved / Convoy"
          changeType="positive"
          icon={Award}
          accentColor="purple"
          subtitle="94.2% Model Accuracy"
        />
      </div>

      {/* District Accessibility Rankings Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider font-mono flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#155EEF]" />
          District Isolation Risk & Lifeline Rankings
        </h3>

        <DataTable
          columns={districtColumns}
          data={MOCK_ANALYTICS.districtRankings}
          searchPlaceholder="Search district HQ, state, or lifeline corridor..."
        />
      </div>
    </div>
  );
};
