
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
      
      const availabilityData = await CalendarAvailabilityService.getAvailability(startDate, endDate);
      setAvailability(availabilityData);
      
      // Process the data to extract dates for calendar modifiers
      const unavailable: Date[] = [];
      const booked: Date[] = [];
      const googleEvents: any[] = [];
      
      availabilityData.forEach(item => {
        const date = new Date(item.date);
        
        // Only mark as unavailable if explicitly set to false, not based on day of week
        if (item.isAvailable === false) {
          console.log('Marking date as unavailable from DB:', date.toDateString(), 'Day of week:', date.getDay());
          unavailable.push(date);
        }
        if (item.bookedEvents > 0) {
          booked.push(date);
        }
        if (item.googleCalendarEvents && item.googleCalendarEvents.length > 0) {
          googleEvents.push(...item.googleCalendarEvents);
        }
      });
      
      console.log('Unavailable dates loaded:', unavailable.map(d => d.toDateString()));
      setUnavailableDates(unavailable);
      setBookedDates(booked);
      setGoogleCalendarEvents(googleEvents);
      
      // Get blocked dates
      const blocked = await CalendarAvailabilityService.getBlockedDates();
      const blockedDateObjects = blocked.map(dateStr => new Date(dateStr));
      console.log('Blocked dates loaded:', blockedDateObjects.map(d => d.toDateString()));
      setBlockedDates(blockedDateObjects);
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
