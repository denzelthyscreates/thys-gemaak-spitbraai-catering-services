
import { supabase } from '@/integrations/supabase/client';
import { getAreaNameByPostalCode } from '@/data/travelData';
import { DateConflictInfo } from './types';

/**
 * Service for checking date conflicts and area-based restrictions
 */
export class ConflictService {
  /**
   * Check for area-based conflicts on a specific date
   */
  static async getDateConflicts(date: Date, userPostalCode: string): Promise<DateConflictInfo> {
    const dateStr = date.toISOString().split('T')[0];
    const userArea = getAreaNameByPostalCode(userPostalCode);

    if (!userArea) {
      return {
        hasConflict: false,
        message: 'Unable to determine service area. Please contact us to verify availability.',
        canProceed: true
      };
    }

    // Get existing bookings for this date with venue postal codes
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, venue_postal_code, status')
      .eq('event_date', dateStr)
      .in('status', ['confirmed', 'pending_payment', 'pending']);

    if (error) {
      console.error('Error fetching bookings:', error);
      return {
        hasConflict: false,
        message: 'Unable to check for conflicts. Please contact us to verify availability.',
        canProceed: true
      };
    }

    if (!bookings || bookings.length === 0) {
      return {
        hasConflict: false,
        message: 'No existing bookings on this date. Your event can be scheduled.',
        canProceed: true
      };
    }

    // Check if we've reached the maximum of 2 events per day
    if (bookings.length >= 2) {
      return {
        hasConflict: true,
        message: 'This date already has 2 bookings (our daily maximum). Please choose another date.',
        canProceed: false
      };
    }

    return this.checkAreaConflicts(bookings, userArea);
  }

  /**
   * Check for area-based conflicts with existing bookings
   */
  private static checkAreaConflicts(
    bookings: Array<{ id: string; venue_postal_code: string | null; status: string }>,
    userArea: string
  ): DateConflictInfo {
    // Check area conflicts using postal codes
    const existingAreas = bookings
      .filter(booking => booking.venue_postal_code) // Only check bookings with postal codes
      .map(booking => getAreaNameByPostalCode(booking.venue_postal_code!))
      .filter(area => area !== null);

    // If some bookings don't have postal codes, we need to be cautious
    const bookingsWithoutPostalCode = bookings.filter(booking => !booking.venue_postal_code);
    
    if (bookingsWithoutPostalCode.length > 0) {
      return {
        hasConflict: true,
        message: `This date has ${bookings.length} existing booking(s), some without location details. We will review area compatibility and confirm availability.`,
        canProceed: true
      };
    }

    // Check if any existing bookings are in different areas
    const differentAreas = existingAreas.filter(area => area !== userArea);

    if (differentAreas.length > 0) {
      return {
        hasConflict: true,
        message: `This date has ${bookings.length} existing booking(s) in different service area(s). This may require special coordination. We will review and confirm availability.`,
        canProceed: true
      };
    }

    // Same area, less than 2 bookings - this is ideal
    return {
      hasConflict: false,
      message: `This date has ${bookings.length} existing booking(s) in the same service area (${userArea}). Your event can be accommodated.`,
      canProceed: true
    };
  }
}
