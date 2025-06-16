
import { supabase } from '@/integrations/supabase/client';
import { getAreaNameByPostalCode } from '@/data/travelData';
import { DateConflictInfo } from './types';

export class ConflictService {
  static async getDateConflicts(date: Date | string | null, userPostalCode?: string): Promise<DateConflictInfo | null> {
    if (!date) return null;
    
    try {
      // Ensure we have a proper date string
      let dateString: string;
      if (date instanceof Date) {
        dateString = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        // If it's already a string, try to parse it to ensure it's valid
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          console.error('Invalid date string:', date);
          return null;
        }
        dateString = parsedDate.toISOString().split('T')[0];
      } else {
        console.error('Invalid date type:', typeof date, date);
        return null;
      }

      console.log('Checking conflicts for date:', dateString);

      // Check for existing bookings on this date
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id, venue_postal_code, status')
        .eq('event_date', dateString)
        .in('status', ['confirmed', 'pending_payment', 'pending']);

      if (bookingError) {
        console.error('Error fetching bookings:', bookingError);
        return {
          hasConflict: false,
          message: 'Unable to check for conflicts. Please contact us to verify availability.',
          canProceed: true
        };
      }

      if (!bookings || bookings.length === 0) {
        return {
          hasConflict: false,
          conflictType: 'none',
          message: 'No existing bookings on this date. Your event can be scheduled.',
          canProceed: true,
          existingBookings: []
        };
      }

      // Check if we've reached the maximum of 2 events per day
      if (bookings.length >= 2) {
        return {
          hasConflict: true,
          conflictType: 'booking',
          message: 'This date already has 2 bookings (our daily maximum). Please choose another date.',
          canProceed: false,
          existingBookings: bookings
        };
      }

      // If we have a postal code, check area conflicts
      if (userPostalCode) {
        const userArea = getAreaNameByPostalCode(userPostalCode);

        if (!userArea) {
          return {
            hasConflict: false,
            message: 'Unable to determine service area. Please contact us to verify availability.',
            canProceed: true,
            existingBookings: bookings
          };
        }

        // Check area conflicts using postal codes
        const existingAreas = bookings
          .filter(booking => booking.venue_postal_code)
          .map(booking => getAreaNameByPostalCode(booking.venue_postal_code!))
          .filter(area => area !== null);

        const bookingsWithoutPostalCode = bookings.filter(booking => !booking.venue_postal_code);
        
        if (bookingsWithoutPostalCode.length > 0) {
          return {
            hasConflict: true,
            conflictType: 'booking',
            message: `This date has ${bookings.length} existing booking(s), some without location details. We will review area compatibility and confirm availability.`,
            canProceed: true,
            existingBookings: bookings
          };
        }

        const differentAreas = existingAreas.filter(area => area !== userArea);

        if (differentAreas.length > 0) {
          return {
            hasConflict: true,
            conflictType: 'booking',
            message: `This date has ${bookings.length} existing booking(s) in different service area(s). This may require special coordination. We will review and confirm availability.`,
            canProceed: true,
            existingBookings: bookings
          };
        }

        return {
          hasConflict: false,
          conflictType: 'none',
          message: `This date has ${bookings.length} existing booking(s) in the same service area (${userArea}). Your event can be accommodated.`,
          canProceed: true,
          existingBookings: bookings
        };
      }

      // If no postal code provided, just return basic conflict info
      return {
        hasConflict: true,
        conflictType: 'booking',
        message: `${bookings.length} booking(s) already exist for this date`,
        canProceed: true,
        existingBookings: bookings
      };

    } catch (error) {
      console.error('Error checking date conflicts:', error);
      return {
        hasConflict: false,
        message: 'Unable to check for conflicts. Please contact us to verify availability.',
        canProceed: true
      };
    }
  }
}
