
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

// Define the form type to match useBookingForm schema
type AdditionalNotesFormData = {
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

interface AdditionalNotesSectionProps {
  form: UseFormReturn<AdditionalNotesFormData>;
}

const AdditionalNotesSection: React.FC<AdditionalNotesSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="additionalNotes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Information or Requests</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Please share any specific requirements or questions you have..."
              className="min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdditionalNotesSection;
