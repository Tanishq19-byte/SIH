import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Building2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { evaluateSupplyImpact } from '../services/supplyImpactEngine';
import { MOCK_ROUTES } from '../data/mockRoutes';
import { useToast } from '../hooks/useToast';

export const SuppliesPage = () => {
  const { addToast } = useToast();
  const [supplyResult, setSupplyResult] = useState(null);

  useEffect(() => {
    const impact = evaluateSupplyImpact(
      { recommendedRoute: { routeRiskScore: 39, etaHours: 7.5, etaDisplay: '7h 30m' }, routeA: { etaHours: 19.5 } },
      MOCK_ROUTES[0],
      { rainfall24h: 140 }
    );
    setSupplyResult(impact);
  }, []);

  const supplyColumns = [
    {
      key: 'supplyType',
      label: 'Essential Supply Stream',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] font-sans text-xs">{val}</p>
          <p className="text-[10px] text-[#667085] font-mono">{row.facility} ({row.district})</p>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => (
        <span className={`font-mono text-xs font-bold ${val === 'Critical' ? 'text-[#E5484D]' : 'text-[#D97706]'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'stockBufferDays',
      label: 'Stock Buffer (Days)',
      render: (val) => (
        <span className={`font-mono font-bold text-xs ${val <= 2 ? 'text-[#E5484D]' : 'text-[#16A34A]'}`}>
          {val} Days Remaining
        </span>
      )
    },
    {
      key: 'stockoutRisk',
      label: 'Stockout Risk',
      render: (val) => <Badge status={val.toLowerCase()} size="sm" />
    },
    {
      key: 'expectedDelayHours',
      label: 'Expected Transit Delay',
      render: (val) => <span className="font-mono text-[#D97706] font-bold text-xs">+{val} hours</span>
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      <PageHeader
        category="DISTRICT ESSENTIAL SUPPLIES & STOCKOUT RISK ENGINE"
        title="District Stocks & Emergency Inventory"
        subtitle="Track medical oxygen, vaccines, food grains, and fuel stockpiles across 8 North Eastern states."
        badgeText={`${supplyResult?.overallSupplyRisk || 'CRITICAL'} SHORTAGE RISK`}
        actionButton={
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              addToast({
                title: 'Supply Inventory Synced',
                message: 'Refreshed district stockpile balances from state health portals.',
                type: 'success'
              });
            }}
          >
            Sync Inventory
          </Button>
        }
      />

      <DataTable
        columns={supplyColumns}
        data={supplyResult?.rankedSupplies || []}
        searchPlaceholder="Search supply stream, facility, or district..."
      />
    </div>
  );
};
