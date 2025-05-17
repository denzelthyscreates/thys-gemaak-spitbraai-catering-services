
import React from 'react';

interface MenuInclusionsProps {
  selectedMenu: string | null;
  includeCutlery: boolean;
}

export const MenuInclusions = ({ selectedMenu, includeCutlery }: MenuInclusionsProps) => {
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

  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="font-medium">Inclusions:</span>
      <span className="col-span-2">
        {getMenuInclusions().join(', ')}
      </span>
    </div>
  );
};
