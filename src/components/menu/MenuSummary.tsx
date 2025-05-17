import React, { useState } from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAreaNameByPostalCode } from '@/data/travelData';
import { useToast } from '@/hooks/use-toast';

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Systeme.io form URL
  const systemeBaseUrl = "https://systeme.io/dashboard/share?hash=5600969fb15ec54e919229bae54186976caf880&type=funnel";

  const getMenuInclusions = () => {
    if (!selectedMenu) return [];
    const inclusions: string[] = [];
    
    if (includeCutlery) {
      inclusions.push('Cutlery & Crockery (R20/person)');
    }
    
    if (selectedMenu === 'menu1') {
      inclusions.push('All Equipment');
    } else if (selectedMenu === 'menu2' || selectedMenu === 'menu3') {
      inclusions.push('All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving');
    } else if (selectedMenu === 'business') {
      inclusions.push('All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving', 'Clearing');
    } else if (selectedMenu === 'wedding1') {
      inclusions.push('Jugs & Glasses', 'Juice + 1 Refill', 'All Equipment + Setup of Serving Table');
    } else if (selectedMenu === 'wedding2' || selectedMenu === 'standard' || selectedMenu === 'yearend') {
      inclusions.push('All Equipment');
    } else if (selectedMenu === 'matric_standard') {
      inclusions.push('All Equipment', 'Serving Staff');
    } else if (selectedMenu === 'matric_premium') {
      inclusions.push('All Equipment', 'Professional Serving Staff', 'Jugs & Glasses', 'Setup & Clearing');
    }
    
    return inclusions;
  };

  const validateMenuSelection = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedMenu) {
      errors.menu = "Please select a menu package";
    }
    
    const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
    
    if (selectedMenuOption) {
      const minGuests = selectedMenuOption.minGuests || 30;
      
      if (numGuests < minGuests) {
        errors.guests = `Minimum ${minGuests} guests required for this menu`;
      }
      
      // Check if season selection is required
      if ((selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)) && !selectedSeason) {
        errors.season = "Please select a season";
      }
      
      // Check if starters are required and selected
      if ((selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && selectedStarters.length === 0) {
        errors.starters = "Please select a starter";
      }
      
      // Sides are always required if available for selection
      if (selectedSides.length === 0) {
        errors.sides = "Please select required sides";
      }
      
      // Check if desserts are required and selected
      if ((selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && selectedDesserts.length === 0) {
        errors.desserts = "Please select a dessert";
      }
    }
    
    // Check if postal code is provided
    if (!postalCode) {
      errors.postalCode = "Please enter your postal code";
    } else {
      // Validate postal code format (basic validation)
      if (!/^\d{4}$/.test(postalCode)) {
        errors.postalCode = "Please enter a valid 4-digit South African postal code";
      } else if (!getAreaNameByPostalCode(postalCode) || getAreaNameByPostalCode(postalCode) === "Unknown area") {
        errors.postalCode = "We don't recognize this postal code. Please check it or contact us";
      }
    }
    
    return errors;
  };

  const constructRedirectUrl = () => {
    // Get the selected menu name
    const menuName = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
    
    // Construct starters, sides, desserts, and extras
    const starterNames = selectedStarters.map(id => 
      menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
    
    const sideNames = selectedSides.map(id => 
      menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
    
    const dessertNames = selectedDesserts.map(id => 
      menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
    
    const extraNames = selectedExtras.map(id => {
      if (id === 'extra_salad' && extraSaladType) {
        const saladName = menuOptions.find(opt => opt.id === extraSaladType)?.name;
        return `Extra Salad: ${saladName || 'Not specified'}`;
      }
      return menuOptions.find(opt => opt.id === id)?.name;
    }).join(', ');
    
    const areaName = getAreaNameByPostalCode(postalCode) || '';
    const finalTotalPrice = travelFee ? totalPrice * numGuests + travelFee : totalPrice * numGuests;
    
    // Build the parameters
    const params = new URLSearchParams({
      'menu_package': menuName,
      'guests': numGuests.toString(),
      'price_per_person': totalPrice.toString(),
      'total_price': finalTotalPrice.toString(),
      'event_type': eventType || '',
      'cutlery': includeCutlery ? 'Yes' : 'No'
    });
    
    // Add conditional parameters
    if (selectedSeason) params.append('season', selectedSeason);
    if (starterNames) params.append('starters', starterNames);
    if (sideNames) params.append('sides', sideNames);
    if (dessertNames) params.append('desserts', dessertNames);
    if (extraNames) params.append('extras', extraNames);
    if (postalCode) params.append('postal_code', postalCode);
    if (areaName) params.append('area', areaName);
    if (travelFee) params.append('travel_fee', travelFee.toString());
    
    // Create the final URL with parameters
    return `${systemeBaseUrl}&${params.toString()}`;
  };

  const handleNextStep = () => {
    const errors = validateMenuSelection();
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
        window.location.href = constructRedirectUrl();
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
  const finalTotalPrice = travelFee ? totalPrice * numGuests + travelFee : totalPrice * numGuests;

  const renderValidationError = (field: string) => {
    if (showValidation && validationErrors[field]) {
      return (
        <div className="text-destructive text-sm flex items-center gap-1 mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{validationErrors[field]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border p-4 bg-muted/50 mt-8">
      <h3 className="text-lg font-medium mb-3">Your Menu Selection Summary</h3>
      <div className="space-y-2">
        {/* Menu Package */}
        <div id="menu" className="grid grid-cols-3 gap-2">
          <span className="font-medium flex items-center gap-1">
            Package:
            <span className="text-xs text-red-500 ml-1">*</span>
          </span>
          <span className="col-span-2">
            {menuOptions.find(opt => opt.id === selectedMenu)?.name}
          </span>
        </div>
        {renderValidationError('menu')}

        {/* Guests */}
        <div id="guests" className="grid grid-cols-3 gap-2">
          <span className="font-medium flex items-center gap-1">
            Guests:
            <span className="text-xs text-red-500 ml-1">*</span>
          </span>
          <span className="col-span-2">{numGuests} <span className="text-sm text-muted-foreground">(Minimum: {minGuests})</span></span>
        </div>
        {renderValidationError('guests')}

        {/* Cutlery & Crockery */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Cutlery & Crockery:</span>
          <span className="col-span-2 flex items-center">
            {includeCutlery ? (
              <>
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span>Included (R20 per person)</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-amber-600 mr-1" />
                <span>Not included</span>
              </>
            )}
          </span>
        </div>

        {/* Season */}
        {(selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)) && (
          <div id="season" className="grid grid-cols-3 gap-2">
            <span className="font-medium flex items-center gap-1">
              Season:
              <span className="text-xs text-red-500 ml-1">*</span>
            </span>
            <span className="col-span-2">
              {selectedSeason ? (selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1) + ' Menu') : 'Not selected'}
            </span>
          </div>
        )}
        {renderValidationError('season')}

        {/* Starters */}
        {(selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && (
          <div id="starters" className="grid grid-cols-3 gap-2">
            <span className="font-medium flex items-center gap-1">
              Starter:
              <span className="text-xs text-red-500 ml-1">*</span>
            </span>
            <span className="col-span-2">
              {selectedStarters.length > 0 
                ? selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')
                : 'Not selected'}
            </span>
          </div>
        )}
        {renderValidationError('starters')}

        {/* Sides */}
        <div id="sides" className="grid grid-cols-3 gap-2">
          <span className="font-medium flex items-center gap-1">
            Sides:
            <span className="text-xs text-red-500 ml-1">*</span>
          </span>
          <span className="col-span-2">
            {selectedSides.length > 0 
              ? selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')
              : 'Not selected'}
          </span>
        </div>
        {renderValidationError('sides')}

        {/* Desserts */}
        {(selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') && (
          <div id="desserts" className="grid grid-cols-3 gap-2">
            <span className="font-medium flex items-center gap-1">
              Dessert:
              <span className="text-xs text-red-500 ml-1">*</span>
            </span>
            <span className="col-span-2">
              {selectedDesserts.length > 0 
                ? selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')
                : 'Not selected'}
            </span>
          </div>
        )}
        {renderValidationError('desserts')}

        {/* Extras */}
        {selectedExtras.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Extras:</span>
            <span className="col-span-2">
              {selectedExtras.map(id => {
                if (id === 'extra_salad' && extraSaladType) {
                  const saladName = menuOptions.find(opt => opt.id === extraSaladType)?.name;
                  return `Extra Salad: ${saladName || 'Not specified'}`;
                }
                return menuOptions.find(opt => opt.id === id)?.name;
              }).join(', ')}
            </span>
          </div>
        )}

        {/* Menu Inclusions */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Inclusions:</span>
          <span className="col-span-2">
            {getMenuInclusions().join(', ')}
          </span>
        </div>

        {/* Travel Fee Section */}
        <div id="postalCode" className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <span className="font-medium flex items-center gap-1">
              Postal Code:
              <span className="text-xs text-red-500 ml-1">*</span>
            </span>
            <div className="col-span-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={`pl-9 h-9 max-w-[12rem] ${showValidation && validationErrors.postalCode ? 'border-destructive focus:ring-destructive' : ''}`}
                />
              </div>
              {postalCode && areaName && (
                <p className="text-sm mt-1 text-muted-foreground">Area: {areaName}</p>
              )}
            </div>
          </div>
          {renderValidationError('postalCode')}
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <span className="font-medium">Price per person:</span>
          <span className="col-span-2 font-semibold">R{totalPrice}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Menu subtotal:</span>
          <span className="col-span-2">R{totalPrice * numGuests}</span>
        </div>

        {travelFee !== null && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Travel fee:</span>
            <span className="col-span-2">R{travelFee} <span className="text-sm text-muted-foreground">({areaName})</span></span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <span className="font-medium">Total price:</span>
          <span className="col-span-2 font-semibold">R{finalTotalPrice}</span>
        </div>

        {discountApplied && (
          <div className="text-sm text-green-600 font-medium mt-1">
            10% Volume Discount Applied!
          </div>
        )}
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
