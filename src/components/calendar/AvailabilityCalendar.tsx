
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CalendarAvailabilityService, AvailabilityData, SyncStatus } from '@/services/CalendarAvailabilityService';
import { toast } from 'sonner';

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
  const [dateConflictInfo, setDateConflictInfo] = useState<{
    hasConflict: boolean;
    message: string;
    canProceed: boolean;
  } | null>(null);

  // Load availability data
  const loadAvailability = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 90);

      const [availabilityData, blockedDatesData, statusData] = await Promise.all([
        CalendarAvailabilityService.getAvailability(startDate, endDate),
        CalendarAvailabilityService.getBlockedDates(),
        CalendarAvailabilityService.getSyncStatus()
      ]);

      setAvailability(availabilityData);
      setBlockedDates(blockedDatesData);
      setSyncStatus(statusData);
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
    if (selectedDate && userPostalCode) {
      checkDateConflicts(selectedDate);
    } else {
      setDateConflictInfo(null);
    }
  }, [selectedDate, userPostalCode]);

  const checkDateConflicts = async (date: Date) => {
    try {
      const conflicts = await CalendarAvailabilityService.getDateConflicts(date, userPostalCode);
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

  // Handle sync with Google Calendar
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await CalendarAvailabilityService.syncWithGoogleCalendar();
      
      if (result.success) {
        toast.success('Calendar synced successfully!');
        loadAvailability(); // Reload data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to sync calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  // Check if date should be disabled (only blocked dates and weekends)
  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is blocked
    if (blockedDates.includes(dateStr)) return true;
    
    // Block past dates
    if (date < new Date()) return true;
    
    // Block Sundays and Mondays
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 1;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Loading Calendar...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Select Event Date
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Calendar'}
          </Button>
        </div>
        <CardDescription>
          Choose a date for your event. We can accommodate up to 2 events per day in the same area.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Status */}
        {syncStatus && (
          <div className="flex items-center gap-2 text-sm">
            {syncStatus.status === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>
              Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
            </span>
            {syncStatus.status === 'success' && (
              <Badge variant="secondary">{syncStatus.eventsSynced} events</Badge>
            )}
          </div>
        )}

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={isDateDisabled}
          className="rounded-md border"
        />

        {/* Date Selection Info */}
        {selectedDate && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Selected Date</h4>
              <p className="text-blue-700">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Conflict Information */}
            {dateConflictInfo && (
              <div className={`p-3 rounded-lg ${
                dateConflictInfo.hasConflict 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-start gap-2">
                  {dateConflictInfo.hasConflict ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      dateConflictInfo.hasConflict ? 'text-yellow-900' : 'text-green-900'
                    }`}>
                      {dateConflictInfo.hasConflict ? 'Potential Booking Conflict' : 'Date Available'}
                    </h4>
                    <p className={`text-sm ${
                      dateConflictInfo.hasConflict ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {dateConflictInfo.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Sundays and Mondays are not available for bookings</p>
          <p>• We can handle up to 2 events per day if they are in the same service area</p>
          <p>• Events in different areas on the same day may require coordination</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
