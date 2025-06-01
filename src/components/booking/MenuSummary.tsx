
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MenuSummaryProps {
  menuSelection: any;
}

const MenuSummary: React.FC<MenuSummaryProps> = ({ menuSelection }) => {
  if (!menuSelection) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Your Menu Selection</CardTitle>
        <CardDescription>Review your selection before booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Package:</strong> {menuSelection.menuPackage}</div>
            <div><strong>Guests:</strong> {menuSelection.numberOfGuests}</div>
            {menuSelection.season && <div><strong>Season:</strong> {menuSelection.season}</div>}
            {menuSelection.starters && <div><strong>Starters:</strong> {menuSelection.starters}</div>}
            {menuSelection.sides && <div><strong>Sides:</strong> {menuSelection.sides}</div>}
            {menuSelection.desserts && <div><strong>Desserts:</strong> {menuSelection.desserts}</div>}
          </div>
          <div className="space-y-2">
            {menuSelection.extras && <div><strong>Extras:</strong> {menuSelection.extras}</div>}
            <div><strong>Cutlery:</strong> {menuSelection.includeCutlery ? 'Included' : 'Not included'}</div>
            {menuSelection.travelFee && (
              <div><strong>Travel Fee:</strong> R{menuSelection.travelFee}</div>
            )}
            <Separator />
            <div className="text-lg"><strong>Total: R{
              menuSelection.travelFee 
                ? (menuSelection.totalPrice * menuSelection.numberOfGuests) + menuSelection.travelFee
                : menuSelection.totalPrice * menuSelection.numberOfGuests
            }</strong></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSummary;
