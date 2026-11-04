import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { FacilityCard } from '../components/FacilityCard';
import { Building2, Cpu, Trophy, BookOpen, ShieldCheck, Bus, Music, Sparkles } from 'lucide-react';

export const Facilities: React.FC = () => {
  const FACILITIES = [
    {
      icon: Building2,
      title: 'Smart Classrooms',
      subtitle: 'Digital Infrastructure',
      description: 'Air-conditioned classrooms equipped with 4K touch panels, ergonomic furniture, and fiber internet.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Cpu,
      title: 'AI & Robotics Studio',
      subtitle: 'High Tech Labs',
      description: 'Dedicated workstations with GPUs for machine learning, 3D printers, and robotics arenas.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: BookOpen,
      title: 'Digital Media Library',
      subtitle: 'Knowledge & Research',
      description: 'Silent reading pods, over 30,000 books, and subscription access to IEEE & JSTOR journals.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Trophy,
      title: 'Sports & Aquatic Arena',
      subtitle: 'Athletics & Fitness',
      description: 'Olympic-sized indoor swimming pool, multi-court gymnasium, synthetic soccer field, and tennis courts.',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Music,
      title: 'Performing Arts Auditorium',
      subtitle: 'Creative Arts',
      description: 'A 750-seat acoustic theatre equipped with professional lighting, sound engineering, and music suites.',
      imageUrl: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Bus,
      title: 'GPS-Tracked Transportation',
      subtitle: 'Safe Fleet',
      description: 'Fleet of air-conditioned buses equipped with real-time GPS tracking, speed governors, and trained attendants.',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Secure Campus',
      subtitle: '24/7 Security',
      description: 'CCTV coverage across all public areas, biometric entry access, and on-site medical infirmary with qualified staff.',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
    },
    {
      icon: Sparkles,
      title: 'Organic Dining Hall',
      subtitle: 'Nutrition & Health',
      description: 'Nutritious chef-prepared meals using organic produce with dietary options tailored for growing minds.',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SectionHeading
        badge="Infrastructure"
        title="Campus Facilities"
        subtitle="Designed to provide a safe, technologically advanced, and nurturing environment."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FACILITIES.map((f, idx) => (
          <FacilityCard
            key={idx}
            icon={f.icon}
            title={f.title}
            subtitle={f.subtitle}
            description={f.description}
            imageUrl={f.imageUrl}
            delay={idx * 0.08}
          />
        ))}
      </div>
    </div>
  );
};
