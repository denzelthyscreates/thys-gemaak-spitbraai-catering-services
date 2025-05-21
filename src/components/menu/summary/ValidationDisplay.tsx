
import React from 'react';
import { ValidationErrors } from './ValidationUtils';

interface ValidationDisplayProps {
  showValidation: boolean;
  validationErrors: ValidationErrors;
  field: string;
}

export const ValidationDisplay = ({ showValidation, validationErrors, field }: ValidationDisplayProps) => {
  if (showValidation && validationErrors[field]) {
    return (
      <div className="text-destructive text-sm mt-1 flex items-center">
        <span className="text-xs mr-1">⚠</span>
        {validationErrors[field]}
      </div>
    );
  }
  return null;
};
