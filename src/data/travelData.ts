
// Re-export everything from the modular travel data files
export type { TravelArea } from './travel/types';
export { travelAreas } from './travel/travelAreas';
export { 
  getTravelFee, 
  getAreaNameByPostalCode, 
  getAreaByPostalCode 
} from './travel/travelUtils';
