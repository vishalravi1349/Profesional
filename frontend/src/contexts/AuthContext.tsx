import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  sessionToken: string | null;
  loading: boolean;
  login: (email: string, password: string, rolePreference?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { full_name: string; mobile_number: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('noventra_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem('noventra_token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const client = supabase!;
        const { data } = await client.auth.getSession();
        if (data.session) {
          setSessionToken(data.session.access_token);
          localStorage.setItem('noventra_token', data.session.access_token);

          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profile) {
            setUser(profile);
            localStorage.setItem('noventra_user', JSON.stringify(profile));
          }
        }

        const { data: listener } = client.auth.onAuthStateChange(async (_event, session) => {
          if (session) {
            setSessionToken(session.access_token);
            localStorage.setItem('noventra_token', session.access_token);
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              localStorage.setItem('noventra_user', JSON.stringify(profile));
            }
          } else {
            setUser(null);
            setSessionToken(null);
            localStorage.removeItem('noventra_user');
            localStorage.removeItem('noventra_token');
          }
        });

        setLoading(false);
        return () => {
          listener.subscription.unsubscribe();
        };
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rolePreference?: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: UserProfile = profile || {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || 'Noventra User',
            mobile_number: data.user.user_metadata?.mobile_number || '',
            email: data.user.email || email,
            role: email.includes('admin') ? 'admin' : 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(userProfile);
          setSessionToken(data.session?.access_token || 'supabase-session');
          localStorage.setItem('noventra_user', JSON.stringify(userProfile));
          localStorage.setItem('noventra_token', data.session?.access_token || '');
          return { success: true };
        }
      }

      // Demo fallback login
      const isAdminLogin = email.toLowerCase().includes('admin') || rolePreference === 'admin';
      const mockProfile: UserProfile = {
        id: isAdminLogin ? 'demo-admin-id' : 'demo-user-id',
        full_name: isAdminLogin ? 'Noventra Administrator' : 'Sarah Jenkins',
        mobile_number: isAdminLogin ? '+1 (555) 019-2834' : '+1 (555) 987-6543',
        email,
        role: isAdminLogin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockProfile);
      setSessionToken('demo-token-12345');
      localStorage.setItem('noventra_user', JSON.stringify(mockProfile));
      localStorage.setItem('noventra_token', 'demo-token-12345');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (data: { full_name: string; mobile_number: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              mobile_number: data.mobile_number,
              role: 'user',
            },
          },
        });

        if (error) return { success: false, error: error.message };

        if (authData.user) {
          const newProfile: UserProfile = {
            id: authData.user.id,
            full_name: data.full_name,
            mobile_number: data.mobile_number,
            email: data.email,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(newProfile);
          localStorage.setItem('noventra_user', JSON.stringify(newProfile));
          return { success: true };
        }
      }

      // Demo signup
      const newProfile: UserProfile = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        full_name: data.full_name,
        mobile_number: data.mobile_number,
        email: data.email,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(newProfile);
      setSessionToken('demo-token-67890');
      localStorage.setItem('noventra_user', JSON.stringify(newProfile));
      localStorage.setItem('noventra_token', 'demo-token-67890');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('noventra_user');
    localStorage.removeItem('noventra_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        loading,
        login,
        signup,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
