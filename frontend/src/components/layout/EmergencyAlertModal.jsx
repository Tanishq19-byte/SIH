import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  Truck,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../hooks/useToast';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const EmergencyAlertModal = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    activeEmergencyAlert,
    setActiveEmergencyAlert,
    isEmergencyMode,
    setIsEmergencyMode
  } = useApp();

  if (!isEmergencyModalOpen) return null;

  const handleExecuteReroute = () => {
    setIsEmergencyModalOpen(false);
    addToast({
      title: 'AI Emergency Detour Protocol Executed',
      message: 'Rerouted 38 stranded oxygen & freight tankers via Haflong Corridor B. Escorts dispatched.',
      type: 'success'
    });
    navigate('/operations');
  };

  const handleDismiss = () => {
    setIsEmergencyModalOpen(false);
    addToast({
      title: 'Alert Acknowledged',
      message: 'Command log updated. Monitoring field clearance operations.',
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-3xl border-2 border-[#DC2626] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Emergency Header */}
        <div className="bg-[#FEF2F2] border-b border-[#FECACA] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DC2626] text-white">
                  CRITICAL DISPATCH
                </span>
                <span className="text-xs text-[#DC2626] font-bold">Priority Tier 1</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                Active Ground Emergency Directive
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 text-xs text-[#0F172A] max-h-[75vh] overflow-y-auto">
          {/* Main Alert Message */}
          <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#E11D48] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-sm text-[#9F1239]">
                {activeEmergencyAlert.message}
              </p>
              <p className="text-[#64748B] text-[11px]">
                Incident verified by BRO 44 BRTF Patrol at {activeEmergencyAlert.timestamp || '08:15 IST'} • Monitored across Assam & Meghalaya Command
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Stranded Vehicles</span>
              <span className="text-lg font-extrabold text-[#DC2626]">38 Units</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Oxygen Cargo</span>
              <span className="text-lg font-extrabold text-[#0F766E]">22,000 Liters</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Primary Destination</span>
              <span className="text-xs font-extrabold text-[#0F172A] mt-1 block">Silchar SMCH Hospital</span>
            </div>
          </div>

          {/* AI Recommended Action Card */}
          <div className="p-4 rounded-2xl bg-[#CCFBF1]/40 border border-[#99F6E4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#0F766E]" />
                AI Smart Bypass Corridor Analysis
              </span>
              <Badge status="operational" size="sm">ACTIVE ESCORT AVAILABLE</Badge>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#CCFBF1] space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#0F172A]">Route B: Lumding → Haflong → Silchar Bypass</span>
                <span className="text-[#0F766E] font-mono">ETA: 7h 15m (-12h delay)</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Bypasses Sonapur Tunnel debris zone via newly paved hill corridor. Verified 88% accessibility index with zero active blockages.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-xl transition-colors"
          >
            Dismiss Alert
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEmergencyModalOpen(false);
                navigate('/incidents');
              }}
            >
              View Ground Incident
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Zap}
              onClick={handleExecuteReroute}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md shadow-red-500/20"
            >
              Execute AI Rerouting &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
