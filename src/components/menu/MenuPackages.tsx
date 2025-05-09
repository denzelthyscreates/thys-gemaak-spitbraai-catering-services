
import React, { useState, useEffect } from 'react';
import { Check, Building, Calendar, CalendarCheck, GraduationCap, PartyPopper } from 'lucide-react';
import { MenuOption } from '@/types/menu';
import { useMenu } from '@/contexts/menu';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface MenuPackagesProps {
  menuOptions: MenuOption[];
}

export const MenuPackages = ({ menuOptions }: MenuPackagesProps) => {
  const { selectedMenu, setSelectedMenu } = useMenu();
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Function to get menu options grouped by event type
  const getMenusByEventType = () => {
    const eventGroups = {
      birthday: {
        title: "Birthday Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'birthday' && menu.category === 'menu'),
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        key: "birthday"
      },
      business: {
        title: "Business Event Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'business' && menu.category === 'menu'),
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        key: "business"
      },
      wedding: {
        title: "Wedding Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'wedding' && menu.category === 'menu'),
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        key: "wedding"
      },
      yearend: {
        title: "Year-End Celebration Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'yearend' && menu.category === 'menu'),
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        key: "yearend"
      },
      matric: {
        title: "Matric Farewell 2025 Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'matric' && menu.category === 'menu'),
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        key: "matric"
      },
      standard: {
        title: "Standard Packages",
        menus: menuOptions.filter(menu => menu.eventType === 'standard' && menu.category === 'menu'),
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        key: "standard"
      }
    };

    return Object.entries(eventGroups)
      .filter(([_, group]) => group.menus.length > 0)
      .map(([_, group]) => group);
  };

  // Function to find out which group a menu belongs to
  const findGroupForMenu = (menuId: string) => {
    const groups = getMenusByEventType();
    for (const group of groups) {
      if (group.menus.some(menu => menu.id === menuId)) {
        return group.key;
      }
    }
    return null;
  };

  // Update expanded groups when menu selection changes
  useEffect(() => {
    if (selectedMenu) {
      const groupKey = findGroupForMenu(selectedMenu);
      if (groupKey) {
        const newExpandedGroups: Record<string, boolean> = {};
        
        // Set all groups to collapsed
        getMenusByEventType().forEach(group => {
          newExpandedGroups[group.key] = false;
        });
        
        // Expand only the group with the selected menu
        newExpandedGroups[groupKey] = true;
        
        setExpandedGroups(newExpandedGroups);
      }
    } else {
      // When no menu is selected, expand all groups
      const allExpanded: Record<string, boolean> = {};
      getMenusByEventType().forEach(group => {
        allExpanded[group.key] = true;
      });
      setExpandedGroups(allExpanded);
    }
  }, [selectedMenu]);

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

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  return (
    <div>
      {getMenusByEventType().map((group) => (
        <div key={group.key} className={`mb-8 p-4 rounded-lg ${group.bgColor} ${group.borderColor} border`}>
          <Collapsible 
            open={expandedGroups[group.key]} 
            onOpenChange={() => toggleGroup(group.key)}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">{group.title}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {expandedGroups[group.key] ? '−' : '+'}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
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
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};
