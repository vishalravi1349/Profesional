import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  delay?: number;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  icon: Icon,
  title,
  category,
  description,
  highlights,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl glass-card glass-card-hover p-8 flex flex-col justify-between relative group border border-slate-800 hover:border-gold-500/40"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 via-navy-800 to-navy-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform duration-300 shadow-md">
            <Icon className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full bg-navy-900 border border-slate-700 text-xs font-semibold text-sky-400">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Outcomes:</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {highlights.map((h, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-navy-950/80 border border-slate-800 text-xs text-slate-300"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link
        to="/enquiry"
        className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-800 text-xs font-bold text-gold-400 group-hover:text-gold-300 transition-colors"
      >
        <span>Enroll or Enquire for Program</span>
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </Link>
    </motion.div>
  );
};
