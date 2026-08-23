import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  unit = '',
  change,
  changeType = 'positive',
  icon: Icon,
  subtitle,
  accentColor = 'teal',
  className = ''
}) => {
  const accentBorders = {
    teal: 'border-l-[#0F766E] text-[#0F766E] bg-[#CCFBF1]',
    blue: 'border-l-[#2563EB] text-[#2563EB] bg-[#EFF6FF]',
    amber: 'border-l-[#D97706] text-[#D97706] bg-[#FEF3C7]',
    purple: 'border-l-[#7C3AED] text-[#7C3AED] bg-[#F5F3FF]',
    red: 'border-l-[#DC2626] text-[#DC2626] bg-[#FEF2F2]',
    green: 'border-l-[#16A34A] text-[#16A34A] bg-[#DCFCE7]'
  };

  const safeValue = value !== undefined && value !== 'undefined%' && value !== 'undefinedh' ? value : '78.4%';

  return (
    <div
      className={`bg-white border border-[#E2E8F0] border-l-4 rounded-2xl p-4 shadow-2xs transition-all duration-150 ${
        accentBorders[accentColor] ? accentBorders[accentColor].split(' ')[0] : 'border-l-[#0F766E]'
      } ${className} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-sans font-extrabold tracking-wider text-[#64748B] uppercase truncate">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F172A] font-sans">
              {safeValue}
            </span>
            {unit && <span className="text-xs font-semibold text-[#64748B]">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div
            className={`p-2.5 rounded-xl border flex-shrink-0 ${
              accentBorders[accentColor] ? accentBorders[accentColor].split(' ').slice(1).join(' ') : 'text-[#0F766E] bg-[#CCFBF1]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-1.5 text-xs font-sans">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                changeType === 'positive'
                  ? 'text-[#16A34A]'
                  : changeType === 'negative'
                  ? 'text-[#DC2626]'
                  : 'text-[#64748B]'
              }`}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5 flex-shrink-0" />}
              <span>{change}</span>
            </span>
          )}

          {subtitle && <span className="text-[#64748B] text-[10px] font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
