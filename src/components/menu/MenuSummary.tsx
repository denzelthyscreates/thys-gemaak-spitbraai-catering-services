
import React, { useState } from 'react';
import { Check, X } from 'lucide-react'; 
import { useMenu } from '@/contexts/menu';
import { MenuOption } from '@/types/menu';
import { getAreaNameByPostalCode } from '@/data/travelData';

// Import refactored components
import { MenuInclusions } from './summary/MenuInclusions';
import { LocationSection } from './summary/LocationSection';
import { PricingSection } from './summary/PricingSection';
import { MenuSelectionItem, MenuOptionDisplay } from './summary/MenuSelectionItem';
import { ValidationDisplay } from './summary/ValidationDisplay';
import { BookingRedirect } from './summary/BookingRedirect';
import { validateMenuSelection, ValidationErrors } from './summary/ValidationUtils';

interface MenuSummaryProps {
  menuOptions: MenuOption[];
  onNextStep?: () => void;
}

export const MenuSummary = ({ menuOptions, onNextStep }: MenuSummaryProps) => {
  const {
    selectedMenu,
    numGuests,
    selectedSeason,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    includeCutlery,
    totalPrice,
    discountApplied,
    postalCode,
    travelFee,
    eventType,
    setPostalCode
  } = useMenu();
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);
  
  // Updated Systeme.io form URL
  const systemeBaseUrl = "https://spitbraai-thysgemaak.systeme.io/bookingform";

  if (!selectedMenu) return null;

  const renderValidationError = (field: string) => {
    return <ValidationDisplay 
      showValidation={showValidation} 
      validationErrors={validationErrors} 
      field={field} 
    />;
  };

  const isValid = () => {
    const errors = validateMenuSelection(
      selectedMenu,
      numGuests,
      selectedSeason,
      selectedStarters,
      selectedSides,
      selectedDesserts,
      postalCode,
      menuOptions
    );
    setValidationErrors(errors);
    setShowValidation(true);
    
    return Object.keys(errors).length === 0;
  };

  const scrollToFirstError = () => {
    const firstErrorKey = Object.keys(validationErrors)[0];
    const element = document.getElementById(firstErrorKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const selectedMenuOption = menuOptions.find(opt => opt.id === selectedMenu);
  const minGuests = selectedMenuOption?.minGuests || 30;
  const areaName = postalCode ? getAreaNameByPostalCode(postalCode) : '';

  const menuState = {
    selectedMenu,
    numGuests,
    selectedSeason,
    selectedStarters,
    selectedSides,
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    includeCutlery,
    totalPrice,
    postalCode,
    travelFee,
    eventType
  };

  return (
    <div className="rounded-lg border p-4 bg-muted/50 mt-8">
      <h3 className="text-lg font-medium mb-3">Your Menu Selection Summary</h3>
      <MenuSelectionContent 
        menuOptions={menuOptions}
        minGuests={minGuests}
        selectedMenuOption={selectedMenuOption}
        menuState={menuState}
        renderValidationError={renderValidationError}
      />
      
      {/* Menu Inclusions */}
      <MenuInclusions selectedMenu={selectedMenu} includeCutlery={includeCutlery} />

      {/* Travel Fee Section */}
      <LocationSection 
        postalCode={postalCode}
        setPostalCode={setPostalCode}
        showValidation={showValidation}
        validationError={validationErrors.postalCode}
        renderValidationError={renderValidationError}
      />

      {/* Pricing */}
      <PricingSection 
        totalPrice={totalPrice}
        numGuests={numGuests}
        travelFee={travelFee}
        areaName={areaName}
        discountApplied={discountApplied}
      />
      
      {/* Book button - redirects directly to Systeme */}
      {selectedMenu && (
        <BookingRedirect 
          isValid={isValid()}
          redirectUrl={systemeBaseUrl}
          menuState={menuState}
          validationErrors={validationErrors}
          menuOptions={menuOptions}
          scrollToFirstError={scrollToFirstError}
          onNextStep={onNextStep}
        />
      )}
    </div>
  );
};

// Extract the menu selection content into a separate component
interface MenuSelectionContentProps {
  menuOptions: MenuOption[];
  minGuests: number;
  selectedMenuOption: MenuOption | undefined;
  menuState: {
    selectedMenu: string | null;
    numGuests: number;
    selectedSeason: 'summer' | 'winter' | null;
    selectedStarters: string[];
    selectedSides: string[];
    selectedDesserts: string[];
    selectedExtras: string[];
    extraSaladType: string;
    includeCutlery: boolean;
  };
  renderValidationError: (field: string) => React.ReactNode;
}

const MenuSelectionContent = ({ 
  menuOptions, 
  minGuests,
  selectedMenuOption,
  menuState,
  renderValidationError 
}: MenuSelectionContentProps) => {
  const { 
    selectedMenu, 
    numGuests, 
    selectedSeason, 
    selectedStarters, 
    selectedSides, 
    selectedDesserts,
    selectedExtras,
    extraSaladType,
    includeCutlery 
  } = menuState;

  return (
    <div className="space-y-2">
      {/* Menu Package */}
      <MenuSelectionItem 
        label="Package" 
        value={menuOptions.find(opt => opt.id === selectedMenu)?.name || ''} 
        id="menu"
        required={true}
        renderValidationError={renderValidationError}
      />

      {/* Guests */}
      <MenuSelectionItem 
        label="Guests" 
        value={<>{numGuests} <span className="text-sm text-muted-foreground">(Minimum: {minGuests})</span></>} 
        id="guests"
        required={true}
        renderValidationError={renderValidationError}
      />

      {/* Cutlery & Crockery */}
      <RenderCutleryOption includeCutlery={includeCutlery} />

      {/* Season */}
      <RenderSeasonOption 
        selectedMenu={selectedMenu} 
        selectedMenuOption={selectedMenuOption} 
        selectedSeason={selectedSeason} 
        renderValidationError={renderValidationError} 
      />

      {/* Starters */}
      <RenderStartersOption 
        selectedMenu={selectedMenu} 
        selectedStarters={selectedStarters} 
        menuOptions={menuOptions} 
        renderValidationError={renderValidationError} 
      />

      {/* Sides */}
      <MenuSelectionItem 
        label="Sides" 
        value={<MenuOptionDisplay ids={selectedSides} menuOptions={menuOptions} />} 
        id="sides"
        required={true}
        renderValidationError={renderValidationError}
      />

      {/* Desserts */}
      <RenderDessertsOption 
        selectedMenu={selectedMenu} 
        selectedDesserts={selectedDesserts} 
        menuOptions={menuOptions} 
        renderValidationError={renderValidationError} 
      />

      {/* Extras */}
      {selectedExtras.length > 0 && (
        <MenuSelectionItem 
          label="Extras" 
          value={<MenuOptionDisplay ids={selectedExtras} menuOptions={menuOptions} extraInfo={{id: 'extra_salad', type: extraSaladType}} />} 
        />
      )}
    </div>
  );
};

// Helper function components to keep the code clean and focused
const RenderCutleryOption = ({ includeCutlery }: { includeCutlery: boolean }) => {
  return (
    <MenuSelectionItem 
      label="Cutlery & Crockery" 
      value={
        includeCutlery ? (
          <>
            <Check className="h-4 w-4 text-green-600 mr-1 inline" />
            <span>Included (R20 per person)</span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 text-amber-600 mr-1 inline" />
            <span>Not included</span>
          </>
        )
      }
    />
  );
};

const RenderSeasonOption = ({
  selectedMenu, 
  selectedMenuOption, 
  selectedSeason,
  renderValidationError
}: {
  selectedMenu: string | null;
  selectedMenuOption: MenuOption | undefined;
  selectedSeason: 'summer' | 'winter' | null;
  renderValidationError: (field: string) => React.ReactNode;
}) => {
  if (selectedMenu === 'wedding1' || (selectedMenu === 'matric_premium' && selectedMenuOption?.seasonOptions)) {
    return (
      <MenuSelectionItem 
        label="Season" 
        value={selectedSeason ? (selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1) + ' Menu') : 'Not selected'} 
        id="season"
        required={true}
        renderValidationError={renderValidationError}
      />
    );
  }
  return null;
};

const RenderStartersOption = ({
  selectedMenu,
  selectedStarters,
  menuOptions,
  renderValidationError
}: {
  selectedMenu: string | null;
  selectedStarters: string[];
  menuOptions: MenuOption[];
  renderValidationError: (field: string) => React.ReactNode;
}) => {
  if (selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') {
    return (
      <MenuSelectionItem 
        label="Starter" 
        value={<MenuOptionDisplay ids={selectedStarters} menuOptions={menuOptions} />} 
        id="starters"
        required={true}
        renderValidationError={renderValidationError}
      />
    );
  }
  return null;
};

const RenderDessertsOption = ({
  selectedMenu,
  selectedDesserts,
  menuOptions,
  renderValidationError
}: {
  selectedMenu: string | null;
  selectedDesserts: string[];
  menuOptions: MenuOption[];
  renderValidationError: (field: string) => React.ReactNode;
}) => {
  if (selectedMenu === 'menu3' || selectedMenu === 'business' || selectedMenu === 'wedding1' || selectedMenu === 'matric_premium') {
    return (
      <MenuSelectionItem 
        label="Dessert" 
        value={<MenuOptionDisplay ids={selectedDesserts} menuOptions={menuOptions} />} 
        id="desserts"
        required={true}
        renderValidationError={renderValidationError}
      />
    );
  }
  return null;
};
