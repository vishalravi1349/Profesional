import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { Target, Compass, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <SectionHeading
        badge="About Noventra School"
        title="Pioneering Excellence in Education"
        subtitle="Discover our vision, leadership team, and relentless commitment to nurturing future innovators."
      />

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl glass-panel border border-gold-500/30 relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center mb-6">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-3">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            To be recognized globally as a beacon of educational innovation, empowering diverse learners to become compassionate leaders, critical thinkers, and creators who shape a better world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="p-8 rounded-3xl glass-panel border border-slate-700 relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center mb-6">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-3">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            To deliver an inspiring, tech-infused curriculum that blends academic rigor with moral integrity, creative inquiry, and physical vitality within a safe and inclusive community.
          </p>
        </motion.div>
      </div>

      {/* Core Educational Philosophy Values */}
      <div className="space-y-8">
        <div className="text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            Our Core Values
          </span>
          <h3 className="text-3xl font-heading font-bold text-white mt-3">The Noventra Pillars</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Innovation', icon: Sparkles, desc: 'Fostering curiosity and forward-thinking problem solving.' },
            { title: 'Integrity', icon: ShieldCheck, desc: 'Upholding honesty, ethical action, and mutual respect.' },
            { title: 'Excellence', icon: Award, desc: 'Striving for peak performance in academics, sports, and arts.' },
            { title: 'Empathy', icon: Heart, desc: 'Nurturing compassionate leaders aware of global needs.' },
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-card text-center border border-slate-800"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{val.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
