
import React from 'react';

const CalendarLegend: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>• We can handle up to 2 events per day if they are in the same service area</p>
      <p>• Events in different areas on the same day may require coordination</p>
    </div>
  );
};

export default CalendarLegend;
