import React from 'react';
import DateConflictDisplay from './DateConflictDisplay';
import { DateConflictInfo } from '@/services/calendar/types';

interface SelectedDateInfoProps {
  selectedDate: Date | string | null;
  dateConflictInfo: DateConflictInfo | null;
}

const SelectedDateInfo: React.FC<SelectedDateInfoProps> = ({ selectedDate, dateConflictInfo }) => {
  // Helper function to safely convert to Date and format
  const formatSelectedDate = (date: Date | string | null): string => {
    if (!date) return 'No date selected';
    
    // Convert to Date object if it's a string
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900">Selected Date</h4>
        <p className="text-blue-700">
          {formatSelectedDate(selectedDate)}
        </p>
      </div>
      <DateConflictDisplay dateConflictInfo={dateConflictInfo} />
    </div>
  );
};

export default SelectedDateInfo;
