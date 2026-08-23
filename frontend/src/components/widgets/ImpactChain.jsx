import React from 'react';
import { AlertTriangle, Truck, PackageCheck, Building2, Sparkles, ArrowRight } from 'lucide-react';

export const ImpactChain = ({ impactData }) => {
  if (!impactData) return null;

  const stages = [
    {
      id: 1,
      title: '1. Road Disruption',
      subtitle: impactData.impactChain.disruption,
      icon: AlertTriangle,
      color: 'bg-rose-950/40 border-rose-500/50 text-rose-400',
      badge: 'Choke-Point'
    },
    {
      id: 2,
      title: '2. Vehicles Affected',
      subtitle: impactData.impactChain.vehicles,
      icon: Truck,
      color: 'bg-amber-950/40 border-amber-500/50 text-amber-400',
      badge: `${impactData.affectedVehiclesCount} Convoys`
    },
    {
      id: 3,
      title: '3. Deliveries Delayed',
      subtitle: impactData.impactChain.deliveries,
      icon: PackageCheck,
      color: 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400',
      badge: `${impactData.affectedDeliveriesCount} Deliveries`
    },
    {
      id: 4,
      title: '4. District Impact',
      subtitle: impactData.impactChain.districtImpact,
      icon: Building2,
      color: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
      badge: `${impactData.affectedDistrictsCount} Districts`
    },
    {
      id: 5,
      title: '5. Recommended Action',
      subtitle: impactData.impactChain.recommendedAction,
      icon: Sparkles,
      color: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-glow-cyan',
      badge: 'AI Directive'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          5-Stage Disruption Impact Chain Sequence
        </h4>
        <span className="text-[10px] font-mono text-cyan-400">Live Cascade Analysis</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className={`p-3.5 rounded-2xl border backdrop-blur-md flex flex-col justify-between space-y-2 relative transition-all hover:scale-[1.02] ${stage.color}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-300">{stage.title}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-950/80 border border-slate-700">
                {stage.badge}
              </span>
            </div>

            {/* Icon & Narrative */}
            <div className="space-y-1.5">
              <stage.icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold leading-tight font-sans text-white">{stage.subtitle}</p>
            </div>

            {/* Flow Arrow to Next Stage */}
            {idx < stages.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#131B2A] border border-cyan-500/40 items-center justify-center text-cyan-400 shadow-md">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
