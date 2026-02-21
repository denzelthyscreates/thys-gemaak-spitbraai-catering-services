
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== GOOGLE CALENDAR SYNC STARTED ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.4");
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log('Step 1: Updating sync status to pending...');
    await DatabaseService.updateSyncStatus('pending');

    console.log('Step 2: Validating environment variables...');
    const { calendarId, serviceAccount } = ValidationService.validateEnvironmentVariables();

    console.log('Step 3: Creating JWT token...');
    const jwt = await GoogleAuthService.createJWT(serviceAccount);

    console.log('Step 4: Getting access token...');
    const accessToken = await GoogleAuthService.getAccessToken(jwt);

    console.log('Step 5: Fetching calendar events...');
    const events = await GoogleCalendarService.fetchEvents(accessToken, calendarId);

    console.log('Step 6: Processing events...');
    const dateEventMap = GoogleCalendarService.processEvents(events);

    console.log('Step 7: Updating database availability...');
    await DatabaseService.updateAvailability(dateEventMap);

    console.log('Step 8: Updating sync status to success...');
    await DatabaseService.updateSyncStatus('success', events.length);

    console.log('=== SYNC COMPLETED SUCCESSFULLY ===');
    console.log(`Total events: ${events.length}`);
    console.log(`Dates updated: ${dateEventMap.size}`);

    const result: SyncResult = {
      success: true,
      message: `Synced ${events.length} events`,
      dates_updated: dateEventMap.size
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== SYNC FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error object:', error);
    
    // Log error to sync table
    try {
      console.log('Logging error to database...');
      await DatabaseService.updateSyncStatus('error', undefined, error.message);
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    const result: SyncResult = {
      success: false,
      message: 'Sync failed',
      error: error.message
    };

    return new Response(JSON.stringify(result), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
