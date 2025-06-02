
export interface PayNowFormData {
  cmd: string;
  receiver: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  amount: string;
  item_name: string;
  item_description: string;
}

// PayNow form action URL (different from regular PayFast)
const PAYFAST_PAYNOW_FORM_URL = 'https://payment.payfast.io/eng/process';

// Your PayFast receiver ID from the HTML
const PAYFAST_RECEIVER_ID = '29885651';

/**
 * Creates form data for a simple PayNow button with fixed R500 amount
 */
export const createSimplePayNowFormData = (
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
  }
): PayNowFormData => {
  const baseUrl = window.location.origin;
  
  return {
    cmd: '_paynow',
    receiver: PAYFAST_RECEIVER_ID,
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancelled`,
    notify_url: `${baseUrl}/api/payfast-notification`,
    amount: '500',
    item_name: 'Booking Deposit',
    item_description: 'Deposit to secure your Spitbraai catering booking.'
  };
};

/**
 * Creates form data for a dynamic PayNow button with variable amount
 */
export const createDynamicPayNowFormData = (
  amount: number,
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
  },
  paymentType: 'full' | 'balance' = 'full'
): PayNowFormData => {
  const baseUrl = window.location.origin;
  
  const itemName = paymentType === 'full' 
    ? 'Full Payment - Spitbraai Catering'
    : 'Final Payment - Spitbraai Catering';
  
  const itemDescription = paymentType === 'full'
    ? 'Full payment for Spitbraai catering services'
    : 'Final payment for Spitbraai catering services';
  
  return {
    cmd: '_paynow',
    receiver: PAYFAST_RECEIVER_ID,
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancelled`,
    notify_url: `${baseUrl}/api/payfast-notification`,
    amount: amount.toFixed(2),
    item_name: itemName,
    item_description: itemDescription
  };
};

/**
 * Gets the PayNow form action URL
 */
export const getPayNowFormUrl = (): string => {
  return PAYFAST_PAYNOW_FORM_URL;
};

/**
 * Helper function to submit PayNow form programmatically
 */
export const submitPayNowForm = (formData: PayNowFormData, openInNewTab: boolean = false): void => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = PAYFAST_PAYNOW_FORM_URL;
  
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
