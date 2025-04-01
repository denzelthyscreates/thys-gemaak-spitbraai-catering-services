
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are available
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Authentication will not work!');
}

// Create the Supabase client with proper fallbacks
// Using dummy values when real ones aren't available allows the app to at least load
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-supabase-url.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key-for-fallback-purposes'
);

// Export configuration status for UI components to use
export const isSupabaseReady = isSupabaseConfigured;

// Auth helpers
export const signUp = async (email: string, password: string, redirectTo?: string) => {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: new Error('Supabase is not configured. Please set the required environment variables.') 
    };
  }
  
  const options = redirectTo ? { emailRedirectTo: redirectTo } : undefined;
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: new Error('Supabase is not configured. Please set the required environment variables.') 
    };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not configured. Please set the required environment variables.') };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    return { user: null, error: new Error('Supabase is not configured. Please set the required environment variables.') };
  }
  
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Database helpers for the booking system with RLS support
export const createBooking = async (bookingData: any) => {
  // Get the current user to ensure we have authentication
  const { user } = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: new Error('User must be authenticated to create a booking') };
  }
  
  // Add the user_id to the booking data for RLS
  const bookingWithUserId = {
    ...bookingData,
    user_id: user.id
  };
  
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingWithUserId)
    .select()
    .single();
  
  return { data, error };
};

export const getBookings = async () => {
  // RLS will automatically filter to only show the current user's bookings
  // No need to explicitly filter by user_id as RLS policy will handle this
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getBookingById = async (id: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

export const updateBooking = async (id: string, bookingData: any) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(bookingData)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteBooking = async (id: string) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);
  
  return { error };
};
