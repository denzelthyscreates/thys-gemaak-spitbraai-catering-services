import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Bootstrap Admin Edge Function
 * 
 * This function provides a secure, one-time mechanism to create the first admin user.
 * It checks if ANY admin exists - if so, it refuses to work (prevents abuse).
 * 
 * Security measures:
 * 1. Only works when NO admins exist in the system
 * 2. Requires the user to be authenticated
 * 3. Uses SERVICE_ROLE_KEY to bypass RLS safely
 * 4. Only promotes the calling user (cannot promote others)
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== BOOTSTRAP ADMIN FUNCTION ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required. Please log in first.' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with the user's auth token to verify their identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // Use anon key client to verify the user's token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Failed to authenticate user:', userError?.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid authentication. Please log in again.' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated, ID:', user.id.substring(0, 8) + '...');

    // Use service role client to check for existing admins and create the role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if ANY admin already exists
    const { data: existingAdmins, error: checkError } = await adminClient
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      console.error('Failed to check for existing admins:', checkError.message);
      throw new Error('Failed to check admin status');
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('Admin already exists - bootstrap not allowed');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'An admin already exists. Contact the existing admin for role assignment.' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this user already has a role
    const { data: existingRole, error: roleCheckError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (existingRole) {
      console.log('User already has role:', existingRole.role);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `You already have the "${existingRole.role}" role assigned.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No admins exist - create the first admin (the authenticated user)
    const { error: insertError } = await adminClient
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      });

    if (insertError) {
      console.error('Failed to create admin role:', insertError.message);
      throw new Error('Failed to assign admin role');
    }

    console.log('Admin role successfully assigned to user:', user.id.substring(0, 8) + '...');
    console.log('User email:', user.email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'You have been assigned as the first admin. You can now manage user roles and access admin features.',
        userId: user.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bootstrap admin error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
