
import React, { useState } from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import { getAreaNameByPostalCode } from '@/data/travelData';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import { MenuInclusions } from './summary/MenuInclusions';
import { LocationSection } from './summary/LocationSection';
import { PricingSection } from './summary/PricingSection';
import { MenuSelectionItem, MenuOptionDisplay } from './summary/MenuSelectionItem';
import { ValidationError, validateMenuSelection, ValidationErrors } from './summary/ValidationUtils';
import { constructRedirectUrl } from './summary/RedirectUtils';

interface MenuSummaryProps {
  menuOptions: MenuOption[];
  onNextStep?: () => void;
}

export const MenuSummary = ({ menuOptions, onNextStep }: MenuSummaryProps) => {
  const {
    selectedMenu,
    numGuests,
    selectedSeason,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    includeCutlery,
    totalPrice,
    discountApplied,
    postalCode,
    travelFee,
    eventType,
    setPostalCode
  } = useMenu();
  
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Systeme.io form URL
  const systemeBaseUrl = "https://systeme.io/dashboard/share?hash=5600969fb15ec54e919229bae54186976caf880&type=funnel";

  const renderValidationError = (field: string) => {
    if (showValidation && validationErrors[field]) {
      return <ValidationError message={validationErrors[field]} />;
    }
    return null;
  };

  const handleNextStep = () => {
    const errors = validateMenuSelection(
      selectedMenu,
      numGuests,
      selectedSeason,
      selectedStarters,
      selectedSides,
      selectedDesserts,
      postalCode,
      menuOptions
    );
    setValidationErrors(errors);
    setShowValidation(true);
    
    if (Object.keys(errors).length === 0) {
      // Direct redirect to Systeme.io with parameters
      if (onNextStep) {
        // Still fire the next step callback for legacy support
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
          systemeBaseUrl,
          {
            selectedMenu,
            numGuests,
            selectedSeason,
            selectedStarters,
            selectedSides,
            selectedDesserts,
            selectedExtras,
            extraSaladType,
            includeCutlery,
            totalPrice,
            postalCode,
            travelFee,
            eventType
          },
          menuOptions
        );
      }, 1500);
    } else {
      // Show toast with error message
      toast({
        variant: "destructive",
        title: "Please complete required fields",
        description: "Some required information is missing or incorrect.",
        duration: 4000
      });
      
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!selectedMenu) return null;

  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  const minGuests = selectedMenuOption?.minGuests || 30;
  const areaName = postalCode ? getAreaNameByPostalCode(postalCode) : '';

  return (
    <div className="rounded-lg border p-4 bg-muted/50 mt-8">
      <h3 className="text-lg font-medium mb-3">Your Menu Selection Summary</h3>
      <div className="space-y-2">
        {/* Menu Package */}
        <MenuSelectionItem 
          label="Package" 
          value={menuOptions.find(opt => opt.id === selectedMenu)?.name || ''} 
          id="menu"
          required={true}
          renderValidationError={renderValidationError}
        />

        {/* Guests */}
        <MenuSelectionItem 
          label="Guests" 
          value={<>{numGuests} <span className="text-sm text-muted-foreground">(Minimum: {minGuests})</span></>} 
          id="guests"
          required={true}
          renderValidationError={renderValidationError}
        />

        {/* Cutlery & Crockery */}
        <MenuSelectionItem 
          label="Cutlery & Crockery" 
          value={
            includeCutlery ? (
              <>
                <Check className="h-4 w-4 text-green-600 mr-1 inline" />
                <span>Included (R20 per person)</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-amber-600 mr-1 inline" />
                <span>Not included</span>
              </>
            )
          }
        />

        {/* Season */}
        {(selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)) && (
          <MenuSelectionItem 
            label="Season" 
            value={selectedSeason ? (selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1) + ' Menu') : 'Not selected'} 
            id="season"
            required={true}
            renderValidationError={renderValidationError}
          />
        )}

        {/* Starters */}
        {(selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && (
          <MenuSelectionItem 
            label="Starter" 
            value={<MenuOptionDisplay ids={selectedStarters} menuOptions={menuOptions} />} 
            id="starters"
            required={true}
            renderValidationError={renderValidationError}
          />
        )}

        {/* Sides */}
        <MenuSelectionItem 
          label="Sides" 
          value={<MenuOptionDisplay ids={selectedSides} menuOptions={menuOptions} />} 
          id="sides"
          required={true}
          renderValidationError={renderValidationError}
        />

        {/* Desserts */}
        {(selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && (
          <MenuSelectionItem 
            label="Dessert" 
            value={<MenuOptionDisplay ids={selectedDesserts} menuOptions={menuOptions} />} 
            id="desserts"
            required={true}
            renderValidationError={renderValidationError}
          />
        )}

        {/* Extras */}
        {selectedExtras.length > 0 && (
          <MenuSelectionItem 
            label="Extras" 
            value={<MenuOptionDisplay ids={selectedExtras} menuOptions={menuOptions} extraInfo={{id: 'extra_salad', type: extraSaladType}} />} 
          />
        )}

        {/* Menu Inclusions */}
        <MenuInclusions selectedMenu={selectedMenu} includeCutlery={includeCutlery} />

        {/* Travel Fee Section */}
        <LocationSection 
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          showValidation={showValidation}
          validationError={validationErrors.postalCode}
          renderValidationError={renderValidationError}
        />

        {/* Pricing */}
        <PricingSection 
          totalPrice={totalPrice}
          numGuests={numGuests}
          travelFee={travelFee}
          areaName={areaName}
          discountApplied={discountApplied}
        />
      </div>
      
      {/* Book button - now redirects directly to Systeme */}
      {selectedMenu && (
        <div className="mt-6">
          <div className="text-sm text-muted-foreground mb-2">
            <span className="text-xs text-red-500 mr-1">*</span>
            Required fields
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleNextStep}
              disabled={isRedirecting}
              className="gap-2"
            >
              {isRedirecting ? "Redirecting..." : "Continue to Booking Form"}
              {isRedirecting ? null : <ExternalLink className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
