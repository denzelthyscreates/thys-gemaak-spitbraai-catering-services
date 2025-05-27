
interface LatenodeBookingData {
  // Contact Information
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventType: string;
  eventLocation: string;
  additionalNotes?: string;
  
  // Menu Selection Details
  menuPackage: string;
  numberOfGuests: number;
  season?: string;
  starters?: string;
  sides?: string;
  desserts?: string;
  extras?: string;
  extraSaladType?: string;
  includeCutlery: boolean;
  
  // Pricing Information
  pricePerPerson: number;
  totalAmount: number;
  travelFee: number;
  postalCode?: string;
  areaName?: string;
  discountApplied: boolean;
  
  // Booking Management
  bookingReference: string;
  status: string;
  submittedAt: string;
}

interface LatenodeResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  message?: string;
}

const LATENODE_WEBHOOK_URL = import.meta.env.VITE_LATENODE_WEBHOOK_URL || 'https://your-latenode-webhook-url.com/webhook';

export const submitBookingToLatenode = async (bookingData: LatenodeBookingData): Promise<LatenodeResponse> => {
  try {
    console.log('Submitting booking to Latenode:', bookingData);
    
    const response = await fetch(LATENODE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        event: 'booking_submitted',
        data: bookingData,
        timestamp: new Date().toISOString(),
        source: 'website'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Latenode response:', result);

    return {
      success: true,
      bookingId: result.bookingId || bookingData.bookingReference,
      message: result.message || 'Booking submitted successfully'
    };

  } catch (error) {
    console.error('Error submitting to Latenode:', error);
    
    // Fallback: Store locally and retry later
    const fallbackData = {
      ...bookingData,
      failedAt: new Date().toISOString(),
      retryCount: 0
    };
    
    localStorage.setItem(`failed_booking_${bookingData.bookingReference}`, JSON.stringify(fallbackData));
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Retry failed submissions
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

// Payment status update webhook
export const updatePaymentStatus = async (bookingReference: string, paymentData: {
  paymentId: string;
  amount: number;
  status: string;
  paymentMethod: string;
}): Promise<LatenodeResponse> => {
  try {
    const response = await fetch(LATENODE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'payment_updated',
        data: {
          bookingReference,
          ...paymentData,
          timestamp: new Date().toISOString()
        }
      }),
    });

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Payment status updated'
    };

  } catch (error) {
    console.error('Error updating payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment status'
    };
  }
};
