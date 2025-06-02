
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { CalendarAvailabilityService, AvailabilityData, SyncStatus } from '@/services/CalendarAvailabilityService';
import { toast } from 'sonner';

interface AvailabilityCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
  className
}) => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Check if date is available
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is blocked
    if (blockedDates.includes(dateStr)) return false;
    
    // Check availability data
    const dateAvailability = availability.find(a => a.date === dateStr);
    if (dateAvailability) {
      return dateAvailability.isAvailable && dateAvailability.bookedEvents < dateAvailability.maxEvents;
    }
    
    // Default check for weekends
    const dayOfWeek = date.getDay();
    return !(dayOfWeek === 0 || dayOfWeek === 1); // Block Sundays and Mondays
  };

  // Custom day renderer
  const renderDay = (date: Date) => {
    const available = isDateAvailable(date);
    const dateStr = date.toISOString().split('T')[0];
    const dateAvailability = availability.find(a => a.date === dateStr);
    
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${
        !available ? 'opacity-50' : 'cursor-pointer'
      }`}>
        <span>{date.getDate()}</span>
        {dateAvailability && dateAvailability.bookedEvents > 0 && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />
        )}
        {!available && (
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
    );
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
          Choose an available date for your event
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
          disabled={(date) => !isDateAvailable(date) || date < new Date()}
          className="rounded-md border"
        />

        {/* Legend */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-sm relative">
              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full transform translate-x-1 -translate-y-1" />
            </div>
            <span>Has bookings (may still be available)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm relative">
              <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1 -translate-y-1" />
            </div>
            <span>Unavailable</span>
          </div>
        </div>

        {selectedDate && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
