
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  
  React.useEffect(() => {
    // Show informational toast when the page loads
    toast({
      title: "Payment Cancelled",
      description: "Your payment process was cancelled.",
      variant: "default"
    });
    
    // Log cancellation for debugging
    console.log("Payment cancelled with params:", Object.fromEntries(queryParams.entries()));
  }, []);
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  const handleReturnToPayment = () => {
    navigate('/#contact');
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
            <XCircle className="h-8 w-8 text-amber-600" />
          </div>
          
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/t_Thumbnail/v1747774078/2025-05-20_TGS_full_round_gswynv.png" 
            alt="Thys Gemaak Spitbraai Logo" 
            className="h-20 mx-auto mb-4"
          />
          
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Payment Cancelled</h1>
          <p className="text-gray-600">
            Your payment process was cancelled. No payment has been processed.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              If you encountered any issues with the payment process or have any questions, please
              contact us at <a href="mailto:spitbookings@thysgemaak.com" className="underline">spitbookings@thysgemaak.com</a>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleReturnToPayment}
              className="flex-1"
              variant="outline"
              size="lg"
            >
              Try Payment Again
            </Button>
            
            <Button
              onClick={handleReturnHome}
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
