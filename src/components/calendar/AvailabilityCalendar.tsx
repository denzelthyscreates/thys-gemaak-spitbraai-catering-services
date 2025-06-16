
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { CalendarAvailabilityService } from '@/services/CalendarAvailabilityService';
import { SyncService } from '@/services/calendar/syncService';
import { ConflictService } from '@/services/calendar/conflictService';
import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import SyncStatusDisplay from './SyncStatusDisplay';
import SelectedDateInfo from './SelectedDateInfo';
import BookedDatesDisplay from './BookedDatesDisplay';
import DateConflictDisplay from './DateConflictDisplay';
import { cn } from '@/lib/utils';
import { AvailabilityData, DateConflictInfo } from '@/services/calendar/types';

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
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<any>(null);
  const [dateConflictInfo, setDateConflictInfo] = useState<DateConflictInfo | null>(null);

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

  // Check for date conflicts when selected date or postal code changes
  useEffect(() => {
    if (selectedDate && userPostalCode) {
      checkDateConflicts();
    } else {
      setDateConflictInfo(null);
    }
  }, [selectedDate, userPostalCode]);

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

  const checkDateConflicts = async () => {
    if (!selectedDate || !userPostalCode) return;
    
    try {
      const conflictInfo = await ConflictService.getDateConflicts(selectedDate, userPostalCode);
      setDateConflictInfo(conflictInfo);
    } catch (error) {
      console.error('Error checking date conflicts:', error);
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
            dateConflictInfo={dateConflictInfo}
          />
        )}
        
        <BookedDatesDisplay 
          availability={availability}
          isVisible={availability.length > 0}
        />
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
