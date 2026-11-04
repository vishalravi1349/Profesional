import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  highlight?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  highlight = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-6 md:p-8 rounded-2xl glass-card glass-card-hover relative group ${
        highlight ? 'border-gold-500/40 bg-navy-800/60' : ''
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400/20 to-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:text-gold-300 transition-all duration-300 mb-5 shadow-lg">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
        {title}
      </h3>

      <p className="text-sm text-slate-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
