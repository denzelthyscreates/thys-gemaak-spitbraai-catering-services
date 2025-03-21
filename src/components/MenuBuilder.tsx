
import React, { useState, useEffect } from 'react';
import { Check, Users, Building, Calendar, CalendarCheck, PartyPopper, GraduationCap, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
  eventType?: 'birthday' | 'business' | 'wedding' | 'standard' | 'yearend' | 'matric';
  subtitle?: string;
  availabilityInfo?: string;
  icon?: JSX.Element;
}

interface MenuBuilderProps {
  onSelectionChange: (selection: any) => void;
  initialSelection?: any;
}

const MenuBuilder = ({ onSelectionChange, initialSelection }: MenuBuilderProps) => {
  const { toast } = useToast();
  const menuOptions: MenuOption[] = [
    // Birthday Menu Options with new psychological names
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
    
    // Business Menu Options (renamed from Corporate)
    { 
      id: 'business', 
      name: 'Executive Premium Experience', 
      price: 290, 
      description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', 
      category: 'menu',
      eventType: 'business',
      icon: <Building className="h-5 w-5 text-blue-500" />
    },
    
    // Wedding Menu Options with new order (Classic first, then Luxury)
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
    
    // Standard Menu Option with new psychological name
    { 
      id: 'standard', 
      name: 'Classic Spitbraai Selection', 
      price: 169, 
      description: 'Lamb Spit, Garlic Bread, and 2 sides', 
      category: 'menu',
      eventType: 'standard',
      icon: <Calendar className="h-5 w-5 text-gray-500" />
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
      icon: <Calendar className="h-5 w-5 text-orange-500" />
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
  
  const [menuSectionOpen, setMenuSectionOpen] = useState<boolean>(true);
  const [detailsSectionOpen, setDetailsSectionOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialSelection) {
      const menuOption = menuOptions.find(opt => opt.name === initialSelection.menuPackage);
      if (menuOption) {
        setSelectedMenu(menuOption.id);
      }
      
      setNumGuests(initialSelection.numberOfGuests || 50);
      
      if (initialSelection.season) {
        setSelectedSeason(initialSelection.season.toLowerCase() as 'summer' | 'winter');
      }
      
      if (initialSelection.starters) {
        const starterNames = initialSelection.starters.split(', ');
        const starterIds = starterNames.map(name => {
          const option = menuOptions.find(opt => opt.name === name && opt.category === 'starter');
          return option ? option.id : null;
        }).filter(Boolean);
        setSelectedStarters(starterIds);
      }
      
      if (initialSelection.sides) {
        const sideNames = initialSelection.sides.split(', ');
        const sideIds = sideNames.map(name => {
          const option = menuOptions.find(opt => opt.name === name && opt.category === 'side');
          return option ? option.id : null;
        }).filter(Boolean);
        setSelectedSides(sideIds);
      }
      
      if (initialSelection.desserts) {
        const dessertNames = initialSelection.desserts.split(', ');
        const dessertIds = dessertNames.map(name => {
          const option = menuOptions.find(opt => opt.name === name && opt.category === 'dessert');
          return option ? option.id : null;
        }).filter(Boolean);
        setSelectedDesserts(dessertIds);
      }
      
      if (initialSelection.extras) {
        const extraNames = initialSelection.extras.split(', ');
        const extraIds = extraNames.map(name => {
          if (name.startsWith("Extra Salad: ")) {
            const saladName = name.replace("Extra Salad: ", "");
            const saladOption = menuOptions.find(opt => opt.name === saladName && opt.category === 'side');
            if (saladOption) {
              setExtraSaladType(saladOption.id);
            }
            return 'extra_salad';
          }
          
          const option = menuOptions.find(opt => opt.name === name && opt.category === 'extra');
          return option ? option.id : null;
        }).filter(Boolean);
        setSelectedExtras(extraIds);
      }
      
      setDetailsSectionOpen(true);
      setMenuSectionOpen(false);
    }
  }, [initialSelection]);

  useEffect(() => {
    const calculatedPrice = calculateTotalPrice();
    setTotalPrice(calculatedPrice);
    
    setDiscountApplied(numGuests >= 100);
    
    updateSelectionSummary(calculatedPrice);
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests]);

  useEffect(() => {
    if (selectedMenu) {
      setDetailsSectionOpen(true);
      setMenuSectionOpen(false);
    }
  }, [selectedMenu]);

  const updateSelectionSummary = (calculatedPrice: number) => {
    if (!selectedMenu) return;
    
    const menuName = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
    const starterNames = selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const sideNames = selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const dessertNames = selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    
    const extraNames = selectedExtras.map(id => {
      if (id === 'extra_salad' && extraSaladType) {
        const saladOption = menuOptions.find(opt => opt.id === extraSaladType);
        return `Extra Salad: ${saladOption?.name || 'Not specified'}`;
      }
      return menuOptions.find(opt => opt.id === id)?.name || '';
    });
    
    let seasonInfo = '';
    if (selectedMenu === 'wedding1' && selectedSeason) {
      seasonInfo = `Season: ${selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}`;
    }
    
    const discountInfo = discountApplied ? '10% Volume Discount Applied!' : '';
    
    const selectionSummary = {
      menuPackage: menuName,
      numberOfGuests: numGuests,
      season: selectedSeason ? selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1) : '',
      starters: starterNames.join(', '),
      sides: sideNames.join(', '),
      desserts: dessertNames.join(', '),
      extras: extraNames.join(', '),
      extraSaladType: extraSaladType ? menuOptions.find(opt => opt.id === extraSaladType)?.name : '',
      totalPrice: calculatedPrice,
      discountApplied: discountApplied,
      fullSelection: `
        Menu Package: ${menuName}
        Number of Guests: ${numGuests}
        ${seasonInfo ? `${seasonInfo}\n` : ''}
        ${starterNames.length > 0 ? `Starters: ${starterNames.join(', ')}` : ''}
        ${sideNames.length > 0 ? `Sides: ${sideNames.join(', ')}` : ''}
        ${dessertNames.length > 0 ? `Desserts: ${dessertNames.join(', ')}` : ''}
        ${extraNames.length > 0 ? `Extras: ${extraNames.join(', ')}` : ''}
        ${discountInfo ? `${discountInfo}\n` : ''}
        Total Price: R${calculatedPrice} pp
      `
    };
    
    onSelectionChange(selectionSummary);
  };

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    setSelectedStarters([]);
    setSelectedSides([]);
    setSelectedDesserts([]);
    setSelectedExtras([]);
    setSelectedSeason(null);
    setExtraSaladType('');
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
    setMenuSectionOpen(true);
    setDetailsSectionOpen(false);
    
    localStorage.removeItem('menuSelection');
    
    toast({
      title: "Menu Builder Reset",
      description: "All selections have been cleared.",
      duration: 3000
    });
    
    onSelectionChange(null);
  };

  const handleSeasonSelect = (season: 'summer' | 'winter') => {
    setSelectedSeason(season);
    setSelectedSides([]);
  };

  const toggleOption = (id: string, category: 'starter' | 'side' | 'dessert' | 'extra') => {
    let updatedSelection: string[] = [];
    
    switch (category) {
      case 'starter':
        updatedSelection = selectedStarters.includes(id) ? [] : [id];
        setSelectedStarters(updatedSelection);
        break;
      case 'side':
        updatedSelection = [...selectedSides];
        if (updatedSelection.includes(id)) {
          updatedSelection = updatedSelection.filter(item => item !== id);
        } else {
          let maxSides = 2;
          if (selectedMenu === 'corporate') {
            maxSides = 3;
          } else if (selectedMenu === 'menu3' || selectedMenu === 'matric_premium') {
            maxSides = 3;
          }
          if (selectedMenu === 'wedding1') return;
          
          if (updatedSelection.length < maxSides) {
            updatedSelection.push(id);
          } else {
            updatedSelection.shift();
            updatedSelection.push(id);
          }
        }
        setSelectedSides(updatedSelection);
        break;
      case 'dessert':
        updatedSelection = selectedDesserts.includes(id) ? [] : [id];
        setSelectedDesserts(updatedSelection);
        break;
      case 'extra':
        updatedSelection = [...selectedExtras];
        if (updatedSelection.includes(id)) {
          updatedSelection = updatedSelection.filter(item => item !== id);
        } else {
          updatedSelection.push(id);
        }
        setSelectedExtras(updatedSelection);
        break;
    }
  };

  const handleExtraSaladTypeSelect = (saladId: string) => {
    setExtraSaladType(saladId);
  };

  const calculateTotalPrice = (): number => {
    if (!selectedMenu) return 0;
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

  const menuPackages = menuOptions.filter(opt => opt.category === 'menu');
  const starters = menuOptions.filter(opt => opt.category === 'starter');
  const sides = menuOptions.filter(opt => opt.category === 'side');
  const desserts = menuOptions.filter(opt => opt.category === 'dessert');
  const extras = menuOptions.filter(opt => opt.category === 'extra');

  const getAvailableSides = () => {
    if (selectedMenu === 'wedding1' && selectedSeason === 'winter') {
      return sides.filter(side => ['baby_potatoes', 'baby_carrots', 'baby_onions'].includes(side.id));
    } else if (selectedMenu === 'wedding1' && selectedSeason === 'summer') {
      return sides.filter(side => ['potato_salad', 'curry_noodle', 'green_salad'].includes(side.id));
    } else if (selectedMenu === 'matric_standard') {
      return sides.filter(side => 
        ['potato_salad', 'curry_noodle', 'green_salad', 'three_bean', 'baby_potatoes', 'baby_carrots'].includes(side.id)
      );
    }
    return sides;
  };

  const getMaxSelections = (category: 'starter' | 'side' | 'dessert') => {
    if (!selectedMenu) return 0;
    switch (category) {
      case 'starter':
        if (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') return 1;
        return 0;
      case 'side':
        if (selectedMenu === 'corporate' || selectedMenu === 'menu3' || selectedMenu === 'matric_premium') return 3;
        if (selectedMenu === 'menu1' || selectedMenu === 'menu2' || selectedMenu === 'wedding2' || selectedMenu === 'standard' || selectedMenu === 'yearend' || selectedMenu === 'matric_standard') return 2;
        return selectedMenu === 'wedding1' ? 0 : 0;
      case 'dessert':
        if (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') return 1;
        return 0;
      default:
        return 0;
    }
  };

  const getMenuInclusions = () => {
    if (!selectedMenu) return [];
    const inclusions: string[] = [];
    
    if (selectedMenu === 'menu1') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'All Equipment');
    } else if (selectedMenu === 'menu2' || selectedMenu === 'menu3') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving');
    } else if (selectedMenu === 'corporate') {
      inclusions.push('Starter, Main & Dessert', 'Cutlery & Crockery', 'All Equipment', 'Friendly Staff', 'Jugs & Glasses', 'Setup & Serving', 'Clearing');
    } else if (selectedMenu === 'wedding1') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'Jugs & Glasses', 'Juice + 1 Refill', 'All Equipment + Setup of Serving Table');
    } else if (selectedMenu === 'wedding2' || selectedMenu === 'standard' || selectedMenu === 'yearend') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'All Equipment');
    } else if (selectedMenu === 'matric_standard') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'All Equipment', 'Serving Staff');
    } else if (selectedMenu === 'matric_premium') {
      inclusions.push('Complete Menu Experience', 'Cutlery & Crockery', 'All Equipment', 'Professional Serving Staff', 'Jugs & Glasses', 'Setup & Clearing');
    }
    
    return inclusions;
  };

  const getAvailableSalads = () => {
    return menuOptions.filter(opt => opt.category === 'side' && 
      ['curry_noodle', 'green_salad', 'potato_salad', 'three_bean'].includes(opt.id));
  };

  const getMenusByEventType = () => {
    const eventGroups = {
      birthday: {
        title: "Birthday Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'birthday'),
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200"
      },
      business: {
        title: "Business Event Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'business'),
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      wedding: {
        title: "Wedding Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'wedding'),
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      },
      yearend: {
        title: "Year-End Celebration Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'yearend'),
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      },
      matric: {
        title: "Matric Farewell 2025 Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'matric'),
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      standard: {
        title: "Standard Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'standard'),
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      }
    };

    return Object.entries(eventGroups)
      .filter(([_, group]) => group.menus.length > 0)
      .map(([type, group]) => group);
  };

  const showMenuAvailabilityToast = (menuOption: MenuOption) => {
    if (menuOption.availabilityInfo) {
      toast({
        title: `${menuOption.name} Availability`,
        description: menuOption.availabilityInfo,
        duration: 5000
      });
    }
  };

  let step = 1;

  return (
    <TooltipProvider>
      <div className="animate-fade-in">
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Menu Selections
          </Button>
        </div>
        
        <Collapsible open={menuSectionOpen} onOpenChange={setMenuSectionOpen} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Step {step++}: Choose Your Menu Package
            </h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {menuSectionOpen ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            {getMenusByEventType().map((group, index) => (
              <div key={index} className={`mb-8 p-4 rounded-lg ${group.bgColor} ${group.borderColor} border`}>
                <h4 className="text-lg font-medium mb-4">{group.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.menus.map((menuOption) => (
                    <div
                      key={menuOption.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedMenu === menuOption.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card hover:bg-muted/50 border-muted'
                      }`}
                      onClick={() => {
                        handleMenuSelect(menuOption.id);
                        showMenuAvailabilityToast(menuOption);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {menuOption.icon}
                          <div>
                            <h5 className="font-medium">{menuOption.name}</h5>
                            {menuOption.subtitle && <p className="text-sm text-muted-foreground">{menuOption.subtitle}</p>}
                          </div>
                        </div>
                        <span className="text-lg font-semibold">R{menuOption.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{menuOption.description}</p>
                      {selectedMenu === menuOption.id && (
                        <div className="mt-2 flex items-center text-sm text-primary">
                          <Check className="mr-1 h-4 w-4" /> Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        
        {selectedMenu && (
          <Collapsible open={detailsSectionOpen} onOpenChange={setDetailsSectionOpen} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Step {step++}: Configure Your Menu
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {detailsSectionOpen ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="mb-6 space-y-4">
                <div className="p-4 rounded-lg bg-card border">
                  <h4 className="text-lg font-medium mb-4">Number of Guests</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      <span>Guests:</span>
                    </div>
                    <input
                      type="number"
                      min="10"
                      value={numGuests}
                      onChange={(e) => setNumGuests(Number(e.target.value))}
                      className="w-20 p-2 border rounded"
                    />
                    {numGuests >= 100 && (
                      <span className="text-sm font-medium text-green-600">10% Volume Discount Applied!</span>
                    )}
                  </div>
                </div>
                
                {selectedMenu === 'wedding1' && (
                  <div className="p-4 rounded-lg bg-card border">
                    <h4 className="text-lg font-medium mb-4">Season Selection</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={selectedSeason === 'summer' ? 'default' : 'outline'}
                        onClick={() => handleSeasonSelect('summer')}
                      >
                        Summer Menu
                      </Button>
                      <Button
                        variant={selectedSeason === 'winter' ? 'default' : 'outline'}
                        onClick={() => handleSeasonSelect('winter')}
                      >
                        Winter Menu
                      </Button>
                    </div>
                    
                    {selectedSeason && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">
                          {selectedSeason === 'summer' ? 'Summer' : 'Winter'} Menu Includes:
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {selectedSeason === 'summer' ? (
                            <>
                              <li>Lamb Spit</li>
                              <li>Garlic Bread</li>
                              <li>Potato Salad</li>
                              <li>Curry Noodle Salad</li>
                              <li>Green Salad</li>
                            </>
                          ) : (
                            <>
                              <li>Lamb Spit</li>
                              <li>Garlic Bread</li>
                              <li>Baby Potatoes</li>
                              <li>Baby Carrots</li>
                              <li>Baby Onions</li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {getMaxSelections('starter') > 0 && (
                  <div className="p-4 rounded-lg bg-card border">
                    <h4 className="text-lg font-medium mb-4">Choose Starter</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {starters.map((starter) => (
                        <div
                          key={starter.id}
                          className={`p-3 rounded border cursor-pointer ${
                            selectedStarters.includes(starter.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleOption(starter.id, 'starter')}
                        >
                          <div className="flex justify-between items-start">
                            <span>{starter.name}</span>
                            {selectedStarters.includes(starter.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{starter.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {getMaxSelections('side') > 0 && selectedMenu !== 'wedding1' && (
                  <div className="p-4 rounded-lg bg-card border">
                    <h4 className="text-lg font-medium mb-4">
                      Choose Sides 
                      <span className="text-sm font-normal ml-2 text-muted-foreground">
                        (Select up to {getMaxSelections('side')})
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getAvailableSides().map((side) => (
                        <div
                          key={side.id}
                          className={`p-3 rounded border cursor-pointer ${
                            selectedSides.includes(side.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleOption(side.id, 'side')}
                        >
                          <div className="flex justify-between items-start">
                            <span>{side.name}</span>
                            {selectedSides.includes(side.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{side.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {getMaxSelections('dessert') > 0 && (
                  <div className="p-4 rounded-lg bg-card border">
                    <h4 className="text-lg font-medium mb-4">Choose Dessert</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {desserts.map((dessert) => (
                        <div
                          key={dessert.id}
                          className={`p-3 rounded border cursor-pointer ${
                            selectedDesserts.includes(dessert.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleOption(dessert.id, 'dessert')}
                        >
                          <div className="flex justify-between items-start">
                            <span>{dessert.name}</span>
                            {selectedDesserts.includes(dessert.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{dessert.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-4 rounded-lg bg-card border">
                  <h4 className="text-lg font-medium mb-4">Optional Extras</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extras.map((extra) => (
                      <React.Fragment key={extra.id}>
                        <div
                          className={`p-3 rounded border cursor-pointer ${
                            selectedExtras.includes(extra.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => toggleOption(extra.id, 'extra')}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span>{extra.name}</span>
                              {extra.id === 'cheese_table' || extra.id === 'fruit_table' ? (
                                <span className="block text-sm text-muted-foreground">
                                  R{extra.price} (R{Math.round(extra.price / numGuests)} pp)
                                </span>
                              ) : (
                                <span className="block text-sm text-muted-foreground">
                                  R{extra.price} pp
                                </span>
                              )}
                            </div>
                            {selectedExtras.includes(extra.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{extra.description}</p>
                          
                          {extra.id === 'extra_salad' && selectedExtras.includes('extra_salad') && (
                            <div className="mt-2 p-2 bg-muted rounded">
                              <span className="text-sm font-medium block mb-1">Select Salad Type:</span>
                              <div className="grid grid-cols-2 gap-2">
                                {getAvailableSalads().map((salad) => (
                                  <div
                                    key={salad.id}
                                    className={`p-2 text-sm rounded cursor-pointer ${
                                      extraSaladType === salad.id
                                        ? 'bg-primary/20 border-primary'
                                        : 'bg-card hover:bg-primary/5'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExtraSaladTypeSelect(salad.id);
                                    }}
                                  >
                                    {salad.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6 p-4 rounded-lg bg-card border">
                <h4 className="text-lg font-medium mb-4">Package Inclusions</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getMenuInclusions().map((inclusion, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Total Price:</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold">R{totalPrice} pp</div>
                    <div className="text-sm text-muted-foreground">
                      R{totalPrice * numGuests} total for {numGuests} guests
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {selectedMenu && (
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="text-lg font-medium mb-3">Your Menu Selection Summary</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Package:</span>
                <span className="col-span-2">{menuOptions.find(opt => opt.id === selectedMenu)?.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Guests:</span>
                <span className="col-span-2">{numGuests}</span>
              </div>
              {selectedMenu === 'wedding1' && selectedSeason && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Season:</span>
                  <span className="col-span-2">{selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}</span>
                </div>
              )}
              {selectedStarters.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Starter:</span>
                  <span className="col-span-2">
                    {selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                  </span>
                </div>
              )}
              {selectedSides.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Sides:</span>
                  <span className="col-span-2">
                    {selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                  </span>
                </div>
              )}
              {selectedDesserts.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Dessert:</span>
                  <span className="col-span-2">
                    {selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                  </span>
                </div>
              )}
              {selectedExtras.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-medium">Extras:</span>
                  <span className="col-span-2">
                    {selectedExtras.map(id => {
                      if (id === 'extra_salad' && extraSaladType) {
                        const saladName = menuOptions.find(opt => opt.id === extraSaladType)?.name;
                        return `Extra Salad: ${saladName || 'Not specified'}`;
                      }
                      return menuOptions.find(opt => opt.id === id)?.name;
                    }).join(', ')}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <span className="font-medium">Price per person:</span>
                <span className="col-span-2 font-semibold">R{totalPrice}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Total price:</span>
                <span className="col-span-2 font-semibold">R{totalPrice * numGuests}</span>
              </div>
              {discountApplied && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  10% Volume Discount Applied!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MenuBuilder;
