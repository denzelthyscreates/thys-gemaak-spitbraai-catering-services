
import React, { useState } from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import {
  Accordion,
} from '@/components/ui/accordion';
import { GuestCountSection } from './configuration/GuestCountSection';
import { SeasonSelectionSection } from './configuration/SeasonSelectionSection';
import { StartersSection } from './configuration/StartersSection';
import { SidesSection } from './configuration/SidesSection';
import { DessertsSection } from './configuration/DessertsSection';
import { ExtrasSection } from './configuration/ExtrasSection';

interface MenuConfigurationProps {
  menuOptions: MenuOption[];
}

export const MenuConfiguration: React.FC<MenuConfigurationProps> = ({ menuOptions }) => {
  const { selectedMenu, eventType } = useMenu();
  const [accordionValue, setAccordionValue] = useState<string[]>(['guest-count']);
  
  if (!selectedMenu) return null;
  
  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  
  // Updated logic for season selection - include all wedding event types
  const needsSeason = (
    selectedMenu === 'wedding1' || 
    selectedMenu === 'wedding2' ||
    eventType === 'wedding' ||
    (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)
  );
  
  const needsStarters = selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium';
  const needsDesserts = selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium';

  return (
    <div className="space-y-6">
      <Accordion 
        type="multiple" 
        value={accordionValue} 
        onValueChange={setAccordionValue}
        className="space-y-4"
      >
        <GuestCountSection menuOptions={menuOptions} />
        <SeasonSelectionSection needsSeason={needsSeason} />
        <StartersSection menuOptions={menuOptions} needsStarters={needsStarters} />
        <SidesSection menuOptions={menuOptions} />
        <DessertsSection menuOptions={menuOptions} needsDesserts={needsDesserts} />
        <ExtrasSection menuOptions={menuOptions} />
      </Accordion>
    </div>
  );
};
