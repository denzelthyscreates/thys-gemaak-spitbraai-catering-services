
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

  const isDateUnavailable = (date: Date) => {
    // Get today's date and normalize to start of day for proper comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Normalize the input date to start of day for comparison
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Get day of week for debugging
    const dayOfWeek = dateToCheck.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    console.log(`Checking date: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]}) vs today: ${today.toDateString()}`);
    
    // Disable all past dates (dates before today)
    if (dateToCheck < today) {
      console.log(`Date disabled - past date: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]})`);
      return true;
    }
    
    // Check if date is in the explicitly unavailable dates list
    const isExplicitlyUnavailable = unavailableDates.some(unavailableDate => {
      const normalizedUnavailableDate = new Date(unavailableDate);
      normalizedUnavailableDate.setHours(0, 0, 0, 0);
      return normalizedUnavailableDate.getTime() === dateToCheck.getTime();
    });
    
    // Check if date is in the blocked dates list
    const isBlocked = blockedDates.some(blockedDate => {
      const normalizedBlockedDate = new Date(blockedDate);
      normalizedBlockedDate.setHours(0, 0, 0, 0);
      return normalizedBlockedDate.getTime() === dateToCheck.getTime();
    });
    
    if (isExplicitlyUnavailable) {
      console.log(`Date disabled - explicitly unavailable: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]})`);
    }
    
    if (isBlocked) {
      console.log(`Date disabled - blocked: ${dateToCheck.toDateString()} (${dayNames[dayOfWeek]})`);
    }
    
    // CRITICAL: DO NOT disable based on day of week
    // All days including Sundays (0) and Mondays (1) should be available for future dates
    const shouldDisable = isExplicitlyUnavailable || isBlocked;
    
    if (!shouldDisable && (dayOfWeek === 0 || dayOfWeek === 1)) {
      console.log(`${dayNames[dayOfWeek]} ${dateToCheck.toDateString()} is AVAILABLE for selection`);
    }
    
    return shouldDisable;
  };

  return {
    modifiers,
    modifiersStyles,
    isDateUnavailable
  };
};
