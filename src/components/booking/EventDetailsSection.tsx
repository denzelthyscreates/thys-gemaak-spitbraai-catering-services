
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CalendarDays } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from './types';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';

interface EventDetailsSectionProps {
  form: UseFormReturn<BookingFormValues>;
  menuSelection: any;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ form, menuSelection }) => {
  const selectedDate = form.watch('eventDate');
  const venuePostalCode = form.watch('venuePostalCode');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="eventDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Event Date
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                <AvailabilityCalendar
                  selectedDate={field.value}
                  onDateSelect={field.onChange}
                  userPostalCode={venuePostalCode || menuSelection?.postalCode}
                  className="w-full"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EventDetailsSection;
