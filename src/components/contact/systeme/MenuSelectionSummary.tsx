
import React from 'react';

interface MenuSelectionProps {
  menuSelection: {
    eventType?: string;
    menuPackage?: string;
    numberOfGuests?: number;
    season?: string;
    starters?: string;
    sides?: string;
    desserts?: string;
    extras?: string;
    includeCutlery?: boolean;
    totalPrice?: number;
    travelFee?: number | null;
  } | null;
}

const MenuSelectionSummary: React.FC<MenuSelectionProps> = ({ menuSelection }) => {
  if (!menuSelection) return null;

  return (
    <div className="menu-selection-summary mb-6 bg-card p-4 rounded-md border">
      <h4 className="font-semibold mb-2">Your Menu Selection</h4>
      <div className="grid gap-1 text-sm">
        {menuSelection.eventType && <div><strong>Event Type:</strong> {menuSelection.eventType}</div>}
        {menuSelection.menuPackage && <div><strong>Menu Package:</strong> {menuSelection.menuPackage}</div>}
        {menuSelection.numberOfGuests && <div><strong>Number of Guests:</strong> {menuSelection.numberOfGuests}</div>}
        {menuSelection.season && <div><strong>Season:</strong> {menuSelection.season}</div>}
        {menuSelection.starters && <div><strong>Starters:</strong> {menuSelection.starters}</div>}
        {menuSelection.sides && <div><strong>Sides:</strong> {menuSelection.sides}</div>}
        {menuSelection.desserts && <div><strong>Desserts:</strong> {menuSelection.desserts}</div>}
        {menuSelection.extras && <div><strong>Extras:</strong> {menuSelection.extras}</div>}
        <div><strong>Cutlery & Crockery:</strong> {menuSelection.includeCutlery ? 'Yes' : 'No'}</div>
        
        {menuSelection.totalPrice && (
          <>
            <div className="mt-1"><strong>Price per person:</strong> R{menuSelection.totalPrice}</div>
            <div>
              <strong>Total price:</strong> R{menuSelection.totalPrice * (menuSelection.numberOfGuests || 0)}
              {menuSelection.travelFee ? ` + R${menuSelection.travelFee} travel fee` : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuSelectionSummary;
