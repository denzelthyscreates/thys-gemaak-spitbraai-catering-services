
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PayFastForm from './PayFastForm';
import PayNowButton from './PayNowButton';
import CustomAmountPayNowForm from './CustomAmountPayNowForm';
import { generateSecurePayment, SecurePaymentRequest } from '@/services/SecurePaymentService';

export type PaymentType = 'deposit' | 'balance' | 'full';

interface PaymentGatewayProps {
  bookingData: {
    id?: number;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    total_amount: number;
    deposit_paid?: number;
  };
  paymentType: PaymentType;
  onCancel?: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  bookingData,
  paymentType,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'paynow' | 'custom-paynow' | 'form'>('paynow');
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<{url: string; formData: Record<string, string>} | null>(null);
  
  useEffect(() => {
    const generateSecurePaymentData = async () => {
      try {
        setIsLoading(true);
        
        const paymentAmount = getPaymentAmount();
        const request: SecurePaymentRequest = {
          amount: paymentAmount,
          paymentType,
          bookingData: {
            client_name: bookingData.client_name,
            client_email: bookingData.client_email,
            client_phone: bookingData.client_phone,
            event_date: bookingData.event_date,
            booking_id: bookingData.id
          }
        };
        
        const response = await generateSecurePayment(request);
        
        if (response.success) {
          setPaymentData({
            url: response.paymentUrl,
            formData: response.formData
          });
        } else {
          throw new Error(response.error || 'Failed to generate payment');
        }
      } catch (error) {
        console.error('Error generating secure payment:', error);
        toast({
          title: "Payment Error",
          description: "Failed to generate payment. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSecurePaymentData();
  }, [bookingData, paymentType]);
  
  const getPaymentAmount = () => {
    switch(paymentType) {
      case 'deposit':
        return 500;
      case 'balance':
        const depositPaid = bookingData.deposit_paid || 500;
        return bookingData.total_amount - depositPaid;
      case 'full':
        return bookingData.total_amount;
      default:
        return 0;
    }
  };
  
  if (isLoading || !paymentData) {
    return (
      <div className="p-4 text-center">
        <p>Preparing secure payment options...</p>
      </div>
    );
  }
  
  return (
    <div className="payment-gateway space-y-4">
      <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'paynow' | 'custom-paynow' | 'form')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paynow">Quick PayNow</TabsTrigger>
          <TabsTrigger value="custom-paynow">Custom Amount</TabsTrigger>
          <TabsTrigger value="form">Traditional Form</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paynow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick PayNow Payment</CardTitle>
              <CardDescription>
                Click the button below to be redirected to PayFast's secure payment page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentType === 'deposit' ? (
                <PayNowButton
                  type="simple"
                  bookingData={{
                    client_name: bookingData.client_name,
                    client_email: bookingData.client_email,
                    client_phone: bookingData.client_phone,
                    event_date: bookingData.event_date,
                    booking_id: bookingData.id
                  }}
                  buttonText="Pay R500 Deposit with PayNow"
                />
              ) : (
                <PayNowButton
                  type="dynamic"
                  amount={getPaymentAmount()}
                  bookingData={{
                    client_name: bookingData.client_name,
                    client_email: bookingData.client_email,
                    client_phone: bookingData.client_phone,
                    event_date: bookingData.event_date,
                    booking_id: bookingData.id
                  }}
                  paymentType={paymentType === 'full' ? 'full' : 'balance'}
                  buttonText={`Pay ${paymentType === 'balance' ? 'Remaining Balance' : 'Full Amount'} with PayNow`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom-paynow" className="space-y-4">
          <CustomAmountPayNowForm
            bookingData={{
              client_name: bookingData.client_name,
              client_email: bookingData.client_email,
              client_phone: bookingData.client_phone,
              event_date: bookingData.event_date,
              booking_id: bookingData.id
            }}
            defaultAmount={getPaymentAmount()}
            itemName={paymentType === 'deposit' ? 'Booking Deposit' : 
                     paymentType === 'balance' ? 'Final Payment - Spitbraai Catering' : 
                     'Full Payment - Spitbraai Catering'}
            itemDescription={paymentType === 'deposit' ? 'Deposit to secure your Spitbraai catering booking.' :
                           paymentType === 'balance' ? 'Final payment for Spitbraai catering services' :
                           'Full payment for Spitbraai catering services'}
          />
        </TabsContent>
        
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traditional Payment Form</CardTitle>
              <CardDescription>
                Use the traditional payment form method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PayFastForm 
                formData={paymentData.formData}
                paymentUrl={paymentData.url}
                isLoading={isLoading}
                buttonText={`Pay ${paymentType === 'deposit' ? 'Deposit' : paymentType === 'balance' ? 'Remaining Balance' : 'Full Amount'}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {onCancel && (
        <button 
          onClick={onCancel}
          className="mt-3 text-sm text-muted-foreground underline block w-full text-center"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default PaymentGateway;
