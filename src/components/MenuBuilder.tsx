
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuProvider, useMenu } from '@/contexts/menu';
import { MenuPackages } from './menu/MenuPackages';
import { MenuConfiguration } from './menu/MenuConfiguration';
import { MenuSummary } from './menu/MenuSummary';
import { MenuOption, MenuBuilderProps } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';
import { menuOptions } from '@/data/menuData';

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
      
      const completeSelection = {
        menuPackage,
        numberOfGuests: numGuests,
        season: selectedSeason,
        starters: starterNames,
        sides: sideNames,
        desserts: dessertNames,
        extras: extraNames,
        extraSaladType,
        totalPrice
      };
      
      onSelectionChange(completeSelection);
    } else {
      onSelectionChange(null);
    }
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests, extraSaladType, totalPrice]);
  
  const resetMenu = () => {
    handleReset();
    onSelectionChange(null);
    toast({
      title: "Menu Reset",
      description: "Your menu selections have been cleared.",
      duration: 3000
    });
  };
  
  const handleNextStep = () => {
    // Use the callback from parent to change tabs
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

      <h3 className="text-xl font-semibold mb-4">Step 1: Choose Your Menu Package</h3>
      <MenuPackages menuOptions={menuOptions} />

      {selectedMenu && (
        <>
          <h3 className="text-xl font-semibold mt-8 mb-4">Step 2: Configure Your Menu</h3>
          <MenuConfiguration menuOptions={menuOptions} />
        </>
      )}

      <MenuSummary menuOptions={menuOptions} onNextStep={handleNextStep} />
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
