
import { supabase } from '@/integrations/supabase/client';

export interface SecurePaymentRequest {
  amount: number;
  paymentType: 'deposit' | 'full' | 'balance';
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    booking_id?: number;
  };
}

export interface PaymentFormResponse {
  success: boolean;
  formData: Record<string, string>;
  paymentUrl: string;
  error?: string;
}

/**
 * Generate secure PayFast payment form using server-side processing
 */
export const generateSecurePayment = async (
  request: SecurePaymentRequest
): Promise<PaymentFormResponse> => {
  try {
    console.log('Calling PayFast payment function with:', request);
    
    const { data, error } = await supabase.functions.invoke('payfast-payment', {
      body: request,
    });

    console.log('PayFast payment function response:', { data, error });

    if (error) {
      console.error('Payment generation error:', error);
      return {
        success: false,
        formData: {},
        paymentUrl: '',
        error: error.message || 'Failed to generate payment form'
      };
    }

    // Check if the response indicates failure
    if (!data || !data.success) {
      console.error('Payment generation failed:', data);
      return {
        success: false,
        formData: {},
        paymentUrl: '',
        error: data?.error || 'Payment processing failed'
      };
    }

    return data;
  } catch (error) {
    console.error('Secure payment error:', error);
    return {
      success: false,
      formData: {},
      paymentUrl: '',
      error: 'Payment processing temporarily unavailable'
    };
  }
};

/**
 * Generate secure PayNow form using server-side processing
 */
export const generateSecurePayNow = async (
  request: SecurePaymentRequest
): Promise<PaymentFormResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('payfast-paynow', {
      body: request,
    });

    if (error) {
      console.error('PayNow generation error:', error);
      return {
        success: false,
        formData: {},
        paymentUrl: '',
        error: error.message || 'Failed to generate PayNow form'
      };
    }

    // Check if the response indicates failure
    if (!data || !data.success) {
      return {
        success: false,
        formData: {},
        paymentUrl: '',
        error: data?.error || 'PayNow processing failed'
      };
    }

    return data;
  } catch (error) {
    console.error('Secure PayNow error:', error);
    return {
      success: false,
      formData: {},
      paymentUrl: '',
      error: 'PayNow processing temporarily unavailable'
    };
  }
};

/**
 * Submit payment form securely
 */
export const submitSecurePaymentForm = (
  formData: Record<string, string>,
  paymentUrl: string,
  openInNewTab: boolean = false
): void => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = paymentUrl;
  
  if (openInNewTab) {
    form.target = '_blank';
  }
  
  // Add all form fields
  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
