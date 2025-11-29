import React, { useCallback, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, UserProfile, UserRole, AuthContextType } from './AuthContext';
export { AuthContext };
export type { UserRole, UserProfile, AuthContextType };
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({
  children
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);
  const {
    toast
  } = useToast();
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabaseAvailable) return;
    try {
      const {
        data,
        error
      } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  }, [supabaseAvailable]);
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);
  useEffect(() => {
    let mounted = true;
    // Get initial session with error handling
    const initAuth = async () => {
      try {
        const {
          data: {
            session
          },
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase auth error:', error);
          setSupabaseAvailable(false);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setSupabaseAvailable(false);
        if (mounted) {
          setLoading(false);
          toast({
            title: 'Authentication unavailable',
            description: 'Running in read-only mode. Please check your configuration.',
            variant: 'destructive'
          });
        }
      }
    };
    initAuth();
    // Listen for auth changes with error handling
    let subscription: {
      unsubscribe: () => void;
    } | null = null;
    try {
      const {
        data
      } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Failed to set up auth listener:', error);
      setSupabaseAvailable(false);
    }
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile, toast]);
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabaseAvailable) {
      toast({
        title: 'Authentication unavailable',
        description: 'Please check your Supabase configuration.',
        variant: 'destructive'
      });
      throw new Error('Supabase not available');
    }
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.user) {
        await fetchProfile(data.user.id);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.'
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [supabaseAvailable, fetchProfile, toast]);
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    if (!supabaseAvailable) {
      toast({
        title: 'Authentication unavailable',
        description: 'Please check your Supabase configuration.',
        variant: 'destructive'
      });
      throw new Error('Supabase not available');
    }
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.'
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
      toast({
        title: 'Sign up failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [supabaseAvailable, toast]);
  const signOut = useCallback(async () => {
    if (!supabaseAvailable) {
      toast({
        title: 'Authentication unavailable',
        description: 'Please check your Supabase configuration.',
        variant: 'destructive'
      });
      throw new Error('Supabase not available');
    }
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign out';
      toast({
        title: 'Sign out failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [supabaseAvailable, toast]);
  // Role-based access helpers
  const hasRole = useCallback((role: UserRole): boolean => {
    return profile?.role === role;
  }, [profile]);
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return profile ? roles.includes(profile.role) : false;
  }, [profile]);
  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);
  const isAnalyst = useCallback((): boolean => {
    return hasRole('analyst');
  }, [hasRole]);
  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
    isAnalyst
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};