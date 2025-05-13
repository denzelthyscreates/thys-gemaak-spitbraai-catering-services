
import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MenuContextType, MenuProviderProps } from './types';
import { useMenuState } from './useMenuState';
import { calculateTotalPrice, getCompleteMenuSelection } from './menuUtils';

// Create context
export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const menuState = useMenuState();
  const { toast } = useToast();
  
  const handleCalculateTotalPrice = (): number => {
    const state = {
      selectedMenu: menuState.selectedMenu,
      selectedStarters: menuState.selectedStarters,
      selectedSides: menuState.selectedSides,
      selectedDesserts: menuState.selectedDesserts,
      selectedExtras: menuState.selectedExtras,
      selectedSeason: menuState.selectedSeason,
      numGuests: menuState.numGuests,
      totalPrice: menuState.totalPrice,
      extraSaladType: menuState.extraSaladType,
      discountApplied: menuState.discountApplied,
      includeCutlery: menuState.includeCutlery,
      postalCode: menuState.postalCode,
      travelFee: menuState.travelFee
    };
    
    return calculateTotalPrice(state);
  };

  const handleReset = () => {
    menuState.setSelectedMenu(null);
    menuState.setSelectedStarters([]);
    menuState.setSelectedSides([]);
    menuState.setSelectedDesserts([]);
    menuState.setSelectedExtras([]);
    menuState.setSelectedSeason(null);
    menuState.setNumGuests(50);
    menuState.setExtraSaladType('');
    menuState.setIncludeCutlery(true);
    menuState.setPostalCode('');
    
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem('selectedStarters');
    localStorage.removeItem('selectedSides');
    localStorage.removeItem('selectedDesserts');
    localStorage.removeItem('selectedExtras');
    localStorage.removeItem('selectedSeason');
    localStorage.removeItem('numGuests');
    localStorage.removeItem('extraSaladType');
    localStorage.removeItem('includeCutlery');
    localStorage.removeItem('menuSelection');
    localStorage.removeItem('postalCode');
    
    toast({
      title: "Menu Builder Reset",
      description: "All selections have been cleared.",
      duration: 3000
    });
  };

  // Save complete menu selection to localStorage
  useEffect(() => {
    const state = {
      selectedMenu: menuState.selectedMenu,
      selectedStarters: menuState.selectedStarters,
      selectedSides: menuState.selectedSides,
      selectedDesserts: menuState.selectedDesserts,
      selectedExtras: menuState.selectedExtras,
      selectedSeason: menuState.selectedSeason,
      numGuests: menuState.numGuests,
      totalPrice: menuState.totalPrice,
      extraSaladType: menuState.extraSaladType,
      discountApplied: menuState.discountApplied,
      includeCutlery: menuState.includeCutlery,
      postalCode: menuState.postalCode,
      travelFee: menuState.travelFee
    };
    
    const completeSelection = getCompleteMenuSelection(state, menuState.totalPrice);
    
    if (completeSelection) {
      localStorage.setItem('menuSelection', JSON.stringify(completeSelection));
    } else {
      localStorage.removeItem('menuSelection');
    }
  }, [
    menuState.selectedMenu,
    menuState.selectedStarters,
    menuState.selectedSides,
    menuState.selectedDesserts,
    menuState.selectedExtras,
    menuState.selectedSeason,
    menuState.numGuests,
    menuState.extraSaladType,
    menuState.includeCutlery,
    menuState.totalPrice,
    menuState.postalCode,
    menuState.travelFee
  ]);

  return (
    <MenuContext.Provider value={{
      ...menuState,
      calculateTotalPrice: handleCalculateTotalPrice,
      handleReset
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
