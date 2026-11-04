import React from 'react';
import { EnquiryStatus } from '../types';

interface StatusBadgeProps {
  status: EnquiryStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Reviewing':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Contacted':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Responded':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Approved':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/50';
      case 'Closed':
        return 'bg-slate-700/30 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {status}
    </span>
  );
};
