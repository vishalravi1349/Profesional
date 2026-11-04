import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { GalleryGrid } from '../components/GalleryGrid';

export const Gallery: React.FC = () => {
  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SectionHeading
        badge="Visual Tour"
        title="Noventra Photo & Video Gallery"
        subtitle="Filter through campus life, classroom innovations, sports achievements, and cultural events."
      />

      <GalleryGrid />
    </div>
  );
};
