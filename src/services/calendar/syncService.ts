
import { supabase } from '@/integrations/supabase/client';
import { SyncStatus } from './types';
import { formatSouthAfricaDateTime } from '@/utils/dateUtils';

/**
 * Service for Google Calendar synchronization
 */
export class SyncService {
  /**
   * Trigger Google Calendar sync
   */
  static async syncWithGoogleCalendar(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Sync error:', error);
      return { 
        success: false, 
        message: 'Failed to sync with Google Calendar: ' + error.message 
      };
    }
  }

  /**
   * Get sync status with proper South Africa timezone conversion
   */
  static async getSyncStatus(): Promise<SyncStatus | null> {
    const { data, error } = await supabase
      .from('calendar_sync')
      .select('*')
      .order('last_sync', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      lastSync: data.last_sync,
      status: data.sync_status as 'success' | 'error' | 'pending',
      errorMessage: data.error_message,
      eventsSynced: data.events_synced,
      // Add formatted South Africa time for display
      lastSyncSouthAfrica: data.last_sync ? formatSouthAfricaDateTime(data.last_sync, 'yyyy-MM-dd HH:mm:ss') : null
    };
  }
}
