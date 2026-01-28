import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// ============= Input Validation Utilities =============

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function isAllowedRedirectUri(uri: string): boolean {
  const allowedDomains = [
    'spitbraai.thysgemaak.com',
    'thysgemaak.com',
    'lovable.app',
    'localhost'
  ];
  try {
    const url = new URL(uri);
    return allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidLength(text: string | undefined | null, maxLength: number): boolean {
  if (!text) return true;
  return text.length <= maxLength;
}

function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ALLOWED_ACTIONS = ['create-estimate', 'convert-to-invoice', 'setup-oauth', 'exchange-code'] as const;
type AllowedAction = typeof ALLOWED_ACTIONS[number];

function isAllowedAction(action: unknown): action is AllowedAction {
  return typeof action === 'string' && ALLOWED_ACTIONS.includes(action as AllowedAction);
}

class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ============= End Validation Utilities =============

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const zohoClientId = Deno.env.get('ZOHO_CLIENT_ID')!;
const zohoClientSecret = Deno.env.get('ZOHO_CLIENT_SECRET')!;
const zohoOrgId = Deno.env.get('ZOHO_ORGANIZATION_ID')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BookingData {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code_address: string;
  venue_name?: string;
  venue_street_address?: string;
  venue_city?: string;
  venue_province?: string;
  venue_postal_code?: string;
  event_date: string;
  event_type: string;
  number_of_guests: number;
  total_price: number;
  menu_selection: any;
  booking_reference: string;
}

interface ZohoTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

async function getZohoAccessToken(): Promise<string> {
  // Try to get stored access token from database first
  const { data: tokens, error } = await supabase
    .from('zoho_tokens')
    .select('access_token, refresh_token, expires_at')
    .single();

  if (!error && tokens && new Date(tokens.expires_at) > new Date()) {
    return tokens.access_token;
  }

  // If no valid token, throw error indicating OAuth setup needed
  throw new Error('No valid Zoho access token found. Please complete OAuth setup first.');
}

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: zohoClientId,
    client_secret: zohoClientSecret,
    redirect_uri: redirectUri,
    code: code
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`);
  }

  const tokenData = await response.json();
  
  // Store tokens in database
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
  
  const { error } = await supabase
    .from('zoho_tokens')
    .upsert({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error storing tokens:', error);
    throw new Error('Failed to store access tokens');
  }

  return tokenData;
}

async function createZohoEstimate(bookingData: BookingData, accessToken: string) {
  const estimateData = {
    customer_name: bookingData.contact_name,
    customer_email: bookingData.contact_email,
    customer_phone: bookingData.contact_phone,
    billing_address: {
      address: bookingData.address_line1,
      street2: bookingData.address_line2 || '',
      city: bookingData.city,
      state: bookingData.province,
      zip: bookingData.postal_code_address,
      country: 'South Africa'
    },
    shipping_address: {
      address: bookingData.venue_street_address || bookingData.address_line1,
      city: bookingData.venue_city || bookingData.city,
      state: bookingData.venue_province || bookingData.province,
      zip: bookingData.venue_postal_code || bookingData.postal_code_address,
      country: 'South Africa'
    },
    estimate_number: `EST-${bookingData.booking_reference}`,
    reference_number: bookingData.booking_reference,
    date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    line_items: [
      {
        name: `Spitbraai Catering - ${bookingData.event_type}`,
        description: `Event Date: ${new Date(bookingData.event_date).toLocaleDateString()}\nGuests: ${bookingData.number_of_guests}\nMenu: ${bookingData.menu_selection?.menuPackage || 'Custom Menu'}`,
        rate: bookingData.total_price,
        quantity: 1,
        unit: 'event'
      }
    ],
    notes: `Event Details:\n- Event Type: ${bookingData.event_type}\n- Number of Guests: ${bookingData.number_of_guests}\n- Event Date: ${new Date(bookingData.event_date).toLocaleDateString()}\n- Venue: ${bookingData.venue_name || 'Client Address'}`,
    terms: 'Payment terms: 50% deposit required to confirm booking, balance due on event date.',
    template_id: '', // You can set a default template ID
  };

  const response = await fetch(`https://www.zohoapis.com/books/v3/estimates?organization_id=${zohoOrgId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(estimateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Zoho estimate: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function convertEstimateToInvoice(estimateId: string, accessToken: string) {
  const response = await fetch(`https://www.zohoapis.com/books/v3/estimates/${estimateId}/converttoInvoice?organization_id=${zohoOrgId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to convert estimate to invoice: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, bookingId, estimateId, redirectUri, code } = body;

    // ============= Input Validation =============
    
    // Validate action
    if (!isAllowedAction(action)) {
      throw new ValidationError('Invalid action specified. Allowed: create-estimate, convert-to-invoice, setup-oauth, exchange-code', 'action');
    }

    // Validate bookingId if required
    if (action === 'create-estimate') {
      if (!isNonEmptyString(bookingId)) {
        throw new ValidationError('Booking ID is required', 'bookingId');
      }
      if (!isValidUUID(bookingId)) {
        throw new ValidationError('Invalid booking ID format', 'bookingId');
      }
    }

    // Validate estimateId if required
    if (action === 'convert-to-invoice') {
      if (!isNonEmptyString(estimateId)) {
        throw new ValidationError('Estimate ID is required', 'estimateId');
      }
      if (!isValidLength(estimateId, 100)) {
        throw new ValidationError('Estimate ID is too long', 'estimateId');
      }
    }

    // Validate redirectUri if required
    if (action === 'setup-oauth' || action === 'exchange-code') {
      if (!isNonEmptyString(redirectUri)) {
        throw new ValidationError('Redirect URI is required', 'redirectUri');
      }
      if (!isAllowedRedirectUri(redirectUri)) {
        throw new ValidationError('Invalid redirect URI. Must be from an allowed domain.', 'redirectUri');
      }
    }

    // Validate code for exchange-code action
    if (action === 'exchange-code') {
      if (!isNonEmptyString(code)) {
        throw new ValidationError('Authorization code is required', 'code');
      }
      if (!isValidLength(code, 500)) {
        throw new ValidationError('Authorization code is too long', 'code');
      }
    }

    // ============= End Input Validation =============

    if (action === 'create-estimate') {
      // Fetch booking data
      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error || !booking) {
        throw new Error('Booking not found');
      }

      // Get Zoho access token
      const accessToken = await getZohoAccessToken();
      
      // Create estimate in Zoho Books
      const estimateResult = await createZohoEstimate(booking as BookingData, accessToken);
      
      console.log('Zoho estimate created successfully');

      return new Response(JSON.stringify({ 
        success: true, 
        estimate: estimateResult,
        message: 'Estimate created successfully in Zoho Books'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'convert-to-invoice') {
      // Get Zoho access token
      const accessToken = await getZohoAccessToken();
      
      // Convert estimate to invoice
      const invoiceResult = await convertEstimateToInvoice(estimateId, accessToken);
      
      console.log('Estimate converted to invoice successfully');

      return new Response(JSON.stringify({ 
        success: true, 
        invoice: invoiceResult,
        message: 'Estimate converted to invoice successfully'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'setup-oauth') {
      // Check if we have the required environment variables
      if (!zohoClientId || !zohoClientSecret) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Zoho Client ID and Secret must be configured in environment variables'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Return OAuth URL for setup with proper encoding
      const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoBooks.fullaccess.all&client_id=${encodeURIComponent(zohoClientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&access_type=offline&prompt=consent`;
      
      return new Response(JSON.stringify({ 
        success: true, 
        authUrl,
        redirectUri,
        message: 'Use this URL to complete Zoho Books OAuth setup. Make sure this redirect URI is configured in your Zoho app settings.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'exchange-code') {
      const tokenData = await exchangeCodeForTokens(code, redirectUri);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'OAuth setup completed successfully! Tokens have been stored securely.',
        tokenData: {
          expires_in: tokenData.expires_in,
          token_type: tokenData.token_type
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new ValidationError('Invalid action specified');
    }

  } catch (error: any) {
    console.error('Error in Zoho Books integration:', error.name, error.message);
    
    const statusCode = error instanceof ValidationError ? 400 : 500;
    const errorMessage = error instanceof ValidationError 
      ? error.message 
      : 'An error occurred processing your request';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);