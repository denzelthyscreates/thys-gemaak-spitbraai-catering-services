
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CalendarDays } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';
import { BookingFormValues } from './types';

interface EventDetailsSectionProps {
  form: UseFormReturn<BookingFormValues>;
  menuSelection: any;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ form, menuSelection }) => {
  const selectedDate = form.watch('eventDate');
  const venuePostalCode = form.watch('venuePostalCode');

  // Convert string to Date for calendar, and Date back to string for form
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('eventDate', date.toISOString().split('T')[0]);
    } else {
      form.setValue('eventDate', '');
    }
  };

  // Convert string back to Date for calendar display
  const getSelectedDateForCalendar = () => {
    if (selectedDate && typeof selectedDate === 'string') {
      return new Date(selectedDate);
    }
    return undefined;
  };

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
                  selectedDate={getSelectedDateForCalendar()}
                  onDateSelect={handleDateSelect}
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
