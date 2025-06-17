
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

const getMenuInclusions = (menuPackage: string, includeCutlery: boolean) => {
  const inclusions: string[] = [];
  
  if (includeCutlery) {
    inclusions.push('Cutlery & Crockery (R20/person)');
  }
  
  // Based on menu package, add specific inclusions
  if (menuPackage.includes('Basic') || menuPackage.includes('Standard')) {
    inclusions.push('All Equipment');
  } else if (menuPackage.includes('Premium') || menuPackage.includes('Business')) {
    inclusions.push('All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving');
  } else if (menuPackage.includes('Wedding')) {
    inclusions.push('Jugs & Glasses', 'Juice + 1 Refill', 'All Equipment + Setup of Serving Table');
  }
  
  return inclusions;
};

const generateEnhancedPDFContent = (bookingData: BookingData, bookingId: string) => {
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
  const menuInclusions = getMenuInclusions(bookingData.menu_package, menuSelection?.includeCutlery);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Spitbraai Booking Summary</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            color: #22c55e; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #22c55e;
            padding-bottom: 20px;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-weight: bold; 
            font-size: 18px; 
            margin-bottom: 15px; 
            color: #22c55e; 
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        .info-row { 
            margin-bottom: 8px; 
            display: flex;
            align-items: flex-start;
        }
        .label { 
            font-weight: bold; 
            min-width: 150px;
            margin-right: 10px;
        }
        .value {
            flex: 1;
        }
        .pricing { 
            background-color: #f9f9f9; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e5e7eb;
        }
        .total { 
            font-weight: bold; 
            font-size: 20px; 
            color: #22c55e; 
            border-top: 2px solid #22c55e;
            padding-top: 10px;
            margin-top: 10px;
        }
        .venue-details {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #22c55e;
        }
        .menu-details {
            background-color: #fefefe;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        .inclusions {
            background-color: #ecfdf5;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .inclusions ul {
            margin: 0;
            padding-left: 20px;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
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
        <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${bookingData.contact_name}</span>
        </div>
        <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${bookingData.contact_email}</span>
        </div>
        <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">${bookingData.contact_phone}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">EVENT DETAILS</div>
        <div class="info-row">
            <span class="label">Event Type:</span>
            <span class="value">${fullEventType}</span>
        </div>
        <div class="info-row">
            <span class="label">Menu Package:</span>
            <span class="value">${bookingData.menu_package}</span>
        </div>
        <div class="info-row">
            <span class="label">Event Date:</span>
            <span class="value">${eventDate}</span>
        </div>
        <div class="info-row">
            <span class="label">Number of Guests:</span>
            <span class="value">${bookingData.number_of_guests}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">VENUE DETAILS</div>
        <div class="venue-details">
            ${bookingData.venue_name ? `<div class="info-row"><span class="label">Venue Name:</span><span class="value">${bookingData.venue_name}</span></div>` : ''}
            <div class="info-row">
                <span class="label">Address:</span>
                <span class="value">${bookingData.venue_street_address}</span>
            </div>
            <div class="info-row">
                <span class="label">City:</span>
                <span class="value">${bookingData.venue_city}</span>
            </div>
            <div class="info-row">
                <span class="label">Province:</span>
                <span class="value">${bookingData.venue_province}</span>
            </div>
            <div class="info-row">
                <span class="label">Postal Code:</span>
                <span class="value">${bookingData.venue_postal_code}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">BILLING ADDRESS</div>
        <div class="info-row">
            <span class="label">Address:</span>
            <span class="value">${bookingData.address_line1}</span>
        </div>
        <div class="info-row">
            <span class="label">City:</span>
            <span class="value">${bookingData.city}</span>
        </div>
        <div class="info-row">
            <span class="label">Province:</span>
            <span class="value">${bookingData.province}</span>
        </div>
        <div class="info-row">
            <span class="label">Postal Code:</span>
            <span class="value">${bookingData.postal_code_address}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">DETAILED MENU SELECTION</div>
        <div class="menu-details">
            <div class="info-row">
                <span class="label">Package:</span>
                <span class="value">${bookingData.menu_package}</span>
            </div>
            ${bookingData.season ? `<div class="info-row"><span class="label">Season:</span><span class="value">${bookingData.season}</span></div>` : ''}
            ${bookingData.starters ? `<div class="info-row"><span class="label">Starters:</span><span class="value">${bookingData.starters}</span></div>` : ''}
            ${bookingData.sides ? `<div class="info-row"><span class="label">Sides:</span><span class="value">${bookingData.sides}</span></div>` : ''}
            ${bookingData.desserts ? `<div class="info-row"><span class="label">Desserts:</span><span class="value">${bookingData.desserts}</span></div>` : ''}
            ${bookingData.extras ? `<div class="info-row"><span class="label">Extras:</span><span class="value">${bookingData.extras}</span></div>` : ''}
            <div class="info-row">
                <span class="label">Cutlery & Crockery:</span>
                <span class="value">${menuSelection?.includeCutlery ? 'Included' : 'Not included'}</span>
            </div>
        </div>
        
        <div class="inclusions">
            <h4 style="margin: 0 0 10px 0; color: #22c55e;">What's Included in Your Package:</h4>
            <ul>
                ${menuInclusions.map(inclusion => `<li>${inclusion}</li>`).join('')}
            </ul>
        </div>
    </div>

    <div class="section pricing">
        <div class="section-title">PRICING SUMMARY</div>
        <div class="info-row">
            <span class="label">Price per person:</span>
            <span class="value">R${bookingData.total_price}</span>
        </div>
        <div class="info-row">
            <span class="label">Subtotal (${bookingData.number_of_guests} guests):</span>
            <span class="value">R${bookingData.total_price * bookingData.number_of_guests}</span>
        </div>
        ${menuSelection?.travelFee ? `<div class="info-row"><span class="label">Travel Fee:</span><span class="value">R${menuSelection.travelFee}</span></div>` : ''}
        <div class="total">
            <div class="info-row">
                <span class="label">Total Amount:</span>
                <span class="value">R${totalAmount}</span>
            </div>
        </div>
    </div>

    ${bookingData.additional_notes ? `
    <div class="section">
        <div class="section-title">ADDITIONAL NOTES</div>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
            ${bookingData.additional_notes}
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>Thank you for choosing Thys Gemaak Spitbraai Catering Services!</strong></p>
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

    console.log("Generating enhanced PDF for booking:", bookingId);

    const htmlContent = generateEnhancedPDFContent(bookingData, bookingId);

    // For now, return HTML content. In a production environment, 
    // you would use a service like Puppeteer to convert to actual PDF
    return new Response(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="Spitbraai-Booking-Summary-${bookingId}.html"`,
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in generate-booking-pdf function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to generate booking PDF"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
