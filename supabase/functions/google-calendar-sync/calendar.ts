
import { GoogleCalendarEvent, ProcessedEvent } from './types.ts';

export class GoogleCalendarService {
  static async fetchEvents(accessToken: string, calendarId: string): Promise<GoogleCalendarEvent[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90);

    console.log(`Fetching calendar events from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    console.log('Calendar ID:', calendarId);
    console.log('Access token length:', accessToken.length);

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`;
    console.log('Calendar API URL:', calendarUrl);

    const calendarResponse = await fetch(calendarUrl, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    console.log('Calendar response status:', calendarResponse.status);
    console.log('Calendar response headers:', Object.fromEntries(calendarResponse.headers.entries()));

    if (!calendarResponse.ok) {
      const calendarError = await calendarResponse.text();
      console.error('Calendar response error:', calendarError);
      
      if (calendarResponse.status === 404) {
        console.error('Calendar not found - check if Calendar ID is correct and service account has access');
      } else if (calendarResponse.status === 403) {
        console.error('Access forbidden - check if service account has been shared with the calendar');
      } else if (calendarResponse.status === 401) {
        console.error('Unauthorized - check if access token is valid');
      }
      
      throw new Error(`Failed to fetch calendar events: ${calendarError}`);
    }

    const calendarData = await calendarResponse.json();
    console.log('Calendar response keys:', Object.keys(calendarData));
    
    const events = calendarData.items || [];
    console.log(`Fetched ${events.length} events from Google Calendar`);
    
    if (events.length > 0) {
      console.log('Sample event structure:', JSON.stringify(events[0], null, 2));
      events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          status: event.status
        });
      });
    } else {
      console.log('No events found in the specified date range');
      console.log('Calendar data:', JSON.stringify(calendarData, null, 2));
    }

    return events;
  }

  static processEvents(events: GoogleCalendarEvent[]): Map<string, ProcessedEvent[]> {
    console.log(`Processing ${events.length} events...`);
    const dateEventMap = new Map<string, ProcessedEvent[]>();
    
    events.forEach((event, index) => {
      console.log(`Processing event ${index + 1}:`, {
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end
      });
      
      if (event.start?.date || event.start?.dateTime) {
        const eventDate = event.start.date ? 
          new Date(event.start.date).toISOString().split('T')[0] :
          new Date(event.start.dateTime).toISOString().split('T')[0];
        
        console.log(`Event ${index + 1} date: ${eventDate}`);
        
        if (!dateEventMap.has(eventDate)) {
          dateEventMap.set(eventDate, []);
        }
        
        const processedEvent = {
          id: event.id,
          summary: event.summary || 'Untitled Event',
          start: event.start,
          end: event.end
        };
        
        dateEventMap.get(eventDate)!.push(processedEvent);
        console.log(`Added event to date ${eventDate}:`, processedEvent);
      } else {
        console.warn(`Event ${index + 1} has no start date/time:`, event);
      }
    });

    console.log(`Processing complete: ${dateEventMap.size} dates with events`);
    for (const [date, dayEvents] of dateEventMap) {
      console.log(`Date ${date}: ${dayEvents.length} events`);
    }
    
    return dateEventMap;
  }
}
