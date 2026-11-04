import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { Trophy, Award, Star, Medal, Sparkles, CheckCircle2 } from 'lucide-react';

export const Achievements: React.FC = () => {
  const STATS = [
    { value: '1000+', label: 'Active Students', sub: 'Growing global community' },
    { value: '50+', label: 'Faculty Members', sub: '80% Master & PhD qualified' },
    { value: '20+', label: 'Innovative Programs', sub: 'STEM, AI, Arts & Leadership' },
    { value: '95%+', label: 'Academic Success', sub: 'Top university admittance rate' },
  ];

  const HONORS = [
    {
      title: 'National STEM Excellence Award 2025',
      body: 'Awarded 1st place in the National Science & Technology Olympiad for student AI solutions.',
      date: 'November 2025',
    },
    {
      title: 'Green Campus Gold Certification',
      body: 'Recognized for 100% solar energy powered campus operations and zero-waste initiatives.',
      date: 'August 2025',
    },
    {
      title: 'International Robotics Champions',
      body: 'Noventra Robotics squad won Gold medal at the Asia-Pacific Robotics Championship.',
      date: 'May 2025',
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionHeading
        badge="Proven Track Record"
        title="School Achievements & Milestones"
        subtitle="Celebrating academic breakthroughs, national honors, and student triumphs."
      />

      {/* Animated Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl glass-panel text-center border border-gold-500/30 shadow-xl"
          >
            <div className="text-4xl sm:text-5xl font-heading font-extrabold text-gradient-gold mb-2">
              {stat.value}
            </div>
            <div className="text-base font-bold text-white">{stat.label}</div>
            <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Major Honors Timeline */}
      <div className="space-y-6">
        <h3 className="text-2xl font-heading font-bold text-white text-center">Recent Accolades</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HONORS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-8 rounded-3xl glass-card border border-slate-800 relative"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">{item.date}</span>
              <h4 className="text-xl font-heading font-bold text-white mt-1 mb-3">{item.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
