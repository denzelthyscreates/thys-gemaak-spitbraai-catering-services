
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Update sync status to pending
    await supabaseClient
      .from('calendar_sync')
      .upsert({
        id: 'main-sync',
        last_sync: new Date().toISOString(),
        sync_status: 'pending',
        error_message: null
      });

    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID');
    const googleServiceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

    console.log('Calendar ID exists:', !!googleCalendarId);
    console.log('Service account key exists:', !!googleServiceAccountKey);

    if (!googleCalendarId) {
      throw new Error('GOOGLE_CALENDAR_ID environment variable is not set');
    }

    if (!googleServiceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    // Parse service account key with better error handling
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(googleServiceAccountKey);
      console.log('Service account key parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse service account key:', parseError.message);
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format - must be valid JSON');
    }
    
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Service account key is missing required fields (private_key or client_email)');
    }

    console.log('Creating JWT for authentication...');

    // Create JWT for Google API authentication
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    // Import the private key with better error handling
    let privateKey;
    try {
      const privateKeyString = serviceAccount.private_key.replace(/\\n/g, '\n');
      
      // Remove any extra whitespace or formatting issues
      const cleanPrivateKey = privateKeyString.trim();
      
      privateKey = await crypto.subtle.importKey(
        "pkcs8",
        new TextEncoder().encode(cleanPrivateKey),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["sign"]
      );
      console.log('Private key imported successfully');
    } catch (keyError) {
      console.error('Failed to import private key:', keyError.message);
      throw new Error('Invalid private key format in service account key');
    }

    const jwt = await create({ alg: "RS256", typ: "JWT" }, jwtPayload, privateKey);
    console.log('JWT created successfully');
    
    // Get access token
    console.log('Requesting access token from Google...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Token response error:', tokenError);
      throw new Error(`Failed to get access token: ${tokenError}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received from Google');
    }

    console.log('Access token received successfully');

    // Get calendar events for next 90 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90);

    console.log(`Fetching calendar events from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(googleCalendarId)}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    if (!calendarResponse.ok) {
      const calendarError = await calendarResponse.text();
      console.error('Calendar response error:', calendarError);
      throw new Error(`Failed to fetch calendar events: ${calendarError}`);
    }

    const calendarData = await calendarResponse.json();
    const events = calendarData.items || [];

    console.log(`Fetched ${events.length} events from Google Calendar`);

    // Process events and update availability
    const dateEventMap = new Map();
    
    events.forEach(event => {
      if (event.start?.date || event.start?.dateTime) {
        const eventDate = event.start.date ? 
          new Date(event.start.date).toISOString().split('T')[0] :
          new Date(event.start.dateTime).toISOString().split('T')[0];
        
        if (!dateEventMap.has(eventDate)) {
          dateEventMap.set(eventDate, []);
        }
        
        dateEventMap.get(eventDate).push({
          id: event.id,
          summary: event.summary || 'Untitled Event',
          start: event.start,
          end: event.end
        });
      }
    });

    console.log(`Processing ${dateEventMap.size} dates with events`);

    // Update Supabase availability table
    const updatePromises = [];
    
    for (const [date, dayEvents] of dateEventMap) {
      const eventCount = dayEvents.length;
      
      updatePromises.push(
        supabaseClient
          .from('event_availability')
          .upsert({
            date,
            booked_events: eventCount,
            is_available: eventCount === 0, // Available if no events
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

    // Update sync status
    await supabaseClient
      .from('calendar_sync')
      .upsert({
        id: 'main-sync',
        last_sync: new Date().toISOString(),
        sync_status: 'success',
        events_synced: events.length,
        error_message: null
      });

    console.log(`Sync completed successfully: ${events.length} events, ${dateEventMap.size} dates updated`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${events.length} events`,
        dates_updated: dateEventMap.size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Detailed calendar sync error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Log error to sync table
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );
      
      await supabaseClient
        .from('calendar_sync')
        .upsert({
          id: 'main-sync',
          last_sync: new Date().toISOString(),
          sync_status: 'error',
          error_message: error.message
        });
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
