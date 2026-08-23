import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  BrainCircuit,
  Truck,
  CheckCheck,
  ShieldAlert,
  Search,
  Filter,
  Sparkles,
  CloudRain,
  MapPin,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { AlertDetailModal } from '../common/AlertDetailModal';
import { useToast } from '../../hooks/useToast';

export const NotificationCenter = () => {
  const { isNotificationOpen, setIsNotificationOpen, setUnreadNotificationsCount } = useApp();
  const { addToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsList, setAlertsList] = useState(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null);

  if (!isNotificationOpen) return null;

  const handleMarkAllRead = () => {
    setAlertsList(prev => prev.map(a => ({ ...a, isRead: true })));
    setUnreadNotificationsCount(0);
    addToast({
      title: 'Alerts Marked as Read',
      message: 'Cleared unread notifications badge.',
      type: 'info'
    });
  };

  const filteredAlerts = alertsList.filter((a) => {
    if (activeCategory !== 'all' && a.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (activeSeverity !== 'all' && a.severity.toLowerCase() !== activeSeverity.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.summary.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.affectedVehicle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      {/* Slide-Out Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#131B2A] border-l border-[#2A3B56] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-[#2A3B56] bg-[#192437] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Command Alerts Center
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-cyan-400 hover:underline font-mono flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Clear Unread
              </button>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-3 border-b border-[#2A3B56] bg-[#0F1623] space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter alerts by location, vehicle, category..."
                className="w-full bg-[#0B0F17] border border-[#2A3B56] rounded-xl pl-8 pr-3 py-1 text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto py-1 text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'Road blocked', label: 'Road Blocked' },
                { id: 'Reroute recommendation', label: 'AI Reroutes' },
                { id: 'Essential supply risk', label: 'Supply Risk' },
                { id: 'Severe weather', label: 'Weather' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No alerts matching selected criteria.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'Critical';

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-slate-500 ${
                      isCritical
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-glow-rose'
                        : alert.severity === 'High'
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-[#192437]/60 border-[#2A3B56]'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                            isCritical
                              ? 'bg-rose-600 text-white shadow font-extrabold uppercase'
                              : alert.severity === 'High'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{alert.category}</span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">{alert.timeDisplay}</span>
                    </div>

                    {/* Summary */}
                    <p className="text-xs font-bold text-white leading-snug">{alert.summary}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {alert.location}
                    </p>

                    {/* Recommended Action */}
                    <div className="mt-3 p-2.5 rounded-lg bg-[#0B0F17] border border-[#2A3B56] space-y-1">
                      <span className="text-[9px] font-mono text-indigo-300 uppercase font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" /> Recommended Action
                      </span>
                      <p className="text-[11px] text-slate-200 leading-tight">{alert.recommendedAction}</p>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-[10px] font-mono text-cyan-400 hover:underline">
                        Inspect Alert Details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#2A3B56] bg-[#0B0F17] text-center text-[10px] font-mono text-slate-500">
            Connected to Centralized Command Intelligence Bus
          </div>
        </div>
      </div>

      {/* ALERT DETAIL MODAL */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};
