
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
        if (!item.isAvailable) {
          unavailable.push(date);
        }
        if (item.bookedEvents > 0) {
          booked.push(date);
        }
        if (item.googleCalendarEvents && item.googleCalendarEvents.length > 0) {
          googleEvents.push(...item.googleCalendarEvents);
        }
      });
      
      setUnavailableDates(unavailable);
      setBookedDates(booked);
      setGoogleCalendarEvents(googleEvents);
      
      // Get blocked dates
      const blocked = await CalendarAvailabilityService.getBlockedDates();
      setBlockedDates(blocked.map(dateStr => new Date(dateStr)));
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
