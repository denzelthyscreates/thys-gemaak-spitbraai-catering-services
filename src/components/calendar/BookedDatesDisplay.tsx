
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { AvailabilityData } from '@/services/calendar/types';

interface BookedDatesDisplayProps {
  availability: AvailabilityData[];
  isVisible: boolean;
}

const BookedDatesDisplay: React.FC<BookedDatesDisplayProps> = ({ availability, isVisible }) => {
  if (!isVisible || !availability.length) return null;

  // Filter to show only dates with events
  const datesWithEvents = availability.filter(item => 
    item.googleCalendarEvents.length > 0 || item.bookedEvents > 0
  );

  if (datesWithEvents.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-green-700">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">No events found in the synced period (next 90 days)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
          <Calendar className="h-4 w-4" />
          Booked Dates Found ({datesWithEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {datesWithEvents.slice(0, 10).map((dateInfo) => (
          <div key={dateInfo.date} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {new Date(dateInfo.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {dateInfo.googleCalendarEvents.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {dateInfo.googleCalendarEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.summary || 'Untitled Event'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {dateInfo.googleCalendarEvents.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {dateInfo.googleCalendarEvents.length} Google event{dateInfo.googleCalendarEvents.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {dateInfo.bookedEvents > 0 && (
                <Badge variant="default" className="text-xs">
                  {dateInfo.bookedEvents} booking{dateInfo.bookedEvents !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        ))}
        {datesWithEvents.length > 10 && (
          <div className="text-xs text-gray-500 text-center pt-2">
            ... and {datesWithEvents.length - 10} more dates with events
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookedDatesDisplay;
