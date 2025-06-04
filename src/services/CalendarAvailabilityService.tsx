import { supabase } from '@/integrations/supabase/client';
import { getAreaNameByPostalCode } from '@/data/travelData';

export interface AvailabilityData {
  date: string;
  isAvailable: boolean;
  bookedEvents: number;
  maxEvents: number;
  googleCalendarEvents: any[];
  notes?: string;
}

export interface SyncStatus {
  lastSync: string;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string;
  eventsSynced: number;
}

export interface DateConflictInfo {
  hasConflict: boolean;
  message: string;
  canProceed: boolean;
}

/**
 * Service for managing calendar availability and Google Calendar sync
 */
export class CalendarAvailabilityService {
  
  /**
   * Get availability for a date range
   */
  static async getAvailability(startDate: Date, endDate: Date): Promise<AvailabilityData[]> {
    const { data, error } = await supabase
      .from('event_availability')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date');

    if (error) {
      console.error('Error fetching availability:', error);
      throw new Error('Failed to fetch availability data');
    }

    return data.map(item => ({
      date: item.date,
      isAvailable: item.is_available,
      bookedEvents: item.booked_events,
      maxEvents: item.max_events,
      googleCalendarEvents: Array.isArray(item.google_calendar_events) 
        ? item.google_calendar_events 
        : [],
      notes: item.notes
    }));
  }

  /**
   * Check if a specific date is available
   */
  static async isDateAvailable(date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('event_availability')
      .select('is_available, booked_events, max_events')
      .eq('date', dateStr)
      .single();

    if (error || !data) {
      // If no data exists for this date, check if it's a blocked day (weekend, etc.)
      const dayOfWeek = date.getDay();
      return !(dayOfWeek === 0 || dayOfWeek === 1); // Block Sundays and Mondays by default
    }

    return data.is_available && data.booked_events < data.max_events;
  }

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

  /**
   * Get blocked dates
   */
  static async getBlockedDates(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('date');

    if (error) {
      console.error('Error fetching blocked dates:', error);
      return [];
    }

    return data.map(item => item.date);
  }

  /**
   * Trigger Google Calendar sync
   */
  static async syncWithGoogleCalendar(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Sync error:', error);
      return { 
        success: false, 
        message: 'Failed to sync with Google Calendar: ' + error.message 
      };
    }
  }

  /**
   * Get sync status
   */
  static async getSyncStatus(): Promise<SyncStatus | null> {
    const { data, error } = await supabase
      .from('calendar_sync')
      .select('*')
      .order('last_sync', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      lastSync: data.last_sync,
      status: data.sync_status as 'success' | 'error' | 'pending',
      errorMessage: data.error_message,
      eventsSynced: data.events_synced
    };
  }

  /**
   * Reserve a date (when booking is confirmed)
   */
  static async reserveDate(date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('event_availability')
      .upsert({
        date: dateStr,
        booked_events: 1,
        is_available: false,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error reserving date:', error);
      return false;
    }

    return true;
  }
}
