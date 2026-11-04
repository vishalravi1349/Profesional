import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-navy-950 border-t border-slate-800/80 pt-16 pb-8 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Upper CTA Card Banner */}
        <div className="mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Admissions Open 2026-2027
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Shape Your Child's Future with Noventra
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Join our vibrant academic community dedicated to innovation, STEM excellence, and holistic leadership.
            </p>
          </div>
          <Link
            to="/enquiry"
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/25 transition-all transform hover:-translate-y-1"
          >
            Submit Admission Enquiry
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-gradient-to-br from-gold-400 to-navy-800">
                <img src="/logo.jpeg" alt="Noventra Crest" className="w-10 h-10 object-contain rounded-lg bg-navy-950 p-0.5" />
              </div>
              <div>
                <span className="text-xl font-heading font-extrabold tracking-tight text-white">
                  NOVENTRA
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-gold-400 uppercase -mt-1">
                  S C H O O L
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering future-ready leaders through innovative STEM learning, AI integration, creative arts, and holistic values.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Accredited Excellence
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-gold-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Noventra</Link></li>
              <li><Link to="/academics" className="hover:text-gold-400 transition-colors">Curriculum & Pedagogy</Link></li>
              <li><Link to="/facilities" className="hover:text-gold-400 transition-colors">Campus Facilities</Link></li>
              <li><Link to="/achievements" className="hover:text-gold-400 transition-colors">School Achievements</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-400 transition-colors">Photo & Video Gallery</Link></li>
              <li><Link to="/enquiry" className="hover:text-gold-400 transition-colors">Admissions & Enquiries</Link></li>
            </ul>
          </div>

          {/* Programs Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-gold-400">
              Specialized Programs
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/programs" className="hover:text-gold-400 transition-colors">STEM & Robotics Lab</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition-colors">AI & Computational Thinking</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition-colors">Creative Performing Arts</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition-colors">Global Leadership Program</Link></li>
              <li><Link to="/programs" className="hover:text-gold-400 transition-colors">Sports & Physical Fitness</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-gold-400">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>124 Innovation Avenue, Education City Campus, City, Country</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+1 (800) 555-NOVENTRA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>admissions@noventra.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Noventra School. All rights reserved. Built with passion for excellence.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for Future Leaders</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
