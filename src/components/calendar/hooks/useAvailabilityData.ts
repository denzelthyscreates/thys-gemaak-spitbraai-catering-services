
import { useState, useEffect } from 'react';
import { CalendarAvailabilityService } from '@/services/calendar';
import { AvailabilityData } from '@/services/calendar/types';

export const useAvailabilityData = (month: Date, userPostalCode?: string) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAvailabilityData();
  }, [month, userPostalCode]);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      // Get start and end of month
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      console.log(`Loading availability data for ${month.getFullYear()}-${month.getMonth() + 1}`);
      
      const availabilityData = await CalendarAvailabilityService.getAvailability(startDate, endDate);
      setAvailability(availabilityData);
      
      // Process the data to extract dates for calendar modifiers
      const unavailable: Date[] = [];
      const booked: Date[] = [];
      const googleEvents: any[] = [];
      
      availabilityData.forEach(item => {
        const date = new Date(item.date);
        const dayOfWeek = date.getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // CRITICAL FIX: Do not mark Sundays and Mondays as unavailable based on database entries
        // Only mark as unavailable if explicitly set to false AND it's not a Sunday or Monday
        // This ensures Sundays and Mondays are always available regardless of database entries
        if (item.isAvailable === false && dayOfWeek !== 0 && dayOfWeek !== 1) {
          console.log('Marking date as unavailable from DB:', date.toDateString(), 'Day of week:', dayOfWeek);
          unavailable.push(date);
        } else if (item.isAvailable === false && (dayOfWeek === 0 || dayOfWeek === 1)) {
          console.log(`OVERRIDE: ${dayNames[dayOfWeek]} ${date.toDateString()} marked unavailable in DB but FORCING it to be available`);
        }
        
        if (item.bookedEvents > 0) {
          booked.push(date);
        }
        if (item.googleCalendarEvents && item.googleCalendarEvents.length > 0) {
          googleEvents.push(...item.googleCalendarEvents);
        }
      });
      
      console.log('Final unavailable dates after processing:', unavailable.map(d => d.toDateString()));
      setUnavailableDates(unavailable);
      setBookedDates(booked);
      setGoogleCalendarEvents(googleEvents);
      
      // Get blocked dates
      const blocked = await CalendarAvailabilityService.getBlockedDates();
      const blockedDateObjects = blocked.map(dateStr => new Date(dateStr));
      
      // Filter out Sundays and Mondays from blocked dates as well
      const filteredBlockedDates = blockedDateObjects.filter(date => {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 1) {
          console.log(`OVERRIDE: Removing ${dayOfWeek === 0 ? 'Sunday' : 'Monday'} ${date.toDateString()} from blocked dates`);
          return false;
        }
        return true;
      });
      
      console.log('Final blocked dates after filtering:', filteredBlockedDates.map(d => d.toDateString()));
      setBlockedDates(filteredBlockedDates);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availability,
    unavailableDates,
    bookedDates,
    blockedDates,
    googleCalendarEvents,
    isLoading
  };
};
