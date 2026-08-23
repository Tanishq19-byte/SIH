import React from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, MapPin, Truck, Clock, CheckCircle2, X } from 'lucide-react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';
import { useToast } from '../../hooks/useToast';

export const AlertDetailModal = ({ alert, isOpen, onClose }) => {
  const { addToast } = useToast();

  if (!alert) return null;

  const handleExecuteAction = () => {
    addToast({
      title: 'AI Alert Directive Authorised',
      message: `Enforced recommended action for alert ${alert.id}. Transmitted to command escort & highway control.`,
      type: 'success'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Command Alert Detail - ${alert.id}`}
      subtitle={`${alert.category} | ${alert.timeDisplay}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close Inspector
          </Button>
          <Button variant="danger" icon={Sparkles} onClick={handleExecuteAction}>
            Authorize AI Alert Directive
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Severity & Category Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F17] border border-[#2A3B56]">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 font-mono font-extrabold text-xs rounded-full border ${
                alert.severity === 'Critical'
                  ? 'bg-rose-600 text-white border-rose-400 shadow-glow-rose font-bold'
                  : alert.severity === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}
            >
              {alert.severity.toUpperCase()} SEVERITY
            </span>
            <span className="px-2.5 py-0.5 font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded">
              {alert.category}
            </span>
          </div>

          <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
          </span>
        </div>

        {/* Summary Description */}
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#2A3B56] space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Alert Narrative Summary</span>
          <p className="text-sm font-bold text-white leading-snug">{alert.summary}</p>
        </div>

        {/* Location & Affected Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#2A3B56] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Ground Location
            </span>
            <p className="font-bold text-slate-200 font-mono text-xs">{alert.location}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#2A3B56] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <Truck className="w-3 h-3 text-cyan-400" /> Affected Vehicle / Manifest
            </span>
            <p className="font-bold text-slate-200 font-mono text-xs">{alert.affectedVehicle}</p>
          </div>
        </div>

        {/* Recommended Action Box */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            AI Recommended Action & Bypass Directive
          </div>
          <p className="text-xs text-slate-100 font-medium leading-relaxed">{alert.recommendedAction}</p>
        </div>
      </div>
    </Modal>
  );
};
