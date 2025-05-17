
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getAreaNameByPostalCode } from '@/data/travelData';
import { MenuOption } from '@/types/menu';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateMenuSelection = (
  selectedMenu: string | null,
  numGuests: number,
  selectedSeason: string | null,
  selectedStarters: string[],
  selectedSides: string[],
  selectedDesserts: string[],
  postalCode: string,
  menuOptions: MenuOption[]
) => {
  const errors: ValidationErrors = {};
  
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

export const ValidationError = ({ message }: { message: string }) => {
  return (
    <div className="text-destructive text-sm flex items-center gap-1 mt-1">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
