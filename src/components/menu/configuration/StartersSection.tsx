
import React from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface StartersSectionProps {
  menuOptions: MenuOption[];
  needsStarters: boolean;
}

export const StartersSection: React.FC<StartersSectionProps> = ({ menuOptions, needsStarters }) => {
  const { selectedStarters, setSelectedStarters } = useMenu();
  
  const starterOptions = menuOptions
    .filter(option => option.category === 'starter')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  if (!needsStarters || starterOptions.length === 0) return null;
  
  const handleSelectStarter = (id: string) => {
    // Starters are typically a single choice, so replace current selection
    setSelectedStarters([id]);
  };

  return (
    <AccordionItem value="starters" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Select Your Starter</span>
          <span className="text-xs text-red-500">*</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {starterOptions.map((starter) => (
            <Card 
              key={starter.id}
              className={`cursor-pointer transition ${
                selectedStarters.includes(starter.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectStarter(starter.id)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{starter.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {starter.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
