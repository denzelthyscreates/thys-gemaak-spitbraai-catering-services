
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  supabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase credentials are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      setSupabaseReady(false);
      toast({
        title: "Configuration Error",
        description: "Supabase credentials are missing. Authentication features will not work.",
        variant: "destructive",
      });
      return;
    }
    
    setSupabaseReady(true);

    // Check for existing session
    const checkUser = async () => {
      try {
        setLoading(true);
        const { user, error } = await getCurrentUser();
        
        if (error) {
          throw error;
        }
        
        setUser(user);
      } catch (err: any) {
        console.error('Auth error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignIn = async (email: string, password: string) => {
    if (!supabaseReady) {
      toast({
        title: "Authentication Error",
        description: "Supabase is not configured. Please set up environment variables.",
        variant: "destructive",
      });
      return { success: false, error: "Supabase is not configured" };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Sign in error:', err);
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    if (!supabaseReady) {
      toast({
        title: "Authentication Error",
        description: "Supabase is not configured. Please set up environment variables.",
        variant: "destructive",
      });
      return { success: false, error: "Supabase is not configured" };
    }

    try {
      setLoading(true);
      // Get the current hostname to set as the redirect URL
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}/auth`
        }
      });

      if (error) throw error;

      toast({
        title: "Sign up successful",
        description: "Please verify your email to continue.",
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast({
        title: "Sign up failed",
        description: err.message,
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabaseReady) {
      return;
    }
    
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (err: any) {
      console.error('Sign out error:', err);
      toast({
        title: "Sign out failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        supabaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
