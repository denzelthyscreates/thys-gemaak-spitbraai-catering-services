
import React, { useEffect } from 'react';
import { SyncService } from '@/services/calendar/syncService';

const CalendarSync: React.FC = () => {
  // Auto-sync calendar data on mount and periodically (in background)
  useEffect(() => {
    const syncCalendarData = async () => {
      try {
        await SyncService.syncWithGoogleCalendar();
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

  return null; // This component doesn't render anything
};

export default CalendarSync;
