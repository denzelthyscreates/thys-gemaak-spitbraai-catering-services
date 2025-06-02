
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomAmountPayNowFormProps {
  bookingData: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    event_date?: string;
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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount < minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount of at least R${minAmount.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    // Create and submit the form programmatically
    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://payment.payfast.io/eng/process';
    form.name = 'PayFastPayNowForm';

    const formData = {
      cmd: '_paynow',
      receiver: '29885651',
      return_url: `${window.location.origin}/payment-success`,
      cancel_url: `${window.location.origin}/payment-cancelled`,
      notify_url: `${window.location.origin}/api/payfast-notification`,
      amount: numericAmount.toFixed(2),
      item_name: itemName,
      item_description: itemDescription
    };

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      input.required = true;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    console.log('Custom PayNow form submitted with amount:', numericAmount);
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
            />
            <p className="text-sm text-muted-foreground">
              Minimum amount: R{minAmount.toFixed(2)}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay R{parseFloat(amount || '0').toFixed(2)} with PayNow
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomAmountPayNowForm;
