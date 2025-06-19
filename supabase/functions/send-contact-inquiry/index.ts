
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== CONTACT INQUIRY FUNCTION STARTED ===");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData: ContactInquiryRequest = await req.json();
    console.log("Contact inquiry received:", inquiryData);

    const { name, email, phone, inquiryType, message } = inquiryData;

    // Send confirmation email to customer
    console.log("Sending confirmation email to customer:", email);
    const customerEmailResponse = await resend.emails.send({
      from: "Thysgemaak Spitbraai <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your inquiry - Thysgemaak Spitbraai",
      html: `
        <h2>Thank you for contacting Thysgemaak Spitbraai!</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry regarding: <strong>${inquiryType}</strong></p>
        <p>Our team will review your message and get back to you within 24 hours during business hours.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #d4af37;">
          <h3>Your Message:</h3>
          <p style="margin: 0;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>If you have any urgent questions, please feel free to call us directly.</p>
        <p>Best regards,<br>The Thysgemaak Spitbraai Team</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated confirmation email. Please do not reply to this email.
        </p>
      `,
    });

    console.log("Customer confirmation email sent:", customerEmailResponse);

    // Send notification email to business
    console.log("Sending notification email to business");
    const businessEmailResponse = await resend.emails.send({
      from: "Thysgemaak Website <onboarding@resend.dev>",
      to: ["spitbookings@thysgemaak.com"],
      subject: `New Contact Inquiry: ${inquiryType} - ${name}`,
      html: `
        <h2>New Contact Inquiry Received</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Contact Information:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        <p style="margin-top: 30px;">
          <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
        </p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          This inquiry was submitted through the Thysgemaak Spitbraai website contact form.
        </p>
      `,
    });

    console.log("Business notification email sent:", businessEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        businessEmail: businessEmailResponse 
      }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== CONTACT INQUIRY ERROR ===");
    console.error("Error details:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process contact inquiry",
        details: error
      }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);
