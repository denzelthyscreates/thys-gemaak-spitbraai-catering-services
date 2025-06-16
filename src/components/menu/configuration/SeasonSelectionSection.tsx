
import React from 'react';
import { useMenu } from '@/contexts/menu';
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

interface SeasonSelectionSectionProps {
  needsSeason: boolean;
}

export const SeasonSelectionSection: React.FC<SeasonSelectionSectionProps> = ({ needsSeason }) => {
  const { selectedSeason, setSelectedSeason, eventType, selectedMenu } = useMenu();
  
  // Show season selection for wedding events (both wedding1 and wedding2) and matric_premium
  const shouldShowSeason = needsSeason || eventType === 'wedding' || selectedMenu === 'matric_premium';
  
  if (!shouldShowSeason) return null;

  return (
    <AccordionItem value="season" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Season Selection</span>
          <span className="text-xs text-red-500">*</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="season-select" className="mb-2 block">
              Select the seasonal menu:
            </Label>
            <Select 
              value={selectedSeason || ""} 
              onValueChange={(value) => setSelectedSeason(value as 'summer' | 'winter' | null)}
            >
              <SelectTrigger id="season-select" className="w-full max-w-xs">
                <SelectValue placeholder="Select a season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summer">Summer Menu</SelectItem>
                <SelectItem value="winter">Winter Menu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
