
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CalendarClock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from './types';

interface EventDetailsSectionProps {
  form: UseFormReturn<BookingFormValues>;
  menuSelection?: any;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ form, menuSelection }) => {
  // Pre-populate number of guests from menu selection
  useEffect(() => {
    if (menuSelection?.numberOfGuests) {
      form.setValue('numberOfGuests', menuSelection.numberOfGuests);
    }
  }, [menuSelection, form]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Details</h3>
      
      <FormField
        control={form.control}
        name="eventDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Date</FormLabel>
            <FormControl>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal pl-10"
                    >
                      <CalendarClock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfGuests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Guests (Minimum 50)</FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="50"
                  className="pl-10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const numValue = value ? parseInt(value) : '';
                    field.onChange(numValue);
                  }}
                  value={field.value || ''}
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
