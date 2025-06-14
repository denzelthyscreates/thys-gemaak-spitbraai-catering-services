
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ProcessedEvent } from './types.ts';

export class DatabaseService {
  private static getSupabaseClient() {
    return createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
  }

  static async updateSyncStatus(status: 'pending' | 'success' | 'error', eventsSynced?: number, errorMessage?: string) {
    const supabaseClient = this.getSupabaseClient();
    
    await supabaseClient
      .from('calendar_sync')
      .upsert({
        id: 'main-sync',
        last_sync: new Date().toISOString(),
        sync_status: status,
        events_synced: eventsSynced || null,
        error_message: errorMessage || null
      });
  }

  static async updateAvailability(dateEventMap: Map<string, ProcessedEvent[]>): Promise<void> {
    const supabaseClient = this.getSupabaseClient();
    const updatePromises = [];
    
    for (const [date, dayEvents] of dateEventMap) {
      const eventCount = dayEvents.length;
      
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

    const results = await Promise.allSettled(updatePromises);
    const failedUpdates = results.filter(result => result.status === 'rejected');
    
    if (failedUpdates.length > 0) {
      console.error('Some updates failed:', failedUpdates);
    }
  }
}
