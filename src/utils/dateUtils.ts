
import { format, parseISO } from 'date-fns';

// South Africa timezone offset (UTC+2)
const SOUTH_AFRICA_OFFSET = 2 * 60; // 2 hours in minutes

/**
 * Convert UTC date to South Africa time
 */
export const convertToSouthAfricaTime = (utcDate: string | Date): Date => {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  const utcTime = date.getTime();
  const southAfricaTime = new Date(utcTime + (SOUTH_AFRICA_OFFSET * 60 * 1000));
  return southAfricaTime;
};

/**
 * Format date for South Africa timezone display
 */
export const formatSouthAfricaDateTime = (utcDate: string | Date, formatString: string = 'yyyy-MM-dd HH:mm:ss'): string => {
  const southAfricaDate = convertToSouthAfricaTime(utcDate);
  return format(southAfricaDate, formatString);
};

/**
 * Get current South Africa time as ISO string
 */
export const getCurrentSouthAfricaTime = (): string => {
  const now = new Date();
  const southAfricaTime = convertToSouthAfricaTime(now);
  return southAfricaTime.toISOString();
};
