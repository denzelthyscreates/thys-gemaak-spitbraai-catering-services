
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from './types';

interface AdditionalNotesSectionProps {
  form: UseFormReturn<BookingFormValues>;
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
