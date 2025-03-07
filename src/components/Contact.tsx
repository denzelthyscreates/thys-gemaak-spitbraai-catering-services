
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from './MenuBuilder';
import BookingForm from './BookingForm';
import PaymentOptions from './PaymentOptions';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState(null);
  
  const handleMenuSelectionChange = (selection: any) => {
    setMenuSelection(selection);
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
        
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="menu">Build Your Menu</TabsTrigger>
            <TabsTrigger value="book">Booking Enquiry</TabsTrigger>
            <TabsTrigger value="payment">Payment Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="px-1">
            <MenuBuilder onSelectionChange={handleMenuSelectionChange} />
          </TabsContent>
          
          <TabsContent value="book">
            <BookingForm menuSelection={menuSelection} />
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
                <a href="tel:+27123456789" className="text-primary hover:underline">+27 12 345 6789</a>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <a href="mailto:info@premiumspitbraai.co.za" className="text-primary hover:underline">info@premiumspitbraai.co.za</a>
              </div>
              <div>
                <div className="font-medium">Office Hours</div>
                <p>Monday - Friday: 9:00 - 17:00</p>
                <p>Saturday: 10:00 - 15:00</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-card shadow-subtle">
            <h3 className="text-xl font-semibold mb-3">Service Areas</h3>
            <p className="text-muted-foreground mb-4">
              We provide catering services throughout these areas and surrounding regions.
            </p>
            <ul className="space-y-2">
              <li>Johannesburg</li>
              <li>Pretoria</li>
              <li>East Rand</li>
              <li>West Rand</li>
              <li>Vaal Triangle</li>
              <li>Hartbeespoort</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              For locations outside these areas, please contact us for availability.
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
