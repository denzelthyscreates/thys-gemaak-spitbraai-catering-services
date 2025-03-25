
export interface MenuOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'menu' | 'starter' | 'side' | 'dessert' | 'extra';
  eventType?: 'birthday' | 'business' | 'wedding' | 'standard' | 'yearend' | 'matric';
  subtitle?: string;
  availabilityInfo?: string;
  icon?: JSX.Element;
}

export interface MenuBuilderProps {
  onSelectionChange: (selection: any) => void;
  initialSelection?: any;
}
