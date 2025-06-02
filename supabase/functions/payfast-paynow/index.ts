
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayNowRequest {
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
    // Get PayFast receiver ID from secrets
    const receiverId = Deno.env.get('PAYFAST_RECEIVER_ID') || '29885651';

    const { amount, paymentType, bookingData }: PayNowRequest = await req.json();

    // Validate input
    if (!amount || amount < 5 || !paymentType || !bookingData) {
      return new Response(
        JSON.stringify({ error: 'Invalid PayNow request' }),
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

    // Build PayNow form data
    const formData = {
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        formData,
        paymentUrl: 'https://payment.payfast.io/eng/process'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('PayNow processing error:', error);
    return new Response(
      JSON.stringify({ error: 'PayNow processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
