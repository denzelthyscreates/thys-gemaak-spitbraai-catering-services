
import React from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

interface GuestCountSectionProps {
  menuOptions: MenuOption[];
}

export const GuestCountSection: React.FC<GuestCountSectionProps> = ({ menuOptions }) => {
  const { 
    selectedMenu, 
    numGuests,
    includeCutlery,
    setNumGuests,
    setIncludeCutlery
  } = useMenu();
  
  const [displayValue, setDisplayValue] = React.useState(numGuests.toString());
  
  // Update display value when numGuests changes from context
  React.useEffect(() => {
    setDisplayValue(numGuests.toString());
  }, [numGuests]);
  
  if (!selectedMenu) return null;
  
  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  const minGuests = selectedMenuOption?.minGuests || 30;
  
  const handleGuestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);
    
    // Allow empty field while typing
    if (value === '') {
      return;
    }
    
    // Only allow numbers
    if (!/^\d+$/.test(value)) {
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (numValue >= minGuests && numValue <= 1000) {
      setNumGuests(numValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If field is empty on blur, set to minimum
    if (value === '' || parseInt(value) < minGuests) {
      setNumGuests(minGuests);
      setDisplayValue(minGuests.toString());
    }
  };

  return (
    <AccordionItem value="guest-count" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Number of Guests</span>
          <span className="text-xs text-red-500">*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Required: Minimum {minGuests} guests</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="guest-number" className="mb-2 block">
              Number of guests:
              <span className="text-sm text-muted-foreground ml-2">
                (Minimum: {minGuests})
              </span>
            </Label>
            <Input
              id="guest-number"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={displayValue}
              onChange={handleGuestNumberChange}
              onBlur={handleBlur}
              placeholder={`Enter number (min: ${minGuests})`}
              className="max-w-[200px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="cutlery" 
              checked={includeCutlery}
              onCheckedChange={setIncludeCutlery} 
            />
            <div>
              <Label htmlFor="cutlery">Include Cutlery & Crockery</Label>
              <p className="text-sm text-muted-foreground">R20 per person</p>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
