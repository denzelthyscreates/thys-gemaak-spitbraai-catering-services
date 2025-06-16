
import React from 'react';
import { Calendar } from '@/components/ui/calendar';

interface CalendarDisplayProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  isDateUnavailable: (date: Date) => boolean;
  modifiers: any;
  modifiersStyles: any;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  selectedDate,
  onDateSelect,
  month,
  onMonthChange,
  isDateUnavailable,
  modifiers,
  modifiersStyles
}) => {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateSelect}
      month={month}
      onMonthChange={onMonthChange}
      disabled={isDateUnavailable}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      className="rounded-md border"
    />
  );
};

export default CalendarDisplay;
