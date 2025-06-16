
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { CalendarAvailabilityService } from '@/services/CalendarAvailabilityService';
import { SyncService } from '@/services/calendar/syncService';
import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import SyncStatusDisplay from './SyncStatusDisplay';
import SelectedDateInfo from './SelectedDateInfo';
import BookedDatesDisplay from './BookedDatesDisplay';
import DateConflictDisplay from './DateConflictDisplay';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  userPostalCode?: string;
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
  userPostalCode,
  className
}) => {
  const [month, setMonth] = useState<Date>(new Date());
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<any>(null);

  // Auto-sync calendar data on mount and periodically
  useEffect(() => {
    const syncCalendarData = async () => {
      try {
        await SyncService.syncWithGoogleCalendar();
        const status = await SyncService.getSyncStatus();
        setLastSyncStatus(status);
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    };

    // Initial sync
    syncCalendarData();

    // Set up periodic sync every 5 minutes
    const interval = setInterval(syncCalendarData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAvailabilityData();
  }, [month, userPostalCode]);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      const availability = await CalendarAvailabilityService.getAvailabilityForMonth(month);
      
      setUnavailableDates(availability.unavailableDates);
      setBookedDates(availability.bookedDates);
      setBlockedDates(availability.blockedDates);
      setGoogleCalendarEvents(availability.googleCalendarEvents);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    return unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    ) || blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const hasGoogleCalendarEvent = (date: Date) => {
    return googleCalendarEvents.some(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForDate = (date: Date) => {
    return googleCalendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const modifiers = {
    unavailable: unavailableDates.concat(blockedDates),
    booked: bookedDates,
    googleEvent: googleCalendarEvents.map(event => new Date(event.start))
  };

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

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CalendarHeader />
        <CardDescription>
          Choose your event date. Unavailable dates are crossed out.
        </CardDescription>
        {lastSyncStatus && (
          <SyncStatusDisplay syncStatus={lastSyncStatus} />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={isDateUnavailable}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
        
        <CalendarLegend />
        
        {selectedDate && (
          <SelectedDateInfo 
            selectedDate={selectedDate}
            isBooked={isDateBooked(selectedDate)}
            hasGoogleEvent={hasGoogleCalendarEvent(selectedDate)}
            events={getEventsForDate(selectedDate)}
          />
        )}
        
        <BookedDatesDisplay 
          bookedDates={bookedDates}
          month={month}
        />
        
        <DateConflictDisplay 
          selectedDate={selectedDate}
          googleCalendarEvents={googleCalendarEvents}
        />
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
