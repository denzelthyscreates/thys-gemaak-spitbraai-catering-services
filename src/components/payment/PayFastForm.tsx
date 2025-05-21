
import React, { FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PayFastFormProps {
  formData: Record<string, string>;
  paymentUrl: string;
  buttonText?: string;
  isLoading?: boolean;
}

export const PayFastForm: React.FC<PayFastFormProps> = ({
  formData,
  paymentUrl,
  buttonText = "Proceed to Payment",
  isLoading = false
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  
  return (
    <div className="payfast-form-container">
      {/* Warning message for sandbox environment */}
      {paymentUrl.includes('sandbox') && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-800">
            You are using the PayFast sandbox environment. No real payments will be processed.
          </p>
        </div>
      )}
      
      <form ref={formRef} action={paymentUrl} method="post" onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden form fields */}
        {Object.entries(formData).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : buttonText}
        </Button>
      </form>
    </div>
  );
};

export default PayFastForm;
