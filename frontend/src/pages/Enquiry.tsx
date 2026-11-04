import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { EnquiryForm } from '../components/EnquiryForm';

export const Enquiry: React.FC = () => {
  return (
    <div className="pt-28 pb-20 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <SectionHeading
        badge="Official Admission Portal"
        title="Noventra Admission Enquiry"
        subtitle="Please fill in student and parent details accurately. Your enquiry will generate a unique tracking ID for live status updates."
      />

      <EnquiryForm />
    </div>
  );
};
