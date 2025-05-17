
import { getAreaNameByPostalCode } from '@/data/travelData';
import { MenuOption } from '@/types/menu';

interface MenuSelectionData {
  selectedMenu: string | null;
  numGuests: number;
  selectedSeason: string | null;
  selectedStarters: string[];
  selectedSides: string[];
  selectedDesserts: string[];
  selectedExtras: string[];
  extraSaladType: string;
  includeCutlery: boolean;
  totalPrice: number;
  postalCode: string;
  travelFee: number | null;
  eventType: string | null;
}

export const constructRedirectUrl = (
  baseUrl: string,
  data: MenuSelectionData,
  menuOptions: MenuOption[]
): string => {
  // Get the selected menu name
  const menuName = menuOptions.find(opt => opt.id === data.selectedMenu)?.name || '';
  
  // Construct starters, sides, desserts, and extras
  const starterNames = data.selectedStarters.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const sideNames = data.selectedSides.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const dessertNames = data.selectedDesserts.map(id => 
    menuOptions.find(opt => opt.id === id)?.name || '').join(', ');
  
  const extraNames = data.selectedExtras.map(id => {
    if (id === 'extra_salad' && data.extraSaladType) {
      const saladName = menuOptions.find(opt => opt.id === data.extraSaladType)?.name;
      return `Extra Salad: ${saladName || 'Not specified'}`;
    }
    return menuOptions.find(opt => opt.id === id)?.name;
  }).join(', ');
  
  const areaName = getAreaNameByPostalCode(data.postalCode) || '';
  const finalTotalPrice = data.travelFee ? data.totalPrice * data.numGuests + data.travelFee : data.totalPrice * data.numGuests;
  
  // Build the parameters
  const params = new URLSearchParams({
    'menu_package': menuName,
    'guests': data.numGuests.toString(),
    'price_per_person': data.totalPrice.toString(),
    'total_price': finalTotalPrice.toString(),
    'event_type': data.eventType || '',
    'cutlery': data.includeCutlery ? 'Yes' : 'No'
  });
  
  // Add conditional parameters
  if (data.selectedSeason) params.append('season', data.selectedSeason);
  if (starterNames) params.append('starters', starterNames);
  if (sideNames) params.append('sides', sideNames);
  if (dessertNames) params.append('desserts', dessertNames);
  if (extraNames) params.append('extras', extraNames);
  if (data.postalCode) params.append('postal_code', data.postalCode);
  if (areaName) params.append('area', areaName);
  if (data.travelFee) params.append('travel_fee', data.travelFee.toString());
  
  // Create the final URL with parameters
  return `${baseUrl}&${params.toString()}`;
};
