import React, { useState, useRef, useEffect } from 'react';
import { User, ShieldCheck, Settings, LogOut, ChevronDown, Building2 } from 'lucide-react';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0B0F17] hover:bg-[#131B2A] border border-[#2A3B56] rounded-xl p-1.5 pr-2.5 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-slate-950 text-xs">
          ND
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-bold text-slate-200 leading-none">Command Controller</p>
          <p className="text-[10px] text-cyan-400 font-mono mt-0.5">NDMA / MDoNER</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#131B2A] border border-[#2A3B56] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-[#2A3B56] bg-[#192437]">
            <p className="text-xs font-bold text-white">Dr. R. K. Sharma</p>
            <p className="text-[11px] text-slate-400">Chief Logistics Officer</p>
            <div className="mt-2 pt-2 border-t border-[#2A3B56]/60 flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
              <Building2 className="w-3 h-3" />
              North Eastern Council Secretariat
            </div>
          </div>

          <div className="p-1.5 text-xs text-slate-300">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              Officer Profile
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security & Credentials
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Agency Preferences
            </button>
          </div>

          <div className="p-1.5 border-t border-[#2A3B56] bg-[#0F1623]">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Command System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
