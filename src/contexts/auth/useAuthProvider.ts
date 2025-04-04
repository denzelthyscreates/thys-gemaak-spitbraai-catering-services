
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
