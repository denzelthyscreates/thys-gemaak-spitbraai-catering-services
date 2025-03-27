import React from 'react';
import { Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuOption } from '@/types/menu';
import { useMenu } from '@/contexts/MenuContext';

interface MenuConfigurationProps {
  menuOptions: MenuOption[];
}

export const MenuConfiguration = ({ menuOptions }: MenuConfigurationProps) => {
  const {
    selectedMenu,
    numGuests,
    selectedSeason,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    setNumGuests,
    setSelectedSeason,
    setSelectedStarters,
    setSelectedSides,
    setSelectedDesserts,
    setSelectedExtras,
    setExtraSaladType
  } = useMenu();

  if (!selectedMenu) return null;

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
          if (selectedMenu === 'business') {
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

  const getMaxSelections = (category: 'starter' | 'side' | 'dessert') => {
    if (!selectedMenu) return 0;
    switch (category) {
      case 'starter':
        if (selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') return 1;
        return 0;
      case 'side':
        if (selectedMenu === 'business' || selectedMenu === 'menu3' || selectedMenu === 'matric_premium') return 3;
        if (selectedMenu === 'menu1' || selectedMenu === 'menu2' || selectedMenu === 'wedding2' || selectedMenu === 'standard' || selectedMenu === 'yearend' || selectedMenu === 'matric_standard') return 2;
        return selectedMenu === 'wedding1' ? 0 : 0;
      case 'dessert':
        if (selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') return 1;
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="mb-6">
      <div className="space-y-4">
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
                onClick={() => setSelectedSeason('summer')}
              >
                Summer Menu
              </Button>
              <Button
                variant={selectedSeason === 'winter' ? 'default' : 'outline'}
                onClick={() => setSelectedSeason('winter')}
              >
                Winter Menu
              </Button>
            </div>
          </div>
        )}

        {getMaxSelections('starter') > 0 && (
          <div className="p-4 rounded-lg bg-card border">
            <h4 className="text-lg font-medium mb-4">Choose Starter</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuOptions
                .filter((option) => option.category === 'starter')
                .map((starter) => (
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
            <h4 className="text-lg font-medium mb-4">Choose Sides</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuOptions
                .filter((option) => option.category === 'side')
                .map((side) => (
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
              {menuOptions
                .filter((option) => option.category === 'dessert')
                .map((dessert) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuOptions
              .filter((option) => option.category === 'extra')
              .map((extra) => (
                <div
                  key={extra.id}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedExtras.includes(extra.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleOption(extra.id, 'extra')}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{extra.name}</span>
                    {selectedExtras.includes(extra.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{extra.description}</p>
                  <p className="text-sm font-medium mt-2">
                    {extra.id === 'cheese_table' || extra.id === 'fruit_table' 
                      ? `R${extra.price} (table)` 
                      : `R${extra.price} per person`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
