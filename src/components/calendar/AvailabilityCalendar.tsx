
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { CalendarAvailabilityService, AvailabilityData, SyncStatus, DateConflictInfo } from '@/services/calendar';
import { toast } from 'sonner';
import CalendarHeader from './CalendarHeader';
import SyncStatusDisplay from './SyncStatusDisplay';
import SelectedDateInfo from './SelectedDateInfo';
import CalendarLegend from './CalendarLegend';

interface AvailabilityCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  className?: string;
  userPostalCode?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
  className,
  userPostalCode
}) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dateConflictInfo, setDateConflictInfo] = useState<DateConflictInfo | null>(null);

  // Load availability data and sync status
  const loadAvailability = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 90);

      // Load basic availability data (no authentication required)
      try {
        const [availabilityData, blockedDatesData] = await Promise.all([
          CalendarAvailabilityService.getAvailability(startDate, endDate),
          CalendarAvailabilityService.getBlockedDates()
        ]);

        setAvailability(availabilityData);
        setBlockedDates(blockedDatesData);

        // Load sync status to show when last sync occurred
        try {
          const statusData = await CalendarAvailabilityService.getSyncStatus();
          setSyncStatus(statusData);
        } catch (syncError) {
          console.log('Sync status not available:', syncError);
        }
      } catch (error) {
        console.log('Availability service not available, using default calendar');
        // Set empty arrays as fallback
        setAvailability([]);
        setBlockedDates([]);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load calendar availability');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  // Check for area-based conflicts when date is selected
  useEffect(() => {
    if (selectedDate) {
      checkDateConflicts(selectedDate);
    } else {
      setDateConflictInfo(null);
    }
  }, [selectedDate, userPostalCode]);

  const checkDateConflicts = async (date: Date) => {
    try {
      const conflicts = await CalendarAvailabilityService.getDateConflicts(date);
      setDateConflictInfo(conflicts);
    } catch (error) {
      console.error('Error checking date conflicts:', error);
      setDateConflictInfo({
        hasConflict: false,
        message: 'Unable to check for conflicts. Please contact us to verify availability.',
        canProceed: true
      });
    }
  };

  // Handle sync with Google Calendar (now enabled for all users)
  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      toast.info('Starting Google Calendar sync...');
      
      const result = await CalendarAvailabilityService.syncWithGoogleCalendar();
      
      if (result.success) {
        toast.success(`Calendar synced successfully! ${result.message || 'Events updated'}`);
        
        // Reload availability data to show updated information
        await loadAvailability();
      } else {
        toast.error(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync calendar. Please check your connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Check if date should be disabled (only blocked dates and past dates)
  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is blocked
    if (blockedDates.includes(dateStr)) return true;
    
    // Block past dates
    if (date < new Date()) return true;
    
    // All days of the week are now available for booking
    return false;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CalendarHeader onSync={handleSync} isSyncing={isSyncing} />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CalendarHeader onSync={handleSync} isSyncing={isSyncing} />
        <CardDescription>
          Choose a date for your event. We can accommodate up to 2 events per day in the same area.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show sync status for all users */}
        <SyncStatusDisplay syncStatus={syncStatus} />

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={isDateDisabled}
          className="rounded-md border"
        />

        {selectedDate && (
          <SelectedDateInfo 
            selectedDate={selectedDate} 
            dateConflictInfo={dateConflictInfo} 
          />
        )}

        <CalendarLegend />
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
