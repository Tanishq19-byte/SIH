import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Route,
  Truck,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/routes', label: 'Route Planning', icon: Route },
  { path: '/operations', label: 'Live Operations', icon: Radio },
  { path: '/incidents', label: 'Disruptions', icon: AlertTriangle, badge: '14' },
  { path: '/vehicles', label: 'Shipments', icon: Truck, badge: '128' },
  { path: '/predictions', label: 'AI Insights', icon: BrainCircuit },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 }
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-16 px-3 border-b border-[#E2E8F0] flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] p-0.5 flex-shrink-0 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>

            {!collapsed && (
              <div className="truncate min-w-0">
                <h2 className="text-sm font-extrabold tracking-tight text-[#0F172A] flex items-center gap-1.5">
                  Disha <span className="text-[10px] text-[#0F766E] px-1.5 py-0.2 bg-[#CCFBF1] rounded font-bold">AI</span>
                </h2>
                <p className="text-[10px] text-[#64748B] truncate">Logistics Intelligence</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer ${
              collapsed ? 'absolute -right-3.5 top-5 bg-white border border-[#CBD5E1] shadow-xs hover:scale-110 z-40 rounded-full w-7 h-7 flex items-center justify-center p-0' : ''
            }`}
            title={collapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 text-[#0F766E]" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="py-3 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors font-medium text-xs ${
                  isActive
                    ? 'bg-[#CCFBF1] text-[#0F766E] font-bold border border-[#99F6E4]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />

              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    item.badge === '14'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#0F172A] text-white text-xs rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Settings & System Status Section */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-2 bg-[#F8FAFC]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? 'bg-[#CCFBF1] text-[#0F766E] font-bold border border-[#99F6E4]'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase block">System Status</span>
            <div className="flex items-center gap-1.5 text-[#0F766E] font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2" title="All systems operational">
            <Activity className="w-4 h-4 text-[#0F766E] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
