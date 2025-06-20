import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSecurePayNow, submitSecurePaymentForm, SecurePaymentRequest } from '@/services/SecurePaymentService';

interface PayNowButtonProps {
  type: 'simple' | 'dynamic';
  amount?: number;
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    booking_id?: number;
  };
  paymentType?: 'full' | 'balance' | 'deposit';
  buttonText?: string;
  variant?: 'default' | 'outline' | 'secondary';
  openInNewTab?: boolean;
  disabled?: boolean;
}

const PayNowButton: React.FC<PayNowButtonProps> = ({
  type,
  amount,
  bookingData,
  paymentType = 'full',
  buttonText,
  variant = 'default',
  openInNewTab = true,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handlePayNowClick = async () => {
    setIsLoading(true);
    
    try {
      const paymentAmount = type === 'simple' ? 500 : amount;
      const paymentTypeForRequest = type === 'simple' ? 'deposit' : paymentType;
      
      if (!paymentAmount) {
        throw new Error('Amount is required for PayNow payment');
      }
      
      const request: SecurePaymentRequest = {
        amount: paymentAmount,
        paymentType: paymentTypeForRequest,
        bookingData
      };
      
      const response = await generateSecurePayNow(request);
      
      if (!response.success || response.error) {
        throw new Error(response.error || 'Failed to generate payment form');
      }
      
      console.log('Secure PayNow form generated');
      
      // Always open in new tab and use the correct PayNow URL
      const form = document.createElement('form');
      form.method = 'post';
      form.action = 'https://payment.payfast.io/eng/process'; // Correct PayNow URL
      form.target = '_blank'; // Always open in new tab
      
      // Add all form fields
      Object.entries(response.formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
    } catch (error) {
      console.error('Error submitting PayNow form:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDefaultButtonText = () => {
    if (buttonText) return buttonText;
    
    if (type === 'simple') {
      return 'Pay R500 Deposit';
    } else {
      return paymentType === 'full' 
        ? `Pay Full Amount (R${amount?.toFixed(0) || '0'})` 
        : `Pay Balance (R${amount?.toFixed(0) || '0'})`;
    }
  };
  
  return (
    <Button
      onClick={handlePayNowClick}
      disabled={disabled || isLoading}
      variant={variant}
      className="w-full flex items-center justify-center gap-2"
    >
      <CreditCard className="h-4 w-4" />
      {isLoading ? 'Processing...' : getDefaultButtonText()}
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
};

export default PayNowButton;
