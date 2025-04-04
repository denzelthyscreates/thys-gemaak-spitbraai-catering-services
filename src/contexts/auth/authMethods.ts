
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthMethodsProps {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  supabaseReady: boolean;
  toast: ReturnType<typeof useToast>['toast'];
}

export const createAuthMethods = ({
  setUser,
  setLoading,
  supabaseReady,
  toast
}: AuthMethodsProps) => {
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

  return {
    handleSignIn,
    handleSignUp,
    handleSignOut
  };
};
