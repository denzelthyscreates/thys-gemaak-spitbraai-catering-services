
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";
import { createSimplePayNowButton, createDynamicPayNowButton, redirectToPayNow } from '@/services/PayFastPayNowService';
import { useToast } from "@/hooks/use-toast";

interface PayNowButtonProps {
  type: 'simple' | 'dynamic';
  amount?: number;
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
  };
  paymentType?: 'full' | 'balance';
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
  openInNewTab = false,
  disabled = false
}) => {
  const { toast } = useToast();
  
  const handlePayNowClick = () => {
    try {
      let payNowUrl: string;
      
      if (type === 'simple') {
        payNowUrl = createSimplePayNowButton(bookingData);
      } else {
        if (!amount) {
          throw new Error('Amount is required for dynamic PayNow button');
        }
        payNowUrl = createDynamicPayNowButton(amount, bookingData, paymentType);
      }
      
      console.log('PayNow URL generated:', payNowUrl);
      redirectToPayNow(payNowUrl, openInNewTab);
      
    } catch (error) {
      console.error('Error generating PayNow URL:', error);
      toast({
        title: "Payment Error",
        description: "Failed to generate payment link. Please try again.",
        variant: "destructive"
      });
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
      disabled={disabled}
      variant={variant}
      className="w-full flex items-center justify-center gap-2"
    >
      <CreditCard className="h-4 w-4" />
      {getDefaultButtonText()}
      {openInNewTab && <ExternalLink className="h-4 w-4" />}
    </Button>
  );
};

export default PayNowButton;
