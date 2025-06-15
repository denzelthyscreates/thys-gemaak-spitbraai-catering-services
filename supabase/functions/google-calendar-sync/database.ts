
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ProcessedEvent } from './types.ts';

export class DatabaseService {
  private static getSupabaseClient() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Supabase key exists:', !!supabaseKey);
    
    return createClient(supabaseUrl ?? '', supabaseKey ?? '');
  }

  static async updateSyncStatus(status: 'pending' | 'success' | 'error', eventsSynced?: number, errorMessage?: string) {
    console.log(`Updating sync status to: ${status}`);
    console.log('Events synced:', eventsSynced);
    console.log('Error message:', errorMessage);
    
    const supabaseClient = this.getSupabaseClient();
    
    const { data, error } = await supabaseClient
      .from('calendar_sync')
      .upsert({
        id: 'main-sync',
        last_sync: new Date().toISOString(),
        sync_status: status,
        events_synced: eventsSynced || null,
        error_message: errorMessage || null
      });

    if (error) {
      console.error('Failed to update sync status:', error);
    } else {
      console.log('Sync status updated successfully:', data);
    }
  }

  static async updateAvailability(dateEventMap: Map<string, ProcessedEvent[]>): Promise<void> {
    console.log(`Updating availability for ${dateEventMap.size} dates...`);
    
    const supabaseClient = this.getSupabaseClient();
    const updatePromises = [];
    
    for (const [date, dayEvents] of dateEventMap) {
      const eventCount = dayEvents.length;
      
      console.log(`Updating date ${date} with ${eventCount} events:`, dayEvents.map(e => e.summary));
      
      updatePromises.push(
        supabaseClient
          .from('event_availability')
          .upsert({
            date,
            booked_events: eventCount,
            is_available: eventCount === 0,
            google_calendar_events: dayEvents,
            updated_at: new Date().toISOString()
          })
      );
    }

    console.log(`Executing ${updatePromises.length} database updates...`);
    const results = await Promise.allSettled(updatePromises);
    
    const successfulUpdates = results.filter(result => result.status === 'fulfilled');
    const failedUpdates = results.filter(result => result.status === 'rejected');
    
    console.log(`Database updates completed: ${successfulUpdates.length} successful, ${failedUpdates.length} failed`);
    
    if (failedUpdates.length > 0) {
      console.error('Failed updates:', failedUpdates);
      failedUpdates.forEach((failure, index) => {
        if (failure.status === 'rejected') {
          console.error(`Update ${index} failed:`, failure.reason);
        }
      });
    }
    
    if (successfulUpdates.length > 0) {
      console.log('Sample successful update:', successfulUpdates[0]);
    }
  }
}
