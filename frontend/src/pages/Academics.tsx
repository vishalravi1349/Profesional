import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { BookOpen, GraduationCap, Award, Cpu, CheckCircle2 } from 'lucide-react';

export const Academics: React.FC = () => {
  const STAGES = [
    {
      stage: 'Early Years & Kindergarten',
      grades: 'Ages 3 - 6',
      desc: 'Play-based experiential learning fostering sensory development, basic numeracy, language fluency, and social interaction.',
      color: 'border-emerald-500/30 text-emerald-400',
    },
    {
      stage: 'Primary School Academy',
      grades: 'Grades 1 - 5',
      desc: 'Building fundamental inquiry skills across Science, Mathematics, Languages, Arts, and introductory Coding.',
      color: 'border-sky-500/30 text-sky-400',
    },
    {
      stage: 'Middle School STEM Track',
      grades: 'Grades 6 - 8',
      desc: 'Deepening analytical capabilities with robotics, experimental laboratory science, logic, and creative design thinking.',
      color: 'border-gold-500/30 text-gold-400',
    },
    {
      stage: 'High School & Pre-University',
      grades: 'Grades 9 - 12',
      desc: 'Advanced placement options, specialized AI & Data Science pathways, university guidance, and capstone research projects.',
      color: 'border-indigo-500/30 text-indigo-400',
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionHeading
        badge="Academic Framework"
        title="Curriculum & Pedagogical Methodology"
        subtitle="Designed for critical inquiry, global standards, and holistic academic mastery."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {STAGES.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-3xl glass-card border ${s.color} relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-navy-950 text-xs font-bold uppercase tracking-wider">
                {s.grades}
              </span>
              <GraduationCap className="w-6 h-6 opacity-60" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">{s.stage}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">{s.desc}</p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Continuous assessment & project portfolios
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
