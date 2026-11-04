import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Award,
  BookOpen,
  Cpu,
  Globe,
  CheckCircle2,
  ChevronRight,
  Zap,
  Users,
  Building2,
  Trophy,
  Star,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { FeatureCard } from '../components/FeatureCard';
import { ProgramCard } from '../components/ProgramCard';
import { FacilityCard } from '../components/FacilityCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { GalleryGrid } from '../components/GalleryGrid';
import { EnquiryForm } from '../components/EnquiryForm';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const Home: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const [hasEnquiries, setHasEnquiries] = useState<boolean | null>(null);

  useEffect(() => {
    const checkEnquiries = async () => {
      if (user) {
        const res = await api.getEnquiryQueue(sessionToken || undefined, user?.id);
        if (res.success && res.data) {
          const mine = res.data.some((e: any) => e.is_owner);
          setHasEnquiries(mine);
        } else {
          setHasEnquiries(false);
        }
      } else {
        setHasEnquiries(false);
      }
    };
    checkEnquiries();
  }, [user, sessionToken]);
  return (
    <div className="relative min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo Crest Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-xl"
          >
            <img src="/logo.jpeg" alt="Noventra Crest" className="w-6 h-6 object-contain rounded-md bg-navy-950 p-0.5" />
            <span>Admissions Open for Academic Year 2026-2027</span>
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
          >
            Empowering <span className="text-gradient-gold">Future-Ready</span> Minds with Knowledge & Innovation
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            At <strong className="text-gold-400">Noventra School</strong>, we combine world-class STEM education, Artificial Intelligence, creative arts, and holistic values to inspire the next generation of visionary global leaders.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
          >
            {!user ? (
              <>
                <Link
                  to="/enquiry"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-2xl shadow-gold-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold text-slate-200 glass-panel hover:bg-navy-800 border border-slate-700 hover:border-gold-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Our School <ChevronRight className="w-4 h-4 text-gold-400" />
                </Link>
              </>
            ) : hasEnquiries ? (
              <>
                <Link
                  to="/dashboard/enquiries"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-2xl shadow-gold-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  View Live Admission Queue <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold text-slate-200 glass-panel hover:bg-navy-800 border border-slate-700 hover:border-gold-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ChevronRight className="w-4 h-4 text-gold-400" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/enquiry"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-2xl shadow-gold-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Submit Enquiry to Access Queue <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold text-slate-200 glass-panel hover:bg-navy-800 border border-slate-700 hover:border-gold-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Our School <ChevronRight className="w-4 h-4 text-gold-400" />
                </Link>
              </>
            )}
          </motion.div>

          {/* Floating Key Highlights Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
          >
            {[
              { label: 'STEM & AI Focused', desc: 'Robotics & Coding Labs' },
              { label: '100% Digital Campus', desc: 'Smart Interactive Classrooms' },
              { label: 'Holistic Pedagogy', desc: 'Arts, Sports & Leadership' },
              { label: 'Global Recognition', desc: 'Top Tier Academic Success' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl glass-card border border-slate-800/80">
                <div className="flex items-center gap-2 text-gold-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT NOVENTRA */}
      <section className="py-20 relative z-10 border-t border-slate-800/60 bg-navy-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
                About Noventra School
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight">
                Where Curiosity Meets Educational Innovation
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                Noventra School was established to redefine modern education for the 21st century. We cultivate critical thinking, creative problem-solving, and emotional intelligence alongside rigorous academic standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-900 border border-slate-800">
                  <Globe className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Global Curriculum</h4>
                    <p className="text-xs text-slate-400 mt-0.5">International standards with personalized learning tracks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-900 border border-slate-800">
                  <Zap className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">AI & Future Tech</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Hands-on coding, machine learning & robotics.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden glass-panel p-2 border border-gold-500/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                  alt="Noventra School Campus"
                  className="rounded-2xl w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-navy-950/80 backdrop-blur-md border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gold-400 uppercase">Inspiring Environment</span>
                      <h4 className="text-sm font-bold text-white">Campus Designed for Discovery</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gold-400 text-navy-950 text-xs font-extrabold">
                      Est. 2012
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE NOVENTRA */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Choose Us"
            title="The Noventra Advantage"
            subtitle="We provide an ecosystem where students excel academically, innovate fearlessly, and develop unshakeable confidence."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Cpu}
              title="Advanced STEM & AI Integration"
              description="From Grade 1 onwards, students engage with hands-on robotics, computational thinking, and AI ethics in specialized laboratories."
              delay={0.1}
              highlight
            />
            <FeatureCard
              icon={Users}
              title="1:12 Teacher-Student Ratio"
              description="Personalized mentorship ensures every student receives individual guidance tailored to their learning style and pace."
              delay={0.2}
            />
            <FeatureCard
              icon={Compass}
              title="Holistic Character & Leadership"
              description="Leadership workshops, public speaking forums, and community initiatives cultivate compassionate future global citizens."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 4. FUTURE-READY PROGRAMS */}
      <section className="py-20 relative z-10 border-t border-slate-800/60 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Future-Ready Learning"
            title="Specialized Academic Programs"
            subtitle="Designed to prepare students for the careers of tomorrow."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProgramCard
              icon={Cpu}
              title="STEM & Robotics Academy"
              category="Technology"
              description="Hands-on engineering, 3D prototyping, micro-controllers, and competitive robotics."
              highlights={['Python & C++', '3D Printing', 'VEX Robotics']}
              delay={0.1}
            />
            <ProgramCard
              icon={Zap}
              title="Artificial Intelligence & Data"
              category="Innovation"
              description="Exploring data literacy, machine learning concepts, and ethical AI development."
              highlights={['Data Analysis', 'Neural Nets Intro', 'AI Ethics']}
              delay={0.2}
            />
            <ProgramCard
              icon={Globe}
              title="Global Leadership & Diplomacy"
              category="Humanities"
              description="Model UN, debating societies, international exchange programs, and environmental stewardship."
              highlights={['Public Speaking', 'Model UN', 'Global Ethics']}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 5. FACILITIES SHOWCASE */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="World-Class Campus"
            title="State-of-the-Art Facilities"
            subtitle="Designed to support active learning, physical wellness, and artistic expression."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FacilityCard
              icon={Building2}
              title="Smart Classrooms"
              subtitle="Interactive Learning"
              description="Equipped with 4K interactive touch boards and high-speed digital infrastructure."
              imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
              delay={0.1}
            />
            <FacilityCard
              icon={Cpu}
              title="AI & Innovation Lab"
              subtitle="Hands-on Tech"
              description="High-performance computing workstations for coding, AI modeling, and VR simulation."
              imageUrl="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
              delay={0.2}
            />
            <FacilityCard
              icon={Trophy}
              title="Sports Complex"
              subtitle="Athletic Excellence"
              description="Indoor heated pool, basketball courts, soccer turf, and gymnastics studio."
              imageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
              delay={0.3}
            />
            <FacilityCard
              icon={BookOpen}
              title="Digital Media Library"
              subtitle="Knowledge Hub"
              description="Over 30,000 physical volumes and instant access to digital research databases."
              imageUrl="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* 6. ACHIEVEMENTS STAT COUNTERS */}
      <section className="py-20 relative z-10 border-y border-gold-500/20 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { count: '1000+', label: 'Enrolled Students', desc: 'From 25+ Nationalities' },
              { count: '50+', label: 'Expert Faculty', desc: '80% Master & PhD Holders' },
              { count: '20+', label: 'Specialized Programs', desc: 'STEM, Arts, Sports & AI' },
              { count: '95%+', label: 'Academic Distinction', desc: 'Top University Placements' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-card border border-gold-500/20"
              >
                <div className="text-4xl sm:text-5xl font-heading font-extrabold text-gradient-gold mb-2">
                  {stat.count}
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Campus Life"
            title="Noventra in Action"
            subtitle="Explore moments of discovery, sports triumphs, and academic achievements."
          />

          <GalleryGrid />
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 relative z-10 border-t border-slate-800/60 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Testimonials"
            title="What Parents & Students Say"
            subtitle="Hear directly from families who are part of the Noventra community."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Marcus Vance"
              role="Parent of Grade 9 Student"
              relation="STEM Program"
              content="The transformation in my son's problem-solving ability since joining Noventra's AI & Robotics lab has been astounding. The teachers truly care about individual potential."
              rating={5}
              delay={0.1}
            />
            <TestimonialCard
              name="Elena Rostova"
              role="Grade 11 Student"
              relation="Head Student Council"
              content="Noventra gave me the confidence to speak at national debates and lead our robotics team to victory. It feels like a place where every idea is valued."
              rating={5}
              delay={0.2}
            />
            <TestimonialCard
              name="Dr. Aris Thorne"
              role="Parent of Grade 4 Student"
              relation="Primary Academy"
              content="The balance between rigorous academics, creative arts, and physical well-being makes Noventra standout. The campus infrastructure is top-notch."
              rating={5}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 9. ADMISSION ENQUIRY SECTION */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Take the First Step"
            title="Enquire for Admission"
            subtitle="Fill out the official form below to receive detailed prospectus information or schedule a personal campus tour."
          />

          <EnquiryForm />
        </div>
      </section>
    </div>
  );
};
