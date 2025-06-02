
import { submitBookingToLatenode } from './bookingService';

export const retryFailedBookings = async (): Promise<void> => {
  const failedBookings: string[] = [];
  
  // Find all failed bookings in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('failed_booking_')) {
      failedBookings.push(key);
    }
  }
  
  for (const key of failedBookings) {
    try {
      const bookingData = JSON.parse(localStorage.getItem(key) || '{}');
      
      if (bookingData.retryCount < 3) { // Max 3 retries
        const result = await submitBookingToLatenode(bookingData);
        
        if (result.success) {
          localStorage.removeItem(key);
          console.log(`Successfully retried booking: ${bookingData.bookingReference}`);
        } else {
          bookingData.retryCount += 1;
          localStorage.setItem(key, JSON.stringify(bookingData));
        }
      }
    } catch (error) {
      console.error(`Failed to retry booking ${key}:`, error);
    }
  }
};
