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
    setIsEmergencyMode
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
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      {/* Mobile Menu Button + Search Input Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-all min-w-[260px] md:min-w-[320px]"
        >
          <Search className="w-4 h-4 text-[#0F766E]" />
          <span className="flex-1 text-left font-sans">Search routes, shipments, incidents...</span>
          <kbd className="font-mono text-[10px] bg-white text-[#64748B] border border-[#CBD5E1] px-1.5 py-0.5 rounded shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Center Operational Status & Emergency Mode Button */}
      <div className="hidden md:flex items-center gap-3">
        {/* Emergency Operations Toggle Button (Section 10) */}
        <button
          onClick={() => setIsEmergencyMode(!isEmergencyMode)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isEmergencyMode
              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] shadow-xs'
              : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:bg-[#F1F5F9]'
          }`}
        >
          <Zap className={`w-4 h-4 ${isEmergencyMode ? 'text-[#DC2626] animate-bounce' : 'text-[#D97706]'}`} />
          <span>{isEmergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Emergency Operations'}</span>
        </button>

        {activeEmergencyAlert.active && (
          <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 rounded-full text-xs text-[#991B1B] max-w-xs truncate font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0" />
            <span className="truncate">{activeEmergencyAlert.message}</span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <NetworkIndicator />

        {/* System Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs font-mono text-[#0F766E] font-bold">
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
          className="relative p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#0F766E] transition-colors"
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
