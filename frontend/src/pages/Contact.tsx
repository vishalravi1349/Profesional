import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
  return (
    <div className="pt-28 pb-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionHeading
        badge="Contact Us"
        title="We'd Love to Hear From You"
        subtitle="Our admissions team is available to assist with inquiries, campus visits, and registration."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Campus Location</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                124 Innovation Avenue, Education City Campus, City, Country
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Phone Helpline</h4>
              <p className="text-xs text-slate-300">+1 (800) 555-NOVENTRA</p>
              <p className="text-xs text-slate-400 mt-0.5">+1 (555) 019-2834 (Admissions)</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Email Inquiries</h4>
              <p className="text-xs text-slate-300">admissions@noventra.edu</p>
              <p className="text-xs text-slate-400 mt-0.5">info@noventra.edu</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Office Hours</h4>
              <p className="text-xs text-slate-300">Monday – Friday: 8:00 AM – 5:00 PM</p>
              <p className="text-xs text-slate-400 mt-0.5">Saturday: 9:00 AM – 1:00 PM</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder & Direct Form Banner */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-gold-500/30 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Direct Admission Request
            </span>
            <h3 className="text-2xl font-heading font-bold text-white">
              Looking for Immediate Admission Guidance?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Skip traditional queues by submitting an online admission enquiry. Our counsellors will review your request and get back within 24 hours.
            </p>
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20"
            >
              <Send className="w-4 h-4" /> Go to Admission Enquiry Form
            </Link>
          </div>

          {/* Interactive Map Graphic Container */}
          <div className="rounded-3xl overflow-hidden glass-card h-[280px] border border-slate-800 relative flex items-center justify-center text-center p-6 bg-navy-900/60">
            <div className="space-y-2">
              <MapPin className="w-10 h-10 text-gold-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Noventra City Campus</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Located in the heart of Education City with direct highway access and metro connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
