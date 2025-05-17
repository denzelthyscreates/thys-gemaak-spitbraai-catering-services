
import React from 'react';
import { MenuOption } from '@/types/menu';

interface MenuSelectionItemProps {
  label: string;
  value: string | React.ReactNode;
  id?: string;
  required?: boolean;
  renderValidationError?: (field: string) => React.ReactNode;
}

export const MenuSelectionItem = ({ 
  label, 
  value, 
  id, 
  required = false,
  renderValidationError 
}: MenuSelectionItemProps) => {
  return (
    <>
      <div id={id} className="grid grid-cols-3 gap-2">
        <span className="font-medium flex items-center gap-1">
          {label}:
          {required && <span className="text-xs text-red-500 ml-1">*</span>}
        </span>
        <span className="col-span-2">
          {value}
        </span>
      </div>
      {id && renderValidationError && renderValidationError(id)}
    </>
  );
};

interface MenuOptionDisplayProps {
  ids: string[];
  menuOptions: MenuOption[];
  extraInfo?: {
    id: string;
    type: string;
  };
}

export const MenuOptionDisplay = ({ ids, menuOptions, extraInfo }: MenuOptionDisplayProps) => {
  if (ids.length === 0) return <>Not selected</>;
  
  return (
    <>
      {ids.map(id => {
        if (extraInfo && id === extraInfo.id && extraInfo.type) {
          const typeName = menuOptions.find(opt => opt.id === extraInfo.type)?.name;
          return `Extra Salad: ${typeName || 'Not specified'}`;
        }
        return menuOptions.find(opt => opt.id === id)?.name;
      }).join(', ')}
    </>
  );
};
