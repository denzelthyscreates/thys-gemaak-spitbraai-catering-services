
import { supabase } from '@/lib/supabase';
import { DateConflictInfo } from './types';

export class ConflictService {
  static async getDateConflicts(date: Date | string | null): Promise<DateConflictInfo | null> {
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
        return null;
      }

      if (!bookings || bookings.length === 0) {
        return {
          hasConflict: false,
          conflictType: 'none',
          message: 'Date is available',
          existingBookings: []
        };
      }

      return {
        hasConflict: true,
        conflictType: 'booking',
        message: `${bookings.length} booking(s) already exist for this date`,
        existingBookings: bookings
      };

    } catch (error) {
      console.error('Error checking date conflicts:', error);
      return null;
    }
  }
}
