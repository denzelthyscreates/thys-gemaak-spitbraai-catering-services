
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CalendarDays } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';

// Define the form type to match useBookingForm schema
type EventDetailsFormData = {
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

interface EventDetailsSectionProps {
  form: UseFormReturn<EventDetailsFormData>;
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
