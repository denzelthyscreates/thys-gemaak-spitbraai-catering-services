
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingRedirectProps {
  isValid: boolean;
  redirectUrl: string;
  menuState: any;
  validationErrors: any;
  menuOptions: any[];
  scrollToFirstError: () => void;
  onNextStep?: () => void;
  performValidationCheck: () => boolean;
}

export const BookingRedirect: React.FC<BookingRedirectProps> = ({
  isValid,
  onNextStep,
  performValidationCheck
}) => {
  const handleContinueToBooking = () => {
    console.log('Continue to Booking clicked');
    const validationPassed = performValidationCheck();
    
    if (validationPassed && onNextStep) {
      console.log('Validation passed, calling onNextStep');
      onNextStep();
    } else {
      console.log('Validation failed or no onNextStep function');
    }
  };

  return (
    <div className="mt-6">
      {!isValid && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete all required fields before continuing.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleContinueToBooking}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        Continue to Booking
      </Button>
    </div>
  );
};
