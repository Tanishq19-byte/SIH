import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertOctagon className="w-5 h-5 text-rose-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-cyan-400" />
};

const toastBorders = {
  success: 'border-emerald-500/40 bg-emerald-950/40',
  error: 'border-rose-500/40 bg-rose-950/40 shadow-glow-rose',
  warning: 'border-amber-500/40 bg-amber-950/40 shadow-glow-amber',
  info: 'border-cyan-500/40 bg-cyan-950/40 shadow-glow-cyan'
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md text-slate-100 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toastBorders[toast.type] || toastBorders.info
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toastIcons[toast.type] || toastIcons.info}
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">{toast.title}</h5>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
