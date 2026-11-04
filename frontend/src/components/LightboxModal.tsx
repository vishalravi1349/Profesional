import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { GalleryItem } from './GalleryGrid';

interface LightboxModalProps {
  item: GalleryItem;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-4xl w-full bg-navy-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-navy-950/80 text-slate-300 hover:text-white hover:bg-navy-800 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative aspect-video max-h-[65vh] overflow-hidden bg-black">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-6 bg-navy-900 border-t border-slate-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> {item.category}
            </span>
            <h3 className="text-xl font-heading font-bold text-white mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
