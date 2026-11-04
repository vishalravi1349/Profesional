import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'gold' | 'sky' | 'emerald' | 'indigo' | 'amber';
  delay?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'gold',
  delay = 0,
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'gold':
        return 'from-gold-500/20 to-navy-900 border-gold-500/30 text-gold-400';
      case 'sky':
        return 'from-sky-500/20 to-navy-900 border-sky-500/30 text-sky-400';
      case 'emerald':
        return 'from-emerald-500/20 to-navy-900 border-emerald-500/30 text-emerald-400';
      case 'indigo':
        return 'from-indigo-500/20 to-navy-900 border-indigo-500/30 text-indigo-400';
      case 'amber':
        return 'from-amber-500/20 to-navy-900 border-amber-500/30 text-amber-400';
      default:
        return 'from-gold-500/20 to-navy-900 border-gold-500/30 text-gold-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-6 rounded-3xl glass-card glass-card-hover flex items-center justify-between border border-slate-800"
    >
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-3xl font-heading font-extrabold text-white mt-1 mb-0.5">
          {value}
        </h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br border flex items-center justify-center shadow-lg ${getColorStyles()}`}>
        <Icon className="w-7 h-7" />
      </div>
    </motion.div>
  );
};
