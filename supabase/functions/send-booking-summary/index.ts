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

const getMenuInclusions = (menuPackage: string, includeCutlery: boolean) => {
  const inclusions: string[] = [];
  
  if (includeCutlery) {
    inclusions.push('Cutlery & Crockery (R20/person)');
  }
  
  if (menuPackage.includes('Basic') || menuPackage.includes('Standard')) {
    inclusions.push('All Equipment');
  } else if (menuPackage.includes('Premium') || menuPackage.includes('Business')) {
    inclusions.push('All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving');
  } else if (menuPackage.includes('Wedding')) {
    inclusions.push('Jugs & Glasses', 'Juice + 1 Refill', 'All Equipment + Setup of Serving Table');
  }
  
  return inclusions;
};

// Function to format extras with exact salad name
const formatExtrasWithSaladName = (extras: string, menuSelection: any) => {
  if (!extras || !menuSelection) return extras;
  
  // If extras contains "Extra Salad" and we have extraSaladType, replace it with the specific salad name
  if (extras.includes('Extra Salad') && menuSelection.extraSaladType) {
    // Map salad type IDs to names
    const saladTypeMap: { [key: string]: string } = {
      'greek_salad': 'Greek Salad',
      'potato_salad': 'Potato Salad',
      'coleslaw': 'Coleslaw',
      'beetroot_salad': 'Beetroot Salad',
      'three_bean_salad': 'Three Bean Salad'
    };
    
    const saladName = saladTypeMap[menuSelection.extraSaladType] || menuSelection.extraSaladType;
    return extras.replace('Extra Salad', `Extra Salad: ${saladName}`);
  }
  
  return extras;
};

const generatePaymentSection = (bookingData: BookingData, bookingId: string, totalAmount: number) => {
  // Create payment links that work in email clients
  const baseUrl = 'https://payment.payfast.io/eng/process';
  const receiverId = Deno.env.get('PAYFAST_RECEIVER_ID') || '29885651';
  
  // Create deposit payment URL
  const depositParams = new URLSearchParams({
    cmd: '_paynow',
    receiver: receiverId,
    amount: '500.00',
    item_name: 'Booking Deposit',
    item_description: 'Deposit to secure your Spitbraai catering booking.',
    return_url: 'https://spitbraai.thysgemaak.com/payment-success',
    cancel_url: 'https://spitbraai.thysgemaak.com/payment-cancelled'
  });
  
  // Create full payment URL
  const fullPaymentParams = new URLSearchParams({
    cmd: '_paynow',
    receiver: receiverId,
    amount: totalAmount.toFixed(2),
    item_name: 'Full Payment - Spitbraai Catering',
    item_description: 'Full payment for Spitbraai catering services',
    return_url: 'https://spitbraai.thysgemaak.com/payment-success',
    cancel_url: 'https://spitbraai.thysgemaak.com/payment-cancelled'
  });

  const depositUrl = `${baseUrl}?${depositParams.toString()}`;
  const fullPaymentUrl = `${baseUrl}?${fullPaymentParams.toString()}`;

  return `
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #0ea5e9;">
      <h3 style="color: #0369a1; margin-top: 0;">💳 Secure Payment Options</h3>
      <p style="margin-bottom: 15px;">You can secure your booking by making a payment using one of the options below:</p>
      
      <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
        <div style="flex: 1; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; min-width: 200px;">
          <h4 style="color: #22c55e; margin: 0 0 10px 0;">Option 1: Booking Deposit (R500)</h4>
          <p style="margin: 0 0 15px 0; font-size: 14px;">Secure your date with a R500 deposit</p>
          <a href="${depositUrl}" 
             style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-align: center; width: 100%; box-sizing: border-box;"
             target="_blank">
            Pay R500 Deposit
          </a>
        </div>
        
        <div style="flex: 1; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; min-width: 200px;">
          <h4 style="color: #22c55e; margin: 0 0 10px 0;">Option 2: Full Payment (R${totalAmount})</h4>
          <p style="margin: 0 0 15px 0; font-size: 14px;">Pay the full amount now</p>
          <a href="${fullPaymentUrl}" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-align: center; width: 100%; box-sizing: border-box;"
             target="_blank">
            Pay Full Amount
          </a>
        </div>
        
        <div style="flex: 1; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; min-width: 200px;">
          <h4 style="color: #9333ea; margin: 0 0 10px 0;">Option 3: Manual Bank Transfer</h4>
          <p style="margin: 0 0 15px 0; font-size: 14px;">Pay via direct bank transfer</p>
          <div style="background-color: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; font-weight: bold;">Bank Details:</p>
            <p style="margin: 2px 0; font-size: 12px;">Bank: Capitec Business Bank</p>
            <p style="margin: 2px 0; font-size: 12px;">Account: Thys Gemaak SDC</p>
            <p style="margin: 2px 0; font-size: 12px;">Account No: 1051789869</p>
            <p style="margin: 2px 0; font-size: 12px;">Branch Code: 470010</p>
            <p style="margin: 2px 0; font-size: 12px;">Reference: ${bookingId} - ${bookingData.contact_name}</p>
          </div>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #dc2626;">⚠️ Email proof of payment to wade@thysgemaak.com</p>
        </div>
      </div>
      
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        🔒 Secure payments powered by PayFast. Bank transfers require proof of payment.
      </p>
    </div>
  `;
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
  const menuInclusions = getMenuInclusions(bookingData.menu_package, menuSelection?.includeCutlery);
  
  // Format extras with specific salad name
  const formattedExtras = formatExtrasWithSaladName(bookingData.extras || '', menuSelection);

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
        .venue-details, .menu-details {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #22c55e;
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
        .bank-details {
            background-color: #faf5ff;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #9333ea;
            margin-top: 15px;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
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
            ${formattedExtras ? `<div class="info-row"><span class="label">Extras:</span><span class="value">${formattedExtras}</span></div>` : ''}
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

    <div class="section">
        <div class="section-title">PAYMENT OPTIONS</div>
        <p>You can secure your booking using any of these payment methods:</p>
        
        <div class="bank-details">
            <h4 style="margin: 0 0 10px 0; color: #9333ea;">Bank Transfer Details:</h4>
            <div class="info-row">
                <span class="label">Bank:</span>
                <span class="value">Capitec Business Bank</span>
            </div>
            <div class="info-row">
                <span class="label">Account Name:</span>
                <span class="value">Thys Gemaak SDC</span>
            </div>
            <div class="info-row">
                <span class="label">Account Type:</span>
                <span class="value">Transact Account</span>
            </div>
            <div class="info-row">
                <span class="label">Account Number:</span>
                <span class="value">1051789869</span>
            </div>
            <div class="info-row">
                <span class="label">Branch Code:</span>
                <span class="value">470010</span>
            </div>
            <div class="info-row">
                <span class="label">Reference:</span>
                <span class="value">${bookingId} - ${bookingData.contact_name}</span>
            </div>
        </div>
        
        <p style="margin-top: 15px; font-size: 14px; color: #dc2626;"><strong>Important:</strong> Please email proof of payment to wade@thysgemaak.com or WhatsApp to +27 60 461 3766</p>
        <p style="margin-top: 10px; font-size: 14px;">Alternatively, you can pay online using the secure PayFast links provided in the email.</p>
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

const generateStaffNotificationEmail = (bookingData: BookingData, bookingId: string) => {
  const menuSelection = bookingData.menu_selection;
  const totalAmount = menuSelection?.travelFee 
    ? (bookingData.total_price * bookingData.number_of_guests) + menuSelection.travelFee
    : bookingData.total_price * bookingData.number_of_guests;

  // Format extras with specific salad name for email display
  const formattedExtras = formatExtrasWithSaladName(bookingData.extras || '', bookingData.menu_selection);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">🚨 NEW BOOKING ENQUIRY RECEIVED 🚨</h2>
      </div>
      
      <div style="padding: 20px;">
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">URGENT: New Booking Requires Attention</h3>
          <p style="margin: 0; font-weight: bold;">A new booking enquiry has been submitted and requires follow-up within 24-48 hours.</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #22c55e;">📋 Complete Booking Summary</h3>
          <p><strong>Reference:</strong> ${bookingId}</p>
          <p><strong>Client Name:</strong> ${bookingData.contact_name}</p>
          <p><strong>Client Email:</strong> ${bookingData.contact_email}</p>
          <p><strong>Client Phone:</strong> ${bookingData.contact_phone}</p>
          <p><strong>Event Type:</strong> ${getFullEventTypeName(bookingData.event_type)}</p>
          <p><strong>Package:</strong> ${bookingData.menu_package}</p>
          ${bookingData.season ? `<p><strong>Season:</strong> ${bookingData.season}</p>` : ''}
          ${bookingData.starters ? `<p><strong>Starters:</strong> ${bookingData.starters}</p>` : ''}
          ${bookingData.sides ? `<p><strong>Sides:</strong> ${bookingData.sides}</p>` : ''}
          ${bookingData.desserts ? `<p><strong>Desserts:</strong> ${bookingData.desserts}</p>` : ''}
          ${formattedExtras ? `<p><strong>Extras:</strong> ${formattedExtras}</p>` : ''}
          <p><strong>Cutlery & Crockery:</strong> ${bookingData.menu_selection?.includeCutlery ? 'Included' : 'Not included'}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Guests:</strong> ${bookingData.number_of_guests}</p>
          <p><strong>Venue:</strong> ${bookingData.venue_street_address}, ${bookingData.venue_city}</p>
          <p style="font-size: 18px; color: #22c55e;"><strong>Total Amount: R${totalAmount}</strong></p>
          ${bookingData.additional_notes ? `<p><strong>Additional Notes:</strong> ${bookingData.additional_notes}</p>` : ''}
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Action Required</h4>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>Contact client within 24-48 hours to confirm booking details</li>
            <li>Check calendar availability for the requested date</li>
            <li>Confirm menu selections and any special requirements</li>
            <li>Follow up on payment to secure the booking</li>
          </ul>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h4 style="color: #0369a1; margin: 0 0 10px 0;">📞 Contact Information</h4>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${bookingData.contact_name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${bookingData.contact_email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${bookingData.contact_phone}</p>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h4 style="color: #166534; margin: 0 0 10px 0;">🏢 Venue Details</h4>
          ${bookingData.venue_name ? `<p style="margin: 5px 0;"><strong>Venue Name:</strong> ${bookingData.venue_name}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Address:</strong> ${bookingData.venue_street_address}</p>
          <p style="margin: 5px 0;"><strong>City:</strong> ${bookingData.venue_city}</p>
          <p style="margin: 5px 0;"><strong>Province:</strong> ${bookingData.venue_province}</p>
          <p style="margin: 5px 0;"><strong>Postal Code:</strong> ${bookingData.venue_postal_code}</p>
        </div>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">Automated notification from Thys Gemaak Spitbraai booking system</p>
        <p style="margin: 5px 0 0 0;">This email was sent automatically when booking ${bookingId} was submitted</p>
      </div>
    </div>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingData, bookingId, zohoEstimate } = await req.json();

    console.log("Processing booking summary email for:", bookingId);
    console.log("Recipient email:", bookingData.contact_email);

    const htmlContent = generatePDFContent(bookingData, bookingId);
    const totalAmount = bookingData.menu_selection?.travelFee 
      ? (bookingData.total_price * bookingData.number_of_guests) + bookingData.menu_selection.travelFee
      : bookingData.total_price * bookingData.number_of_guests;

    const paymentSection = generatePaymentSection(bookingData, bookingId, totalAmount);
    
    // Format extras with specific salad name for email display
    const formattedExtras = formatExtrasWithSaladName(bookingData.extras || '', bookingData.menu_selection);

    // Send email with enhanced content including working payment links and bank details
    const emailResponse = await resend.emails.send({
      from: "Thys Gemaak Spitbraai <no-reply@spitbraai.thysgemaak.com>",
      to: [bookingData.contact_email],
      subject: `We have received your spitbraai booking! - ${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background-color: #22c55e; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">We have received your spitbraai booking!</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${bookingData.contact_name},</p>
            <p>Thank you for choosing Thys Gemaak Spitbraai! We have successfully received your booking request and are excited to cater your special event.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #22c55e;">📋 Complete Booking Summary</h3>
              <p><strong>Reference:</strong> ${bookingId}</p>
              <p><strong>Event Type:</strong> ${getFullEventTypeName(bookingData.event_type)}</p>
              <p><strong>Package:</strong> ${bookingData.menu_package}</p>
              ${bookingData.season ? `<p><strong>Season:</strong> ${bookingData.season}</p>` : ''}
              ${bookingData.starters ? `<p><strong>Starters:</strong> ${bookingData.starters}</p>` : ''}
              ${bookingData.sides ? `<p><strong>Sides:</strong> ${bookingData.sides}</p>` : ''}
              ${bookingData.desserts ? `<p><strong>Desserts:</strong> ${bookingData.desserts}</p>` : ''}
              ${formattedExtras ? `<p><strong>Extras:</strong> ${formattedExtras}</p>` : ''}
              <p><strong>Cutlery & Crockery:</strong> ${bookingData.menu_selection?.includeCutlery ? 'Included' : 'Not included'}</p>
              <p><strong>Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString('en-ZA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Guests:</strong> ${bookingData.number_of_guests}</p>
              <p><strong>Venue:</strong> ${bookingData.venue_street_address}, ${bookingData.venue_city}</p>
              <p style="font-size: 18px; color: #22c55e;"><strong>Total Amount: R${totalAmount}</strong></p>
            </div>

            ${zohoEstimate ? `
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22c55e;">
              <h3 style="color: #166534; margin-top: 0;">📋 Professional Quote Generated</h3>
              <p>We've automatically generated a professional quote for your booking in our system:</p>
              <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p><strong>Quote Number:</strong> ${zohoEstimate.estimate_number || 'Pending'}</p>
                <p><strong>Quote Total:</strong> R${zohoEstimate.total || totalAmount}</p>
                <p><strong>Status:</strong> ${zohoEstimate.status || 'Draft'}</p>
                ${zohoEstimate.estimate_url ? `<p><a href="${zohoEstimate.estimate_url}" style="color: #22c55e; text-decoration: none;" target="_blank">🔗 View Professional Quote</a></p>` : ''}
              </div>
              <p style="font-size: 14px; color: #166534; margin-bottom: 0;">This quote will be finalized after we confirm all details with you.</p>
            </div>
            ` : ''}

            ${paymentSection}
            
            <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #0369a1; margin-top: 0;">📋 Next Steps</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Confirmation Call:</strong> We will contact you within 24-48 hours to confirm all booking details and discuss any special requirements.</li>
                <li style="margin-bottom: 8px;"><strong>Payment:</strong> You can secure your booking using any of the payment options above. A minimum R500 deposit is required to guarantee your date.</li>
                <li style="margin-bottom: 8px;"><strong>Final Details:</strong> We'll confirm menu selections, setup requirements, and arrival times closer to your event date.</li>
                <li style="margin-bottom: 8px;"><strong>Event Day:</strong> Our team will arrive early to set up and ensure everything is perfect for your special day.</li>
              </ol>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Important Notes</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li>Your booking is not confirmed until we speak with you personally</li>
                <li>Popular dates fill up quickly - payment secures your preferred date</li>
                <li>Final guest numbers can be adjusted up to 7 days before your event</li>
                <li>For bank transfers, please email proof of payment to spitbookings@thysgemaak.com</li>
              </ul>
            </div>
            
            <p>If you have any questions before we call, please don't hesitate to contact us:</p>
            <ul>
              <li><strong>Email:</strong> spitbookings@thysgemaak.com</li>
              <li><strong>Phone:</strong> +27 60 461 3766</li>
              <li><strong>Booking Reference:</strong> ${bookingId}</li>
            </ul>
            
            <p>We look forward to making your event memorable!</p>
            <p>Best regards,<br><strong>The Thys Gemaak Spitbraai Team</strong></p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Thys Gemaak Spitbraai | Professional Catering Services</p>
            <p style="margin: 5px 0 0 0;">Making your special occasions unforgettable since 2024</p>
          </div>
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

    console.log("Customer email sent successfully:", emailResponse.data);

    // Send staff notification email
    try {
      console.log("Sending staff notification email...");
      
      const staffEmailResponse = await resend.emails.send({
        from: "Thys Gemaak Booking System <no-reply@spitbraai.thysgemaak.com>",
        to: ["spitbookings@thysgemaak.com"],
        subject: `🚨 NEW BOOKING ENQUIRY - ${bookingId} - ${bookingData.contact_name}`,
        html: generateStaffNotificationEmail(bookingData, bookingId)
      });

      if (staffEmailResponse.error) {
        console.error("Staff notification email error:", staffEmailResponse.error);
      } else {
        console.log("Staff notification email sent successfully:", staffEmailResponse.data);
      }
    } catch (staffEmailError) {
      console.error("Staff email sending exception:", staffEmailError);
    }

    // Show success toast to customer
    toast({
      title: "Booking Successful!",
      description: `Your booking has been created and a confirmation email has been sent to ${bookingData.contact_email}`,
      duration: 5000
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Enhanced booking summary sent successfully",
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
