import React, { useState } from 'react';
import { Check, X, ShoppingCart } from 'lucide-react';

interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
}

const MenuBuilder = ({ onSelectionChange }: { onSelectionChange: (selection: any) => void }) => {
  // Updated menu data from the uploaded documents
  const menuOptions: MenuOption[] = [
    // Menu Packages
    { id: 'menu1', name: 'Birthday Menu 1', price: 169, description: 'Lamb Spit Main, Garlic Bread, 2 Salads', category: 'menu' },
    { id: 'menu2', name: 'Birthday Menu 2', price: 185, description: 'Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', category: 'menu' },
    { id: 'menu3', name: 'Birthday Menu 3', price: 195, description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', category: 'menu' },
    { id: 'corporate', name: 'Corporate Menu', price: 290, description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', category: 'menu' },
    { id: 'wedding1', name: 'Wedding Menu 1', price: 195, description: '3 Course Meal with starter, main course, and dessert', category: 'menu' },
    { id: 'wedding2', name: 'Wedding Menu 2', price: 169, description: 'Lamb Spit, Garlic Bread, and 2 sides', category: 'menu' },
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
    
    // Extras
    { id: 'cheese_table', name: 'Cheese Table', price: 1900, description: 'Assorted cheese platter', category: 'extra' },
    { id: 'fruit_table', name: 'Fruit Table', price: 900, description: 'Fresh fruit display', category: 'extra' },
    { id: 'chicken_thigh', name: 'Chicken Thigh', price: 25, description: 'Per person', category: 'extra' },
    { id: 'extra_salad', name: 'Extra Salad', price: 25, description: 'Per person', category: 'extra' },
  ];

  // State for menu selections
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | null>(null);
  
  // Selection logic based on menu type
  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    setSelectedStarters([]);
    setSelectedSides([]);
    setSelectedDesserts([]);
    setSelectedSeason(null);
    
    // Clear or set default selections based on menu
    if (menuId === 'menu1' || menuId === 'menu2') {
      setSelectedSides([]);
    } else if (menuId === 'menu3' || menuId === 'corporate') {
      setSelectedStarters([]);
      setSelectedSides([]);
      setSelectedDesserts([]);
    } else if (menuId === 'wedding1') {
      setSelectedStarters([]);
      setSelectedSides([]);
      setSelectedDesserts([]);
      // Wedding Menu 1 requires season selection
      setSelectedSeason(null);
    } else if (menuId === 'wedding2' || menuId === 'standard') {
      setSelectedSides([]);
    }
    
    // Update the parent component
    setTimeout(updateSelectionSummary, 0);
  };
  
  const handleSeasonSelect = (season: 'summer' | 'winter') => {
    setSelectedSeason(season);
    setSelectedSides([]);
    
    // Update the parent component
    setTimeout(updateSelectionSummary, 0);
  };
  
  const toggleOption = (id: string, category: 'starter' | 'side' | 'dessert' | 'extra') => {
    let updatedSelection: string[] = [];
    
    switch (category) {
      case 'starter':
        if (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') {
          // Only one starter for these menus
          updatedSelection = selectedStarters.includes(id) ? [] : [id];
          setSelectedStarters(updatedSelection);
        }
        break;
        
      case 'side':
        updatedSelection = [...selectedSides];
        if (updatedSelection.includes(id)) {
          updatedSelection = updatedSelection.filter(item => item !== id);
        } else {
          // Check max sides based on menu
          let maxSides = 2;
          if (selectedMenu === 'corporate') {
            maxSides = 3;
          } else if (selectedMenu === 'menu1' || selectedMenu === 'menu2') {
            maxSides = 2;
          } else if (selectedMenu === 'wedding1') {
            // Wedding Menu 1 has fixed sides based on season
            return;
          }
          
          if (updatedSelection.length < maxSides) {
            updatedSelection.push(id);
          } else {
            updatedSelection.shift(); // Remove first item if at max
            updatedSelection.push(id);
          }
        }
        setSelectedSides(updatedSelection);
        break;
        
      case 'dessert':
        if (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') {
          // Only one dessert for these menus
          updatedSelection = selectedDesserts.includes(id) ? [] : [id];
          setSelectedDesserts(updatedSelection);
        }
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
    
    // Update the parent component
    setTimeout(updateSelectionSummary, 0);
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedMenu) return 0;
    
    const menuPrice = menuOptions.find(opt => opt.id === selectedMenu)?.price || 0;
    
    // Calculate extras price
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = menuOptions.find(opt => opt.id === extraId);
      if (extra?.id === 'chicken_thigh' || extra?.id === 'extra_salad') {
        // Per person extras
        return total + (extra?.price || 0);
      } else {
        // Fixed price extras
        return total + (extra?.price || 0);
      }
    }, 0);
    
    return menuPrice + extrasPrice;
  };
  
  // Create selection summary for parent component
  const updateSelectionSummary = () => {
    const menuName = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
    const starterNames = selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const sideNames = selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const dessertNames = selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const extraNames = selectedExtras.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const totalPrice = calculateTotalPrice();
    
    let seasonInfo = '';
    if (selectedMenu === 'wedding1' && selectedSeason) {
      seasonInfo = `Season: ${selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}`;
    }
    
    const selectionSummary = {
      menuPackage: menuName,
      season: selectedSeason,
      starters: starterNames.join(', '),
      sides: sideNames.join(', '),
      desserts: dessertNames.join(', '),
      extras: extraNames.join(', '),
      totalPrice: totalPrice,
      fullSelection: `
        Menu Package: ${menuName}
        ${seasonInfo ? `${seasonInfo}\n` : ''}
        ${starterNames.length > 0 ? `Starters: ${starterNames.join(', ')}` : ''}
        ${sideNames.length > 0 ? `Sides: ${sideNames.join(', ')}` : ''}
        ${dessertNames.length > 0 ? `Desserts: ${dessertNames.join(', ')}` : ''}
        ${extraNames.length > 0 ? `Extras: ${extraNames.join(', ')}` : ''}
        Total Price: R${totalPrice}
      `
    };
    
    onSelectionChange(selectionSummary);
  };
  
  // Filter options by category
  const menuPackages = menuOptions.filter(opt => opt.category === 'menu');
  const starters = menuOptions.filter(opt => opt.category === 'starter');
  const sides = menuOptions.filter(opt => opt.category === 'side');
  const desserts = menuOptions.filter(opt => opt.category === 'dessert');
  const extras = menuOptions.filter(opt => opt.category === 'extra');
  
  // Get available sides based on menu and season
  const getAvailableSides = () => {
    if (selectedMenu === 'wedding1' && selectedSeason === 'winter') {
      return sides.filter(side => 
        ['baby_potatoes', 'baby_carrots', 'baby_onions'].includes(side.id)
      );
    } else if (selectedMenu === 'wedding1' && selectedSeason === 'summer') {
      return sides.filter(side => 
        ['potato_salad', 'curry_noodle', 'green_salad'].includes(side.id)
      );
    }
    return sides;
  };
  
  const getMaxSelections = (category: 'starter' | 'side' | 'dessert') => {
    if (!selectedMenu) return 0;
    
    switch (category) {
      case 'starter':
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      case 'side':
        if (selectedMenu === 'corporate') return 3;
        if (selectedMenu === 'menu1' || selectedMenu === 'menu2' || selectedMenu === 'wedding2' || selectedMenu === 'standard') return 2;
        if (selectedMenu === 'wedding1') return 0; // Fixed sides based on season
        return 0;
      case 'dessert':
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      default:
        return 0;
    }
  };
  
  // Get what's included in the menu
  const getMenuInclusions = () => {
    if (!selectedMenu) return [];
    
    const inclusions = [];
    
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
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">1. Select Your Menu Package</h3>
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
      
      {selectedMenu === 'wedding1' && (
        <div className="mb-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">2. Select Season (Wedding Menu 1)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => handleSeasonSelect('summer')}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedSeason === 'summer' 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Summer Menu</h4>
                {selectedSeason === 'summer' && <Check className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-muted-foreground text-sm mt-1">Includes Potato Salad, Curry Noodle Salad, Green Salad</p>
            </div>
            <div 
              onClick={() => handleSeasonSelect('winter')}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedSeason === 'winter' 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Winter Menu</h4>
                {selectedSeason === 'winter' && <Check className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-muted-foreground text-sm mt-1">Includes Baby Potatoes, Baby Carrots, Baby Onions</p>
            </div>
          </div>
        </div>
      )}
      
      {selectedMenu && (
        <>
          {getMaxSelections('starter') > 0 && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">
                {selectedMenu === 'wedding1' ? '3' : '2'}. Select Your Starter {selectedStarters.length}/{getMaxSelections('starter')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {starters.map((starter) => (
                  <div 
                    key={starter.id}
                    onClick={() => toggleOption(starter.id, 'starter')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedStarters.includes(starter.id) 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{starter.name}</h4>
                      {selectedStarters.includes(starter.id) && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{starter.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {getMaxSelections('side') > 0 && (
            <div className="mb-8 animate-fade-in delay-100">
              <h3 className="text-xl font-semibold mb-4">
                {selectedMenu === 'wedding1' ? '4' : selectedMenu === 'menu3' || selectedMenu === 'corporate' ? '3' : '2'}. 
                Select Your Sides {selectedSides.length}/{getMaxSelections('side')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getAvailableSides().map((side) => (
                  <div 
                    key={side.id}
                    onClick={() => toggleOption(side.id, 'side')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedSides.includes(side.id) 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{side.name}</h4>
                      {selectedSides.includes(side.id) && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{side.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {getMaxSelections('dessert') > 0 && (
            <div className="mb-8 animate-fade-in delay-200">
              <h3 className="text-xl font-semibold mb-4">
                {selectedMenu === 'wedding1' ? '5' : '4'}. Select Your Dessert {selectedDesserts.length}/{getMaxSelections('dessert')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {desserts.map((dessert) => (
                  <div 
                    key={dessert.id}
                    onClick={() => toggleOption(dessert.id, 'dessert')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedDesserts.includes(dessert.id) 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{dessert.name}</h4>
                      {selectedDesserts.includes(dessert.id) && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{dessert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-8 animate-fade-in delay-300">
            <h3 className="text-xl font-semibold mb-4">
              {selectedMenu === 'wedding1' && getMaxSelections('dessert') > 0 ? '6' : 
               getMaxSelections('dessert') > 0 ? '5' : 
               getMaxSelections('side') > 0 ? '3' : '2'}. Select Optional Extras
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {extras.map((extra) => (
                <div 
                  key={extra.id}
                  onClick={() => toggleOption(extra.id, 'extra')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedExtras.includes(extra.id) 
                      ? 'border-primary bg-primary/10 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{extra.name}</h4>
                    {selectedExtras.includes(extra.id) && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{extra.description}</p>
                  <p className="font-semibold mt-1">R{extra.price}{extra.id === 'chicken_thigh' || extra.id === 'extra_salad' ? ' pp' : ''}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-primary/10 rounded-lg mb-8 animate-fade-in delay-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Your Selection Summary</h3>
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            
            {selectedMenu && (
              <>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Menu Package:</span>
                  <span className="font-medium">{menuOptions.find(opt => opt.id === selectedMenu)?.name}</span>
                </div>
                
                {selectedMenu === 'wedding1' && selectedSeason && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Season:</span>
                    <span className="font-medium">{selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}</span>
                  </div>
                )}
                
                {selectedStarters.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Starter:</span>
                    <span className="font-medium">
                      {selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
                
                {selectedSides.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Sides:</span>
                    <span className="font-medium">
                      {selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
                
                {selectedDesserts.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Dessert:</span>
                    <span className="font-medium">
                      {selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
                
                {selectedExtras.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span>Extras:</span>
                    <span className="font-medium">
                      {selectedExtras.map(id => menuOptions.find(opt => opt.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between pt-4 text-lg font-semibold">
                  <span>Total Price:</span>
                  <span>R{calculateTotalPrice()} pp</span>
                </div>
                
                {getMenuInclusions().length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-semibold mb-2">Included in the Price:</h4>
                    <ul className="list-disc pl-5">
                      {getMenuInclusions().map((item, index) => (
                        <li key={index} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedMenu === 'wedding1' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Travelling fee charged for all functions outside Stellenbosch.
                    </p>
                  </div>
                )}
              </>
            )}
            
            {!selectedMenu && (
              <p className="text-muted-foreground text-center py-4">Please select a menu package to see your summary.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuBuilder;
