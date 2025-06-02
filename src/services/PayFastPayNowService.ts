
export interface PayNowButtonConfig {
  merchant_id: string;
  merchant_key: string;
  amount?: number;
  item_name: string;
  item_description?: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;
}

// Environment-specific URLs
const isProd = import.meta.env.PROD;
const PAYFAST_PAYNOW_URL = isProd
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

const DEFAULT_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '';
const DEFAULT_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '';

/**
 * Creates a simple PayNow button URL with fixed amount (R500 deposit)
 */
export const createSimplePayNowButton = (
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
  }
): string => {
  const merchant_id = DEFAULT_MERCHANT_ID;
  const merchant_key = DEFAULT_MERCHANT_KEY;
  
  if (!merchant_id || !merchant_key) {
    throw new Error('PayFast merchant credentials not configured');
  }
  
  const baseUrl = window.location.origin;
  const depositAmount = 500; // Fixed R500 booking deposit
  
  const params = new URLSearchParams({
    merchant_id,
    merchant_key,
    amount: depositAmount.toFixed(2),
    item_name: `Booking Deposit - ${bookingData.event_date || 'Event'}`,
    item_description: 'Non-refundable booking deposit for catering services',
    name_first: bookingData.client_name?.split(' ')[0] || '',
    name_last: bookingData.client_name?.split(' ').slice(1).join(' ') || '',
    email_address: bookingData.client_email || '',
    cell_number: bookingData.client_phone || '',
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancelled`,
    notify_url: `${baseUrl}/api/payfast-notification`
  });
  
  return `${PAYFAST_PAYNOW_URL}?${params.toString()}`;
};

/**
 * Creates a dynamic PayNow button URL with variable amount
 */
export const createDynamicPayNowButton = (
  amount: number,
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
  },
  paymentType: 'full' | 'balance' = 'full'
): string => {
  const merchant_id = DEFAULT_MERCHANT_ID;
  const merchant_key = DEFAULT_MERCHANT_KEY;
  
  if (!merchant_id || !merchant_key) {
    throw new Error('PayFast merchant credentials not configured');
  }
  
  const baseUrl = window.location.origin;
  const itemName = paymentType === 'full' 
    ? `Full Payment - ${bookingData.event_date || 'Event'}`
    : `Final Payment - ${bookingData.event_date || 'Event'}`;
  
  const itemDescription = paymentType === 'full'
    ? 'Full payment for catering services'
    : 'Final payment for catering services';
  
  const params = new URLSearchParams({
    merchant_id,
    merchant_key,
    amount: amount.toFixed(2),
    item_name: itemName,
    item_description: itemDescription,
    name_first: bookingData.client_name?.split(' ')[0] || '',
    name_last: bookingData.client_name?.split(' ').slice(1).join(' ') || '',
    email_address: bookingData.client_email || '',
    cell_number: bookingData.client_phone || '',
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancelled`,
    notify_url: `${baseUrl}/api/payfast-notification`
  });
  
  return `${PAYFAST_PAYNOW_URL}?${params.toString()}`;
};

/**
 * Helper function to open PayNow URL in a new tab or redirect
 */
export const redirectToPayNow = (payNowUrl: string, openInNewTab: boolean = false): void => {
  if (openInNewTab) {
    window.open(payNowUrl, '_blank');
  } else {
    window.location.href = payNowUrl;
  }
};
