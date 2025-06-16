
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from '../MenuBuilder';
import BookingForm from '../booking/BookingForm';
import { Badge } from "@/components/ui/badge";

interface ContactTabsProps {
  initialMenuSelection?: any;
}

const ContactTabs: React.FC<ContactTabsProps> = ({
  initialMenuSelection
}) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuSelection, setMenuSelection] = useState<any>(initialMenuSelection || null);
  const [bookingFormData, setBookingFormData] = useState<any>(null);

  // If we have an initial menu selection, start on the booking tab
  useEffect(() => {
    if (initialMenuSelection) {
      setMenuSelection(initialMenuSelection);
      setActiveTab('book');
    }
  }, [initialMenuSelection]);

  const handleMenuSelectionChange = (selection: any) => {
    console.log('Menu selection changed:', selection);
    setMenuSelection(selection);
  };

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setActiveTab(value);
  };

  const handleNavigateTab = (tabValue: string) => {
    console.log('Navigating to tab:', tabValue);
    setActiveTab(tabValue);
  };

  const handleBookingFormDataChange = (data: any) => {
    setBookingFormData(data);
  };

  const handleBookingSubmitted = () => {
    // Handle successful booking submission
    console.log('Booking submitted successfully');
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
          onSelectionChange={handleMenuSelectionChange} 
          initialSelection={menuSelection}
          onNavigateTab={handleNavigateTab}
        />
      </TabsContent>
      
      <TabsContent value="book">
        <BookingForm 
          menuSelection={menuSelection}
          savedFormData={bookingFormData}
          onFormDataChange={handleBookingFormDataChange}
          onFormSubmitted={handleBookingSubmitted}
          onNavigateTab={handleNavigateTab}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContactTabs;
