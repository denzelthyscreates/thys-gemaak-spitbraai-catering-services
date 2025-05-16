
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from '../MenuBuilder';
import SystemeRedirect from './SystemeRedirect';
import PaymentOptions from '../PaymentOptions';

interface ContactTabsProps {
  activeTab: string;
  menuSelection: any;
  bookingFormData: any;
  onMenuSelectionChange: (selection: any) => void;
  onTabChange: (value: string) => void;
  onNavigateTab: (tabValue: string) => void;
  onBookingFormDataChange: (data: any) => void;
  onBookingSubmitted: () => void;
}

const ContactTabs: React.FC<ContactTabsProps> = ({
  activeTab,
  menuSelection,
  bookingFormData,
  onMenuSelectionChange,
  onTabChange,
  onNavigateTab,
  onBookingFormDataChange,
  onBookingSubmitted
}) => {
  const defaultNumGuests = 50;
  const defaultTotalPrice = 0;
  const travelFee = menuSelection ? menuSelection.travelFee : null;

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="menu">Build Your Menu</TabsTrigger>
        <TabsTrigger value="book" disabled={!menuSelection}>Booking Enquiry</TabsTrigger>
        <TabsTrigger value="payment">Payment Options</TabsTrigger>
      </TabsList>
      
      <TabsContent value="menu" className="px-1">
        <MenuBuilder 
          onSelectionChange={onMenuSelectionChange} 
          initialSelection={menuSelection}
          onNavigateTab={onNavigateTab}
        />
      </TabsContent>
      
      <TabsContent value="book">
        <SystemeRedirect 
          menuSelection={menuSelection}
          onNavigateTab={onNavigateTab}
        />
      </TabsContent>
      
      <TabsContent value="payment">
        <PaymentOptions 
          totalPrice={menuSelection ? menuSelection.totalPrice : defaultTotalPrice} 
          numGuests={menuSelection ? menuSelection.numberOfGuests : defaultNumGuests}
          travelFee={travelFee} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContactTabs;
