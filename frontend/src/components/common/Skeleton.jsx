import React from 'react';

export const Skeleton = ({
  variant = 'text', // text, title, card, avatar, table-row, map
  lines = 1,
  className = ''
}) => {
  if (variant === 'card') {
    return (
      <div className={`bg-[#131B2A] border border-[#2A3B56] rounded-xl p-5 animate-pulse ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-6 bg-slate-800 rounded-full w-16"></div>
        </div>
        <div className="h-8 bg-slate-800 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-slate-800/80 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-800/80 rounded w-2/3"></div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr className="animate-pulse border-b border-[#2A3B56]/50">
        <td className="p-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
        <td className="p-4"><div className="h-5 bg-slate-800 rounded-full w-20"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-800 rounded w-16 font-mono"></div></td>
        <td className="p-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
      </tr>
    );
  }

  if (variant === 'map') {
    return (
      <div className={`bg-[#131B2A] border border-[#2A3B56] rounded-xl h-96 flex flex-col items-center justify-center animate-pulse ${className}`}>
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin mb-3"></div>
        <p className="text-xs font-mono text-cyan-400">Loading Geospatial Layer...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-slate-800 rounded ${
            variant === 'title' ? 'h-6 w-3/4' : 'h-4 w-full'
          }`}
        />
      ))}
    </div>
  );
};
