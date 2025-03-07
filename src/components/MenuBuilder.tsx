import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, Calendar, CalendarCheck, PartyPopper, GraduationCap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
  eventType: 'birthday' | 'corporate' | 'wedding' | 'standard' | 'yearend' | 'matric';
  subtitle?: string;
  availabilityInfo?: string;
  icon?: JSX.Element;
}

const MenuBuilder = ({ onSelectionChange }: { onSelectionChange: (selection: any) => void }) => {
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
    
    // Corporate Menu Options with new psychological name
    { 
      id: 'corporate', 
      name: 'Executive Premium Experience', 
      price: 290, 
      description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', 
      category: 'menu',
      eventType: 'corporate',
      icon: <Calendar className="h-5 w-5 text-blue-500" />
    },
    
    // Wedding Menu Options with new psychological names
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
      id: 'wedding2', 
      name: 'Classic Wedding Celebration', 
      price: 169, 
      description: 'Lamb Spit, Garlic Bread, and 2 sides', 
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
      availabilityInfo: 'Available only for year-end corporate events (November-December)',
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
    { id: 'cocktail_burger', name: 'Cocktail Burger', price: 0, description: 'Mini burger appetizer', category: 'starter' },
    { id: 'curry_rooti', name: 'Curry Rooti', price: 0, description: 'Curry-filled flatbread', category: 'starter' },
    
    // Sides
    { id: 'curry_noodle', name: 'Curry Noodle Salad', price: 0, description: 'Spiced noodle salad', category: 'side' },
    { id: 'green_salad', name: 'Green Salad', price: 0, description: 'Fresh green salad', category: 'side' },
    { id: 'potato_salad', name: 'Potato Salad', price: 0, description: 'Creamy potato salad', category: 'side' },
    { id: 'three_bean', name: 'Three Bean Salad', price: 0, description: 'Mixed bean salad', category: 'side' },
    { id: 'baby_potatoes', name: 'Baby Potatoes', price: 0, description: 'Roasted baby potatoes', category: 'side' },
    { id: 'baby_carrots', name: 'Baby Carrots', price: 0, description: 'Glazed baby carrots', category: 'side' },
    { id: 'baby_onions', name: 'Baby Onions', price: 0, description: 'Caramelized baby onions', category: 'side' },
    
    // Desserts
    { id: 'malva_custard', name: 'Malva Custard', price: 0, description: 'Traditional South African dessert', category: 'dessert' },
    { id: 'ice_cream', name: 'Ice Cream & Chocolate Sauce', price: 0, description: 'Classic ice cream with chocolate', category: 'dessert' },
    
    // Extras – note: pricing for some is per group (cheese_table, fruit_table) and others are per person (chicken_thigh, extra_salad)
    { id: 'cheese_table', name: 'Cheese Table', price: 1900, description: 'Assorted cheese platter', category: 'extra' },
    { id: 'fruit_table', name: 'Fruit Table', price: 900, description: 'Fresh fruit display', category: 'extra' },
    { id: 'chicken_thigh', name: 'Chicken Thigh', price: 25, description: 'Per person', category: 'extra' },
    { id: 'extra_salad', name: 'Extra Salad', price: 25, description: 'Per person', category: 'extra' },
  ];

  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(null);
  const [numGuests, setNumGuests] = useState<number>(50); // Default to 50 guests
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [extraSaladType, setExtraSaladType] = useState<string>('');

  useEffect(() => {
    const calculatedPrice = calculateTotalPrice();
    setTotalPrice(calculatedPrice);
    
    updateSelectionSummary(calculatedPrice);
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests]);

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
      fullSelection: `
        Menu Package: ${menuName}
        Number of Guests: ${numGuests}
        ${seasonInfo ? `${seasonInfo}\n` : ''}
        ${starterNames.length > 0 ? `Starters: ${starterNames.join(', ')}` : ''}
        ${sideNames.length > 0 ? `Sides: ${sideNames.join(', ')}` : ''}
        ${dessertNames.length > 0 ? `Desserts: ${dessertNames.join(', ')}` : ''}
        ${extraNames.length > 0 ? `Extras: ${extraNames.join(', ')}` : ''}
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
    
    return menuPrice + extrasPrice;
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
      // For Matric Standard menu, only show salads, baby potatoes, and baby carrots
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
      corporate: {
        title: "Corporate Event Packages",
        menus: menuPackages.filter(menu => menu.eventType === 'corporate'),
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

    // Filter out event types with no menus
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
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{step++}. Select Your Menu Package</h3>
          
          {getMenusByEventType().map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h4 className={`text-lg font-medium mb-3 pb-1 border-b ${group.borderColor}`}>
                {group.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.menus.map((menu) => (
                  <Tooltip key={menu.id}>
                    <TooltipTrigger asChild>
                      <div 
                        onClick={() => {
                          handleMenuSelect(menu.id);
                          showMenuAvailabilityToast(menu);
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                          selectedMenu === menu.id 
                            ? `border-primary bg-primary/10 shadow-md` 
                            : `border-border hover:border-primary/50 ${group.bgColor}`
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {menu.icon}
                            <div>
                              <h4 className="font-semibold">{menu.name}</h4>
                              {menu.subtitle && (
                                <p className="text-xs text-muted-foreground">{menu.subtitle}</p>
                              )}
                            </div>
                          </div>
                          {selectedMenu === menu.id && <Check className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{menu.description}</p>
                        <p className="font-semibold mt-2">R{menu.price} pp</p>
                        {menu.availabilityInfo && (
                          <div className="mt-1 text-xs text-muted-foreground italic">
                            {menu.availabilityInfo}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {menu.availabilityInfo && (
                      <TooltipContent>
                        <p>{menu.availabilityInfo}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {selectedMenu && (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{step++}. Enter Number of Guests</h3>
              <input
                type="number"
                min="1"
                value={numGuests}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setNumGuests(val);
                }}
                className="px-3 py-2 border rounded-md"
              />
            </div>
            
            {selectedMenu === 'wedding1' && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{step++}. Select Season (Wedding Menu 1)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => handleSeasonSelect('summer')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSeason === 'summer' ? 'border-primary bg-primary/10 shadow-md' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Summer Menu</h4>
                      {selectedSeason === 'summer' && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Includes Potato Salad, Curry Noodle Salad, Green Salad
                    </p>
                  </div>
                  <div 
                    onClick={() => handleSeasonSelect('winter')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedSeason === 'winter' ? 'border-primary bg-primary/10 shadow-md' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Winter Menu</h4>
                      {selectedSeason === 'winter' && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Includes Baby Potatoes, Baby Carrots, Baby Onions
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {starters.length > 0 && getMaxSelections('starter') > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {step++}. Select Starter ({selectedStarters.length}/{getMaxSelections('starter')})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {starters.map((starter) => (
                    <div
                      key={starter.id}
                      onClick={() => toggleOption(starter.id, 'starter')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedStarters.includes(starter.id)
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{starter.name}</h4>
                        {selectedStarters.includes(starter.id) && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{starter.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {sides.length > 0 && getMaxSelections('side') > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {step++}. Select Sides ({selectedSides.length}/{getMaxSelections('side')})
                </h3>
                {selectedMenu === 'matric_standard' && (
                  <p className="text-muted-foreground mb-4">
                    Lamb Spit and Garlic Bread are fixed items. Please select any 2 sides from the options below.
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getAvailableSides().map((side) => (
                    <div
                      key={side.id}
                      onClick={() => toggleOption(side.id, 'side')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedSides.includes(side.id)
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{side.name}</h4>
                        {selectedSides.includes(side.id) && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{side.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {desserts.length > 0 && getMaxSelections('dessert') > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {step++}. Select Dessert ({selectedDesserts.length}/{getMaxSelections('dessert')})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {desserts.map((dessert) => (
                    <div
                      key={dessert.id}
                      onClick={() => toggleOption(dessert.id, 'dessert')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedDesserts.includes(dessert.id)
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{dessert.name}</h4>
                        {selectedDesserts.includes(dessert.id) && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{dessert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {extras.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {step++}. Select Extras ({selectedExtras.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {extras.map((extra) => (
                    <div
                      key={extra.id}
                      onClick={() => toggleOption(extra.id, 'extra')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedExtras.includes(extra.id)
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{extra.name}</h4>
                        {selectedExtras.includes(extra.id) && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{extra.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-semibold">R{extra.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {extra.id === 'cheese_table' || extra.id === 'fruit_table' 
                            ? 'Price is per group' 
                            : 'Price is per person'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedExtras.includes('extra_salad') && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Select Salad Type</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getAvailableSalads().map((salad) => (
                        <div
                          key={salad.id}
                          onClick={() => handleExtraSaladTypeSelect(salad.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                            extraSaladType === salad.id
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{salad.name}</h4>
                            {extraSaladType === salad.id && <Check className="h-5 w-5 text-primary" />}
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{salad.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedMenu && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Menu Inclusions</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {getMenuInclusions().map((inclusion, index) => (
                    <li key={index}>{inclusion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedMenu && (
              <div className="mb-8">
                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                  <h3 className="text-xl font-semibold">Total Price Per Person:</h3>
                  <p className="text-2xl font-bold text-primary">R{totalPrice}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MenuBuilder;
