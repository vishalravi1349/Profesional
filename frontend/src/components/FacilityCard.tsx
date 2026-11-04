import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FacilityCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  delay?: number;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  description,
  imageUrl,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl glass-card overflow-hidden group border border-slate-800 hover:border-gold-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10"
    >
      <div className="relative h-48 overflow-hidden bg-navy-900">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent z-10" />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center">
            <Icon className="w-16 h-16 text-gold-500/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}
        <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-xl bg-navy-950/80 backdrop-blur-md border border-gold-500/30 flex items-center justify-center text-gold-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="p-6">
        <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
          {subtitle}
        </span>
        <h3 className="text-xl font-heading font-bold text-white mt-1 mb-2 group-hover:text-gold-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
