
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, RefreshCw } from 'lucide-react';

interface CalendarHeaderProps {
  onSync: () => void;
  isSyncing: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onSync, isSyncing }) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Select Event Date
      </CardTitle>
      <Button
        variant="outline"
        size="sm"
        onClick={onSync}
        disabled={isSyncing}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Calendar'}
      </Button>
    </div>
  );
};

export default CalendarHeader;
