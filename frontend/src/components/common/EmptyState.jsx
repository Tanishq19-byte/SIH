import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no active records matching your filter parameters.',
  icon: Icon = AlertCircle,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[#131B2A]/50 border border-dashed border-[#2A3B56] rounded-xl ${className}`}>
      <div className="p-3 bg-slate-800/80 rounded-full border border-slate-700 text-cyan-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
