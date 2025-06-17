
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

  // Convert string to Date for calendar, ensuring we don't lose a day due to timezone issues
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format the date as YYYY-MM-DD without any timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      console.log('Date selected:', date, 'Formatted as:', dateString);
      form.setValue('eventDate', dateString);
    } else {
      form.setValue('eventDate', '');
    }
  };

  // Convert string back to Date for calendar display, ensuring proper date representation
  const getSelectedDateForCalendar = () => {
    if (selectedDate && typeof selectedDate === 'string') {
      // Parse the date string as local date to avoid timezone offset issues
      const [year, month, day] = selectedDate.split('-').map(Number);
      if (year && month && day) {
        const date = new Date(year, month - 1, day); // month is 0-indexed
        console.log('Converting selected date string:', selectedDate, 'to Date object:', date);
        return date;
      }
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
