import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  MapPin,
  Clock,
  Radio,
  Plus
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { MOCK_VEHICLES } from '../data/mockVehicles';
import { useToast } from '../hooks/useToast';

export const VehiclesPage = () => {
  const { addToast } = useToast();
  const [vehicles] = useState(MOCK_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const vehicleColumns = [
    {
      key: 'regNumber',
      label: 'Registration / Fleet ID',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] font-mono text-xs">{val}</p>
          <p className="text-[10px] text-[#667085] font-sans">{row.agency}</p>
        </div>
      )
    },
    {
      key: 'driverName',
      label: 'Driver & Contact',
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#172033] text-xs font-sans">{val}</p>
          <p className="text-[10px] text-[#667085] font-mono">{row.driverPhone}</p>
        </div>
      )
    },
    {
      key: 'cargoCategory',
      label: 'Cargo Category',
      render: (val) => <span className="font-sans text-xs font-semibold text-[#172033]">{val}</span>
    },
    {
      key: 'status',
      label: 'Convoy Status',
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      key: 'locationName',
      label: 'Current Location',
      render: (val) => (
        <span className="font-mono text-[#667085] text-xs flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#155EEF]" />
          {val}
        </span>
      )
    },
    {
      key: 'speedKmh',
      label: 'Speed / Fuel',
      render: (val, row) => (
        <div className="font-mono text-xs">
          <p className="text-[#172033] font-bold">{val} km/h</p>
          <p className="text-[10px] text-[#667085]">Fuel: {row.fuelLevelPct}%</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      <PageHeader
        category="CONVOY TELEMETRY & ESSENTIAL FLEET MANAGEMENT"
        title="Supply Fleet & Vehicle Telemetry"
        subtitle="Real-time GPS tracking, driver communications, cargo priority status, and detour directives for logistics convoys."
        badgeText={`${vehicles.length} ACTIVE FLEETS`}
        actionButton={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              addToast({
                title: 'Dispatch New Convoy',
                message: 'Opened convoy dispatch manifest form.',
                type: 'info'
              });
            }}
          >
            Dispatch Convoy
          </Button>
        }
      />

      <DataTable
        columns={vehicleColumns}
        data={vehicles}
        searchPlaceholder="Search vehicle reg number, driver, agency, or location..."
        filterOptions={[
          { label: 'On Duty', value: 'on_duty' },
          { label: 'Delayed', value: 'delayed' },
          { label: 'Rerouted', value: 'rerouted' },
          { label: 'Halted', value: 'halted' }
        ]}
      />
    </div>
  );
};
