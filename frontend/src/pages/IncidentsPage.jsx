import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  MapPin,
  Send,
  Search,
  Zap
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MOCK_INCIDENTS } from '../data/mockIncidents';
import { useToast } from '../hooks/useToast';

export const IncidentsPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents] = useState(MOCK_INCIDENTS);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Field Reporting State
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Landslide');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reporterName, setReporterName] = useState('Field Inspector (Command App)');
  const [reporterAgency] = useState('BRO 44 BRTF / NHIDCL Patrol');

  // Ground Telemetry "WHAT CHANGED?" Live Event Log
  const [liveChanges] = useState([
    {
      id: 'CHG-101',
      timestamp: '11:42 AM IST',
      event: 'Heavy Rainfall Telemetry Triggered',
      details: 'Rainfall exceeded 140mm in Cachar sector. Landslide disruption probability increased to 88%.',
      impact: 'Route A risk score escalated from 65 to 100/100.',
      action: 'Alternative Route B Bypass recommended by AI engine.'
    },
    {
      id: 'CHG-102',
      timestamp: '11:15 AM IST',
      event: 'Road Subsidence Reported at Sonapur Portal',
      details: 'BRO 44 BRTF patrol confirmed structural mudslide over 120m roadway span.',
      impact: 'NH-27 Highway corridor status marked BLOCKED.',
      action: 'Emergency Oxygen Convoy V-NER-8891 assigned priority detour.'
    },
    {
      id: 'CHG-103',
      timestamp: '10:50 AM IST',
      event: 'Teesta River Gauge Level Alert',
      details: 'Water level reached 89% saturation capacity at Melli Bridge crossing.',
      impact: 'Expected delay increased +3.5h for vaccine transport fleet.',
      action: 'Route ranking updated for Siliguri-Gangtok lifeline corridor.'
    }
  ]);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      searchQuery === '' ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || inc.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || inc.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-[#172033]">
      {/* Header */}
      <PageHeader
        category="DISRUPTION CENTER & FIELD PATROL TELEMETRY"
        title="Disruptions & Ground Situation Intelligence"
        subtitle="Monitor verified field hazards, landslides, washouts, and road damage across the North Eastern Region."
        badgeText={`${incidents.length} VERIFIED HAZARDS`}
        actionButton={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setActiveTab(activeTab === 'field_report' ? 'dashboard' : 'field_report')}
            >
              {activeTab === 'field_report' ? 'Back to Dashboard' : 'Report Ground Incident'}
            </Button>
          </div>
        }
      />

      {/* "WHAT CHANGED?" LIVE CHANGE DETECTION SECTION */}
      <div className="px-1">
        <div className="bg-white border border-[#E4EAF2] p-4 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E4EAF2] pb-2">
            <span className="text-xs font-bold text-[#155EEF] uppercase font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              "WHAT CHANGED?" — Live Situation & Telemetry Change Detection
            </span>
            <span className="text-[10px] font-mono text-[#667085]">Derived from active field telemetry & sensor feeds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {liveChanges.map((chg) => (
              <div key={chg.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#155EEF] font-bold">{chg.event}</span>
                  <span className="text-[#667085]">{chg.timestamp}</span>
                </div>
                <p className="text-[#172033] font-sans text-xs">{chg.details}</p>
                <div className="pt-1 border-t border-[#E4EAF2] text-[10px] space-y-0.5 font-sans">
                  <span className="text-[#E5484D] block font-bold">Impact: {chg.impact}</span>
                  <span className="text-[#0F9D8A] block font-bold">Action: {chg.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DISRUPTION MONITORING DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E4EAF2] p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#667085]" />
              <input
                type="text"
                placeholder="Filter disruptions by highway, district, hazard type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-[#172033] placeholder-[#98A2B3] focus:outline-none w-full font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-white border border-[#E4EAF2] text-[#172033] px-2.5 py-1 rounded-lg focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-[#E4EAF2] text-[#172033] px-2.5 py-1 rounded-lg focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="landslide">Landslide</option>
                <option value="flood">Flood</option>
                <option value="road damage">Road Damage</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`p-4 rounded-xl border space-y-3 bg-white shadow-xs transition-all ${
                  inc.severity === 'Critical'
                    ? 'border-[#FCA5A5]'
                    : inc.severity === 'High'
                    ? 'border-[#FDBA74]'
                    : 'border-[#E4EAF2]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Badge status={inc.severity.toLowerCase()} size="sm">
                    {inc.severity.toUpperCase()} HAZARD
                  </Badge>
                  <span className="text-[10px] text-[#667085]">{inc.reportedAt || 'Just now'}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#172033] font-sans">{inc.title}</h4>
                  <p className="text-[11px] text-[#667085] mt-0.5 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#155EEF]" />
                    {inc.location}, {inc.district} ({inc.state})
                  </p>
                </div>

                <p className="text-xs text-[#172033] font-sans leading-relaxed">
                  {inc.impactSummary || inc.description}
                </p>

                <div className="pt-2 border-t border-[#E4EAF2] flex items-center justify-between text-[10px]">
                  <span className="text-[#667085]">Reporter: <strong className="text-[#172033]">{inc.reporterAgency}</strong></span>
                  <span className="text-[#155EEF] font-bold">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FIELD REPORTING FORM */}
      {activeTab === 'field_report' && (
        <Card title="FIELD INCIDENT REPORT FORM" subtitle="Submit verified ground disaster telemetries & photos">
          <form className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Major Mudslide at Sonapur Tunnel Portal"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3 py-2 rounded-xl focus:outline-none focus:border-[#155EEF] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Hazard Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3 py-2 rounded-xl focus:outline-none font-sans"
                >
                  <option value="Landslide">Landslide / Slope Collapse</option>
                  <option value="Flood">Flash Flood / River Swell</option>
                  <option value="Road damage">Road Subsidence / Pothole Scour</option>
                  <option value="Bridge issue">Bridge Structural Damage</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Location Description</label>
                <input
                  type="text"
                  placeholder="e.g. NH-27 Km 142.5 near East Jaintia Hills"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3 py-2 rounded-xl focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#667085] uppercase text-[10px] font-bold">Reporting Officer & Agency</label>
                <input
                  type="text"
                  value={`${reporterName} (${reporterAgency})`}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] px-3 py-2 rounded-xl focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#667085] uppercase text-[10px] font-bold">Detailed Impact Summary</label>
              <textarea
                rows={3}
                placeholder="Describe road blockage extent, convoy delays, and machinery requirements..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="w-full bg-[#F5F8FC] border border-[#E4EAF2] text-[#172033] p-3 rounded-xl focus:outline-none font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('dashboard')}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={(e) => {
                  e.preventDefault();
                  addToast({
                    title: 'Disruption Incident Submitted',
                    message: `Verified hazard report logged for ${reportTitle || 'Sonapur Mudslide'}. Updated live telemetry feed.`,
                    type: 'success'
                  });
                  setActiveTab('dashboard');
                }}
              >
                Submit Ground Report
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
