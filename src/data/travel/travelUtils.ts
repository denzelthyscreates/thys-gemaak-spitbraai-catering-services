
import { travelAreas } from './travelAreas';

// Function to get travel fee based on postal code
export const getTravelFee = (postalCode: string): number | null => {
  if (!postalCode) return null;

  const trimmedPostalCode = postalCode.trim();
  const area = travelAreas.find(area => 
    area.postalCodes.includes(trimmedPostalCode)
  );

  return area ? area.fee : null;
};

// Function to get area name based on postal code
export const getAreaNameByPostalCode = (postalCode: string): string | null => {
  if (!postalCode) return null;

  const trimmedPostalCode = postalCode.trim();
  const area = travelAreas.find(area => 
    area.postalCodes.includes(trimmedPostalCode)
  );

  return area ? area.name : null;
};

// Function to get area information based on postal code
export const getAreaByPostalCode = (postalCode: string): { city: string; province: string } | null => {
  if (!postalCode) return null;

  const trimmedPostalCode = postalCode.trim();
  const area = travelAreas.find(area => 
    area.postalCodes.includes(trimmedPostalCode)
  );

  if (!area) return null;

  // Extract city from area name and set province to Western Cape
  return {
    city: area.name,
    province: 'Western Cape'
  };
};
