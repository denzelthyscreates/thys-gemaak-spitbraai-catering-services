
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
  // Menu data from the uploaded images
  const menuOptions: MenuOption[] = [
    // Menu Packages
    { id: 'menu1', name: 'Menu 1 (Basic)', price: 169, description: 'Lamb Spit, Garlic Bread, 2 Salads', category: 'menu' },
    { id: 'menu2', name: 'Menu 2', price: 185, description: 'Lamb Spit, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', category: 'menu' },
    { id: 'menu3', name: 'Menu 3', price: 195, description: 'Starter, Lamb Spit, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', category: 'menu' },
    { id: 'corporate', name: 'Corporate Menu', price: 290, description: 'Starter, Lamb Spit, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', category: 'menu' },
    { id: 'wedding1', name: 'Wedding Menu 1', price: 195, description: '3 Course Meal with starter, main, and dessert', category: 'menu' },
    
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
  
  // Selection logic based on menu type
  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    setSelectedStarters([]);
    setSelectedSides([]);
    setSelectedDesserts([]);
    
    // Clear or set default selections based on menu
    if (menuId === 'menu1' || menuId === 'menu2') {
      setSelectedSides([]);
    } else if (menuId === 'menu3' || menuId === 'corporate' || menuId === 'wedding1') {
      setSelectedStarters([]);
      setSelectedSides([]);
      setSelectedDesserts([]);
    }
    
    // Update the parent component
    updateSelectionSummary();
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
          const maxSides = selectedMenu === 'corporate' ? 3 : 2;
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
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = menuOptions.find(opt => opt.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    
    return menuPrice + extrasPrice;
  };
  
  // Create selection summary for HubSpot
  const updateSelectionSummary = () => {
    const menuName = menuOptions.find(opt => opt.id === selectedMenu)?.name || '';
    const starterNames = selectedStarters.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const sideNames = selectedSides.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const dessertNames = selectedDesserts.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const extraNames = selectedExtras.map(id => menuOptions.find(opt => opt.id === id)?.name || '');
    const totalPrice = calculateTotalPrice();
    
    const selectionSummary = {
      menuPackage: menuName,
      starters: starterNames.join(', '),
      sides: sideNames.join(', '),
      desserts: dessertNames.join(', '),
      extras: extraNames.join(', '),
      totalPrice: totalPrice,
      fullSelection: `
        Menu Package: ${menuName}
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
  
  const getMaxSelections = (category: 'starter' | 'side' | 'dessert') => {
    if (!selectedMenu) return 0;
    
    switch (category) {
      case 'starter':
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      case 'side':
        return selectedMenu === 'corporate' ? 3 : 2;
      case 'dessert':
        return (selectedMenu === 'menu3' || selectedMenu === 'corporate' || selectedMenu === 'wedding1') ? 1 : 0;
      default:
        return 0;
    }
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
      
      {selectedMenu && (
        <>
          {getMaxSelections('starter') > 0 && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">2. Select Your Starter {selectedStarters.length}/{getMaxSelections('starter')}</h3>
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
              <h3 className="text-xl font-semibold mb-4">3. Select Your Sides {selectedSides.length}/{getMaxSelections('side')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sides.map((side) => (
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
              <h3 className="text-xl font-semibold mb-4">4. Select Your Dessert {selectedDesserts.length}/{getMaxSelections('dessert')}</h3>
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
            <h3 className="text-xl font-semibold mb-4">5. Select Optional Extras</h3>
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
                  <p className="font-semibold mt-1">R{extra.price}</p>
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
