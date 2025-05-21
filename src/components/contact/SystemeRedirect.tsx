
import React, { useState } from 'react';
import { toast } from 'sonner';
import MenuSelectionSummary from './systeme/MenuSelectionSummary';
import InfoBox from './systeme/InfoBox';
import ActionButtons from './systeme/ActionButtons';
import ThankYouPage from './systeme/ThankYouPage';
import { generateRedirectUrl, MenuSelectionType } from './systeme/redirectUtils';
import { getSystemeFormHtml } from './systeme/SystemeFormTemplate';

interface SystemeRedirectProps {
  menuSelection: MenuSelectionType | null;
  onNavigateTab?: (tabValue: string) => void;
}

const SystemeRedirect: React.FC<SystemeRedirectProps> = ({ 
  menuSelection, 
  onNavigateTab 
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Updated with the correct Systeme.io form URL
  const systemeBaseUrl = "https://spitbraai-thysgemaak.systeme.io/bookingform";
  
  // Sample HTML for the Systeme.io form - stored in a separate file now
  const systemeFormHtml = getSystemeFormHtml();

  const handleRedirect = () => {
    // Show toast notification
    toast.success("Redirecting to booking form", {
      description: "You'll be taken to our booking form with your menu details"
    });

    setIsRedirecting(true);
    
    // Short delay for the toast to be visible before redirect
    setTimeout(() => {
      // Open in a new tab
      window.open(generateRedirectUrl(menuSelection, systemeBaseUrl), '_blank');
      setIsRedirecting(false);
    }, 1000);
  };

  const handleShowThankYou = () => {
    setShowThankYou(true);
  };

  const handleReturnFromThankYou = () => {
    setShowThankYou(false);
  };

  if (showThankYou) {
    return <ThankYouPage onReturnHome={handleReturnFromThankYou} />;
  }

  return (
    <div className="systeme-redirect-wrapper">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Complete Your Booking on Systeme.io</h3>
        
        <div className="flex justify-center mb-4">
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773661/2025-05-20_TGS_full_round_xtddvs.png" 
            alt="Thys Gemaak Spitbraai Catering Services Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <p className="text-muted-foreground mb-6">
          You've successfully built your menu. The next step is to complete your booking on our Systeme.io form.
          All your menu selections will be transferred automatically.
        </p>
        
        <MenuSelectionSummary menuSelection={menuSelection} />
        
        <div className="space-y-4">
          <InfoBox />
          
          <ActionButtons 
            isRedirecting={isRedirecting}
            onRedirect={handleRedirect}
            onNavigateTab={onNavigateTab}
            onShowThankYou={handleShowThankYou}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemeRedirect;
