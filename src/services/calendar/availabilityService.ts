
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

    return data.map(item => item.date);
  }
}
