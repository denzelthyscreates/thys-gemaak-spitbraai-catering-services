
export interface MenuContextState {
  selectedMenu: string | null;
  selectedStarters: string[];
  selectedSides: string[];
  selectedDesserts: string[];
  selectedExtras: string[];
  selectedSeason: 'summer' | 'winter' | null;
  numGuests: number;
  totalPrice: number;
  extraSaladType: string;
  discountApplied: boolean;
  includeCutlery: boolean;
  postalCode: string;
  travelFee: number | null;
}

export interface MenuContextType extends MenuContextState {
  setSelectedMenu: (menuId: string | null) => void;
  setSelectedStarters: (starters: string[]) => void;
  setSelectedSides: (sides: string[]) => void;
  setSelectedDesserts: (desserts: string[]) => void;
  setSelectedExtras: (extras: string[]) => void;
  setSelectedSeason: (season: 'summer' | 'winter' | null) => void;
  setNumGuests: (num: number) => void;
  setExtraSaladType: (type: string) => void;
  setIncludeCutlery: (include: boolean) => void;
  setPostalCode: (code: string) => void;
  calculateTotalPrice: () => number;
  handleReset: () => void;
}

export interface MenuProviderProps {
  children: React.ReactNode;
}
