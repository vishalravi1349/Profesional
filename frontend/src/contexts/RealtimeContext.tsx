import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Enquiry } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  lastUpdatedEnquiry: Enquiry | null;
  subscribeToEnquiries: (callback: (updated: Enquiry) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastUpdatedEnquiry, setLastUpdatedEnquiry] = useState<Enquiry | null>(null);
  const listenersRef = useRef<Set<(updated: Enquiry) => void>>(new Set());
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const client = supabase!;
    const channel = client
      .channel('public:enquiries')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'enquiries' },
        (payload) => {
          const updatedEnquiry = payload.new as Enquiry;
          setLastUpdatedEnquiry(updatedEnquiry);

          // Notify all active listener callbacks
          listenersRef.current.forEach((callback) => callback(updatedEnquiry));

          // If updated enquiry belongs to the active user, display real-time toast
          if (user && (updatedEnquiry.user_id === user.id || updatedEnquiry.email === user.email)) {
            showToast(
              `Enquiry Status Updated! (${updatedEnquiry.id})`,
              `New Status: ${updatedEnquiry.status}${
                updatedEnquiry.admin_response ? ' - Admin response received.' : ''
              }`,
              'warning'
            );
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [user, showToast]);

  const subscribeToEnquiries = (callback: (updated: Enquiry) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  return (
    <RealtimeContext.Provider value={{ lastUpdatedEnquiry, subscribeToEnquiries }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtimeEnquiries = (): RealtimeContextType => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeEnquiries must be used within RealtimeProvider');
  }
  return context;
};
