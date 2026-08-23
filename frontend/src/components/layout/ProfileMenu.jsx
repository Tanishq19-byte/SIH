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
        className="flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl p-1.5 pr-2.5 transition-all shadow-2xs cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center font-extrabold text-white text-xs shadow-xs">
          ND
        </div>
        <div className="hidden lg:block text-left font-sans">
          <p className="text-xs font-extrabold text-[#0F172A] leading-none">Command Controller</p>
          <p className="text-[10px] text-[#0F766E] font-bold mt-0.5">NDMA / MDoNER</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-xs">
          <div className="p-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-xs font-extrabold text-[#0F172A]">Dr. R. K. Sharma</p>
            <p className="text-[11px] text-[#64748B] font-medium">Chief Logistics Officer</p>
            <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[10px] text-[#0F766E] font-bold font-mono">
              <Building2 className="w-3 h-3 text-[#0F766E]" />
              North Eastern Council Secretariat
            </div>
          </div>

          <div className="p-1.5 text-xs text-[#0F172A]">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium"
            >
              <User className="w-4 h-4 text-[#64748B]" />
              Officer Profile
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              Security & Credentials
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer font-medium"
            >
              <Settings className="w-4 h-4 text-[#64748B]" />
              Agency Preferences
            </button>
          </div>

          <div className="p-1.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#DC2626]" />
              Sign Out Command System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
