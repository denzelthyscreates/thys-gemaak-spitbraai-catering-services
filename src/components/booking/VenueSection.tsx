import React, { useEffect, useRef, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from './types';
import { getAreaByPostalCode } from '@/data/travelData';

interface VenueSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

const VenueSection: React.FC<VenueSectionProps> = ({ form }) => {
  const postalCode = form.watch('venuePostalCode');
  const lastProcessedPostalCode = useRef<string>('');

  // Memoize the setValue function to prevent unnecessary re-renders
  const setFormValues = useCallback((city: string, province: string) => {
    form.setValue('venueCity', city, { shouldDirty: false });
    form.setValue('venueProvince', province, { shouldDirty: false });
  }, [form.setValue]);

  // Auto-populate address fields based on postal code with optimization
  useEffect(() => {
    if (postalCode && 
        postalCode.length >= 4 && 
        postalCode !== lastProcessedPostalCode.current) {
      
      const areaInfo = getAreaByPostalCode(postalCode);
      if (areaInfo) {
        // Set city and province based on the area information
        setFormValues(areaInfo.city || '', areaInfo.province || 'Western Cape');
        lastProcessedPostalCode.current = postalCode;
      }
    }
  }, [postalCode, setFormValues]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="venueName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Name (Optional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Conference Center, Community Hall, Private Residence" 
                autoComplete="organization"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="venueStreetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="123 Main Street" 
                  autoComplete="street-address"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="venuePostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="8000" 
                  autoComplete="postal-code"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="venueCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Cape Town" 
                  autoComplete="address-level2"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="venueProvince"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Western Cape" 
                  autoComplete="address-level1"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default VenueSection;
