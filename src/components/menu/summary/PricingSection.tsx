
import React from 'react';

interface PricingSectionProps {
  totalPrice: number;
  numGuests: number;
  travelFee: number | null;
  areaName: string | undefined;
  discountApplied: boolean;
}

export const PricingSection = ({
  totalPrice,
  numGuests,
  travelFee,
  areaName,
  discountApplied
}: PricingSectionProps) => {
  const menuSubtotal = totalPrice * numGuests;
  const finalTotalPrice = travelFee ? menuSubtotal + travelFee : menuSubtotal;
  
  return (
    <>
      <div className="grid grid-cols-3 gap-2 pt-2 border-t">
        <span className="font-medium">Price per person:</span>
        <span className="col-span-2 font-semibold">R{totalPrice}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <span className="font-medium">Menu subtotal:</span>
        <span className="col-span-2">R{menuSubtotal}</span>
      </div>

      {travelFee !== null && travelFee > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium">Travel fee:</span>
          <span className="col-span-2">R{travelFee} {areaName && <span className="text-sm text-muted-foreground">({areaName})</span>}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-2 border-t">
        <span className="font-medium">Total price:</span>
        <span className="col-span-2 font-semibold">R{finalTotalPrice}</span>
      </div>

      {discountApplied && (
        <div className="text-sm text-green-600 font-medium mt-1">
          10% Volume Discount Applied!
        </div>
      )}
    </>
  );
};
