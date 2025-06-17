
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_date: string;
  venue_name?: string;
  venue_street_address: string;
  venue_city: string;
  venue_province: string;
  venue_postal_code: string;
  address_line1: string;
  city: string;
  province: string;
  postal_code_address: string;
  additional_notes?: string;
  event_type?: string;
  menu_package: string;
  number_of_guests: number;
  total_price: number;
  season?: string;
  starters?: string;
  sides?: string;
  desserts?: string;
  extras?: string;
  menu_selection: any;
  notes?: string;
}

const getFullEventTypeName = (eventType: string | undefined) => {
  if (!eventType) return 'Not specified';
  
  const eventTypeMap: { [key: string]: string } = {
    'birthday': 'Birthday Party',
    'wedding': 'Wedding',
    'corporate': 'Corporate Event',
    'yearend': 'Year End Function',
    'fundraiser': 'Fundraiser',
    'anniversary': 'Anniversary',
    'graduation': 'Graduation',
    'other': 'Other Event'
  };
  
  return eventTypeMap[eventType] || eventType;
};

const generatePDFContent = (bookingData: BookingData, bookingId: string) => {
  const menuSelection = bookingData.menu_selection;
  const totalAmount = menuSelection?.travelFee 
    ? (bookingData.total_price * bookingData.number_of_guests) + menuSelection.travelFee
    : bookingData.total_price * bookingData.number_of_guests;

  const eventDate = new Date(bookingData.event_date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fullEventType = getFullEventTypeName(bookingData.event_type);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Spitbraai Booking Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; color: #22c55e; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #22c55e; }
        .info-row { margin-bottom: 5px; }
        .label { font-weight: bold; }
        .pricing { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        .total { font-weight: bold; font-size: 18px; color: #22c55e; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SPITBRAAI BOOKING SUMMARY</h1>
        <p>Booking Reference: <strong>${bookingId}</strong></p>
        <p>Booking Date: ${new Date().toLocaleDateString('en-ZA')} (SAST)</p>
    </div>

    <div class="section">
        <div class="section-title">CONTACT INFORMATION</div>
        <div class="info-row"><span class="label">Name:</span> ${bookingData.contact_name}</div>
        <div class="info-row"><span class="label">Email:</span> ${bookingData.contact_email}</div>
        <div class="info-row"><span class="label">Phone:</span> ${bookingData.contact_phone}</div>
    </div>

    <div class="section">
        <div class="section-title">EVENT DETAILS</div>
        <div class="info-row"><span class="label">Event Type:</span> ${fullEventType}</div>
        <div class="info-row"><span class="label">Menu Package:</span> ${bookingData.menu_package}</div>
        <div class="info-row"><span class="label">Event Date:</span> ${eventDate}</div>
        <div class="info-row"><span class="label">Number of Guests:</span> ${bookingData.number_of_guests}</div>
    </div>

    <div class="section">
        <div class="section-title">VENUE ADDRESS</div>
        ${bookingData.venue_name ? `<div class="info-row"><span class="label">Venue Name:</span> ${bookingData.venue_name}</div>` : ''}
        <div class="info-row">${bookingData.venue_street_address}</div>
        <div class="info-row">${bookingData.venue_city}, ${bookingData.venue_province} ${bookingData.venue_postal_code}</div>
    </div>

    <div class="section">
        <div class="section-title">BILLING ADDRESS</div>
        <div class="info-row">${bookingData.address_line1}</div>
        <div class="info-row">${bookingData.city}, ${bookingData.province} ${bookingData.postal_code_address}</div>
    </div>

    <div class="section">
        <div class="section-title">MENU SELECTION</div>
        <div class="info-row"><span class="label">Package:</span> ${bookingData.menu_package}</div>
        ${bookingData.season ? `<div class="info-row"><span class="label">Season:</span> ${bookingData.season}</div>` : ''}
        ${bookingData.starters ? `<div class="info-row"><span class="label">Starters:</span> ${bookingData.starters}</div>` : ''}
        ${bookingData.sides ? `<div class="info-row"><span class="label">Sides:</span> ${bookingData.sides}</div>` : ''}
        ${bookingData.desserts ? `<div class="info-row"><span class="label">Desserts:</span> ${bookingData.desserts}</div>` : ''}
        ${bookingData.extras ? `<div class="info-row"><span class="label">Extras:</span> ${bookingData.extras}</div>` : ''}
        <div class="info-row"><span class="label">Cutlery & Crockery:</span> ${menuSelection?.includeCutlery ? 'Included' : 'Not included'}</div>
    </div>

    <div class="section pricing">
        <div class="section-title">PRICING SUMMARY</div>
        <div class="info-row">Price per person: R${bookingData.total_price}</div>
        <div class="info-row">Subtotal (${bookingData.number_of_guests} guests): R${bookingData.total_price * bookingData.number_of_guests}</div>
        ${menuSelection?.travelFee ? `<div class="info-row">Travel Fee: R${menuSelection.travelFee}</div>` : ''}
        <div class="total">Total Amount: R${totalAmount}</div>
    </div>

    ${bookingData.additional_notes ? `
    <div class="section">
        <div class="section-title">ADDITIONAL NOTES</div>
        <div>${bookingData.additional_notes}</div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for choosing Thys Gemaak Spitbraai Catering Services!</p>
        <p>We will contact you within 24-48 hours to confirm your booking details.</p>
        <p>For any queries, contact us at spitbookings@thysgemaak.com or +27 60 461 3766</p>
    </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingData, bookingId } = await req.json();

    console.log("Processing booking summary email for:", bookingId);
    console.log("Recipient email:", bookingData.contact_email);

    const htmlContent = generatePDFContent(bookingData, bookingId);

    // Send email with HTML content as PDF attachment
    const emailResponse = await resend.emails.send({
      from: "Thys Gemaak Spitbraai <no-reply@spitbraai.thysgemaak.com>",
      to: [bookingData.contact_email],
      subject: `Your Spitbraai Booking Summary - ${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Thank you for your booking!</h2>
          <p>Dear ${bookingData.contact_name},</p>
          <p>Your spitbraai booking has been confirmed! Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #22c55e;">Booking Summary</h3>
            <p><strong>Reference:</strong> ${bookingId}</p>
            <p><strong>Event Type:</strong> ${getFullEventTypeName(bookingData.event_type)}</p>
            <p><strong>Package:</strong> ${bookingData.menu_package}</p>
            <p><strong>Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString('en-ZA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Guests:</strong> ${bookingData.number_of_guests}</p>
            <p><strong>Total Amount:</strong> R${bookingData.menu_selection?.travelFee 
              ? (bookingData.total_price * bookingData.number_of_guests) + bookingData.menu_selection.travelFee
              : bookingData.total_price * bookingData.number_of_guests}</p>
          </div>
          
          <p>We will contact you within 24-48 hours to confirm all details and finalize arrangements.</p>
          
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <ul>
            <li>Email: spitbookings@thysgemaak.com</li>
            <li>Phone: +27 60 461 3766</li>
          </ul>
          
          <p>Best regards,<br>The Thys Gemaak Spitbraai Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `Spitbraai-Booking-Summary-${bookingId}.html`,
          content: btoa(htmlContent),
          content_type: "text/html"
        }
      ]
    });

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log("Email sent successfully:", emailResponse.data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking summary sent successfully",
      emailResponse: emailResponse.data 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-summary function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send booking summary email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
