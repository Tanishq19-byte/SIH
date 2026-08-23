import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold shadow-2xs border border-[#0F766E]',
  secondary: 'bg-white hover:bg-[#CCFBF1] text-[#0F766E] border border-[#0F766E] font-semibold',
  outline: 'bg-white hover:bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB] font-semibold',
  danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold shadow-2xs',
  warning: 'bg-[#D97706] hover:bg-[#B45309] text-white font-semibold shadow-2xs',
  success: 'bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold shadow-2xs',
  ghost: 'bg-transparent hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};
