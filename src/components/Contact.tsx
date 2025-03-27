
import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from './MenuBuilder';
import HubSpotForm from './HubSpotForm';
import PaymentOptions from './PaymentOptions';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [bookingFormData, setBookingFormData] = useState(null);
  
  // Load saved active tab from localStorage on component mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    const savedMenuSelection = localStorage.getItem('menuSelection');
    const savedBookingFormData = localStorage.getItem('bookingFormData');
    
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
    
    if (savedMenuSelection) {
      setMenuSelection(JSON.parse(savedMenuSelection));
    }
    
    if (savedBookingFormData) {
      setBookingFormData(JSON.parse(savedBookingFormData));
    }
  }, []);
  
  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  const handleMenuSelectionChange = (selection: any) => {
    setMenuSelection(selection);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleBookingFormDataChange = (data: any) => {
    setBookingFormData(data);
    localStorage.setItem('bookingFormData', JSON.stringify(data));
  };

  // Default values for PaymentOptions when no menu is selected
  const defaultNumGuests = 50;
  const defaultTotalPrice = 0;

  return (
    <section id="contact" className="section scroll-mt-20">
      <div className="container-width py-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
            Ready to Experience Premium Spitbraai Catering?
          </h2>
          <p className="text-lg text-muted-foreground">
            Let us help you plan the perfect menu for your next event. Build your custom spitbraai package 
            below and submit your enquiry.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="menu">Build Your Menu</TabsTrigger>
            <TabsTrigger value="book">Booking Enquiry</TabsTrigger>
            <TabsTrigger value="payment">Payment Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="px-1">
            <MenuBuilder 
              onSelectionChange={handleMenuSelectionChange} 
              initialSelection={menuSelection}
            />
          </TabsContent>
          
          <TabsContent value="book">
            <HubSpotForm 
              menuSelection={menuSelection}
              savedFormData={bookingFormData}
              onFormDataChange={handleBookingFormDataChange}
            />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentOptions 
              totalPrice={menuSelection ? menuSelection.totalPrice : defaultTotalPrice} 
              numGuests={menuSelection ? menuSelection.numberOfGuests : defaultNumGuests} 
            />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-16" />
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card shadow-subtle">
            <h3 className="text-xl font-semibold mb-3">Contact Us Directly</h3>
            <p className="text-muted-foreground mb-4">
              Have questions or need to discuss special requirements? Reach out to us directly.
            </p>
            <div className="space-y-3">
              <div>
                <div className="font-medium">Phone</div>
                <a href="tel:+27604613766" className="text-primary hover:underline">+27 60 461 3766</a>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <a href="mailto:info@thysgemaak.com" className="text-primary hover:underline">info@thysgemaak.com</a>
              </div>
              <div>
                <div className="font-medium">Office Hours</div>
                <p>Monday - Friday: 9:00 - 17:00</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-card shadow-subtle">
            <h3 className="text-xl font-semibold mb-3">Service Areas</h3>
            <p className="text-muted-foreground mb-4">
              We provide Spitbraai catering for any event, size and location within the borders of the Western Cape.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Contact us to discuss your specific location requirements.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-card shadow-subtle">
            <h3 className="text-xl font-semibold mb-3">Booking Process</h3>
            <p className="text-muted-foreground mb-4">
              Our simple booking process ensures your event catering is confirmed with minimal hassle.
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Submit your enquiry through our booking form</li>
              <li>Receive confirmation of availability</li>
              <li>Pay booking fee to secure your date</li>
              <li>Finalize menu details</li>
              <li>Pay remaining balance before event</li>
              <li>Enjoy premium spitbraai catering at your event</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
