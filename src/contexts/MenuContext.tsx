
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuOption } from '@/types/menu';
import { useToast } from "@/hooks/use-toast";
import { menuOptions } from '@/data/menuData';

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
  includeCutlery: boolean;
  setSelectedMenu: (menuId: string | null) => void;
  setSelectedStarters: (starters: string[]) => void;
  setSelectedSides: (sides: string[]) => void;
  setSelectedDesserts: (desserts: string[]) => void;
  setSelectedExtras: (extras: string[]) => void;
  setSelectedSeason: (season: 'summer' | 'winter' | null) => void;
  setNumGuests: (num: number) => void;
  setExtraSaladType: (type: string) => void;
  setIncludeCutlery: (include: boolean) => void;
  calculateTotalPrice: () => number;
  handleReset: () => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedMenu');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedStarters, setSelectedStarters] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedStarters');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedSides, setSelectedSides] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedSides');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedDesserts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedExtras, setSelectedExtras] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedExtras');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(() => {
    const saved = localStorage.getItem('selectedSeason');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [numGuests, setNumGuests] = useState<number>(() => {
    const saved = localStorage.getItem('numGuests');
    return saved ? JSON.parse(saved) : 50;
  });
  
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  const [extraSaladType, setExtraSaladType] = useState<string>(() => {
    const saved = localStorage.getItem('extraSaladType');
    return saved ? JSON.parse(saved) : '';
  });
  
  const [includeCutlery, setIncludeCutlery] = useState<boolean>(() => {
    const saved = localStorage.getItem('includeCutlery');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('selectedMenu', JSON.stringify(selectedMenu));
  }, [selectedMenu]);
  
  useEffect(() => {
    localStorage.setItem('selectedStarters', JSON.stringify(selectedStarters));
  }, [selectedStarters]);
  
  useEffect(() => {
    localStorage.setItem('selectedSides', JSON.stringify(selectedSides));
  }, [selectedSides]);
  
  useEffect(() => {
    localStorage.setItem('selectedDesserts', JSON.stringify(selectedDesserts));
  }, [selectedDesserts]);
  
  useEffect(() => {
    localStorage.setItem('selectedExtras', JSON.stringify(selectedExtras));
  }, [selectedExtras]);
  
  useEffect(() => {
    localStorage.setItem('selectedSeason', JSON.stringify(selectedSeason));
  }, [selectedSeason]);
  
  useEffect(() => {
    localStorage.setItem('numGuests', JSON.stringify(numGuests));
  }, [numGuests]);
  
  useEffect(() => {
    localStorage.setItem('extraSaladType', JSON.stringify(extraSaladType));
  }, [extraSaladType]);
  
  useEffect(() => {
    localStorage.setItem('includeCutlery', JSON.stringify(includeCutlery));
  }, [includeCutlery]);

  const calculateTotalPrice = (): number => {
    if (!selectedMenu) return 0;
    
    const menuOption = menuOptions.find(opt => opt.id === selectedMenu);
    if (!menuOption) return 0;
    
    // Base price based on whether cutlery is included or not
    let basePrice = includeCutlery ? menuOption.price : (menuOption.withoutCutlery || menuOption.price - 20);
    
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = menuOptions.find(opt => opt.id === extraId);
      if (!extra) return total;
      if (extra.id === 'chicken_thigh' || extra.id === 'extra_salad') {
        return total + extra.price;
      } else {
        return total + (numGuests > 0 ? Math.round(extra.price / numGuests) : extra.price);
      }
    }, 0);
    
    let finalPrice = basePrice + extrasPrice;
    
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
    setIncludeCutlery(true);
    
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem('selectedStarters');
    localStorage.removeItem('selectedSides');
    localStorage.removeItem('selectedDesserts');
    localStorage.removeItem('selectedExtras');
    localStorage.removeItem('selectedSeason');
    localStorage.removeItem('numGuests');
    localStorage.removeItem('extraSaladType');
    localStorage.removeItem('includeCutlery');
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
    
    if (selectedMenu) {
      const menuOption = menuOptions.find(opt => opt.id === selectedMenu);
      const menuPackage = menuOption?.name || '';
      
      const starterNames = selectedStarters.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const sideNames = selectedSides.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const dessertNames = selectedDesserts.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const extraNames = selectedExtras.map(id => 
        menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
      
      const completeSelection = {
        menuPackage,
        numberOfGuests: numGuests,
        season: selectedSeason,
        starters: starterNames,
        sides: sideNames,
        desserts: dessertNames,
        extras: extraNames,
        extraSaladType,
        includeCutlery,
        totalPrice,
        discountApplied: numGuests >= 100
      };
      
      localStorage.setItem('menuSelection', JSON.stringify(completeSelection));
    } else {
      localStorage.removeItem('menuSelection');
    }
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests, extraSaladType, includeCutlery]);

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
      includeCutlery,
      setSelectedMenu,
      setSelectedStarters,
      setSelectedSides,
      setSelectedDesserts,
      setSelectedExtras,
      setSelectedSeason,
      setNumGuests,
      setExtraSaladType,
      setIncludeCutlery,
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
