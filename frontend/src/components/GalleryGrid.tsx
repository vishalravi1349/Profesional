import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { LightboxModal } from './LightboxModal';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Events' | 'Sports' | 'Activities' | 'Classrooms' | 'Achievements';
  imageUrl: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'State-of-the-Art Innovation Hub',
    category: 'Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    description: 'Students engaging in interactive STEM and robotics learning.',
  },
  {
    id: 'g2',
    title: 'Annual Tech & Science Olympiad',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop',
    description: 'Students presenting working prototypes to international jury.',
  },
  {
    id: 'g3',
    title: 'Olympic-Standard Sports Arena',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    description: 'Basketball championship match held at Noventra Sports Complex.',
  },
  {
    id: 'g4',
    title: 'Advanced AI & Coding Studio',
    category: 'Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    description: 'High-speed fiber connectivity with specialized AI workstations.',
  },
  {
    id: 'g5',
    title: 'Cultural Performing Arts Night',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=1200&auto=format&fit=crop',
    description: 'Stage drama and orchestral performance by Noventra arts academy.',
  },
  {
    id: 'g6',
    title: 'National Robotics Gold Trophy',
    category: 'Achievements',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1200&auto=format&fit=crop',
    description: 'Noventra Robotics Team securing first place in national finals.',
  },
  {
    id: 'g7',
    title: 'Lush Green ECO Campus Architecture',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    description: 'Sustainable solar-powered smart campus infrastructure.',
  },
  {
    id: 'g8',
    title: 'Student Leadership Conference',
    category: 'Activities',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    description: 'Mock UN session building public speaking and diplomacy skills.',
  },
];

const CATEGORIES = ['All', 'Campus', 'Events', 'Sports', 'Activities', 'Classrooms', 'Achievements'] as const;

export const GalleryGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold shadow-lg shadow-gold-500/20'
                : 'bg-navy-900/80 text-slate-300 hover:bg-navy-800 hover:text-white border border-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden glass-card aspect-[4/3] cursor-pointer border border-slate-800 hover:border-gold-500/40"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-md bg-navy-950/80 backdrop-blur-sm border border-gold-500/30 text-[10px] font-bold text-gold-400">
                  {item.category}
                </span>
              </div>

              <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-navy-950/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h4 className="text-sm font-heading font-bold text-white group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      {activeImage && (
        <LightboxModal item={activeImage} onClose={() => setActiveImage(null)} />
      )}
    </div>
  );
};
