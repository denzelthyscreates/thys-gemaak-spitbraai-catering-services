
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
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

// Generate SHA-256 hash for PayFast signature
async function generateSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate PayFast signature
async function generateSignature(formData: Record<string, string>, passphrase: string): Promise<string> {
  // Remove signature and empty fields
  const filteredData = Object.entries(formData)
    .filter(([key, value]) => key !== 'signature' && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  // Build parameter string
  const paramString = filteredData
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  // Add passphrase if provided
  const finalString = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString;
  
  return await generateSHA256(finalString);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get PayFast credentials from secrets
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE');

    if (!merchantId || !merchantKey) {
      console.error('PayFast credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { amount, paymentType, bookingData }: PaymentRequest = await req.json();

    // Validate input
    if (!amount || amount < 5 || !paymentType || !bookingData) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment request' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get base URL for return URLs
    const baseUrl = req.headers.get('origin') || 'https://spitbraai.thysgemaak.com';

    // Generate item name and description based on payment type
    let itemName: string;
    let itemDescription: string;

    switch (paymentType) {
      case 'deposit':
        itemName = 'Booking Deposit';
        itemDescription = 'Deposit to secure your Spitbraai catering booking.';
        break;
      case 'full':
        itemName = 'Full Payment - Spitbraai Catering';
        itemDescription = 'Full payment for Spitbraai catering services';
        break;
      case 'balance':
        itemName = 'Final Payment - Spitbraai Catering';
        itemDescription = 'Final payment for Spitbraai catering services';
        break;
      default:
        itemName = 'Spitbraai Catering Payment';
        itemDescription = 'Payment for Spitbraai catering services';
    }

    // Build form data for PayFast
    const formData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/payment-success`,
      cancel_url: `${baseUrl}/payment-cancelled`,
      notify_url: `${baseUrl}/api/payfast-notification`,
      amount: amount.toFixed(2),
      item_name: itemName,
      item_description: itemDescription,
    };

    // Add customer details if available
    if (bookingData.client_name) {
      const nameParts = bookingData.client_name.split(' ');
      formData.name_first = nameParts[0] || '';
      formData.name_last = nameParts.slice(1).join(' ') || '';
    }

    if (bookingData.client_email) {
      formData.email_address = bookingData.client_email;
    }

    if (bookingData.client_phone) {
      formData.cell_number = bookingData.client_phone;
    }

    // Add custom fields for tracking
    if (bookingData.booking_id) {
      formData.custom_int1 = bookingData.booking_id.toString();
    }
    formData.custom_str1 = paymentType;

    // Generate signature if passphrase is available
    if (passphrase) {
      formData.signature = await generateSignature(formData, passphrase);
    }

    console.log('Generated secure payment form for amount:', amount, 'type:', paymentType);

    return new Response(
      JSON.stringify({ 
        success: true, 
        formData,
        paymentUrl: 'https://www.payfast.co.za/eng/process'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Payment processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
