
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toast } from 'sonner';
import { getCompleteMenuSelection } from '@/contexts/menu/menuUtils';

interface SystemeRedirectProps {
  menuSelection: any;
  onNavigateTab?: (tabValue: string) => void;
}

const SystemeRedirect: React.FC<SystemeRedirectProps> = ({ 
  menuSelection, 
  onNavigateTab 
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Base URL for your Systeme.io form
  const systemeBaseUrl = "https://your-systeme-io-form-url.systeme.io";

  const generateRedirectUrl = () => {
    if (!menuSelection) return systemeBaseUrl;

    // Create an object with all the parameters we want to send
    const params = new URLSearchParams();

    // Add menu selection data to URL parameters
    params.append('menuPackage', menuSelection.menuPackage || '');
    params.append('numberOfGuests', String(menuSelection.numberOfGuests || 0));
    
    if (menuSelection.season) {
      params.append('season', menuSelection.season);
    }
    
    if (menuSelection.starters) {
      params.append('starters', menuSelection.starters);
    }
    
    if (menuSelection.sides) {
      params.append('sides', menuSelection.sides);
    }
    
    if (menuSelection.desserts) {
      params.append('desserts', menuSelection.desserts);
    }
    
    if (menuSelection.extras) {
      params.append('extras', menuSelection.extras);
    }
    
    params.append('totalPrice', String(menuSelection.totalPrice || 0));
    
    if (menuSelection.postalCode) {
      params.append('postalCode', menuSelection.postalCode);
    }
    
    if (menuSelection.areaName) {
      params.append('areaName', menuSelection.areaName);
    }
    
    if (menuSelection.travelFee !== null) {
      params.append('travelFee', String(menuSelection.travelFee));
    }

    // Format and join all parameters
    return `${systemeBaseUrl}?${params.toString()}`;
  };

  const handleRedirect = () => {
    // Show toast notification
    toast.success("Redirecting to booking form", {
      description: "You'll be taken to our booking form with your menu details"
    });

    setIsRedirecting(true);
    
    // Short delay for the toast to be visible before redirect
    setTimeout(() => {
      // Open in a new tab
      window.open(generateRedirectUrl(), '_blank');
      setIsRedirecting(false);
    }, 1000);
  };

  return (
    <div className="systeme-redirect-wrapper">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Complete Your Booking on Systeme.io</h3>
        
        <p className="text-muted-foreground mb-6">
          You've successfully built your menu. The next step is to complete your booking on our Systeme.io form.
          All your menu selections will be transferred automatically.
        </p>
        
        {menuSelection && (
          <div className="menu-selection-summary mb-6 bg-card p-4 rounded-md border">
            <h4 className="font-semibold mb-2">Your Menu Selection</h4>
            <div className="grid gap-1 text-sm">
              <div><strong>Menu Package:</strong> {menuSelection.menuPackage}</div>
              <div><strong>Number of Guests:</strong> {menuSelection.numberOfGuests}</div>
              {menuSelection.season && <div><strong>Season:</strong> {menuSelection.season}</div>}
              {menuSelection.starters && <div><strong>Starters:</strong> {menuSelection.starters}</div>}
              {menuSelection.sides && <div><strong>Sides:</strong> {menuSelection.sides}</div>}
              {menuSelection.desserts && <div><strong>Desserts:</strong> {menuSelection.desserts}</div>}
              {menuSelection.extras && <div><strong>Extras:</strong> {menuSelection.extras}</div>}
              <div className="mt-1"><strong>Price per person:</strong> R{menuSelection.totalPrice}</div>
              <div><strong>Total price:</strong> R{menuSelection.totalPrice * menuSelection.numberOfGuests} 
                {menuSelection.travelFee ? ` + R${menuSelection.travelFee} travel fee` : ''}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm">
            <p className="font-medium text-amber-800">What happens next?</p>
            <ol className="list-decimal list-inside mt-2 ml-2 space-y-1 text-amber-700">
              <li>You'll be redirected to our Systeme.io booking form</li>
              <li>Complete the required contact and event details</li>
              <li>Submit your booking request</li>
              <li>We'll confirm your booking via email within 24-48 hours</li>
              <li>You'll receive payment instructions for securing your date</li>
            </ol>
          </div>
          
          <Button
            onClick={handleRedirect}
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
      </div>
    </div>
  );
};

export default SystemeRedirect;
