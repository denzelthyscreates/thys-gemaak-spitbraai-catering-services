
import React from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ExtrasSectionProps {
  menuOptions: MenuOption[];
}

export const ExtrasSection: React.FC<ExtrasSectionProps> = ({ menuOptions }) => {
  const { 
    selectedExtras, 
    extraSaladType,
    setSelectedExtras,
    setExtraSaladType
  } = useMenu();
  
  const extraOptions = menuOptions
    .filter(option => option.category === 'extra')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const saladOptions = menuOptions
    .filter(option => option.category === 'side' && option.name.toLowerCase().includes('salad'))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  if (extraOptions.length === 0) return null;
  
  const handleSelectExtra = (id: string) => {
    const isSelected = selectedExtras.includes(id);
    
    if (isSelected) {
      // If already selected, remove it
      setSelectedExtras(selectedExtras.filter(extraId => extraId !== id));
      
      // If removing extra_salad, also clear the salad type
      if (id === 'extra_salad') {
        setExtraSaladType('');
      }
    } else {
      // If not selected, add it
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  return (
    <AccordionItem value="extras" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <span className="text-base font-medium">Optional Extras</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {extraOptions.map((extra) => (
            <Card 
              key={extra.id}
              className={`cursor-pointer transition ${
                selectedExtras.includes(extra.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectExtra(extra.id)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{extra.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {extra.description}
                </div>
                <div className="text-sm font-medium mt-2">
                  {extra.id === 'cheese_table' || extra.id === 'fruit_table' 
                    ? `R${extra.price}` 
                    : `R${extra.price} per person`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Extra Salad Type Selection */}
        {selectedExtras.includes('extra_salad') && (
          <div className="mt-6">
            <Label htmlFor="extra-salad-type" className="mb-2 block">
              Select your extra salad type:
            </Label>
            <Select 
              value={extraSaladType || ""} 
              onValueChange={setExtraSaladType}
            >
              <SelectTrigger id="extra-salad-type" className="w-full max-w-xs">
                <SelectValue placeholder="Select a salad type" />
              </SelectTrigger>
              <SelectContent>
                {saladOptions.map((salad) => (
                  <SelectItem key={salad.id} value={salad.id}>
                    {salad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
