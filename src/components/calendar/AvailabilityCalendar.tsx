
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import SelectedDateInfo from './SelectedDateInfo';
import CalendarDisplay from './CalendarDisplay';
import CalendarSync from './CalendarSync';
import { useAvailabilityData } from './hooks/useAvailabilityData';
import { useCalendarModifiers } from './hooks/useCalendarModifiers';
import { useConflictCheck } from './hooks/useConflictCheck';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  userPostalCode?: string;
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
  userPostalCode,
  className
}) => {
  const [month, setMonth] = useState<Date>(new Date());

  // Custom hooks for data management
  const {
    unavailableDates,
    bookedDates,
    blockedDates,
    googleCalendarEvents,
    isLoading
  } = useAvailabilityData(month, userPostalCode);

  const { modifiers, modifiersStyles, isDateUnavailable } = useCalendarModifiers(
    unavailableDates,
    bookedDates,
    blockedDates,
    googleCalendarEvents
  );

  const { dateConflictInfo } = useConflictCheck(selectedDate, userPostalCode);

  return (
    <>
      <CalendarSync />
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CalendarHeader />
          <CardDescription>
            Choose your event date. Unavailable dates are crossed out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CalendarDisplay
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            month={month}
            onMonthChange={setMonth}
            isDateUnavailable={isDateUnavailable}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
          
          <CalendarLegend />
          
          {selectedDate && (
            <SelectedDateInfo 
              selectedDate={selectedDate}
              dateConflictInfo={dateConflictInfo}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AvailabilityCalendar;
