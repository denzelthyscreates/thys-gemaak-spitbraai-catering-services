
import React, { useState } from 'react';
import { Check, CreditCard, BanknoteIcon, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PaymentGateway from './payment/PaymentGateway';
import { Button } from '@/components/ui/button';

interface PaymentOptionProps {
  totalPrice: number;
  numGuests: number;
  travelFee?: number | null;
  onClose?: () => void;
}

const PaymentOptions: React.FC<PaymentOptionProps> = ({ 
  totalPrice, 
  numGuests, 
  travelFee = null,
  onClose 
}) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'eft' | 'payfast' | null>(null);
  const [paymentType, setPaymentType] = useState<'deposit' | 'balance' | 'full' | null>(null);
  const { toast } = useToast();
  
  // Calculate the amounts based on Terms and Conditions
  const bookingFee = 500; // Fixed R500 booking fee
  const menuSubtotal = totalPrice * numGuests;
  const travelAmount = travelFee || 0;
  const totalEventCost = menuSubtotal + travelAmount;
  const depositAmount = Math.round(totalEventCost * 0.5); // 50% deposit
  const finalPayment = totalEventCost - depositAmount;
  
  // Mock booking data for demonstration
  const mockBookingData = {
    client_name: '',
    client_email: '',
    client_phone: '',
    event_date: '',
    total_amount: totalEventCost,
    deposit_paid: 0
  };
  
  const handleShowBankDetails = () => {
    if (!acceptTerms) {
      toast({
        title: "Please accept the terms",
        description: "You must accept the terms and conditions before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    setShowBankDetails(true);
    setPaymentMethod('eft');
    toast({
      title: "Bank details displayed",
      description: "Please use these details to make your payment.",
      variant: "default"
    });
  };
  
  const handlePayFastPayment = (type: 'deposit' | 'balance' | 'full') => {
    if (!acceptTerms) {
      toast({
        title: "Please accept the terms",
        description: "You must accept the terms and conditions before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentType(type);
    setPaymentMethod('payfast');
  };
  
  const handleResetPayment = () => {
    setPaymentMethod(null);
    setPaymentType(null);
    setShowBankDetails(false);
  };
  
  return (
    <div className="bg-white rounded-xl p-8 shadow-prominent border border-border animate-fade-in">
      <h3 className="text-xl font-semibold mb-6">Payment Information</h3>
      
      {/* Payment Timeline */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Payment Schedule</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Step 1: Booking Fee</p>
              <p className="text-muted-foreground">R{bookingFee} non-refundable booking fee to secure your date</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Step 2: 50% Deposit (14 days before event)</p>
              <p className="text-muted-foreground">R{depositAmount} deposit (50% of total cost)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Step 3: Final Payment (2 days before event)</p>
              <p className="text-muted-foreground">R{finalPayment} (remaining balance)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cost Summary */}
      <div className="bg-secondary/5 p-4 rounded-lg mb-8">
        <h4 className="font-semibold mb-3">Cost Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Per Person Cost:</span>
            <span>R{totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of Guests:</span>
            <span>{numGuests}</span>
          </div>
          <div className="flex justify-between">
            <span>Menu Subtotal:</span>
            <span>R{menuSubtotal}</span>
          </div>
          {travelFee && (
            <div className="flex justify-between">
              <span>Travel Fee:</span>
              <span>R{travelFee}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
            <span>Total Event Cost:</span>
            <span>R{totalEventCost}</span>
          </div>
        </div>
      </div>
      
      {/* Terms Acceptance */}
      <div className="mb-6">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="mt-1"
          />
          <span className="text-sm text-muted-foreground">
            I have read and agree to the <a href="/terms-of-service" target="_blank" className="text-primary underline">Terms and Conditions</a>, 
            including the payment schedule and cancellation policy.
          </span>
        </label>
      </div>
      
      {/* Payment Options */}
      {!paymentMethod && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-slate-50">
            <h4 className="font-medium mb-3">Select Payment Method</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleShowBankDetails}
                className="w-full flex items-center justify-center gap-2"
                disabled={!acceptTerms}
                variant="outline"
              >
                <BanknoteIcon className="h-5 w-5" />
                Pay via EFT
              </Button>
              
              <Button
                onClick={() => handlePayFastPayment('deposit')}
                className="w-full flex items-center justify-center gap-2"
                disabled={!acceptTerms}
              >
                <CreditCard className="h-5 w-5" />
                Pay Deposit with PayFast
              </Button>
            </div>
            
            <div className="mt-3">
              <Button
                onClick={() => handlePayFastPayment('full')}
                className="w-full flex items-center justify-center gap-2"
                disabled={!acceptTerms}
                variant="secondary"
              >
                <ArrowRight className="h-5 w-5" />
                Pay Full Amount with PayFast
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* PayFast Payment Gateway */}
      {paymentMethod === 'payfast' && paymentType && (
        <div className="mt-6 border border-primary/30 rounded-lg p-4 bg-primary/5 animate-fade-in">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            PayFast Online Payment
          </h4>
          
          <PaymentGateway
            bookingData={mockBookingData}
            paymentType={paymentType}
            onCancel={handleResetPayment}
          />
        </div>
      )}
      
      {/* Bank Details Section - Shows only when user has accepted terms and clicked the button */}
      {paymentMethod === 'eft' && showBankDetails && (
        <div className="mt-6 p-4 border border-primary/30 rounded-lg bg-primary/5 animate-fade-in">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <BanknoteIcon className="h-5 w-5 text-primary" />
            Bank Payment Details
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Bank:</strong> Capitec Business Bank</p>
            <p><strong>Account Name:</strong> Thys Gemaak SDC</p>
            <p><strong>Account Type:</strong> Transact Account</p>
            <p><strong>Account Number:</strong> 1051789869</p>
            <p><strong>Branch Code:</strong> 470010</p>
            <p><strong>Reference:</strong> Your surname and date of function</p>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Important:</p>
              <p>Please email proof of payment to wade@thysgemaak.com or WhatsApp to +27 60 461 3766</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={handleResetPayment}
              className="text-primary underline text-sm"
            >
              Choose another payment method
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
