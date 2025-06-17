
import { useMemo } from 'react';

export const useCalendarModifiers = (
  unavailableDates: Date[],
  bookedDates: Date[],
  blockedDates: Date[],
  googleCalendarEvents: any[]
) => {
  const modifiers = useMemo(() => ({
    unavailable: unavailableDates.concat(blockedDates),
    booked: bookedDates,
    googleEvent: googleCalendarEvents.map(event => new Date(event.start))
  }), [unavailableDates, bookedDates, blockedDates, googleCalendarEvents]);

  const modifiersStyles = {
    unavailable: { 
      backgroundColor: '#fee2e2', 
      color: '#991b1b',
      textDecoration: 'line-through'
    },
    booked: { 
      backgroundColor: '#fef3c7', 
      color: '#92400e',
      fontWeight: 'bold'
    },
    googleEvent: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      border: '2px solid #3b82f6'
    }
  };

  // Create a Set for faster lookup of unavailable dates
  const unavailableDatesSet = useMemo(() => {
    const dateSet = new Set<string>();
    
    // Add explicitly unavailable dates
    unavailableDates.forEach(date => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      dateSet.add(normalizedDate.toDateString());
    });
    
    // Add blocked dates
    blockedDates.forEach(date => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      dateSet.add(normalizedDate.toDateString());
    });
    
    return dateSet;
  }, [unavailableDates, blockedDates]);

  const isDateUnavailable = (date: Date) => {
    // Get today's date and normalize to start of day for proper comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Normalize the input date to start of day for comparison
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Only log for debugging when actually needed, not for every date
    const shouldLog = Math.random() < 0.01; // Log ~1% of checks for debugging
    
    if (shouldLog) {
      const dayOfWeek = dateToCheck.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      console.log(`Checking date: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]}) vs today: ${today.toDateString()}`);
    }
    
    // Disable all past dates (dates before today)
    if (dateToCheck < today) {
      if (shouldLog) {
        const dayOfWeek = dateToCheck.getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        console.log(`Date disabled - past date: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]})`);
      }
      return true;
    }
    
    // Use Set for fast lookup instead of array iteration
    const isExplicitlyUnavailable = unavailableDatesSet.has(dateToCheck.toDateString());
    
    if (isExplicitlyUnavailable && shouldLog) {
      const dayOfWeek = dateToCheck.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      console.log(`Date disabled - explicitly unavailable: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]})`);
    }
    
    // Log availability for weekends when debugging
    if (shouldLog && !isExplicitlyUnavailable) {
      const dayOfWeek = dateToCheck.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        console.log(`${dayNames[dayOfWeek]} ${dateToCheck.toDateString()} is AVAILABLE for selection`);
      }
    }
    
    return isExplicitlyUnavailable;
  };

  return {
    modifiers,
    modifiersStyles,
    isDateUnavailable
  };
};
