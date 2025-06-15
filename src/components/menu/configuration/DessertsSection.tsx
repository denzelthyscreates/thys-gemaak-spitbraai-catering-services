
import React from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface DessertsSectionProps {
  menuOptions: MenuOption[];
  needsDesserts: boolean;
}

export const DessertsSection: React.FC<DessertsSectionProps> = ({ menuOptions, needsDesserts }) => {
  const { selectedDesserts, setSelectedDesserts } = useMenu();
  
  const dessertOptions = menuOptions
    .filter(option => option.category === 'dessert')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  if (!needsDesserts || dessertOptions.length === 0) return null;
  
  const handleSelectDessert = (id: string) => {
    // Desserts are typically a single choice, so replace current selection
    setSelectedDesserts([id]);
  };

  return (
    <AccordionItem value="desserts" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Select Your Dessert</span>
          <span className="text-xs text-red-500">*</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {dessertOptions.map((dessert) => (
            <Card 
              key={dessert.id}
              className={`cursor-pointer transition ${
                selectedDesserts.includes(dessert.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectDessert(dessert.id)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{dessert.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {dessert.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
