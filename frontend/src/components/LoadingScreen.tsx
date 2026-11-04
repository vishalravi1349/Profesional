import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center"
      >
        <div className="relative p-3 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-navy-800 shadow-2xl mb-4">
          <img src="/logo.jpeg" alt="Noventra Loading Logo" className="w-16 h-16 object-contain rounded-xl bg-navy-950 p-1" />
        </div>

        <h2 className="text-2xl font-heading font-extrabold text-white tracking-wider">
          NOVENTRA
        </h2>
        <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
          S C H O O L
        </span>
      </motion.div>

      <div className="w-32 h-1 bg-navy-900 rounded-full mt-8 overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
        />
      </div>
    </div>
  );
};
