
import React, { useState } from 'react';
import { toast } from 'sonner';
import MenuSelectionSummary from './systeme/MenuSelectionSummary';
import InfoBox from './systeme/InfoBox';
import ThankYouPage from './systeme/ThankYouPage';
import { MenuSelectionType } from './systeme/redirectUtils';

interface SystemeRedirectProps {
  menuSelection: MenuSelectionType | null;
  onNavigateTab?: (tabValue: string) => void;
}

const SystemeRedirect: React.FC<SystemeRedirectProps> = ({ 
  menuSelection, 
  onNavigateTab 
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Updated with the correct Systeme.io form URL for embedding
  const systemeEmbedUrl = "https://spitbraai-thysgemaak.systeme.io/bookingform";

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
        <h3 className="text-xl font-semibold mb-4">Complete Your Booking</h3>
        
        <div className="flex justify-center mb-4">
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773661/2025-05-20_TGS_full_round_xtddvs.png" 
            alt="Thys Gemaak Spitbraai Catering Services Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <p className="text-muted-foreground mb-6">
          Please fill out the booking form below with your details. Your menu selection is summarized above for reference.
        </p>
        
        <MenuSelectionSummary menuSelection={menuSelection} />
        
        <div className="space-y-4">
          <InfoBox />
          
          {/* Embedded Systeme.io Form */}
          <div className="mt-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <iframe
                src={systemeEmbedUrl}
                width="100%"
                height="800"
                frameBorder="0"
                scrolling="yes"
                className="w-full min-h-[800px]"
                title="Booking Form"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Alternative actions */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-6">
            <button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors"
              onClick={() => onNavigateTab && onNavigateTab('payment')}
            >
              View Payment Options
            </button>
            
            <button 
              className="bg-outline border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors"
              onClick={handleShowThankYou}
            >
              View Thank You Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemeRedirect;
