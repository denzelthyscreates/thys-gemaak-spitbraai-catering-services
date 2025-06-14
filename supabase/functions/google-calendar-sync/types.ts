
export interface GoogleServiceAccount {
  private_key: string;
  client_email: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
}

export interface ProcessedEvent {
  id: string;
  summary: string;
  start: any;
  end: any;
}

export interface SyncResult {
  success: boolean;
  message: string;
  dates_updated?: number;
  error?: string;
  details?: string;
}
