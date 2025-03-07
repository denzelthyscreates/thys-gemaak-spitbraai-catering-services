
/**
 * This is a service that simulates integration with Make + Google Sheets
 * 
 * In a real implementation:
 * 1. The BookingForm would submit to a Make webhook
 * 2. Make would process the data and add it to Google Sheets
 * 3. Make would trigger Gmail to send confirmation emails
 * 4. Make would schedule follow-up reminders
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

export const submitBookingToMake = async (data: BookingData): Promise<boolean> => {
  try {
    console.log('In a real implementation, this would submit to a Make webhook URL');
    console.log('Make would then:');
    console.log('1. Add the booking to a Google Sheet');
    console.log('2. Send a confirmation email via Gmail');
    console.log('3. Schedule reminder emails in Make for follow-up');
    
    // In a real implementation, this would be an actual API call:
    // const response = await fetch('https://hook.eu1.make.com/your-webhook-id', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // return response.ok;
    
    // Instead, we'll simulate a successful response
    await new Promise(resolve => setTimeout(resolve, 1000));
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
