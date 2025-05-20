
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ActionButtonsProps {
  isRedirecting: boolean;
  onRedirect: () => void;
  onNavigateTab?: (tabValue: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRedirecting,
  onRedirect,
  onNavigateTab
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
      
      <div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto mt-2"
          onClick={() => onNavigateTab && onNavigateTab('payment')}
          size="sm"
        >
          Skip to Payment Options
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
