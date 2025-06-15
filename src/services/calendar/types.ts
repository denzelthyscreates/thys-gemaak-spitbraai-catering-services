
export interface SyncStatus {
  lastSync: string;
  lastSyncSouthAfrica?: string | null;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string | null;
  eventsSynced?: number | null;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
}

export interface ProcessedEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
}

export interface AvailabilityData {
  date: string;
  isAvailable: boolean;
  bookedEvents: number;
  googleCalendarEvents?: ProcessedEvent[];
}
