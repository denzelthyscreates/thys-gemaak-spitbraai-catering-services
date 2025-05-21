
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    // Show success toast when the page loads
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
      variant: "default"
    });
    
    // Record payment success in analytics (if implemented)
    console.log("Payment success with params:", Object.fromEntries(queryParams.entries()));
  }, []);
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-green-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/t_Thumbnail/v1747774078/2025-05-20_TGS_full_round_gswynv.png" 
            alt="Thys Gemaak Spitbraai Logo" 
            className="h-20 mx-auto mb-4"
          />
          
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Payment Successful</h1>
          <p className="text-gray-600">
            Thank you for your payment. We have received your payment successfully.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
            <li>You will receive a payment confirmation email</li>
            <li>Our team will update your booking status</li>
            <li>We'll be in touch to discuss the details of your event</li>
            <li>Your booking is now confirmed and secured</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Button
            onClick={handleReturnHome}
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
