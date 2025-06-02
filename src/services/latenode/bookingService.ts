
import { LatenodeBookingData, LatenodeResponse } from './types';
import { handleLatenodeResponse, createEnhancedPayload } from './responseHandler';

const LATENODE_WEBHOOK_URL = 'https://webhook.latenode.com/64480/prod/e682c3eb-ccd2-47ca-921b-590f6c3acd3f';

export const submitBookingToLatenode = async (bookingData: LatenodeBookingData): Promise<LatenodeResponse> => {
  try {
    console.log('Submitting booking to Latenode with travel fee data:', bookingData);
    
    const enhancedPayload = createEnhancedPayload(bookingData);
    
    const response = await fetch(LATENODE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(enhancedPayload),
    });

    const result = await handleLatenodeResponse(response);

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
