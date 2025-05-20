
export interface MenuSelectionType {
  menuPackage?: string;
  numberOfGuests?: number;
  season?: string;
  starters?: string;
  sides?: string;
  desserts?: string;
  extras?: string;
  totalPrice?: number;
  postalCode?: string;
  areaName?: string;
  travelFee?: number | null;
  eventType?: string;
  includeCutlery?: boolean;
}

export const generateRedirectUrl = (menuSelection: MenuSelectionType | null, baseUrl: string): string => {
  if (!menuSelection) return baseUrl;

  // Create an object with all the parameters we want to send
  const params = new URLSearchParams();

  // Add menu selection data to URL parameters
  if (menuSelection.menuPackage) {
    params.append('menuPackage', menuSelection.menuPackage);
  }
  
  if (menuSelection.numberOfGuests) {
    params.append('numberOfGuests', String(menuSelection.numberOfGuests));
  }
  
  if (menuSelection.season) {
    params.append('season', menuSelection.season);
  }
  
  if (menuSelection.starters) {
    params.append('starters', menuSelection.starters);
  }
  
  if (menuSelection.sides) {
    params.append('sides', menuSelection.sides);
  }
  
  if (menuSelection.desserts) {
    params.append('desserts', menuSelection.desserts);
  }
  
  if (menuSelection.extras) {
    params.append('extras', menuSelection.extras);
  }
  
  if (menuSelection.totalPrice) {
    params.append('totalPrice', String(menuSelection.totalPrice));
  }
  
  if (menuSelection.postalCode) {
    params.append('postalCode', menuSelection.postalCode);
  }
  
  if (menuSelection.areaName) {
    params.append('areaName', menuSelection.areaName);
  }
  
  if (menuSelection.travelFee !== null && menuSelection.travelFee !== undefined) {
    params.append('travelFee', String(menuSelection.travelFee));
  }

  // Add event type parameter
  if (menuSelection.eventType) {
    params.append('eventType', menuSelection.eventType);
  }

  // Add includeCutlery parameter
  if (menuSelection.includeCutlery !== undefined) {
    params.append('includeCutlery', String(menuSelection.includeCutlery));
  }

  // Format and join all parameters
  return `${baseUrl}?${params.toString()}`;
};
