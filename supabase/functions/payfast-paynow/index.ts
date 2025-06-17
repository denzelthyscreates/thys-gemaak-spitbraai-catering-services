
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayFast PayNow function called');
    
    // Get PayFast credentials from secrets
    const receiverId = Deno.env.get('PAYFAST_RECEIVER_ID');

    console.log('PayFast credentials check:', {
      receiverId: receiverId ? 'Present' : 'Missing'
    });

    if (!receiverId) {
      console.error('PayFast receiver ID not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Payment service not configured',
          formData: {},
          paymentUrl: ''
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { amount, paymentType, bookingData }: PaymentRequest = requestBody;

    // Validate input
    if (!amount || amount < 5 || !paymentType || !bookingData) {
      console.error('Invalid payment request:', { amount, paymentType, bookingData });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid payment request',
          formData: {},
          paymentUrl: ''
        }),
        { 
          status: 200, 
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

    // Build form data for PayFast PayNow
    const formData: Record<string, string> = {
      cmd: '_paynow',
      receiver: receiverId,
      return_url: `${baseUrl}/payment-success`,
      cancel_url: `${baseUrl}/payment-cancelled`,
      notify_url: `${baseUrl}/api/payfast-notification`,
      amount: amount.toFixed(2),
      item_name: itemName,
      item_description: itemDescription,
    };

    console.log('Generated secure PayNow form for amount:', amount, 'type:', paymentType);

    const response = {
      success: true, 
      formData,
      paymentUrl: 'https://www.payfast.co.za/eng/process' // Production URL
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Payment processing failed',
        formData: {},
        paymentUrl: ''
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
