
import React from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidesSectionProps {
  menuOptions: MenuOption[];
}

export const SidesSection: React.FC<SidesSectionProps> = ({ menuOptions }) => {
  const { selectedSides, setSelectedSides } = useMenu();
  
  const sideOptions = menuOptions
    .filter(option => option.category === 'side')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  if (sideOptions.length === 0) return null;
  
  const handleSelectSide = (id: string) => {
    const isSelected = selectedSides.includes(id);
    
    if (isSelected) {
      // If already selected, remove it
      setSelectedSides(selectedSides.filter(sideId => sideId !== id));
    } else {
      // If not selected and we have less than 2 sides, add it
      if (selectedSides.length < 2) {
        setSelectedSides([...selectedSides, id]);
      }
    }
  };

  return (
    <AccordionItem value="sides" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Select Your Sides</span>
          <span className="text-xs text-red-500">*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Please select 2 sides</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <p className="text-sm text-muted-foreground mb-4">Please select 2 sides</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sideOptions.map((side) => (
            <Card 
              key={side.id}
              className={`cursor-pointer transition ${
                selectedSides.includes(side.id) 
                  ? 'border-primary bg-primary/5' 
                  : selectedSides.length >= 2 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-primary/50'
              }`}
              onClick={() => selectedSides.length < 2 || selectedSides.includes(side.id) 
                ? handleSelectSide(side.id) 
                : null}
            >
              <CardContent className="p-4">
                <div className="font-medium">{side.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {side.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
