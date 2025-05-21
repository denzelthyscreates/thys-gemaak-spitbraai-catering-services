
export interface PayFastConfig {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;
}

export interface PayFastPaymentData {
  amount: number;
  item_name: string;
  item_description?: string;
  custom_int1?: number; // Booking ID
  custom_str1?: string; // Payment type (deposit/full)
  email_address?: string;
  name_first?: string;
  name_last?: string;
  cell_number?: string;
}

export interface PayFastITNData {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: string;
  item_name: string;
  item_description: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  custom_int1?: string; // Booking ID
  custom_str1?: string; // Payment type (deposit/full)
  signature: string;
}

// Environment-specific URLs
const isProd = import.meta.env.PROD;
const PAYFAST_URL = isProd
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';
  
const DEFAULT_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '';
const DEFAULT_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '';
const DEFAULT_PASSPHRASE = import.meta.env.VITE_PAYFAST_PASSPHRASE || '';

/**
 * Generates a PayFast form with data and signature
 */
export const createPayFastPayment = (
  data: PayFastPaymentData,
  config?: Partial<PayFastConfig>
): { url: string; formData: Record<string, string> } => {
  const merchant_id = DEFAULT_MERCHANT_ID;
  const merchant_key = DEFAULT_MERCHANT_KEY;
  
  if (!merchant_id || !merchant_key) {
    throw new Error('PayFast merchant credentials not configured');
  }
  
  // Base URL for the site
  const baseUrl = window.location.origin;
  
  // Default configuration
  const defaultConfig: PayFastConfig = {
    merchant_id,
    merchant_key,
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancelled`,
    notify_url: `${baseUrl}/api/payfast-notification`
  };
  
  // Merge configurations
  const finalConfig = { ...defaultConfig, ...config };
  
  // Build form data
  const formData: Record<string, string> = {
    merchant_id: finalConfig.merchant_id,
    merchant_key: finalConfig.merchant_key,
    return_url: finalConfig.return_url,
    cancel_url: finalConfig.cancel_url,
    notify_url: finalConfig.notify_url,
    name_first: data.name_first || finalConfig.name_first || '',
    name_last: data.name_last || finalConfig.name_last || '',
    email_address: data.email_address || finalConfig.email_address || '',
    cell_number: data.cell_number || finalConfig.cell_number || '',
    amount: data.amount.toFixed(2),
    item_name: data.item_name,
    item_description: data.item_description || '',
  };
  
  // Add custom values if they exist
  if (data.custom_int1) {
    formData.custom_int1 = data.custom_int1.toString();
  }
  
  if (data.custom_str1) {
    formData.custom_str1 = data.custom_str1;
  }
  
  // In a real implementation, we would calculate a signature here
  // This requires server-side implementation with the passphrase
  
  return {
    url: PAYFAST_URL,
    formData
  };
};

/**
 * Helper function to create a booking deposit payment
 */
export const createBookingDepositPayment = (
  bookingData: {
    id?: number;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    total_amount: number;
  }
): { url: string; formData: Record<string, string> } => {
  const depositAmount = 500; // Fixed R500 booking fee
  
  return createPayFastPayment({
    amount: depositAmount,
    item_name: `Booking Deposit - ${bookingData.event_date || 'Event'}`,
    item_description: 'Non-refundable booking deposit for catering services',
    custom_int1: bookingData.id,
    custom_str1: 'deposit',
    email_address: bookingData.client_email,
    name_first: bookingData.client_name?.split(' ')[0],
    name_last: bookingData.client_name?.split(' ').slice(1).join(' '),
    cell_number: bookingData.client_phone
  });
};

/**
 * Helper function to create a payment for the remaining balance
 */
export const createRemainingBalancePayment = (
  bookingData: {
    id?: number;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    total_amount: number;
    deposit_paid?: number;
  }
): { url: string; formData: Record<string, string> } => {
  const depositPaid = bookingData.deposit_paid || 500;
  const remainingAmount = bookingData.total_amount - depositPaid;
  
  return createPayFastPayment({
    amount: remainingAmount,
    item_name: `Final Payment - ${bookingData.event_date || 'Event'}`,
    item_description: 'Final payment for catering services',
    custom_int1: bookingData.id,
    custom_str1: 'final',
    email_address: bookingData.client_email,
    name_first: bookingData.client_name?.split(' ')[0],
    name_last: bookingData.client_name?.split(' ').slice(1).join(' '),
    cell_number: bookingData.client_phone
  });
};

/**
 * Helper function to create a full payment
 */
export const createFullPayment = (
  bookingData: {
    id?: number;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    total_amount: number;
  }
): { url: string; formData: Record<string, string> } => {
  return createPayFastPayment({
    amount: bookingData.total_amount,
    item_name: `Full Payment - ${bookingData.event_date || 'Event'}`,
    item_description: 'Full payment for catering services',
    custom_int1: bookingData.id,
    custom_str1: 'full',
    email_address: bookingData.client_email,
    name_first: bookingData.client_name?.split(' ')[0],
    name_last: bookingData.client_name?.split(' ').slice(1).join(' '),
    cell_number: bookingData.client_phone
  });
};
