
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  menuSelection: any;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, menuSelection }) => {
  return (
    <div className="space-y-4">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !menuSelection}
        size="lg"
      >
        {isSubmitting ? "Submitting..." : "Submit Booking Form"}
      </Button>
      
      {!menuSelection && (
        <p className="text-sm text-muted-foreground text-center">
          Please select a menu package before submitting your booking.
        </p>
      )}
    </div>
  );
};

export default SubmitButton;
