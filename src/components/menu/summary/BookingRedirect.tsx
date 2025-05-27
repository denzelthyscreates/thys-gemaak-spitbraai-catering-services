
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ValidationErrors } from './ValidationUtils';
import { MenuOption } from '@/types/menu';

interface BookingRedirectProps {
  isValid: boolean;
  redirectUrl: string;
  menuState: {
    selectedMenu: string | null;
    numGuests: number;
    selectedSeason: 'summer' | 'winter' | null;
    selectedStarters: string[];
    selectedSides: string[];
    selectedDesserts: string[];
    selectedExtras: string[];
    extraSaladType: string;
    includeCutlery: boolean;
    totalPrice: number;
    postalCode: string;
    travelFee: number | null;
    eventType: string | null;
  };
  validationErrors: ValidationErrors;
  menuOptions: MenuOption[];
  scrollToFirstError: () => void;
  onNextStep?: () => void;
  performValidationCheck: () => boolean;
}

export const BookingRedirect = ({
  isValid,
  redirectUrl,
  menuState,
  validationErrors,
  menuOptions,
  scrollToFirstError,
  onNextStep,
  performValidationCheck,
}: BookingRedirectProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleContinueToBooking = () => {
    // Perform validation check when button is clicked
    const validationPassed = performValidationCheck();
    
    if (!validationPassed) {
      toast({
        variant: "destructive",
        title: "Please complete required fields",
        description: "Some required information is missing or incorrect.",
        duration: 4000
      });
      
      scrollToFirstError();
      return;
    }
    
    setIsProcessing(true);
    
    // Show success toast
    toast({
      title: "Menu selection complete!",
      description: "Proceeding to booking form...",
      duration: 2000
    });
    
    // Navigate to booking tab
    setTimeout(() => {
      if (onNextStep) {
        onNextStep();
      }
      setIsProcessing(false);
    }, 1000);
  };

  const totalAmount = menuState.travelFee 
    ? (menuState.totalPrice * menuState.numGuests) + menuState.travelFee
    : menuState.totalPrice * menuState.numGuests;

  return (
    <div className="mt-6 space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <span className="text-xs text-red-500 mr-1">*</span>
        Required fields
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-primary">Ready to book?</h4>
            <p className="text-sm text-muted-foreground">
              Total: R{totalAmount} for {menuState.numGuests} guests
            </p>
          </div>
          <Button 
            onClick={handleContinueToBooking}
            disabled={isProcessing}
            className="gap-2"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Continue to Booking"}
            {!isProcessing && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
