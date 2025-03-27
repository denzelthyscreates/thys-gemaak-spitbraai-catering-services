import React, { useState } from 'react';
import { RotateCcw, Building, Calendar, CalendarCheck, GraduationCap, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MenuProvider, useMenu } from '@/contexts/MenuContext';
import { MenuPackages } from './menu/MenuPackages';
import { MenuConfiguration } from './menu/MenuConfiguration';
import { MenuSummary } from './menu/MenuSummary';
import { MenuOption, MenuBuilderProps } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

const MenuBuilderContent = ({ onSelectionChange, menuOptions }: { 
  onSelectionChange: (selection: any) => void,
  menuOptions: MenuOption[]
}) => {
  const { toast } = useToast();
  const { handleReset } = useMenu();
  const [menuSectionOpen, setMenuSectionOpen] = useState(true);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            handleReset();
            onSelectionChange(null);
          }}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Menu Selections
        </Button>
      </div>

      <Collapsible open={menuSectionOpen} onOpenChange={setMenuSectionOpen} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Step 1: Choose Your Menu Package</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {menuSectionOpen ? '−' : '+'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <MenuPackages menuOptions={menuOptions} />
        </CollapsibleContent>
      </Collapsible>

      <MenuConfiguration menuOptions={menuOptions} />

      <MenuSummary menuOptions={menuOptions} />
    </div>
  );
};

const MenuBuilder = ({ onSelectionChange, initialSelection }: MenuBuilderProps) => {
  const menuOptions: MenuOption[] = [
    { 
      id: 'menu1', 
      name: 'Essential Celebration', 
      price: 169, 
      description: 'Lamb Spit Main, Garlic Bread, 2 Salads', 
      category: 'menu',
      eventType: 'birthday',
      icon: <PartyPopper className="h-5 w-5 text-pink-500" />
    },
    { 
      id: 'menu2', 
      name: 'Deluxe Celebration Experience', 
      price: 185, 
      description: 'Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', 
      category: 'menu',
      eventType: 'birthday',
      icon: <PartyPopper className="h-5 w-5 text-pink-500" />
    },
    { 
      id: 'menu3', 
      name: 'Ultimate Birthday Feast', 
      price: 195, 
      description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', 
      category: 'menu',
      eventType: 'birthday',
      icon: <PartyPopper className="h-5 w-5 text-pink-500" />
    },
    
    { 
      id: 'business', 
      name: 'Executive Premium Experience', 
      price: 290, 
      description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', 
      category: 'menu',
      eventType: 'business',
      icon: <Building className="h-5 w-5 text-blue-500" />
    },
    
    { 
      id: 'wedding2', 
      name: 'Classic Wedding Celebration', 
      price: 169, 
      description: 'Lamb Spit, Garlic Bread, and 2 sides', 
      category: 'menu',
      eventType: 'wedding',
      icon: <CalendarCheck className="h-5 w-5 text-purple-500" />
    },
    { 
      id: 'wedding1', 
      name: 'Luxury Wedding Experience', 
      price: 195, 
      description: '3 Course Meal (Start, Main & Dessert)', 
      category: 'menu',
      eventType: 'wedding',
      icon: <CalendarCheck className="h-5 w-5 text-purple-500" />
    },
    
    { 
      id: 'standard', 
      name: 'Classic Spitbraai Selection', 
      price: 169, 
      description: 'Lamb Spit, Garlic Bread, and 2 sides', 
      category: 'menu',
      eventType: 'standard',
      icon: <Calendar className="h-5 w-5 text-gray-500" />
    },
    
    { 
      id: 'yearend', 
      name: 'Signature Year-End Celebration', 
      price: 160, 
      description: 'Lamb Spit, Garlic Bread, and 2 sides', 
      category: 'menu',
      eventType: 'yearend',
      availabilityInfo: 'Available only for year-end business events (November-December)',
      icon: <Calendar className="h-5 w-5 text-orange-500" />
    },
    
    { 
      id: 'matric_standard', 
      name: 'Essential Matric Farewell 2025', 
      price: 169, 
      description: 'Lamb Spit, Garlic Bread, and any 2 sides from our selection', 
      category: 'menu', 
      subtitle: 'Standard Matric Farewell Package',
      eventType: 'matric',
      availabilityInfo: 'Available exclusively for school Matric Farewell events',
      icon: <GraduationCap className="h-5 w-5 text-green-500" />
    },
    { 
      id: 'matric_premium', 
      name: 'Premium Matric Farewell 2025', 
      price: 195, 
      description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Sides, Dessert', 
      category: 'menu', 
      subtitle: 'Exclusive Matric Farewell Experience',
      eventType: 'matric',
      availabilityInfo: 'Available exclusively for school Matric Farewell events',
      icon: <GraduationCap className="h-5 w-5 text-green-500" />
    },
    
    { id: 'cocktail_burger', name: 'Cocktail Burger', price: 0, description: 'Mini burger appetizer', category: 'starter', eventType: 'standard' },
    { id: 'curry_rooti', name: 'Curry Rooti', price: 0, description: 'Curry-filled flatbread', category: 'starter', eventType: 'standard' },
    
    { id: 'curry_noodle', name: 'Curry Noodle Salad', price: 0, description: 'Spiced noodle salad', category: 'side', eventType: 'standard' },
    { id: 'green_salad', name: 'Green Salad', price: 0, description: 'Fresh green salad', category: 'side', eventType: 'standard' },
    { id: 'potato_salad', name: 'Potato Salad', price: 0, description: 'Creamy potato salad', category: 'side', eventType: 'standard' },
    { id: 'three_bean', name: 'Three Bean Salad', price: 0, description: 'Mixed bean salad', category: 'side', eventType: 'standard' },
    { id: 'baby_potatoes', name: 'Baby Potatoes', price: 0, description: 'Roasted baby potatoes', category: 'side', eventType: 'standard' },
    { id: 'baby_carrots', name: 'Baby Carrots', price: 0, description: 'Glazed baby carrots', category: 'side', eventType: 'standard' },
    { id: 'baby_onions', name: 'Baby Onions', price: 0, description: 'Caramelized baby onions', category: 'side', eventType: 'standard' },
    
    { id: 'malva_custard', name: 'Malva Custard', price: 0, description: 'Traditional South African dessert', category: 'dessert', eventType: 'standard' },
    { id: 'ice_cream', name: 'Ice Cream & Chocolate Sauce', price: 0, description: 'Classic ice cream with chocolate', category: 'dessert', eventType: 'standard' },
    
    { id: 'cheese_table', name: 'Cheese Table', price: 1900, description: 'Assorted cheese platter', category: 'extra', eventType: 'standard' },
    { id: 'fruit_table', name: 'Fruit Table', price: 900, description: 'Fresh fruit display', category: 'extra', eventType: 'standard' },
    { id: 'chicken_thigh', name: 'Chicken Thigh', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
    { id: 'extra_salad', name: 'Extra Salad', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
  ];

  return (
    <MenuProvider>
      <MenuBuilderContent 
        onSelectionChange={onSelectionChange} 
        menuOptions={menuOptions} 
      />
    </MenuProvider>
  );
};

export default MenuBuilder;
