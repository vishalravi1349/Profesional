import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, User, Phone, Mail, GraduationCap, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const enquirySchema = z.object({
  student_name: z.string().min(2, 'Student name is required (min 2 characters)'),
  parent_name: z.string().min(2, 'Parent/Guardian name is required'),
  mobile_number: z.string().min(7, 'Mobile number must be at least 7 digits'),
  email: z.string().email('Please enter a valid email address'),
  student_age: z.coerce.number().min(3, 'Age must be between 3 and 20').max(20, 'Age must be between 3 and 20'),
  current_class: z.string().min(1, 'Please specify student current class/grade'),
  interested_class: z.string().min(1, 'Please select interested class or program'),
  preferred_contact_method: z.enum(['Email', 'Phone', 'WhatsApp']),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const EnquiryForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const { user, sessionToken } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      student_name: '',
      parent_name: user?.full_name || '',
      mobile_number: user?.mobile_number || '',
      email: user?.email || '',
      student_age: 12,
      current_class: 'Grade 6',
      interested_class: 'Grade 7 - STEM Track',
      preferred_contact_method: 'Email',
      message: '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitting(true);
    try {
      const res = await api.submitEnquiry(data, sessionToken || undefined, user?.id);
      if (res.success && res.data) {
        setSubmittedId(res.data.id);
        showToast('Enquiry Submitted Successfully!', `Reference ID: ${res.data.id}`, 'success');
        reset();
      } else {
        showToast('Submission Failed', res.message || 'Please try again', 'error');
      }
    } catch (err: any) {
      showToast('Error', 'Unable to submit enquiry. Please check connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="p-8 md:p-12 rounded-3xl glass-panel text-center max-w-2xl mx-auto border border-gold-500/40">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-wider">
          Enquiry Registered
        </span>
        <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white mt-3 mb-2">
          Thank You for Enquiring!
        </h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Your admission enquiry has been successfully recorded under Reference ID:
        </p>
        <div className="inline-block px-6 py-3 rounded-2xl bg-navy-900 border border-gold-500/50 text-xl font-mono font-bold text-gold-400 tracking-wider mb-8">
          {submittedId}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setSubmittedId(null)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-slate-200 bg-navy-800 hover:bg-navy-700 border border-slate-700"
          >
            Submit Another Enquiry
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500"
          >
            View Dashboard Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 rounded-3xl glass-panel border border-slate-800 space-y-6">
      <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4" /> Admission Enquiry Application Form
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Student Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('student_name')}
              type="text"
              placeholder="e.g. Alex Jenkins"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.student_name && (
            <p className="text-xs text-rose-400 mt-1">{errors.student_name.message}</p>
          )}
        </div>

        {/* Parent / Guardian Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Parent / Guardian Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('parent_name')}
              type="text"
              placeholder="e.g. Sarah Jenkins"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.parent_name && (
            <p className="text-xs text-rose-400 mt-1">{errors.parent_name.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Contact Mobile Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('mobile_number')}
              type="text"
              placeholder="e.g. +1 (555) 987-6543"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.mobile_number && (
            <p className="text-xs text-rose-400 mt-1">{errors.mobile_number.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('email')}
              type="email"
              placeholder="e.g. sarah.j@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Student Age */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Student Age *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('student_age')}
              type="number"
              min="3"
              max="20"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.student_age && (
            <p className="text-xs text-rose-400 mt-1">{errors.student_age.message}</p>
          )}
        </div>

        {/* Current Class */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Current Class / Grade *
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              {...register('current_class')}
              type="text"
              placeholder="e.g. Grade 8"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.current_class && (
            <p className="text-xs text-rose-400 mt-1">{errors.current_class.message}</p>
          )}
        </div>

        {/* Interested Class */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Interested Grade / Program *
          </label>
          <select
            {...register('interested_class')}
            className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white text-sm focus:border-gold-500 focus:outline-none"
          >
            <option value="Kindergarten / Early Years">Kindergarten / Early Years</option>
            <option value="Primary School (Grades 1-5)">Primary School (Grades 1-5)</option>
            <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
            <option value="High School - STEM Track (Grade 9-12)">High School - STEM Track (Grade 9-12)</option>
            <option value="High School - Arts & Humanities (Grade 9-12)">High School - Arts & Humanities (Grade 9-12)</option>
            <option value="Advanced AI & Robotics Academy">Advanced AI & Robotics Academy</option>
          </select>
          {errors.interested_class && (
            <p className="text-xs text-rose-400 mt-1">{errors.interested_class.message}</p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Preferred Contact Method *
          </label>
          <select
            {...register('preferred_contact_method')}
            className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white text-sm focus:border-gold-500 focus:outline-none"
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone Call</option>
            <option value="WhatsApp">WhatsApp Message</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-200 mb-2">
          Message & Specific Enquiries *
        </label>
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            {...register('message')}
            rows={4}
            placeholder="Tell us about student interests, questions regarding admission process, campus tours, or scholarships..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
          />
        </div>
        {errors.message && (
          <p className="text-xs text-rose-400 mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {submitting ? (
          <span>Submitting Enquiry...</span>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Official Enquiry
          </>
        )}
      </button>
    </form>
  );
};
