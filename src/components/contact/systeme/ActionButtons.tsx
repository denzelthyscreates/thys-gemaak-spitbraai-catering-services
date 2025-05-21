
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ActionButtonsProps {
  isRedirecting: boolean;
  onRedirect: () => void;
  onNavigateTab?: (tabValue: string) => void;
  onShowThankYou?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRedirecting,
  onRedirect,
  onNavigateTab,
  onShowThankYou
}) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onRedirect}
        disabled={isRedirecting}
        className="w-full sm:w-auto"
        size="lg"
      >
        {isRedirecting ? (
          "Redirecting..."
        ) : (
          <>
            Continue to Booking Form
            <ExternalLink className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => onNavigateTab && onNavigateTab('payment')}
          size="sm"
        >
          Skip to Payment Options
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
        
        {onShowThankYou && (
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={onShowThankYou}
            size="sm"
          >
            View Thank You Page
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
