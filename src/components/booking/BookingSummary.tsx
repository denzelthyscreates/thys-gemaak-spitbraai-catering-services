import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, BanknoteIcon, AlertCircle } from 'lucide-react';
import { formatSouthAfricaDateTime } from '@/utils/dateUtils';
import PayNowButton from '@/components/payment/PayNowButton';

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
    booking_reference?: string;
  };
  bookingId: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingData, bookingId }) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const menuSelection = bookingData.menu_selection;
  const totalAmount = menuSelection?.travelFee 
    ? (bookingData.total_price * bookingData.number_of_guests) + menuSelection.travelFee
    : bookingData.total_price * bookingData.number_of_guests;

  // Use the booking_reference from bookingData if available, otherwise fall back to bookingId
  const displayReference = bookingData.booking_reference || bookingId;

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

  const getMenuInclusions = () => {
    const inclusions: string[] = [];
    
    if (menuSelection?.includeCutlery) {
      inclusions.push('Cutlery & Crockery (R20/person)');
    }
    
    if (bookingData.menu_package.includes('Basic') || bookingData.menu_package.includes('Standard')) {
      inclusions.push('All Equipment');
    } else if (bookingData.menu_package.includes('Premium') || bookingData.menu_package.includes('Business')) {
      inclusions.push('All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving');
    } else if (bookingData.menu_package.includes('Wedding')) {
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

  const paymentBookingData = {
    client_name: bookingData.contact_name,
    client_email: bookingData.contact_email,
    client_phone: bookingData.contact_phone,
    event_date: bookingData.event_date,
    booking_id: parseInt(bookingId, 10) || 0
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif text-green-700">
          Booking Received!
        </CardTitle>
        <CardDescription className="text-lg mb-4">
          Reference: <span className="font-mono font-semibold text-lg">{displayReference}</span>
        </CardDescription>
        
        {/* Information about automatic email */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            📧 <strong>Email Confirmation Sent:</strong> A detailed booking summary has been automatically sent to <strong>{bookingData.contact_email}</strong>. 
            Please check your inbox (and spam folder) for the confirmation email with complete booking details and payment options.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Options Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Secure Your Booking with Payment
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Complete your booking by making a secure payment. Choose from the options below:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Booking Deposit (R500)</h4>
              <p className="text-sm text-gray-600">Secure your date with a deposit</p>
              <PayNowButton 
                type="simple"
                bookingData={paymentBookingData}
                paymentType="deposit"
                variant="outline"
                openInNewTab={true}
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Full Payment (R{totalAmount})</h4>
              <p className="text-sm text-gray-600">Pay the complete amount now</p>
              <PayNowButton 
                type="dynamic"
                amount={totalAmount}
                bookingData={paymentBookingData}
                paymentType="full"
                openInNewTab={true}
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700">Manual Bank Transfer</h4>
              <p className="text-sm text-gray-600">Pay via direct bank transfer</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowBankDetails(!showBankDetails)}
              >
                <BanknoteIcon className="h-4 w-4 mr-2" />
                {showBankDetails ? 'Hide' : 'Show'} Bank Details
              </Button>
            </div>
          </div>
          
          {/* Bank Details Section */}
          {showBankDetails && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-purple-600" />
                Bank Payment Details
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Bank:</strong> Capitec Business Bank</p>
                <p><strong>Account Name:</strong> Thys Gemaak SDC</p>
                <p><strong>Account Type:</strong> Transact Account</p>
                <p><strong>Account Number:</strong> 1051789869</p>
                <p><strong>Branch Code:</strong> 470010</p>
                <p><strong>Reference:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{displayReference}</span></p>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Important:</p>
                  <p>Please email proof of payment to spitbookings@thysgemaak.com or WhatsApp to +27 67 456 7784</p>
                  <p>Use reference: <strong className="font-mono">{displayReference}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>

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

        {/* Enhanced Venue Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Venue Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            {bookingData.venue_name && <div className="font-medium text-green-700">{bookingData.venue_name}</div>}
            <div><strong>Address:</strong> {bookingData.venue_street_address}</div>
            <div><strong>City:</strong> {bookingData.venue_city}</div>
            <div><strong>Province:</strong> {bookingData.venue_province}</div>
            <div><strong>Postal Code:</strong> {bookingData.venue_postal_code}</div>
          </div>
        </div>

        <Separator />

        {/* Enhanced Menu Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Detailed Menu Selection</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div><strong>Package:</strong> {bookingData.menu_package}</div>
                {bookingData.season && <div><strong>Season:</strong> {bookingData.season}</div>}
                {bookingData.starters && <div><strong>Starters:</strong> {bookingData.starters}</div>}
                {bookingData.sides && <div><strong>Sides:</strong> {bookingData.sides}</div>}
              </div>
              <div>
                {bookingData.desserts && <div><strong>Desserts:</strong> {bookingData.desserts}</div>}
                {bookingData.extras && (
                  <div><strong>Extras:</strong> {formatExtrasWithSaladName(bookingData.extras, menuSelection)}</div>
                )}
                <div><strong>Cutlery:</strong> {menuSelection?.includeCutlery ? 'Included' : 'Not included'}</div>
              </div>
            </div>
            
            {/* What's Included Section */}
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-green-700 mb-2">What's Included in Your Package:</h4>
              <ul className="text-sm space-y-1">
                {getMenuInclusions().map((inclusion, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {inclusion}
                  </li>
                ))}
              </ul>
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

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">📋 Next Steps</h3>
          <ol className="text-sm space-y-2 text-blue-700">
            <li><strong>1. Confirmation Call:</strong> We'll contact you within 24-48 hours to confirm details</li>
            <li><strong>2. Secure Your Date:</strong> Use the payment options above to guarantee your booking</li>
            <li><strong>3. Final Planning:</strong> We'll finalize menu and setup details closer to your event</li>
            <li><strong>4. Event Day:</strong> Our team arrives early to set up everything perfectly</li>
          </ol>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Thank you for choosing Thys Gemaak Spitbraai Catering Services!</p>
          <p>We will contact you within 24-48 hours to confirm your booking details.</p>
          <p>For any queries, contact us at spitbookings@thysgemaak.com or +27 67 456 7784</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
