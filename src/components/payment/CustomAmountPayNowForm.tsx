
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSecurePayNow, submitSecurePaymentForm, SecurePaymentRequest } from '@/services/SecurePaymentService';

interface CustomAmountPayNowFormProps {
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
    booking_id?: number;
  };
  minAmount?: number;
  defaultAmount?: number;
  itemName?: string;
  itemDescription?: string;
}

const CustomAmountPayNowForm: React.FC<CustomAmountPayNowFormProps> = ({
  bookingData,
  minAmount = 5.00,
  defaultAmount = 1000,
  itemName = "Full Payment or Rest Payment",
  itemDescription = "Pay for the rest of your Spitbraai catering booking."
}) => {
  const [amount, setAmount] = useState<string>(defaultAmount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount) || numericAmount < minAmount) {
        toast({
          title: "Invalid Amount",
          description: `Please enter a valid amount of at least R${minAmount.toFixed(2)}`,
          variant: "destructive"
        });
        return;
      }

      const request: SecurePaymentRequest = {
        amount: numericAmount,
        paymentType: 'full', // Custom amounts default to full payment type
        bookingData
      };
      
      const response = await generateSecurePayNow(request);
      
      if (!response.success || response.error) {
        throw new Error(response.error || 'Failed to generate payment form');
      }
      
      console.log('Secure custom PayNow form generated with amount:', numericAmount);
      submitSecurePaymentForm(response.formData, response.paymentUrl);
      
    } catch (error) {
      console.error('Error submitting custom PayNow form:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Custom Amount PayNow
        </CardTitle>
        <CardDescription>
          Enter the amount you want to pay and click to proceed to PayFast
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payfast-amount">Amount (R)</Label>
            <Input
              id="payfast-amount"
              type="number"
              step="0.01"
              min={minAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={minAmount.toFixed(2)}
              required
              className="text-lg font-medium"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Minimum amount: R{minAmount.toFixed(2)}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : `Pay R${parseFloat(amount || '0').toFixed(2)} with PayNow`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomAmountPayNowForm;
