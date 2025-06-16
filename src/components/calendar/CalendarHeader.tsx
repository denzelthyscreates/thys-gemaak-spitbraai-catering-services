
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const CalendarHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Select Event Date
      </CardTitle>
    </div>
  );
};

export default CalendarHeader;
