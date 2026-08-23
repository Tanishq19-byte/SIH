import React from 'react';

const badgeStyles = {
  critical: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  blocked: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  high: 'bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]',
  warning: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  delayed: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  medium: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
  rerouted: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
  low: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
  operational: 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]',
  on_duty: 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]',
  healthy: 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]',
  completed: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  halted: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
};

const dotColors = {
  critical: 'bg-[#DC2626] animate-pulse',
  blocked: 'bg-[#DC2626] animate-pulse',
  high: 'bg-[#EA580C]',
  warning: 'bg-[#D97706]',
  delayed: 'bg-[#D97706] animate-pulse',
  medium: 'bg-[#0284C7]',
  rerouted: 'bg-[#0F766E]',
  low: 'bg-[#64748B]',
  operational: 'bg-[#16A34A]',
  on_duty: 'bg-[#16A34A]',
  healthy: 'bg-[#16A34A]',
  completed: 'bg-[#2563EB]',
  halted: 'bg-[#DC2626]'
};

export const Badge = ({
  children,
  status = 'low',
  showDot = true,
  size = 'md',
  className = ''
}) => {
  const normalizedStatus = String(status).toLowerCase();
  const style = badgeStyles[normalizedStatus] || badgeStyles.low;
  const dotColor = dotColors[normalizedStatus] || dotColors.low;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-mono',
    md: 'px-2.5 py-1 text-xs font-mono font-bold',
    lg: 'px-3 py-1.5 text-sm font-mono font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${style} ${sizeStyles[size]} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      <span className="capitalize">{children || status}</span>
    </span>
  );
};
