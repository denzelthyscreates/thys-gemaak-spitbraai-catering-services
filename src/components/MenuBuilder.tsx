
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuProvider, useMenu } from '@/contexts/menu';
import { MenuPackages } from './menu/MenuPackages';
import { MenuConfiguration } from './menu/MenuConfiguration';
import { MenuSummary } from './menu/MenuSummary';
import { EventTypeSelector } from './menu/EventTypeSelector';
import { MenuOption, MenuBuilderProps } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';
import { menuOptions } from '@/data/menuData';
import { getTravelFee, getAreaNameByPostalCode } from '@/data/travelData';

const MenuBuilderContent = ({ onSelectionChange, menuOptions, onNavigateTab }: { 
  onSelectionChange: (selection: any) => void,
  menuOptions: MenuOption[],
  onNavigateTab?: (tab: string) => void
}) => {
  const { 
    selectedMenu, 
    selectedStarters, 
    selectedSides, 
    selectedDesserts, 
    selectedExtras,
    selectedSeason,
    numGuests,
    totalPrice,
    extraSaladType,
    eventType,
    includeCutlery,
    postalCode,
    handleReset 
  } = useMenu();
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedMenu) {
      const menuPackage = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
      
      const starterNames = selectedStarters.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const sideNames = selectedSides.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const dessertNames = selectedDesserts.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const extraNames = selectedExtras.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      // Calculate travel fee and area name from postal code
      const travelFee = postalCode ? getTravelFee(postalCode) : null;
      const areaName = postalCode ? getAreaNameByPostalCode(postalCode) : '';
      
      const completeSelection = {
        menuPackage,
        numberOfGuests: numGuests,
        season: selectedSeason,
        starters: starterNames,
        sides: sideNames,
        desserts: dessertNames,
        extras: extraNames,
        extraSaladType,
        eventType,
        includeCutlery,
        totalPrice,
        postalCode,
        travelFee,
        areaName,
        discountApplied: numGuests >= 100
      };
      
      onSelectionChange(completeSelection);
    } else {
      onSelectionChange(null);
    }
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, 
     selectedSeason, numGuests, extraSaladType, totalPrice, eventType, includeCutlery, postalCode]);
  
  const resetMenu = () => {
    handleReset();
    onSelectionChange(null);
    toast({
      title: "Menu Reset",
      description: "Your menu selections have been cleared.",
      duration: 3000
    });
  };
  
  // This function now only serves to pass the navigation intent to MenuSummary
  // The actual navigation is now handled directly in MenuSummary via external redirect
  const handleNextStep = () => {
    if (onNavigateTab) {
      onNavigateTab('book');
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={resetMenu}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Menu Selections
        </Button>
      </div>

      <div className="space-y-8">
        {/* Step 1: Event Type Selector - Always visible */}
        <div className={`${eventType ? 'opacity-75' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              eventType ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
            }`}>
              {eventType ? '✓' : '1'}
            </span>
            <h3 className="text-xl font-semibold">What type of event are you planning?</h3>
          </div>
          <EventTypeSelector />
        </div>

        {/* Step 2: Menu Packages - Show when event type is selected */}
        {eventType && (
          <div className={`${selectedMenu ? 'opacity-75' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedMenu ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
              }`}>
                {selectedMenu ? '✓' : '2'}
              </span>
              <h3 className="text-xl font-semibold">Choose Your Menu Package</h3>
            </div>
            <MenuPackages menuOptions={menuOptions} />
          </div>
        )}

        {/* Step 3: Menu Configuration - Show when menu package is selected */}
        {eventType && selectedMenu && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground">
                3
              </span>
              <h3 className="text-xl font-semibold">Configure Your Menu</h3>
            </div>
            <MenuConfiguration menuOptions={menuOptions} />
          </div>
        )}

        {/* Menu Summary - Always at the bottom when menu is selected */}
        {selectedMenu && (
          <MenuSummary menuOptions={menuOptions} onNextStep={handleNextStep} />
        )}
      </div>
    </div>
  );
};

const MenuBuilder = ({ onSelectionChange, initialSelection, onNavigateTab }: MenuBuilderProps & { onNavigateTab?: (tab: string) => void }) => {
  useEffect(() => {
    if (initialSelection) {
      console.log("Using initial selection in MenuBuilder:", initialSelection);
    }
  }, [initialSelection]);

  return (
    <MenuProvider>
      <MenuBuilderContent 
        onSelectionChange={onSelectionChange} 
        menuOptions={menuOptions}
        onNavigateTab={onNavigateTab}
      />
    </MenuProvider>
  );
};

export default MenuBuilder;
