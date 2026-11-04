import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Atom, Code, BookOpen, Compass, Trophy } from 'lucide-react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />

      {/* Floating Educational Shapes & Elements */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[10%] text-gold-400/20"
      >
        <GraduationCap className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-[5%] text-sky-400/20"
      >
        <Atom className="w-20 h-20" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -35, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-40 right-[12%] text-gold-400/20"
      >
        <Code className="w-14 h-14" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 right-[8%] text-indigo-400/20"
      >
        <BookOpen className="w-16 h-16" />
      </motion.div>

      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-[35%] text-gold-300/20"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-[30%] text-amber-400/15"
      >
        <Trophy className="w-14 h-14" />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
