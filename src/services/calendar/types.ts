
export interface AvailabilityData {
  date: string;
  isAvailable: boolean;
  bookedEvents: number;
  maxEvents: number;
  googleCalendarEvents: any[];
  notes?: string;
}

export interface SyncStatus {
  lastSync: string;
  status: 'success' | 'error' | 'pending';
  errorMessage?: string;
  eventsSynced: number;
}

export interface DateConflictInfo {
  hasConflict: boolean;
  message: string;
  canProceed: boolean;
}
