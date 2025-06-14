
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleAuthService } from './auth.ts';
import { GoogleCalendarService } from './calendar.ts';
import { DatabaseService } from './database.ts';
import { ValidationService } from './validation.ts';
import { SyncResult } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Google Calendar sync...');
    
    // Update sync status to pending
    await DatabaseService.updateSyncStatus('pending');

    // Validate environment variables
    const { calendarId, serviceAccount } = ValidationService.validateEnvironmentVariables();

    // Create JWT and get access token
    const jwt = await GoogleAuthService.createJWT(serviceAccount);
    const accessToken = await GoogleAuthService.getAccessToken(jwt);

    // Fetch and process calendar events
    const events = await GoogleCalendarService.fetchEvents(accessToken, calendarId);
    const dateEventMap = GoogleCalendarService.processEvents(events);

    // Update database with availability
    await DatabaseService.updateAvailability(dateEventMap);

    // Update sync status to success
    await DatabaseService.updateSyncStatus('success', events.length);

    console.log(`Sync completed successfully: ${events.length} events, ${dateEventMap.size} dates updated`);

    const result: SyncResult = {
      success: true,
      message: `Synced ${events.length} events`,
      dates_updated: dateEventMap.size
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Detailed calendar sync error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Log error to sync table
    try {
      await DatabaseService.updateSyncStatus('error', undefined, error.message);
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    const result: SyncResult = {
      success: false,
      error: error.message,
      details: error.stack
    };

    return new Response(JSON.stringify(result), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
