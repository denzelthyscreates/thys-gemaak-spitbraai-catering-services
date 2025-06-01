
import { z } from 'zod';

export const bookingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  eventDate: z.date().optional(),
  eventType: z.string().min(1, { message: 'Please select an event type' }),
  // Event venue details
  venueName: z.string().optional(),
  venueStreetAddress: z.string().min(2, { message: 'Please enter the venue street address' }),
  venueCity: z.string().min(2, { message: 'Please enter the venue city' }),
  venueProvince: z.string().min(2, { message: 'Please enter the venue province' }),
  venuePostalCode: z.string().min(4, { message: 'Please enter the venue postal code' }),
  // Address fields for invoicing
  addressLine1: z.string().min(2, { message: 'Please enter your street address' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'Please enter your city' }),
  province: z.string().min(2, { message: 'Please enter your province' }),
  postalCodeAddress: z.string().min(4, { message: 'Please enter your postal code' }),
  additionalNotes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export interface BookingFormProps {
  menuSelection: any;
  savedFormData?: BookingFormValues | null;
  onFormDataChange?: (data: BookingFormValues) => void;
  onFormSubmitted?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const eventTypes = [
  "Birthday Party",
  "Wedding",
  "Business Event", 
  "Year-End Function",
  "Matric Farewell",
  "Family Gathering",
  "Other"
];
