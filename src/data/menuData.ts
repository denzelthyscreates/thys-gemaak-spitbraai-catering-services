
import { MenuOption } from '@/types/menu';
import { PartyPopper, Building, CalendarCheck, Calendar, GraduationCap } from 'lucide-react';
import React from 'react';

// Create icon generator functions to avoid using JSX directly in the object
const createPartyPopperIcon = () => React.createElement(PartyPopper, { className: "h-5 w-5 text-pink-500" });
const createBuildingIcon = () => React.createElement(Building, { className: "h-5 w-5 text-blue-500" });
const createCalendarCheckIcon = () => React.createElement(CalendarCheck, { className: "h-5 w-5 text-purple-500" });
const createCalendarIcon = (color: string) => React.createElement(Calendar, { className: `h-5 w-5 ${color}` });
const createGraduationCapIcon = () => React.createElement(GraduationCap, { className: "h-5 w-5 text-green-500" });

// Define all menu options in a single place to avoid duplication
export const menuOptions: MenuOption[] = [
  { 
    id: 'menu1', 
    name: 'Essential Celebration', 
    price: 169, 
    description: 'Lamb Spit Main, Garlic Bread, 2 Salads', 
    category: 'menu',
    eventType: 'birthday',
    icon: createPartyPopperIcon(),
    minGuests: 30,
    withoutCutlery: 149
  },
  { 
    id: 'menu2', 
    name: 'Deluxe Celebration Experience', 
    price: 185, 
    description: 'Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads', 
    category: 'menu',
    eventType: 'birthday',
    icon: createPartyPopperIcon(),
    minGuests: 30,
    withoutCutlery: 165
  },
  { 
    id: 'menu3', 
    name: 'Ultimate Birthday Feast', 
    price: 195, 
    description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Juice + 1 Refill, 2 Salads, Dessert', 
    category: 'menu',
    eventType: 'birthday',
    icon: createPartyPopperIcon(),
    minGuests: 30,
    withoutCutlery: 175
  },
  
  { 
    id: 'business', 
    name: 'Executive Premium Experience', 
    price: 290, 
    description: 'Starter, Lamb Spit Main, Chicken Drumstick, Garlic Bread, Water & Juice, 3 Sides, Dessert', 
    category: 'menu',
    eventType: 'business',
    icon: createBuildingIcon(),
    minGuests: 30,
    withoutCutlery: 270
  },
  
  { 
    id: 'wedding2', 
    name: 'Classic Wedding Celebration', 
    price: 169, 
    description: 'Lamb Spit, Garlic Bread, and 2 sides', 
    category: 'menu',
    eventType: 'wedding',
    icon: createCalendarCheckIcon(),
    minGuests: 50,
    withoutCutlery: 149
  },
  { 
    id: 'wedding1', 
    name: 'Luxury Wedding Experience', 
    price: 195, 
    description: '3 Course Meal (Starter, Main & Dessert)', 
    category: 'menu',
    eventType: 'wedding',
    icon: createCalendarCheckIcon(),
    minGuests: 50,
    withoutCutlery: 175
  },
  
  { 
    id: 'standard', 
    name: 'Classic Spitbraai Selection', 
    price: 169, 
    description: 'Lamb Spit, Garlic Bread, and 2 sides', 
    category: 'menu',
    eventType: 'standard',
    icon: createCalendarIcon("text-gray-500"),
    minGuests: 30,
    withoutCutlery: 149
  },
  
  { 
    id: 'yearend', 
    name: 'Signature Year-End Celebration', 
    price: 160, 
    description: 'Lamb Spit, Garlic Bread, and 2 sides', 
    category: 'menu',
    eventType: 'yearend',
    availabilityInfo: 'Available only for year-end business events (November-December)',
    icon: createCalendarIcon("text-orange-500"),
    minGuests: 30,
    withoutCutlery: 140
  },
  
  { 
    id: 'matric_standard', 
    name: 'Essential Matric Farewell 2025', 
    price: 169, 
    description: 'Lamb Spit, Garlic Bread, and any 2 sides from our selection', 
    category: 'menu', 
    subtitle: 'Standard Matric Farewell Package',
    eventType: 'matric',
    availabilityInfo: 'Available exclusively for school Matric Farewell events',
    icon: createGraduationCapIcon(),
    minGuests: 50,
    withoutCutlery: 149
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
    icon: createGraduationCapIcon(),
    minGuests: 50,
    withoutCutlery: 175,
    seasonOptions: true
  },
  
  { id: 'cocktail_burger', name: 'Cocktail Burger', price: 0, description: 'Mini burger appetizer', category: 'starter', eventType: 'standard' },
  { id: 'curry_rooti', name: 'Curry Rooti', price: 0, description: 'Curry-filled flatbread', category: 'starter', eventType: 'standard' },
  
  { id: 'curry_noodle', name: 'Curry Noodle Salad', price: 0, description: 'Spiced noodle salad', category: 'side', eventType: 'standard' },
  { id: 'green_salad', name: 'Green Salad', price: 0, description: 'Fresh green salad', category: 'side', eventType: 'standard' },
  { id: 'potato_salad', name: 'Potato Salad', price: 0, description: 'Creamy potato salad', category: 'side', eventType: 'standard' },
  { id: 'three_bean', name: 'Three Bean Salad', price: 0, description: 'Mixed bean salad', category: 'side', eventType: 'standard' },
  { id: 'baby_potatoes', name: 'Baby Potatoes', price: 0, description: 'Roasted baby potatoes', category: 'side', eventType: 'standard' },
  { id: 'baby_carrots', name: 'Baby Carrots', price: 0, description: 'Glazed baby carrots', category: 'side', eventType: 'standard' },
  { id: 'baby_onions', name: 'Baby Onions', price: 0, description: 'Caramelized baby onions', category: 'side', eventType: 'standard' },
  
  { id: 'malva_custard', name: 'Malva Custard', price: 0, description: 'Traditional South African dessert', category: 'dessert', eventType: 'standard' },
  { id: 'ice_cream', name: 'Ice Cream & Chocolate Sauce', price: 0, description: 'Classic ice cream with chocolate', category: 'dessert', eventType: 'standard' },
  
  { id: 'cheese_table', name: 'Cheese Table', price: 1900, description: 'Assorted cheese platter', category: 'extra', eventType: 'standard' },
  { id: 'fruit_table', name: 'Fruit Table', price: 900, description: 'Fresh fruit display', category: 'extra', eventType: 'standard' },
  { id: 'chicken_thigh', name: 'Chicken Thigh', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
  { id: 'extra_salad', name: 'Extra Salad', price: 25, description: 'Per person', category: 'extra', eventType: 'standard' },
];

