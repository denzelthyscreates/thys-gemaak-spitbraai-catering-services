
export { AvailabilityService } from './availabilityService';
export { ConflictService } from './conflictService';
export { SyncService } from './syncService';
export type { AvailabilityData, SyncStatus, DateConflictInfo } from './types';

/**
 * Main Calendar Availability Service - aggregates all calendar-related functionality
 */
export class CalendarAvailabilityService {
  // Availability methods
  static getAvailability = AvailabilityService.getAvailability;
  static isDateAvailable = AvailabilityService.isDateAvailable;
  static reserveDate = AvailabilityService.reserveDate;
  static getBlockedDates = AvailabilityService.getBlockedDates;

  // Conflict checking methods
  static getDateConflicts = ConflictService.getDateConflicts;

  // Sync methods
  static syncWithGoogleCalendar = SyncService.syncWithGoogleCalendar;
  static getSyncStatus = SyncService.getSyncStatus;
}
