
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import PayFastForm from './PayFastForm';
import { createBookingDepositPayment, createRemainingBalancePayment, createFullPayment } from '@/services/PayFastService';

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
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<{url: string; formData: Record<string, string>} | null>(null);
  
  React.useEffect(() => {
    try {
      let data;
      
      switch(paymentType) {
        case 'deposit':
          data = createBookingDepositPayment(bookingData);
          break;
        case 'balance':
          data = createRemainingBalancePayment(bookingData);
          break;
        case 'full':
          data = createFullPayment(bookingData);
          break;
        default:
          throw new Error('Invalid payment type');
      }
      
      setPaymentData(data);
    } catch (error) {
      console.error('Error generating PayFast payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to generate payment. Please try again.",
        variant: "destructive"
      });
    }
  }, [bookingData, paymentType]);
  
  if (!paymentData) {
    return (
      <div className="p-4 text-center">
        <p>Preparing payment options...</p>
      </div>
    );
  }
  
  return (
    <div className="payment-gateway">
      <PayFastForm 
        formData={paymentData.formData}
        paymentUrl={paymentData.url}
        isLoading={isLoading}
        buttonText={`Pay ${paymentType === 'deposit' ? 'Deposit' : paymentType === 'balance' ? 'Remaining Balance' : 'Full Amount'}`}
      />
      
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
