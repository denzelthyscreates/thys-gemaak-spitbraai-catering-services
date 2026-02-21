
import React from 'react';
import { Building, Calendar, CalendarCheck, Flame, GraduationCap, PartyPopper, Users, UtensilsCrossed } from 'lucide-react';
import { useMenu } from '@/contexts/menu';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

interface EventType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const eventTypes: EventType[] = [
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    icon: <PartyPopper className="h-8 w-8 text-pink-500" />,
    description: 'Perfect for birthdays and personal celebrations'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: <Calendar className="h-8 w-8 text-purple-500" />,
    description: 'Special menus for your wedding day'
  },
  {
    id: 'business',
    name: 'Business Event',
    icon: <Building className="h-8 w-8 text-blue-500" />,
    description: 'Professional catering for corporate functions'
  },
  {
    id: 'yearend',
    name: 'Year-End Function',
    icon: <CalendarCheck className="h-8 w-8 text-orange-500" />,
    description: 'Celebrate the end of the year in style'
  },
  {
    id: 'matric',
    name: 'Matric Farewell',
    icon: <GraduationCap className="h-8 w-8 text-green-500" />,
    description: 'Make your matric farewell special'
  },
  {
    id: 'standard',
    name: 'Family Gathering',
    icon: <Users className="h-8 w-8 text-gray-500" />,
    description: 'Standard packages for any gathering'
  },
  {
    id: 'braaionly',
    name: 'Braai Only Catering',
    icon: <Flame className="h-8 w-8 text-red-500" />,
    description: 'Traditional braai with chops, drumsticks and sausage'
  },
  {
    id: 'platters',
    name: 'Platter Menu',
    icon: <UtensilsCrossed className="h-8 w-8 text-amber-500" />,
    description: 'Individually priced platters for any occasion'
  }
];

export const EventTypeSelector = () => {
  const { eventType, setEventType } = useMenu();

  const handleSelect = (typeId: string) => {
    setEventType(typeId);
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Step 1: What type of event are you planning?</h3>
      <p className="text-muted-foreground mb-6">
        Select your event type to see the most suitable menu packages.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              eventType === type.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-background">
                  {type.icon}
                </div>
                <div>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription className="mt-1">{type.description}</CardDescription>
                </div>
              </div>
              {eventType === type.id && (
                <div className="mt-4 text-sm text-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Selected
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
