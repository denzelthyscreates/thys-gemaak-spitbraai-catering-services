
import { GoogleCalendarEvent, ProcessedEvent } from './types.ts';

export class GoogleCalendarService {
  static async fetchEvents(accessToken: string, calendarId: string): Promise<GoogleCalendarEvent[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90);

    console.log(`Fetching calendar events from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`,
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
    return events;
  }

  static processEvents(events: GoogleCalendarEvent[]): Map<string, ProcessedEvent[]> {
    const dateEventMap = new Map<string, ProcessedEvent[]>();
    
    events.forEach(event => {
      if (event.start?.date || event.start?.dateTime) {
        const eventDate = event.start.date ? 
          new Date(event.start.date).toISOString().split('T')[0] :
          new Date(event.start.dateTime).toISOString().split('T')[0];
        
        if (!dateEventMap.has(eventDate)) {
          dateEventMap.set(eventDate, []);
        }
        
        dateEventMap.get(eventDate)!.push({
          id: event.id,
          summary: event.summary || 'Untitled Event',
          start: event.start,
          end: event.end
        });
      }
    });

    console.log(`Processing ${dateEventMap.size} dates with events`);
    return dateEventMap;
  }
}
