
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID');
    const googleServiceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

    if (!googleCalendarId || !googleServiceAccountKey) {
      throw new Error('Missing Google Calendar credentials');
    }

    // Parse service account key
    const serviceAccount = JSON.parse(googleServiceAccountKey);
    
    // Get OAuth token for service account
    const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = btoa(JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }));

    // Create JWT for Google API authentication
    const jwtData = `${jwtHeader}.${jwtPayload}`;
    
    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtData}`
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get calendar events for next 90 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90);

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    const calendarData = await calendarResponse.json();
    const events = calendarData.items || [];

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
          summary: event.summary,
          start: event.start,
          end: event.end
        });
      }
    });

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

    await Promise.all(updatePromises);

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${events.length} events`,
        dates_updated: dateEventMap.size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Calendar sync error:', error);
    
    // Log error to sync table
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

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
