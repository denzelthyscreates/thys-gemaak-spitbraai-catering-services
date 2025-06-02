
import { LatenodeResponse, PaymentData } from './types';

const LATENODE_WEBHOOK_URL = 'https://webhook.latenode.com/64480/prod/e682c3eb-ccd2-47ca-921b-590f6c3acd3f';

export const updatePaymentStatus = async (
  bookingReference: string, 
  paymentData: PaymentData
): Promise<LatenodeResponse> => {
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
