import React from 'react';
import { useApp } from '../../context/AppContext';
import { NER_STATES } from '../../data/mockRegions';
import { Filter } from 'lucide-react';

export const PageHeader = ({
  category = 'NORTH EAST LOGISTICS INTELLIGENCE',
  title,
  subtitle,
  actionButton,
  badgeText
}) => {
  const { selectedState, setSelectedState } = useApp();

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-sans tracking-widest text-[#0F766E] uppercase font-bold">
            {category}
          </span>
          {badgeText && (
            <span className="px-2.5 py-0.5 text-[10px] font-sans bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] rounded-full flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse" />
              {badgeText}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F172A] font-sans">{title}</h1>
        {subtitle && <p className="text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed font-sans">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Region State Filter */}
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-[#0F766E]" />
          <span className="text-xs text-[#64748B] hidden sm:inline font-sans">Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer font-sans"
          >
            {NER_STATES.map(state => (
              <option key={state.id} value={state.id} className="bg-white text-[#0F172A]">
                {state.name} ({state.code})
              </option>
            ))}
          </select>
        </div>

        {actionButton}
      </div>
    </div>
  );
};
