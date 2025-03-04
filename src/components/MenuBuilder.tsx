
import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart } from 'lucide-react';

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
}

const MenuBuilder = ({ onSelectionChange }: { onSelectionChange: (selection: any) => void }) => {
  // Updated menu data with modified titles for Birthday Menu options
  const menuOptions: MenuOption[] = [
    // Birthday Menu Options (from Birthday Menu.docx)
    { id: 'menu1', name: 'Birthday Menu 1', price: 169, description: 'Lamb Spit Main, Garlic Bread, 2 Salads', category: 'menu' },
    { id: 'menu2', name: 'Birthday Menu 2', price: 185, description: 'Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', category: 'menu' },
    { id: 'menu3', name: 'Birthday Menu 3', price: 195, description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', category: 'menu' },
    // Corporate Menu Options
    { id: 'corporate', name: 'Corporate Menu', price: 290, description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', category: 'menu' },
    // Wedding Menu Options
    { id: 'wedding1', name: 'Wedding Menu 1', price: 195, description: '3 Course Meal (Start, Main & Dessert)', category: 'menu' },
    { id: 'wedding2', name: 'Wedding Menu 2', price: 169, description: 'Lamb Spit, Garlic Bread, and 2 sides', category: 'menu' },
    // Standard Menu Options
    { id: 'standard', name: 'Standard Menu', price: 169, description: 'Lamb Spit, Garlic Bread, and 2 sides', category: 'menu' },
    
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

  // States for selections and number of guests
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(null);
  const [numGuests, setNumGuests] = useState<number>(50); // Default to 50 guests
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Calculate total price whenever relevant state changes
  useEffect(() => {
    const calculatedPrice = calculateTotalPrice();
    setTotalPrice(calculatedPrice);
    
    // Update selection summary after price calculation
    updateSelectionSummary(calculatedPrice);
  }, [selectedMenu, selectedStarters, selectedSides, selectedDesserts, selectedExtras, selectedSeason, numGuests]);

  // Update selection summary (called on changes)
  const updateSelectionSummary = (calculatedPrice: number) => {
    if (!selectedMenu) return;
    
    const menuName = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
    const starterNames = selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const sideNames = selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const dessertNames = selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const extraNames = selectedExtras.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    
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

  // Handler for menu selection
  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    setSelectedStarters([]);
    setSelectedSides([]);
    setSelectedDesserts([]);
    setSelectedExtras([]);
    setSelectedSeason(null);
  };

  // Handler for season selection (used for Wedding Menu 1)
  const handleSeasonSelect = (season: 'summer' | 'winter') => {
    setSelectedSeason(season);
    setSelectedSides([]); // Reset sides if season changes
  };

  // Toggle option for starters, sides, desserts, and extras
  const toggleOption = (id: string, category: 'starter' | 'side' | 'dessert' | 'extra') => {
    let updatedSelection: string[] = [];
    
    switch (category) {
      case 'starter':
        // For menus that require one starter only
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
          } else if (selectedMenu === 'menu3') {
            maxSides = 3;
          }
          // For Wedding Menu 1 the sides are fixed by season; no manual selection.
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

  // Calculate total price per person – taking into account the number of guests for group extras.
  const calculateTotalPrice = (): number => {
    if (!selectedMenu) return 0;
    const menuPrice = menuOptions.find(opt => opt.id === selectedMenu)?.price || 0;
    
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = menuOptions.find(opt => opt.id === extraId);
      if (!extra) return total;
      // For per-person extras (chicken_thigh & extra_salad) add full price.
      if (extra.id === 'chicken_thigh' || extra.id === 'extra_salad') {
        return total + extra.price;
      } else {
        // For group extras (cheese_table, fruit_table) divide by number of guests.
        return total + (numGuests > 0 ? Math.round(extra.price / numGuests) : extra.price);
      }
    }, 0);
    
    return menuPrice + extrasPrice;
  };

  // Filter options by category
  const menuPackages = menuOptions.filter(opt => opt.category === 'menu');
  const starters = menuOptions.filter(opt => opt.category === 'starter');
  const sides = menuOptions.filter(opt => opt.category === 'side');
  const desserts = menuOptions.filter(opt => opt.category === 'dessert');
  const extras = menuOptions.filter(opt => opt.category === 'extra');

  // For Wedding Menu 1, determine available sides based on season
  const getAvailableSides = () => {
    if (selectedMenu === 'wedding1' && selectedSeason === 'winter') {
      return sides.filter(side => ['baby_potatoes', 'baby_carrots', 'baby_onions'].includes(side.id));
    } else if (selectedMenu === 'wedding1' && selectedSeason === 'summer') {
      return sides.filter(side => ['potato_salad', 'curry_noodle', 'green_salad'].includes(side.id));
    }
    return sides;
  };

  // Determine the maximum selections allowed for different categories
  const getMaxSelections = (category: 'starter' | 'side' | 'dessert') => {
    if (!selectedMenu) return 0;
    switch (category) {
      case 'starter':
        // Menu 3, Corporate, and Wedding Menu 1 require exactly 1 starter.
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      case 'side':
        if (selectedMenu === 'corporate' || selectedMenu === 'menu3') return 3;
        if (selectedMenu === 'menu1' || selectedMenu === 'menu2' || selectedMenu === 'wedding2' || selectedMenu === 'standard') return 2;
        // Wedding Menu 1 sides are fixed by season.
        return selectedMenu === 'wedding1' ? 0 : 0;
      case 'dessert':
        // Menu 3, Corporate, and Wedding Menu 1 require exactly 1 dessert.
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      default:
        return 0;
    }
  };

  // Display what is included in the menu package
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
    } else if (selectedMenu === 'wedding2' || selectedMenu === 'standard') {
      inclusions.push('Menu', 'Cutlery & Crockery', 'All Equipment');
    }
    return inclusions;
  };

  // Use a local counter for dynamically numbering the steps
  let step = 1;

  return (
    <div className="animate-fade-in">
      {/* Step 1: Select Menu Package */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{step++}. Select Your Menu Package</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menuPackages.map((menu) => (
            <div 
              key={menu.id}
              onClick={() => handleMenuSelect(menu.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedMenu === menu.id 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">{menu.name}</h4>
                {selectedMenu === menu.id && <Check className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-muted-foreground text-sm mt-1">{menu.description}</p>
              <p className="font-semibold mt-2">R{menu.price} pp</p>
            </div>
          ))}
        </div>
      </div>
      
      {selectedMenu && (
        <>
          {/* Step 2: Enter Number of Guests */}
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
          
          {/* If Wedding Menu 1, show Season Selection */}
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

          {/* Step 3: Select Starters (if applicable) */}
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

          {/* Step 4: Select Sides (if applicable) */}
          {sides.length > 0 && getMaxSelections('side') > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {step++}. Select Sides ({selectedSides.length}/{getMaxSelections('side')})
              </h3>
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

          {/* Step 5: Select Desserts (if applicable) */}
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

          {/* Step 6: Select Extras (if applicable) */}
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
            </div>
          )}

          {/* Display Menu Inclusions */}
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

          {/* Display Total Price */}
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
  );
};

export default MenuBuilder;
