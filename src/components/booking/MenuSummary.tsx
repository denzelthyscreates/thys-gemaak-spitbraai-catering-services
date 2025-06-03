
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MenuSummaryProps {
  menuSelection: any;
}

const MenuSummary: React.FC<MenuSummaryProps> = ({ menuSelection }) => {
  if (!menuSelection) return null;

  // Calculate totals including travel fee
  const menuSubtotal = menuSelection.totalPrice * menuSelection.numberOfGuests;
  const travelFee = menuSelection.travelFee || 0;
  const grandTotal = menuSubtotal + travelFee;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Your Menu Selection</CardTitle>
        <CardDescription>Review your selection before booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            {menuSelection.eventType && <div><strong>Event Type:</strong> {menuSelection.eventType}</div>}
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
            {menuSelection.postalCode && <div><strong>Location:</strong> {menuSelection.postalCode}</div>}
            {menuSelection.areaName && <div><strong>Area:</strong> {menuSelection.areaName}</div>}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Price per person:</span>
            <span>R{menuSelection.totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Menu subtotal ({menuSelection.numberOfGuests} guests):</span>
            <span>R{menuSubtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Travel fee:</span>
            <span>
              R{travelFee}
              {menuSelection.areaName && <span className="text-muted-foreground"> ({menuSelection.areaName})</span>}
              {travelFee === 0 && !menuSelection.areaName && <span className="text-muted-foreground"> (No travel fee)</span>}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>R{grandTotal}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSummary;
