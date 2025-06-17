
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  menuSelection: any;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, menuSelection }) => {
  const handleClick = (e: React.MouseEvent) => {
    console.log("=== SUBMIT BUTTON CLICKED ===");
    console.log("Button state - isSubmitting:", isSubmitting);
    console.log("Menu selection available:", !!menuSelection);
    console.log("Menu selection details:", menuSelection);
    console.log("Event type:", e.type);
    console.log("Event target:", e.target);
    
    if (!menuSelection) {
      console.error("ERROR: Submit clicked but no menu selection available");
      e.preventDefault();
      return;
    }
    
    console.log("Submit button click - proceeding to form submission");
  };

  return (
    <div className="space-y-4">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !menuSelection}
        size="lg"
        onClick={handleClick}
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
