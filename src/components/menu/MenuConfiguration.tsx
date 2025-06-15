import React, { useState } from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MenuConfigurationProps {
  menuOptions: MenuOption[];
}

export const MenuConfiguration: React.FC<MenuConfigurationProps> = ({ menuOptions }) => {
  const { 
    selectedMenu, 
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    selectedSeason,
    numGuests,
    extraSaladType,
    includeCutlery,
    setSelectedStarters,
    setSelectedSides,
    setSelectedDesserts,
    setSelectedExtras,
    setSelectedSeason,
    setNumGuests,
    setExtraSaladType,
    setIncludeCutlery
  } = useMenu();
  
  const [accordionValue, setAccordionValue] = useState<string[]>(['guest-count']);
  
  if (!selectedMenu) return null;
  
  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  const minGuests = selectedMenuOption?.minGuests || 30;
  
  const needsSeason = (selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions));
  const needsStarters = selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium';
  const needsDesserts = selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium';
  
  const handleSelectStarter = (id: string) => {
    // Starters are typically a single choice, so replace current selection
    setSelectedStarters([id]);
  };
  
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
  
  const handleSelectDessert = (id: string) => {
    // Desserts are typically a single choice, so replace current selection
    setSelectedDesserts([id]);
  };
  
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
  
  const handleGuestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
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
  
  const starterOptions = menuOptions
    .filter(option => option.category === 'starter')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const sideOptions = menuOptions
    .filter(option => option.category === 'side')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const dessertOptions = menuOptions
    .filter(option => option.category === 'dessert')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const extraOptions = menuOptions
    .filter(option => option.category === 'extra')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const saladOptions = menuOptions
    .filter(option => option.category === 'side' && option.name.toLowerCase().includes('salad'))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <Accordion 
        type="multiple" 
        value={accordionValue} 
        onValueChange={setAccordionValue}
        className="space-y-4"
      >
        {/* Guest Count Section */}
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
                  value={numGuests.toString()}
                  onChange={handleGuestNumberChange}
                  placeholder={`Enter number (min: ${minGuests})`}
                  className="max-w-[200px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        
        {/* Season Selection - Only for specific menus */}
        {needsSeason && (
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
        )}
        
        {/* Starters - Only for specific menus */}
        {needsStarters && starterOptions.length > 0 && (
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
        )}
        
        {/* Sides */}
        {sideOptions.length > 0 && (
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
        )}
        
        {/* Desserts - Only for specific menus */}
        {needsDesserts && dessertOptions.length > 0 && (
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
        )}
        
        {/* Extras */}
        {extraOptions.length > 0 && (
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
        )}
      </Accordion>
    </div>
  );
};
