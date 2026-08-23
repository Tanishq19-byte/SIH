import React from 'react';
import { Settings, ShieldCheck, Key, Bell, Database, Save } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';

export const SettingsPage = () => {
  const { addToast } = useToast();

  const handleSaveSettings = () => {
    addToast({
      title: 'Platform Configurations Saved',
      message: 'Updated threshold triggers, agency API endpoints, and alert notification gateways.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      <PageHeader
        category="Platform Administration"
        title="NER-SmartRoute AI Command Settings"
        subtitle="Manage regional alert thresholds, agency integrations (NHIDCL, BRO, NDMA), API keys, and notification triggers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* Alert Thresholds Card */}
        <Card title="Alert Threshold Configurations" subtitle="Set trigger sensitivity for automated alerts">
          <div className="space-y-4 font-sans">
            <div>
              <label className="block font-bold text-[#172033] mb-1 font-mono text-xs">Landslide Risk Auto-Trigger Percentage</label>
              <input
                type="number"
                defaultValue={85}
                className="w-full bg-[#F5F8FC] border border-[#E4EAF2] rounded-xl p-3 text-[#172033] focus:outline-none focus:border-[#155EEF] font-mono text-xs"
              />
              <p className="text-[10px] text-[#667085] mt-1 font-sans">Triggers high-priority reroute alert when model risk exceeds this score.</p>
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1 font-mono text-xs">Oxygen Tanker Delay Tolerance (Hours)</label>
              <input
                type="number"
                defaultValue={2.0}
                step="0.5"
                className="w-full bg-[#F5F8FC] border border-[#E4EAF2] rounded-xl p-3 text-[#172033] focus:outline-none focus:border-[#155EEF] font-mono text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Agency API Credentials Card */}
        <Card title="Agency Integration Keys" subtitle="Connected telemetry & weather data providers">
          <div className="space-y-4 font-sans">
            <div>
              <label className="block font-bold text-[#172033] mb-1 font-mono text-xs">NHIDCL Field Telemetry API Key</label>
              <input
                type="password"
                defaultValue="nhidcl_live_key_9921841289419"
                className="w-full bg-[#F5F8FC] border border-[#E4EAF2] rounded-xl p-3 text-[#172033] font-mono focus:outline-none focus:border-[#155EEF] text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1 font-mono text-xs">IMD Satellite Doppler Weather Endpoint</label>
              <input
                type="text"
                defaultValue="https://api.imd.gov.in/v1/ner-radar"
                className="w-full bg-[#F5F8FC] border border-[#E4EAF2] rounded-xl p-3 text-[#172033] font-mono focus:outline-none focus:border-[#155EEF] text-xs"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="md" icon={Save} onClick={handleSaveSettings} className="bg-[#155EEF] text-white font-bold">
          Save Command Settings
        </Button>
      </div>
    </div>
  );
};
