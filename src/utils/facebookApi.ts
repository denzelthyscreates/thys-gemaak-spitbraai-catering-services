
import { createClient } from '@supabase/supabase-js';

// Facebook page ID 
// Note: You need to replace this with your actual Facebook page ID
// This can be found in your Facebook page URL or page settings
const FACEBOOK_PAGE_ID = '112480334826066'; // Using a fallback ID as an example

// Type definitions
export interface FacebookPhoto {
  id: string;
  source: string;
  name?: string;
  created_time: string;
}

export interface FacebookReview {
  id: string;
  reviewer: {
    name: string;
    picture?: string;
  };
  rating: number;
  review_text: string;
  created_time: string;
}

// Function to fetch photos from the Facebook API via our Supabase Edge Function
export const fetchFacebookPhotos = async (): Promise<FacebookPhoto[]> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log(`Fetching Facebook photos for page ID: ${FACEBOOK_PAGE_ID}`);
    
    const { data, error } = await supabase.functions.invoke('facebook-api', {
      body: { 
        endpoint: 'photos',
        pageId: FACEBOOK_PAGE_ID
      }
    });
    
    if (error) {
      console.error('Supabase Edge Function Error:', error);
      throw error;
    }
    
    if (data.error) {
      console.error('Facebook API Error:', data.error);
      throw new Error(data.error);
    }
    
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching Facebook photos:', error);
    throw error;
  }
};

// Function to fetch reviews from the Facebook API via our Supabase Edge Function
export const fetchFacebookReviews = async (): Promise<FacebookReview[]> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log(`Fetching Facebook reviews for page ID: ${FACEBOOK_PAGE_ID}`);
    
    const { data, error } = await supabase.functions.invoke('facebook-api', {
      body: { 
        endpoint: 'reviews',
        pageId: FACEBOOK_PAGE_ID
      }
    });
    
    if (error) {
      console.error('Supabase Edge Function Error:', error);
      throw error;
    }
    
    if (data.error) {
      console.error('Facebook API Error:', data.error);
      throw new Error(data.error);
    }
    
    return data.reviews || [];
  } catch (error) {
    console.error('Error fetching Facebook reviews:', error);
    throw error;
  }
};
