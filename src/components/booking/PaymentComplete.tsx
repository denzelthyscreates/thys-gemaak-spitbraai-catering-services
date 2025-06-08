
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentGateway from '../payment/PaymentGateway';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from './types';

interface PaymentCompleteProps {
  bookingId: string | null;
  menuSelection: any;
  form: UseFormReturn<BookingFormValues>;
}

const PaymentComplete: React.FC<PaymentCompleteProps> = ({ bookingId, menuSelection, form }) => {
  const totalAmount = menuSelection.travelFee 
    ? (menuSelection.totalPrice * menuSelection.numberOfGuests) + menuSelection.travelFee
    : menuSelection.totalPrice * menuSelection.numberOfGuests;

  const bookingData = {
    client_name: form.getValues('name'),
    client_email: form.getValues('email'),
    client_phone: form.getValues('phone'),
    event_date: form.getValues('eventDate') ? format(form.getValues('eventDate')!, 'yyyy-MM-dd') : undefined,
    total_amount: totalAmount
  };

  const handleBackToForm = () => {
    // Reload the page to go back to the booking form
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-green-800">Booking Successfully Submitted!</CardTitle>
          <CardDescription className="text-green-700">
            Your booking reference: <Badge variant="secondary" className="ml-2">{bookingId}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-700 mb-4">
            Thank you for your booking! Your request has been processed and saved to our system.
          </p>
          <p className="text-sm text-green-600">
            You can now proceed with payment to secure your booking date.
          </p>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Payment
          </CardTitle>
          <CardDescription>
            Choose your payment option to secure your booking date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Deposit Payment */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Booking Deposit
                </CardTitle>
                <CardDescription>
                  Secure your booking with a R500 deposit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">R500</div>
                  <PaymentGateway 
                    bookingData={bookingData}
                    paymentType="deposit"
                  />
                  <p className="text-sm text-muted-foreground">
                    Remaining balance of R{totalAmount - 500} due before event
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Full Payment */}
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Full Payment
                </CardTitle>
                <CardDescription>
                  Pay the full amount and save on processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-600">R{totalAmount}</div>
                  <PaymentGateway 
                    bookingData={bookingData}
                    paymentType="full"
                  />
                  <Badge variant="secondary" className="text-xs">
                    No additional payments required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your booking is now saved in our system</li>
              <li>• You'll receive automated confirmations and updates</li>
              <li>• Our team will contact you to finalize event details</li>
              <li>• Payment secures your date and starts the catering process</li>
            </ul>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleBackToForm}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Booking Form
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentComplete;
