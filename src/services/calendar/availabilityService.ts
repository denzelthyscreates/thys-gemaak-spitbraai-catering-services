
import { supabase } from '@/integrations/supabase/client';
import { AvailabilityData } from './types';

/**
 * Service for managing calendar availability data
 */
export class AvailabilityService {
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

    console.log('Raw availability data from database:', data);

    return data.map(item => {
      const mappedItem = {
        date: item.date,
        isAvailable: item.is_available,
        bookedEvents: item.booked_events,
        maxEvents: item.max_events,
        googleCalendarEvents: Array.isArray(item.google_calendar_events) 
          ? item.google_calendar_events 
          : [],
        notes: item.notes
      };
      
      // Log each item to see what's being marked as unavailable
      const itemDate = new Date(item.date);
      const dayOfWeek = itemDate.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      if ((dayOfWeek === 0 || dayOfWeek === 1) && item.is_available === false) {
        console.log(`DATABASE: ${dayNames[dayOfWeek]} ${itemDate.toDateString()} marked as unavailable in database with is_available:`, item.is_available);
      }
      
      return mappedItem;
    });
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
      // All days are now available for booking by default
      return true;
    }

    return data.is_available && data.booked_events < data.max_events;
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

    console.log('Blocked dates from database:', data);
    return data.map(item => item.date);
  }
}
