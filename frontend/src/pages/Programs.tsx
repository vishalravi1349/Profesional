import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ProgramCard } from '../components/ProgramCard';
import { Cpu, Code, Zap, Palette, Trophy, Globe, MessageSquare, Sparkles, Compass } from 'lucide-react';

export const Programs: React.FC = () => {
  const PROGRAMS_LIST = [
    {
      icon: Cpu,
      title: 'STEM & Robotics Lab',
      category: 'Engineering',
      description: 'Hands-on engineering, microcontrollers, sensor integration, and 3D rapid prototyping.',
      highlights: ['Robotics Competitions', 'Circuit Design', '3D Modeling'],
    },
    {
      icon: Code,
      title: 'Coding & Software Engineering',
      category: 'Computer Science',
      description: 'Full-stack web fundamentals, Python algorithms, app development, and cybersecurity basics.',
      highlights: ['Python & JavaScript', 'Web Development', 'Algorithmic Thinking'],
    },
    {
      icon: Zap,
      title: 'Artificial Intelligence & Data',
      category: 'Future Tech',
      description: 'Understanding artificial neural networks, data analysis, prompt engineering, and ethical AI.',
      highlights: ['Machine Learning', 'Data Literacy', 'AI Ethics'],
    },
    {
      icon: Palette,
      title: 'Creative Performing & Visual Arts',
      category: 'Arts & Media',
      description: 'Digital graphic design, classical orchestra, theatrical drama, and studio painting.',
      highlights: ['Digital Design', 'Orchestra', 'Stage Production'],
    },
    {
      icon: Trophy,
      title: 'Sports & Athletic Performance',
      category: 'Wellness',
      description: 'Professional coaching in basketball, swimming, soccer, track & field, and gymnastics.',
      highlights: ['Tournament Leagues', 'Heated Pool', 'Personalized Fitness'],
    },
    {
      icon: Globe,
      title: 'Global Leadership & Diplomacy',
      category: 'Humanities',
      description: 'Model UN assemblies, international debate tournaments, ethics, and public policy.',
      highlights: ['Public Speaking', 'Model UN', 'Policy Debates'],
    },
    {
      icon: MessageSquare,
      title: 'Effective Communication',
      category: 'Skill Building',
      description: 'Mastering persuasive writing, media production, podcasting, and executive presentations.',
      highlights: ['Podcasting Studio', 'Essay Writing', 'Presentation Skills'],
    },
    {
      icon: Sparkles,
      title: 'Innovation & Entrepreneurship',
      category: 'Business Track',
      description: 'Incubating student startup ideas, financial literacy, pitch competitions, and mentorship.',
      highlights: ['Pitch Deck Days', 'Financial Literacy', 'Mentor Sessions'],
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SectionHeading
        badge="Specialized Curricula"
        title="Future-Ready Programs"
        subtitle="Empowering every student to discover their passions and master cutting-edge skills."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROGRAMS_LIST.map((prog, idx) => (
          <ProgramCard
            key={idx}
            icon={prog.icon}
            title={prog.title}
            category={prog.category}
            description={prog.description}
            highlights={prog.highlights}
            delay={idx * 0.08}
          />
        ))}
      </div>
    </div>
  );
};
