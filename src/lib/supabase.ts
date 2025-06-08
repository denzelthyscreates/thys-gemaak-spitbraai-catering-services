import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback to hardcoded values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pcvmdyhzufupgckszrdy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdm1keWh6dWZ1cGdja3N6cmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTI0ODEsImV4cCI6MjA1ODY4ODQ4MX0.hNNiDqgi8MDavGcP7Bwc2KR59CTsdWAw8g4gdSr_Kq0';

// Check if environment variables are available
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Authentication will not work!');
}

// Create the unified Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Allow anonymous access for booking submissions
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

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

// Database helpers for the booking system with support for anonymous bookings
export const createBooking = async (bookingData: any) => {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: new Error('Supabase is not configured. Please set the required environment variables.') 
    };
  }

  // Get the current user (may be null for anonymous bookings)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError && userError.message !== 'Auth session missing!') {
    console.warn('Error getting user, proceeding with anonymous booking:', userError);
  }
  
  // Add the user_id to the booking data if user is authenticated, otherwise leave it null
  // This allows anonymous bookings while still associating bookings with users when they're logged in
  const bookingWithUserId = {
    ...bookingData,
    user_id: user?.id || null
  };
  
  console.log('Creating booking with data:', bookingWithUserId);
  
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