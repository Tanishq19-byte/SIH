import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldAlert, Clock, Menu, AlertTriangle, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProfileMenu } from './ProfileMenu';
import { NetworkIndicator } from '../common/NetworkIndicator';
import { checkAIHealth } from '../../services/aiPredictionService';

export const TopBar = ({ onToggleMobileMenu }) => {
  const {
    setIsSearchOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    unreadNotificationsCount,
    activeEmergencyAlert,
    isEmergencyMode,
    setIsEmergencyMode,
    setIsEmergencyModalOpen
  } = useApp();

  const [timeString, setTimeString] = useState('');
  const [aiHealthStatus, setAiHealthStatus] = useState('FASTAPI_ONLINE');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    checkAIHealth().then((health) => {
      if (health && health.aiService !== 'unavailable') {
        setAiHealthStatus('FASTAPI_ONLINE');
      } else {
        setAiHealthStatus('LOCAL_FALLBACK');
      }
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-40 shadow-2xs">
      {/* Global Search Input Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-all w-36 md:w-48 lg:w-56 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
          <span className="flex-1 text-left font-sans truncate">Search routes...</span>
          <kbd className="font-mono text-[9px] bg-white text-[#64748B] border border-[#CBD5E1] px-1.5 py-0.5 rounded shadow-2xs flex-shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Center Operational Status & Emergency Alert Button */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0 justify-center">
        {/* Emergency Operations Toggle Button */}
        <button
          onClick={() => setIsEmergencyMode(!isEmergencyMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex-shrink-0 cursor-pointer ${
            isEmergencyMode
              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] shadow-xs'
              : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#F1F5F9]'
          }`}
          title="Toggle Emergency Command Directive Matrix"
        >
          <Zap className={`w-3.5 h-3.5 ${isEmergencyMode ? 'text-[#DC2626] animate-bounce' : 'text-[#D97706]'}`} />
          <span className="whitespace-nowrap">{isEmergencyMode ? 'EMERGENCY ACTIVE' : 'Emergency Ops'}</span>
        </button>

        {activeEmergencyAlert.active && (
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] hover:border-[#FCA5A5] px-3 py-1.5 rounded-full text-xs text-[#991B1B] font-medium transition-all shadow-2xs hover:shadow-xs group cursor-pointer flex-shrink-0"
            title="Click to inspect emergency details and trigger AI rerouting"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline font-bold whitespace-nowrap">Sonapur Landslide (NH-27)</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#DC2626] text-white px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
              INSPECT &rarr;
            </span>
          </button>
        )}
      </div>

      {/* Right Actions - Never Shrink or Overflow */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <NetworkIndicator />

        {/* System Live Clock */}
        <div className="hidden xl:flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#0F766E] font-bold">
          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
          <span>{timeString || '12:00:00 IST'}</span>
        </div>

        {/* Search Trigger for Mobile */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#0F766E] transition-colors cursor-pointer"
          title="Command Center Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white font-mono text-[10px] font-bold flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Profile Menu Dropdown */}
        <ProfileMenu />
      </div>
    </header>
  );
};
