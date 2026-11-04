import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  relation: string;
  content: string;
  rating?: number;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  relation,
  content,
  rating = 5,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl glass-card glass-card-hover relative flex flex-col justify-between"
    >
      <Quote className="absolute top-6 right-6 w-10 h-10 text-gold-500/15" />

      <div>
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
          ))}
        </div>

        <p className="text-sm text-slate-200 leading-relaxed italic mb-6">
          "{content}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-navy-700 font-bold text-navy-950 flex items-center justify-center text-sm shadow-md">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{name}</h4>
          <p className="text-xs text-slate-400">{role} • <span className="text-gold-400">{relation}</span></p>
        </div>
      </div>
    </motion.div>
  );
};
