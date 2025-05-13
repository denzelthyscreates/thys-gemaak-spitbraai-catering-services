
export interface TravelArea {
  name: string;
  postalCodes: string[];
  fee: number;
}

// This is a placeholder - you should replace this with your actual postal code mappings
export const travelAreas: TravelArea[] = [
  {
    name: "Cape Town CBD",
    postalCodes: ["8001", "8002"],
    fee: 200
  },
  {
    name: "Northern Suburbs",
    postalCodes: ["7530", "7550", "7560", "7570", "7580"],
    fee: 300
  },
  {
    name: "Southern Suburbs",
    postalCodes: ["7700", "7701", "7708", "7800", "7801"],
    fee: 350
  },
  {
    name: "West Coast",
    postalCodes: ["7390", "7395", "7396", "7399", "7441"],
    fee: 400
  },
  {
    name: "Helderberg",
    postalCodes: ["7130", "7135", "7140", "7142"],
    fee: 450
  },
  {
    name: "Overberg",
    postalCodes: ["7160", "7170", "7180", "7190", "7195"],
    fee: 600
  }
];

// Function to get travel fee based on postal code
export const getTravelFee = (postalCode: string): number | null => {
  if (!postalCode) return null;
  
  // Find the area that contains this postal code
  const area = travelAreas.find(area => 
    area.postalCodes.includes(postalCode)
  );
  
  return area ? area.fee : null;
};

// Function to get area name based on postal code
export const getAreaNameByPostalCode = (postalCode: string): string => {
  if (!postalCode) return "Unknown area";
  
  const area = travelAreas.find(area => 
    area.postalCodes.includes(postalCode)
  );
  
  return area ? area.name : "Other location";
};
