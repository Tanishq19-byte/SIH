import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Route, Truck, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_ROUTES } from '../../data/mockRoutes';
import { MOCK_VEHICLES } from '../../data/mockVehicles';
import { MOCK_INCIDENTS } from '../../data/mockIncidents';
import { Badge } from '../common/Badge';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const q = query.toLowerCase().trim();

  const matchingRoutes = MOCK_ROUTES.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  const matchingVehicles = MOCK_VEHICLES.filter(v => v.regNumber.toLowerCase().includes(q) || v.cargoDescription.toLowerCase().includes(q) || v.driverName.toLowerCase().includes(q));
  const matchingIncidents = MOCK_INCIDENTS.filter(i => i.title.toLowerCase().includes(q) || i.state.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#131B2A] border border-[#2A3B56] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2A3B56] flex items-center gap-3 bg-[#192437]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search highways, vehicles, driver names, or incident reports..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Route Nav */}
          <div>
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
              Highway Corridors ({matchingRoutes.length})
            </h5>
            <div className="space-y-1.5">
              {matchingRoutes.map(r => (
                <div
                  key={r.id}
                  onClick={() => handleSelect('/routes')}
                  className="p-2.5 rounded-xl bg-[#192437]/50 border border-[#2A3B56] hover:border-cyan-500/50 hover:bg-[#192437] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Route className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-bold text-slate-200">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.states.join(', ')} | {r.distanceKm} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={r.status} size="sm" />
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
              Essential Supply Fleet ({matchingVehicles.length})
            </h5>
            <div className="space-y-1.5">
              {matchingVehicles.map(v => (
                <div
                  key={v.id}
                  onClick={() => handleSelect('/vehicles')}
                  className="p-2.5 rounded-xl bg-[#192437]/50 border border-[#2A3B56] hover:border-cyan-500/50 hover:bg-[#192437] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="font-bold text-slate-200">{v.regNumber} - {v.cargoCategory}</p>
                      <p className="text-[10px] text-slate-400">{v.cargoDescription} ({v.driverName})</p>
                    </div>
                  </div>
                  <Badge status={v.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div>
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
              Active Field Incidents ({matchingIncidents.length})
            </h5>
            <div className="space-y-1.5">
              {matchingIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => handleSelect('/incidents')}
                  className="p-2.5 rounded-xl bg-[#192437]/50 border border-[#2A3B56] hover:border-rose-500/50 hover:bg-[#192437] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="font-bold text-slate-200">{inc.title}</p>
                      <p className="text-[10px] text-slate-400">{inc.state} | {inc.locationDescription}</p>
                    </div>
                  </div>
                  <Badge status={inc.severity} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2A3B56] bg-[#0F1623] text-center text-[10px] font-mono text-slate-400">
          Use &uarr; &darr; to navigate, Enter to select, Esc to close
        </div>
      </div>
    </div>
  );
};
