
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define the form type to match useBookingForm schema
type ContactFormData = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  numberOfGuests: number;
  eventDate: string;
  venueName?: string;
  venueStreetAddress: string;
  venueCity: string;
  venueProvince: string;
  venuePostalCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCodeAddress: string;
  additionalNotes?: string;
};

interface ContactSectionProps {
  form: UseFormReturn<ContactFormData>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="contact-name">Full Name</FormLabel>
            <FormControl>
              <Input
                id="contact-name"
                placeholder="Enter your full name"
                autoComplete="name"
                autoFocus={false}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="contact-email">Email Address</FormLabel>
            <FormControl>
              <Input
                id="contact-email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                autoFocus={false}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="contact-phone">Phone Number</FormLabel>
            <FormControl>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                autoFocus={false}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactSection;
