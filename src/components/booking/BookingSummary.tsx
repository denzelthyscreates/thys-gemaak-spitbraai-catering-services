import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Mail, Loader2 } from 'lucide-react';
import { formatSouthAfricaDateTime } from '@/utils/dateUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BookingSummaryProps {
  bookingData: {
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
  };
  bookingId: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData, bookingId }) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const { toast } = useToast();
  const menuSelection = bookingData.menu_selection;
  const totalAmount = menuSelection?.travelFee 
    ? (bookingData.total_price * bookingData.number_of_guests) + menuSelection.travelFee
    : bookingData.total_price * bookingData.number_of_guests;

  // Function to get full event type name
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

  const handleDownloadSummary = () => {
    const summaryContent = generateSummaryHTML();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(summaryContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const handleEmailSummary = async () => {
    setIsEmailSending(true);
    try {
      console.log('Sending email to:', bookingData.contact_email);
      console.log('Booking data:', bookingData);
      console.log('Booking ID:', bookingId);

      const { data, error } = await supabase.functions.invoke('send-booking-summary', {
        body: {
          bookingData,
          bookingId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Email response:', data);

      toast({
        title: "Email Sent Successfully!",
        description: `Booking summary has been sent to ${bookingData.contact_email}`,
        duration: 5000
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Failed",
        description: "Failed to send booking summary. Please try again or contact support.",
        variant: "destructive",
        duration: 7000
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const generateSummaryHTML = () => {
    const eventDate = formatSouthAfricaDateTime(bookingData.event_date, 'EEEE, MMMM do, yyyy');
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
        <p>Booking Date: ${formatSouthAfricaDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss')} (SAST)</p>
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif text-green-700">
          Booking Confirmed!
        </CardTitle>
        <CardDescription className="text-lg mb-4">
          Reference: <span className="font-mono font-semibold">{bookingId}</span>
        </CardDescription>
        
        {/* Action Buttons moved directly under reference */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadSummary} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={handleEmailSummary} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isEmailSending}
          >
            {isEmailSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Email PDF Summary
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {bookingData.contact_name}</div>
              <div><strong>Email:</strong> {bookingData.contact_email}</div>
              <div><strong>Phone:</strong> {bookingData.contact_phone}</div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Event Details</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Event Type:</strong> {getFullEventTypeName(bookingData.event_type)}</div>
              <div><strong>Menu Package:</strong> {bookingData.menu_package}</div>
              <div><strong>Date:</strong> {formatSouthAfricaDateTime(bookingData.event_date, 'EEEE, MMMM do, yyyy')}</div>
              <div><strong>Guests:</strong> {bookingData.number_of_guests}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Venue Address */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Venue Address</h3>
          <div className="text-sm">
            {bookingData.venue_name && <div className="font-medium">{bookingData.venue_name}</div>}
            <div>{bookingData.venue_street_address}</div>
            <div>{bookingData.venue_city}, {bookingData.venue_province} {bookingData.venue_postal_code}</div>
          </div>
        </div>

        <Separator />

        {/* Menu Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Menu Selection</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div><strong>Package:</strong> {bookingData.menu_package}</div>
              {bookingData.season && <div><strong>Season:</strong> {bookingData.season}</div>}
              {bookingData.starters && <div><strong>Starters:</strong> {bookingData.starters}</div>}
              {bookingData.sides && <div><strong>Sides:</strong> {bookingData.sides}</div>}
            </div>
            <div>
              {bookingData.desserts && <div><strong>Desserts:</strong> {bookingData.desserts}</div>}
              {bookingData.extras && <div><strong>Extras:</strong> {bookingData.extras}</div>}
              <div><strong>Cutlery:</strong> {menuSelection?.includeCutlery ? 'Included' : 'Not included'}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Pricing Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price per person:</span>
              <span>R{bookingData.total_price}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal ({bookingData.number_of_guests} guests):</span>
              <span>R{bookingData.total_price * bookingData.number_of_guests}</span>
            </div>
            {menuSelection?.travelFee && (
              <div className="flex justify-between">
                <span>Travel Fee:</span>
                <span>R{menuSelection.travelFee}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span>R{totalAmount}</span>
            </div>
          </div>
        </div>

        {bookingData.additional_notes && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
              <p className="text-sm bg-muted p-3 rounded">{bookingData.additional_notes}</p>
            </div>
          </>
        )}

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>Thank you for choosing Thys Gemaak Spitbraai Catering Services!</p>
          <p>We will contact you within 24-48 hours to confirm your booking details.</p>
          <p>For any queries, contact us at spitbookings@thysgemaak.com or +27 60 461 3766</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
