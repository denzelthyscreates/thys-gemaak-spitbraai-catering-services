
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Only disable past dates
    if (date < today) {
      console.log('Date disabled - past date:', date.toDateString());
      return true;
    }
    
    // Check if date is in the explicitly unavailable dates list
    const isExplicitlyUnavailable = unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
    
    // Check if date is in the blocked dates list
    const isBlocked = blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
    
    if (isExplicitlyUnavailable) {
      console.log('Date disabled - explicitly unavailable:', date.toDateString());
    }
    
    if (isBlocked) {
      console.log('Date disabled - blocked:', date.toDateString());
    }
    
    // DO NOT disable based on day of week - all days including Sundays (0) and Mondays (1) should be available
    return isExplicitlyUnavailable || isBlocked;
  };

  return {
    modifiers,
    modifiersStyles,
    isDateUnavailable
  };
};
