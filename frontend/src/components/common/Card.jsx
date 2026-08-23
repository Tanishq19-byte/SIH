import React from 'react';

export const Card = ({
  children,
  className = '',
  header,
  action,
  title,
  subtitle,
  footer,
  glow = false
}) => {
  return (
    <div
      className={`bg-white border border-[#E4EAF2] rounded-2xl overflow-hidden shadow-xs transition-all duration-200 hover:border-[#CBD5E1] ${
        glow ? 'border-[#155EEF] shadow-sm' : ''
      } ${className}`}
    >
      {(title || header || action) && (
        <div className="px-5 py-4 border-b border-[#E4EAF2] flex items-center justify-between gap-3 bg-white">
          {header ? (
            header
          ) : (
            <div>
              {title && <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#172033] font-mono">{title}</h3>}
              {subtitle && <p className="text-xs text-[#667085] mt-0.5 font-sans">{subtitle}</p>}
            </div>
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-[#E4EAF2] bg-[#F8FAFC] text-xs text-[#667085]">
          {footer}
        </div>
      )}
    </div>
  );
};
