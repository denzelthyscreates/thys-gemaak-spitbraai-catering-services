
import React from 'react';
import { Check, Building, Calendar, CalendarCheck, GraduationCap, PartyPopper } from 'lucide-react';
import { MenuOption } from '@/types/menu';
import { useMenu } from '@/contexts/MenuContext';
import { useToast } from '@/hooks/use-toast';

interface MenuPackagesProps {
  menuOptions: MenuOption[];
}

export const MenuPackages = ({ menuOptions }: MenuPackagesProps) => {
  const { selectedMenu, setSelectedMenu } = useMenu();
  const { toast } = useToast();

  const getMenusByEventType = () => {
    const eventGroups = {
      birthday: {
        title: "Birthday Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'birthday'),
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200"
      },
      business: {
        title: "Business Event Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'business'),
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      },
      wedding: {
        title: "Wedding Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'wedding'),
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      },
      yearend: {
        title: "Year-End Celebration Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'yearend'),
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      },
      matric: {
        title: "Matric Farewell 2025 Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'matric'),
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      standard: {
        title: "Standard Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'standard'),
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      }
    };

    return Object.entries(eventGroups)
      .filter(([_, group]) => group.menus.length > 0)
      .map(([_, group]) => group);
  };

  const handleMenuSelect = (menuOption: MenuOption) => {
    setSelectedMenu(menuOption.id);
    if (menuOption.availabilityInfo) {
      toast({
        title: `${menuOption.name} Availability`,
        description: menuOption.availabilityInfo,
        duration: 5000
      });
    }
  };

  return (
    <div>
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
                onClick={() => handleMenuSelect(menuOption)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {menuOption.icon}
                    <div>
                      <h5 className="font-medium">{menuOption.name}</h5>
                      {menuOption.subtitle && (
                        <p className="text-sm text-muted-foreground">{menuOption.subtitle}</p>
                      )}
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
    </div>
  );
};
