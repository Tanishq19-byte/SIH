import React, { useState, useRef, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

export const NetworkIndicator = () => {
  const {
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    pendingSyncQueue,
    isSyncing,
    syncPendingQueue
  } = useNetwork();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Network Status Badge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-sans font-extrabold transition-all shadow-2xs cursor-pointer ${
          isOnline
            ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-[#D1FAE5]'
            : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] animate-pulse'
        }`}
        title="Network Connection & Auto-Sync Status"
      >
        {isOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <Wifi className="w-3.5 h-3.5 text-[#059669]" />
            <span className="hidden sm:inline">Online</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
            <WifiOff className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>
              Offline {pendingSyncQueue.length > 0 ? `— ${pendingSyncQueue.length} pending sync` : ''}
            </span>
          </>
        )}
      </button>

      {/* Popover Sync Details Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#131B2A] border border-[#2A3B56] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
          {/* Header */}
          <div className="p-3.5 border-b border-[#2A3B56] bg-[#192437] flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono font-bold text-white">
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
              Network Status
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isOnline ? '🟢 Connected' : '🟠 Offline Mode'}
            </span>
          </div>

          {/* Prototype Simulation Toggle */}
          <div className="p-3 bg-[#0B0F17] border-b border-[#2A3B56] space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold text-[11px]">Demo Offline Simulation Toggle:</span>
              <button
                onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                  isSimulatedOffline
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isSimulatedOffline ? 'Simulating Offline' : 'Simulate Offline'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Toggle to test offline incident creation & automatic sync engine without disconnecting internet.
            </p>
          </div>

          {/* Pending Sync Queue List */}
          <div className="p-3 space-y-3 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 font-bold">
              <span>Pending Sync Queue ({pendingSyncQueue.length})</span>
              {isOnline && pendingSyncQueue.length > 0 && (
                <button
                  onClick={() => syncPendingQueue()}
                  disabled={isSyncing}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Now
                </button>
              )}
            </div>

            {pendingSyncQueue.length === 0 ? (
              <div className="py-4 text-center text-slate-500 text-[11px]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1 opacity-60" />
                All ground reports synced. Queue is clear.
              </div>
            ) : (
              pendingSyncQueue.map((item) => (
                <div key={item.idempotencyKey} className="p-2.5 rounded-xl bg-[#0B0F17] border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span className="truncate max-w-[180px]">{item.title}</span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-mono rounded font-bold">
                      Pending Sync
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.state} • {item.category}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
