
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { constructRedirectUrl } from './RedirectUtils';
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
}

export const BookingRedirect = ({
  isValid,
  redirectUrl,
  menuState,
  validationErrors,
  menuOptions,
  scrollToFirstError,
  onNextStep,
}: BookingRedirectProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();

  const handleRedirect = () => {
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Please complete required fields",
        description: "Some required information is missing or incorrect.",
        duration: 4000
      });
      
      scrollToFirstError();
      return;
    }
    
    // Still fire the next step callback for legacy support
    if (onNextStep) {
      onNextStep();
    }
    
    // Show redirect toast and redirect
    setIsRedirecting(true);
    toast({
      title: "Redirecting to booking form",
      description: "You'll be redirected to our booking form in a moment...",
      duration: 2000
    });
    
    // Short delay before redirect to allow the toast to show
    setTimeout(() => {
      window.location.href = constructRedirectUrl(
        redirectUrl,
        menuState,
        menuOptions
      );
    }, 1500);
  };

  return (
    <div className="mt-6">
      <div className="text-sm text-muted-foreground mb-2">
        <span className="text-xs text-red-500 mr-1">*</span>
        Required fields
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={handleRedirect}
          disabled={isRedirecting}
          className="gap-2"
        >
          {isRedirecting ? "Redirecting..." : "Continue to Booking Form"}
          {isRedirecting ? null : <ExternalLink className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
