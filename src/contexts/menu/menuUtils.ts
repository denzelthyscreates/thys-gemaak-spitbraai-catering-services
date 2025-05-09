
import { MenuOption } from '@/types/menu';
import { MenuContextState } from './types';
import { menuOptions } from '@/data/menuData';

export const calculateTotalPrice = (state: MenuContextState): number => {
  const { 
    selectedMenu, 
    includeCutlery, 
    selectedExtras, 
    numGuests 
  } = state;
  
  if (!selectedMenu) return 0;
  
  const menuOption = menuOptions.find(opt => opt.id === selectedMenu);
  if (!menuOption) return 0;
  
  // Base price based on whether cutlery is included or not
  let basePrice = includeCutlery ? menuOption.price : (menuOption.withoutCutlery || menuOption.price - 20);
  
  const extrasPrice = selectedExtras.reduce((total, extraId) => {
    const extra = menuOptions.find(opt => opt.id === extraId);
    if (!extra) return total;
    if (extra.id === 'chicken_thigh' || extra.id === 'extra_salad') {
      return total + extra.price;
    } else {
      return total + (numGuests > 0 ? Math.round(extra.price / numGuests) : extra.price);
    }
  }, 0);
  
  let finalPrice = basePrice + extrasPrice;
  
  if (numGuests >= 100) {
    finalPrice = Math.round(finalPrice * 0.9);
  }
  
  return finalPrice;
};

export const getCompleteMenuSelection = (state: MenuContextState, totalPrice: number) => {
  const { 
    selectedMenu,
    numGuests,
    selectedSeason,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    includeCutlery
  } = state;

  if (!selectedMenu) return null;

  const menuPackage = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
  
  const starterNames = selectedStarters.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const sideNames = selectedSides.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const dessertNames = selectedDesserts.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const extraNames = selectedExtras.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  return {
    menuPackage,
    numberOfGuests: numGuests,
    season: selectedSeason,
    starters: starterNames,
    sides: sideNames,
    desserts: dessertNames,
    extras: extraNames,
    extraSaladType,
    includeCutlery,
    totalPrice,
    discountApplied: numGuests >= 100
  };
};
