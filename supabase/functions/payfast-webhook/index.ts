
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Generate MD5 hash for PayFast signature verification
async function generateMD5(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('MD5', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify PayFast signature
async function verifySignature(formData: Record<string, string>, passphrase: string): Promise<boolean> {
  const signature = formData.signature;
  if (!signature) return false;

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
  
  const calculatedSignature = await generateMD5(finalString);
  return calculatedSignature === signature;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get PayFast passphrase from secrets
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE');

    // Parse form data from PayFast notification
    const formData = await req.formData();
    const notificationData: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      notificationData[key] = value.toString();
    }

    console.log('Received PayFast notification:', notificationData);

    // Verify signature if passphrase is available
    if (passphrase) {
      const isValid = await verifySignature(notificationData, passphrase);
      if (!isValid) {
        console.error('Invalid PayFast signature');
        return new Response('Invalid signature', { status: 400 });
      }
    }

    // Validate required fields
    const {
      m_payment_id,
      pf_payment_id,
      payment_status,
      amount_gross,
      custom_int1, // booking_id
      custom_str1, // payment_type
    } = notificationData;

    if (!m_payment_id || !pf_payment_id || !payment_status) {
      console.error('Missing required notification fields');
      return new Response('Invalid notification data', { status: 400 });
    }

    // Process the payment notification
    if (payment_status === 'COMPLETE') {
      console.log(`Payment completed: ${pf_payment_id}, Amount: ${amount_gross}, Booking: ${custom_int1}, Type: ${custom_str1}`);
      
      // Here you would typically update your booking records
      // For now, we'll just log the successful payment
      
      // You could add database updates here, for example:
      // if (custom_int1) {
      //   await supabase
      //     .from('bookings')
      //     .update({ 
      //       payment_status: 'completed',
      //       payment_reference: pf_payment_id,
      //       payment_amount: parseFloat(amount_gross),
      //       payment_type: custom_str1,
      //       updated_at: new Date().toISOString()
      //     })
      //     .eq('id', custom_int1);
      // }
      
    } else {
      console.log(`Payment status: ${payment_status} for payment ${pf_payment_id}`);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
});
