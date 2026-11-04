import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MessageCircle, FileText, Award } from 'lucide-react';
import { EnquiryStatus } from '../types';

interface TimelineProps {
  currentStatus: EnquiryStatus;
}

const STEPS = [
  { key: 'Pending', label: 'Enquiry Submitted', icon: FileText, desc: 'Received by Noventra Admissions' },
  { key: 'Reviewing', label: 'Under Review', icon: Clock, desc: 'Academic counselor reviewing details' },
  { key: 'Contacted', label: 'Contacted', icon: MessageCircle, desc: 'Counsellor reached out via preferred method' },
  { key: 'Responded', label: 'Response Received', icon: CheckCircle2, desc: 'Official admin decision & advice provided' },
  { key: 'Approved', label: 'Completed', icon: Award, desc: 'Admission seat / interview confirmed' },
];

const getStepIndex = (status: EnquiryStatus): number => {
  switch (status) {
    case 'Pending':
      return 0;
    case 'Reviewing':
      return 1;
    case 'Contacted':
      return 2;
    case 'Responded':
      return 3;
    case 'Approved':
      return 4;
    case 'Closed':
      return 4;
    default:
      return 0;
  }
};

export const Timeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="py-6">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
        {/* Progress Bar Line */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-slate-800 rounded-full z-0">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-gold-400 to-emerald-400 rounded-full"
          />
        </div>

        {STEPS.map((step, idx) => {
          const isPassed = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center w-full md:w-1/5"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isCurrent
                    ? 'bg-gold-500 text-navy-950 ring-4 ring-gold-500/30 scale-110 shadow-lg shadow-gold-500/30 font-bold'
                    : isPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-navy-900 text-slate-500 border border-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h5
                  className={`text-xs font-heading font-bold ${
                    isCurrent ? 'text-gold-400' : isPassed ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
