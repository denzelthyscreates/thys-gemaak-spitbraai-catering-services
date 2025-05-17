
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAreaNameByPostalCode } from '@/data/travelData';

interface LocationSectionProps {
  postalCode: string;
  setPostalCode: (code: string) => void;
  showValidation: boolean;
  validationError?: string;
  renderValidationError: (field: string) => React.ReactNode;
}

export const LocationSection = ({ 
  postalCode, 
  setPostalCode, 
  showValidation, 
  validationError,
  renderValidationError
}: LocationSectionProps) => {
  const areaName = postalCode ? getAreaNameByPostalCode(postalCode) : '';
  
  return (
    <div id="postalCode" className="mt-4 pt-4 border-t border-border">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <span className="font-medium flex items-center gap-1">
          Postal Code:
          <span className="text-xs text-red-500 ml-1">*</span>
        </span>
        <div className="col-span-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={`pl-9 h-9 max-w-[12rem] ${showValidation && validationError ? 'border-destructive focus:ring-destructive' : ''}`}
            />
          </div>
          {postalCode && areaName && (
            <p className="text-sm mt-1 text-muted-foreground">Area: {areaName}</p>
          )}
        </div>
      </div>
      {renderValidationError('postalCode')}
    </div>
  );
};
