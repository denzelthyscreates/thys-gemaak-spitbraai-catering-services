
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { DateConflictInfo } from '@/services/calendar/types';

interface DateConflictDisplayProps {
  dateConflictInfo: DateConflictInfo | null;
}

const DateConflictDisplay: React.FC<DateConflictDisplayProps> = ({ dateConflictInfo }) => {
  if (!dateConflictInfo) return null;

  return (
    <div className={`p-3 rounded-lg ${
      dateConflictInfo.hasConflict 
        ? 'bg-yellow-50 border border-yellow-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      <div className="flex items-start gap-2">
        {dateConflictInfo.hasConflict ? (
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
        )}
        <div>
          <h4 className={`font-medium ${
            dateConflictInfo.hasConflict ? 'text-yellow-900' : 'text-green-900'
          }`}>
            {dateConflictInfo.hasConflict ? 'Potential Booking Conflict' : 'Date Available'}
          </h4>
          <p className={`text-sm ${
            dateConflictInfo.hasConflict ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {dateConflictInfo.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateConflictDisplay;
