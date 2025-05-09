
import React from 'react';
import { useMenu } from '@/contexts/MenuContext';
import { MenuOption } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, X } from 'lucide-react';

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
    discountApplied
  } = useMenu();

  const getMenuInclusions = () => {
    if (!selectedMenu) return [];
    const inclusions: string[] = [];
    
    if (includeCutlery) {
      inclusions.push('Cutlery & Crockery');
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

  if (!selectedMenu) return null;

  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  const minGuests = selectedMenuOption?.minGuests || 30;

  return (
    <div className="rounded-lg border p-4 bg-muted/50">
      <h3 className="text-lg font-medium mb-3">Your Menu Selection Summary</h3>
      <div className="space-y-2">
        {/* Menu Package */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Package:</span>
          <span className="col-span-2">
            {menuOptions.find(opt => opt.id === selectedMenu)?.name}
          </span>
        </div>

        {/* Guests */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Guests:</span>
          <span className="col-span-2">{numGuests} <span className="text-sm text-muted-foreground">(Minimum: {minGuests})</span></span>
        </div>

        {/* Cutlery & Crockery */}
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Cutlery & Crockery:</span>
          <span className="col-span-2 flex items-center">
            {includeCutlery ? (
              <>
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span>Included</span>
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
        {(selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)) && selectedSeason && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Season:</span>
            <span className="col-span-2">
              {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Menu
            </span>
          </div>
        )}

        {/* Starters */}
        {selectedStarters.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Starter:</span>
            <span className="col-span-2">
              {selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
            </span>
          </div>
        )}

        {/* Sides */}
        {selectedSides.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Sides:</span>
            <span className="col-span-2">
              {selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
            </span>
          </div>
        )}

        {/* Desserts */}
        {selectedDesserts.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium">Dessert:</span>
            <span className="col-span-2">
              {selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
            </span>
          </div>
        )}

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

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <span className="font-medium">Price per person:</span>
          <span className="col-span-2 font-semibold">R{totalPrice}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Total price:</span>
          <span className="col-span-2 font-semibold">R{totalPrice * numGuests}</span>
        </div>

        {discountApplied && (
          <div className="text-sm text-green-600 font-medium mt-1">
            10% Volume Discount Applied!
          </div>
        )}
      </div>
      
      {/* Next button */}
      {selectedMenu && (
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onNextStep}
            className="gap-2"
          >
            Continue to Booking Enquiry
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
