
/**
 * This service handles integration with Make (formerly Integromat) to:
 * 1. Submit booking data to Google Sheets via Make
 * 2. Trigger email confirmations via Gmail
 * 3. Schedule follow-up reminders
 */

import { supabase } from '@/lib/supabase';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventType: string;
  eventLocation: string;
  additionalNotes?: string;
  menuPackage: string;
  numberOfGuests: number;
  season?: string;
  starters?: string;
  sides?: string;
  desserts?: string;
  extras?: string;
  totalPrice: number;
  discountApplied: boolean;
  submittedAt: string;
  user_id?: string;
  postalCode?: string;
  travelFee?: number | null;
  areaName?: string;
}

// Make webhook URL for the integration
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/tgojx8cfkf5sf65n1ctj4noz1du6pvpw";

/**
 * Submits booking data to both Supabase and Make webhook
 */
export const submitBookingToMake = async (data: BookingData): Promise<boolean> => {
  try {
    console.log('Submitting booking data to Make webhook and Supabase');
    
    // Add metadata for Make scenario to use
    const makePayload = {
      ...data,
      source: 'website_booking_form',
      requires_confirmation: true,
      requires_reminders: true,
      booking_reminder_due: 2, // 2 days for booking confirmation reminder
      payment_reminder_due: 7, // 7 days for payment reminder
      submission_timestamp: new Date().toISOString()
    };
    
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      makePayload.user_id = user.id;
    }
    
    console.log('Full payload being sent:', JSON.stringify(makePayload));
    
    // Save to Supabase database
    const { error: supabaseError } = await supabase
      .from('bookings')
      .insert(makePayload);
    
    if (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError);
    }
    
    // Also send to Make webhook as a backup/legacy integration
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Add this to handle potential CORS issues
      body: JSON.stringify(makePayload),
    });
    
    console.log('Booking submission complete');
    
    return true;
  } catch (error) {
    console.error('Error submitting booking:', error);
    return false;
  }
};

/**
 * Get bookings for the current user
 */
export const getUserBookings = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get bookings for this user
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('submittedAt', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const MakeAutomationInfo = {
  setupSteps: [
    "Create a webhook in Make that receives form data",
    "Set up a Google Sheets module to add booking data to a spreadsheet",
    "Add a Gmail module to send confirmation emails",
    "Create a scheduled scenario to check for upcoming bookings and send reminders",
    "Create a bookings spreadsheet with columns for all booking fields",
    "Create an email template for confirmations and reminders",
  ],
  makeScenarioDescription: `
    The Make scenario would work like this:
    1. Webhook receives booking data from your website
    2. Data is processed and added to the Google Sheet
    3. A confirmation email is sent immediately to the customer
    4. The scenario creates a scheduled task for 48-hour follow-up
    5. Another scenario runs daily to check for bookings needing reminders
    6. Reminder emails are sent based on scheduled dates
  `,
  googleSheetsSetup: `
    Create a Google Sheet with these columns:
    - Submission Date/Time
    - Customer Name
    - Email
    - Phone
    - Event Type
    - Event Date
    - Event Location
    - Menu Package
    - Number of Guests
    - Menu Details (Starters, Sides, etc.)
    - Total Price
    - Booking Status (New, Confirmed, Paid, etc.)
    - Follow-up Date
    - Notes
  `
};

export default {
  submitBookingToMake,
  getUserBookings,
  MakeAutomationInfo
};
