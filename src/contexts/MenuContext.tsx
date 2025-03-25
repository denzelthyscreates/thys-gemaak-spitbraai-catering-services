import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuOption } from '@/types/menu';
import { useToast } from "@/hooks/use-toast";

interface MenuContextType {
  selectedMenu: string | null;
  selectedStarters: string[];
  selectedSides: string[];
  selectedDesserts: string[];
  selectedExtras: string[];
  selectedSeason: 'summer' | 'winter' | null;
  numGuests: number;
  totalPrice: number;
  extraSaladType: string;
  discountApplied: boolean;
  setSelectedMenu: (menuId: string | null) => void;
  setSelectedStarters: (starters: string[]) => void;
  setSelectedSides: (sides: string[]) => void;
  setSelectedDesserts: (desserts: string[]) => void;
  setSelectedExtras: (extras: string[]) => void;
  setSelectedSeason: (season: 'summer' | 'winter' | null) => void;
  setNumGuests: (num: number) => void;
  setExtraSaladType: (type: string) => void;
  calculateTotalPrice: () => number;
  handleReset: () => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(null);
  const [numGuests, setNumGuests] = useState<number>(50);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [extraSaladType, setExtraSaladType] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const { toast } = useToast();

  const calculateTotalPrice = (): number => {
    if (!selectedMenu) return 0;
    const menuOptions = [
        // Birthday Menu Options with new psychological names
        { 
          id: 'menu1', 
          name: 'Essential Celebration', 
          price: 169, 
          description: 'Lamb Spit Main, Garlic Bread, 2 Salads', 
          category: 'menu',
          eventType: 'birthday',
        },
        { 
          id: 'menu2', 
          name: 'Deluxe Celebration Experience', 
          price: 185, 
          description: 'Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', 
          category: 'menu',
          eventType: 'birthday',
        },
        { 
          id: 'menu3', 
          name: 'Ultimate Birthday Feast', 
          price: 195, 
          description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', 
          category: 'menu',
          eventType: 'birthday',
        },
        
        // Business Menu Options (renamed from Corporate)
        { 
          id: 'business', 
          name: 'Executive Premium Experience', 
          price: 290, 
          description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', 
          category: 'menu',
          eventType: 'business',
        },
        
        // Wedding Menu Options with new order (Classic first, then Luxury)
        { 
          id: 'wedding2', 
          name: 'Classic Wedding Celebration', 
          price: 169, 
          description: 'Lamb Spit, Garlic Bread, and 2 sides', 
          category: 'menu',
          eventType: 'wedding',
        },
        { 
          id: 'wedding1', 
          name: 'Luxury Wedding Experience', 
          price: 195, 
          description: '3 Course Meal (Start, Main & Dessert)', 
          category: 'menu',
          eventType: 'wedding',
        },
        
        // Standard Menu Option with new psychological name
        { 
          id: 'standard', 
          name: 'Classic Spitbraai Selection', 
          price: 169, 
          description: 'Lamb Spit, Garlic Bread, and 2 sides', 
          category: 'menu',
          eventType: 'standard',
        },
        
        // Year-End Function Menu Option
        { 
          id: 'yearend', 
          name: 'Signature Year-End Celebration', 
          price: 160, 
          description: 'Lamb Spit, Garlic Bread, and 2 sides', 
          category: 'menu',
          eventType: 'yearend',
          availabilityInfo: 'Available only for year-end business events (November-December)',
        },
        
        // Matric Farewell Menus with special naming
        { 
          id: 'matric_standard', 
          name: 'Essential Matric Farewell 2025', 
          price: 169, 
          description: 'Lamb Spit, Garlic Bread, and any 2 sides from our selection', 
          category: 'menu', 
          subtitle: 'Standard Matric Farewell Package',
          eventType: 'matric',
          availabilityInfo: 'Available exclusively for school Matric Farewell events',
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
        },
        
        // Starters
        { id: 'cocktail_burger', name: 'Cocktail Burger', price: 0, description: 'Mini burger appetizer', category: 'starter', eventType: 'standard' },
        { id: 'curry_rooti', name: 'Curry Rooti', price: 0, description: 'Curry-filled flatbread', category: 'starter', eventType: 'standard' },
        
        // Sides
        { id: 'curry_noodle', name: 'Curry Noodle Salad', price: 0, description: 'Spiced noodle salad', category: 'side', eventType: 'standard' },
        { id: 'green_salad', name: 'Green Salad', price: 0, description: 'Fresh green salad', category: 'side', eventType: 'standard' },
        { id: 'potato_salad', name: 'Potato Salad', price: 0, description: 'Creamy potato salad', category: 'side', eventType: 'standard' },
        { id: 'three_bean', name: 'Three Bean Salad', price: 0, description: 'Mixed bean salad', category: 'side', eventType: 'standard' },
        { id: 'baby_potatoes', name: 'Baby Potatoes', price: 0, description: 'Roasted baby potatoes', category: 'side', eventType: 'standard' },
        { id: 'baby_carrots', name: 'Baby Carrots', price: 0, description: 'Glazed baby carrots', category: 'side', eventType: 'standard' },
        { id: 'baby_onions', name: 'Baby Onions', price: 0, description: 'Caramelized baby onions', category: 'side', eventType: 'standard' },
        
        // Desserts
        { id: 'malva_custard', name: 'Malva Custard', price: 0, description: 'Traditional South African dessert', category: 'dessert', eventType: 'standard' },
        { id: 'ice_cream', name: 'Ice Cream & Chocolate Sauce', price: 0, description: 'Classic ice cream with chocolate', category: 'dessert', eventType: 'standard' },
        
        // Extras – note: pricing for some is per group (cheese_table, fruit_table) and others are per person (chicken_thigh, extra_salad)
        { id: 'cheese_table', name: 'Cheese Table', price: 1900, description: 'Assorted cheese platter', category: 'extra', eventType: 'standard' },
        { id: 'fruit_table', name: 'Fruit Table', price: 900, description: 'Fresh fruit display', category: 'extra', eventType: 'standard' },
        { id: 'chicken_thigh', name: 'Chicken Thigh', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
        { id: 'extra_salad', name: 'Extra Salad', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
    ];
    const menuPrice = menuOptions.find(opt => opt.id === selectedMenu)?.price || 0;
    
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = menuOptions.find(opt => opt.id === extraId);
      if (!extra) return total;
      if (extra.id === 'chicken_thigh' || extra.id === 'extra_salad') {
        return total + extra.price;
      } else {
        return total + (numGuests > 0 ? Math.round(extra.price / numGuests) : extra.price);
      }
    }, 0);
    
    let finalPrice = menuPrice + extrasPrice;
    
    if (numGuests >= 100) {
      finalPrice = Math.round(finalPrice * 0.9);
    }
    
    return finalPrice;
  };

  const handleReset = () => {
    setSelectedMenu(null);
    setSelectedStarters([]);
    setSelectedSides([]);
    setSelectedDesserts([]);
    setSelectedExtras([]);
    setSelectedSeason(null);
    setNumGuests(50);
    setExtraSaladType('');
    
    localStorage.removeItem('menuSelection');
    
    toast({
      title: "Menu Builder Reset",
      description: "All selections have been cleared.",
      duration: 3000
    });
  };

  useEffect(() => {
    const calculatedPrice = calculateTotalPrice();
    setTotalPrice(calculatedPrice);
    setDiscountApplied(numGuests >= 100);
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests]);

  return (
    <MenuContext.Provider value={{
      selectedMenu,
      selectedStarters,
      selectedSides,
      selectedDesserts,
      selectedExtras,
      selectedSeason,
      numGuests,
      totalPrice,
      extraSaladType,
      discountApplied,
      setSelectedMenu,
      setSelectedStarters,
      setSelectedSides,
      setSelectedDesserts,
      setSelectedExtras,
      setSelectedSeason,
      setNumGuests,
      setExtraSaladType,
      calculateTotalPrice,
      handleReset
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
