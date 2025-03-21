
/**
 * This service handles integration with Make (formerly Integromat) to:
 * 1. Submit booking data to Google Sheets via Make
 * 2. Trigger email confirmations via Gmail
 * 3. Schedule follow-up reminders
 */

interface BookingData {
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
}

// Make webhook URL for the integration
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/tgojx8cfkf5sf65n1ctj4noz1du6pvpw";

/**
 * Submits booking data to Make webhook, which then:
 * 1. Adds the data to Google Sheets
 * 2. Sends confirmation email via Gmail
 * 3. Schedules reminder emails
 */
export const submitBookingToMake = async (data: BookingData): Promise<boolean> => {
  try {
    console.log('Submitting booking data to Make webhook:', MAKE_WEBHOOK_URL);
    
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
    
    // Make the actual API call to the Make webhook
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(makePayload),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Make webhook:', errorText);
      return false;
    }
    
    // Log the successful response
    const responseData = await response.json().catch(() => null);
    console.log('Make webhook response:', responseData || 'Success (no response body)');
    
    return true;
  } catch (error) {
    console.error('Error submitting booking to Make:', error);
    return false;
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
  MakeAutomationInfo
};
