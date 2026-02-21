
export interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
  eventType?: 'birthday' | 'business' | 'wedding' | 'standard' | 'yearend' | 'matric' | 'braaionly' | 'platters';
  subtitle?: string;
  availabilityInfo?: string;
  icon?: JSX.Element;
  minGuests?: number;
  withoutCutlery?: number;
  seasonOptions?: boolean;
}

export interface MenuBuilderProps {
  onSelectionChange: (selection: any) => void;
  initialSelection?: any;
  onNavigateTab?: (tab: string) => void;
}
