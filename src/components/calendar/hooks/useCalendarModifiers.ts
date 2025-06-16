
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
    
    // Only disable past dates - all future dates including Sundays and Mondays are available
    if (date < today) return true;
    
    // Check if date is in the explicitly unavailable dates list
    const isExplicitlyUnavailable = unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
    
    // Check if date is in the blocked dates list
    const isBlocked = blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
    
    return isExplicitlyUnavailable || isBlocked;
  };

  return {
    modifiers,
    modifiersStyles,
    isDateUnavailable
  };
};
