
import { LatenodeResponse } from './types';

export const handleLatenodeResponse = async (response: Response): Promise<LatenodeResponse> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Handle both JSON and text responses
  let result;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    // Handle plain text response
    const textResponse = await response.text();
    console.log('Latenode text response:', textResponse);
    
    // Check if the response indicates success
    if (textResponse.toLowerCase().includes('accepted') || textResponse.toLowerCase().includes('success')) {
      result = { message: textResponse, success: true };
    } else {
      throw new Error(`Unexpected response: ${textResponse}`);
    }
  }
  
  console.log('Latenode response:', result);
  return result;
};

export const createEnhancedPayload = (bookingData: any) => {
  return {
    event: 'booking_submitted',
    data: {
      ...bookingData,
      // Explicitly include pricing breakdown for clarity
      pricing: {
        pricePerPerson: bookingData.pricePerPerson,
        numberOfGuests: bookingData.numberOfGuests,
        menuSubtotal: bookingData.menuSubtotal,
        travelFee: bookingData.travelFee,
        totalAmount: bookingData.totalAmount,
        discountApplied: bookingData.discountApplied
      },
      // Include location information for travel fee context
      location: {
        postalCode: bookingData.postalCode,
        areaName: bookingData.areaName,
        venue: {
          name: bookingData.venueName,
          address: bookingData.venueStreetAddress,
          city: bookingData.venueCity,
          province: bookingData.venueProvince,
          postalCode: bookingData.venuePostalCode
        }
      }
    },
    timestamp: new Date().toISOString(),
    source: 'website'
  };
};
