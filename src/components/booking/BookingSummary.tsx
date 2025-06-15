
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Mail } from 'lucide-react';
import { formatSouthAfricaDateTime } from '@/utils/dateUtils';
import { format } from 'date-fns';

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
  const menuSelection = bookingData.menu_selection;
  const totalAmount = menuSelection?.travelFee 
    ? (bookingData.total_price * bookingData.number_of_guests) + menuSelection.travelFee
    : bookingData.total_price * bookingData.number_of_guests;

  const handleDownloadSummary = () => {
    const summaryContent = generateSummaryText();
    const blob = new Blob([summaryContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Spitbraai-Booking-${bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailSummary = () => {
    const summaryContent = generateSummaryText();
    const subject = `Spitbraai Booking Summary - ${bookingId}`;
    const body = encodeURIComponent(summaryContent);
    window.open(`mailto:${bookingData.contact_email}?subject=${subject}&body=${body}`);
  };

  const generateSummaryText = () => {
    const eventDate = formatSouthAfricaDateTime(bookingData.event_date, 'EEEE, MMMM do, yyyy');
    
    return `
SPITBRAAI BOOKING SUMMARY
========================

Booking Reference: ${bookingId}
Booking Date: ${formatSouthAfricaDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss')} (SAST)

CONTACT INFORMATION
------------------
Name: ${bookingData.contact_name}
Email: ${bookingData.contact_email}
Phone: ${bookingData.contact_phone}

EVENT DETAILS
------------
Event Type: ${bookingData.event_type || 'Not specified'}
Event Date: ${eventDate}
Number of Guests: ${bookingData.number_of_guests}

VENUE ADDRESS
------------
${bookingData.venue_name ? `Venue Name: ${bookingData.venue_name}\n` : ''}${bookingData.venue_street_address}
${bookingData.venue_city}, ${bookingData.venue_province}
${bookingData.venue_postal_code}

BILLING ADDRESS
--------------
${bookingData.address_line1}
${bookingData.city}, ${bookingData.province}
${bookingData.postal_code_address}

MENU SELECTION
-------------
Package: ${bookingData.menu_package}
${bookingData.season ? `Season: ${bookingData.season}\n` : ''}${bookingData.starters ? `Starters: ${bookingData.starters}\n` : ''}${bookingData.sides ? `Sides: ${bookingData.sides}\n` : ''}${bookingData.desserts ? `Desserts: ${bookingData.desserts}\n` : ''}${bookingData.extras ? `Extras: ${bookingData.extras}\n` : ''}
PRICING
-------
Price per person: R${bookingData.total_price}
Subtotal (${bookingData.number_of_guests} guests): R${bookingData.total_price * bookingData.number_of_guests}
${menuSelection?.travelFee ? `Travel Fee: R${menuSelection.travelFee}\n` : ''}Total Amount: R${totalAmount}

${bookingData.additional_notes ? `ADDITIONAL NOTES\n---------------\n${bookingData.additional_notes}\n\n` : ''}
Contact us at spitbookings@thysgemaak.com or +27 60 461 3766

Thank you for choosing Thys Gemaak Spitbraai Catering Services!
    `.trim();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif text-green-700">
          Booking Confirmed!
        </CardTitle>
        <CardDescription className="text-lg">
          Reference: <span className="font-mono font-semibold">{bookingId}</span>
        </CardDescription>
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
              {bookingData.event_type && <div><strong>Type:</strong> {bookingData.event_type}</div>}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadSummary} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Summary
          </Button>
          <Button onClick={handleEmailSummary} variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Summary
          </Button>
        </div>

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
