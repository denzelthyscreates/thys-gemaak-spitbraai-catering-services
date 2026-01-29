
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Supabase is configured via src/lib/supabase.ts with hardcoded fallback values
    // No need to check VITE_* env vars as they may not be available in production
    setSupabaseReady(true);

    // Check for existing session
    const checkUser = async () => {
      try {
        setLoading(true);
        const { user, error } = await getCurrentUser();
        
        if (error && error.message !== 'Auth session missing!') {
          // Only throw error if it's not the expected "no session" error
          throw error;
        }
        
        setUser(user);
      } catch (err: any) {
        // Only log non-session errors
        if (err.message !== 'Auth session missing!') {
          console.error('Auth error:', err);
          setError(err);
        }
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

  return {
    user,
    loading,
    error,
    supabaseReady,
    setUser,
    setLoading,
    setError,
    setSupabaseReady
  };
};
