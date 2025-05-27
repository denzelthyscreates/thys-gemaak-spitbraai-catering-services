
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from '../MenuBuilder';
import BookingForm from '../BookingForm';
import { Badge } from "@/components/ui/badge";

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

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="menu">
          Build Your Menu
        </TabsTrigger>
        <TabsTrigger value="book" disabled={!menuSelection}>
          Complete Booking
          {menuSelection && (
            <Badge variant="secondary" className="ml-2">
              Ready
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="menu" className="px-1">
        <MenuBuilder 
          onSelectionChange={onMenuSelectionChange} 
          initialSelection={menuSelection}
          onNavigateTab={onNavigateTab}
        />
      </TabsContent>
      
      <TabsContent value="book">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
            <p className="text-muted-foreground">
              Fill in your details and choose your payment option to secure your catering service
            </p>
          </div>
          
          <BookingForm 
            menuSelection={menuSelection}
            savedFormData={bookingFormData}
            onFormDataChange={onBookingFormDataChange}
            onFormSubmitted={onBookingSubmitted}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContactTabs;
