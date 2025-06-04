
import React from 'react';
import DateConflictDisplay from './DateConflictDisplay';
import { DateConflictInfo } from '@/services/calendar/types';

interface SelectedDateInfoProps {
  selectedDate: Date;
  dateConflictInfo: DateConflictInfo | null;
}

const SelectedDateInfo: React.FC<SelectedDateInfoProps> = ({ selectedDate, dateConflictInfo }) => {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900">Selected Date</h4>
        <p className="text-blue-700">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <DateConflictDisplay dateConflictInfo={dateConflictInfo} />
    </div>
  );
};

export default SelectedDateInfo;
