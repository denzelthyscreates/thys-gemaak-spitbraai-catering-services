
import React, { useState, useEffect, useRef } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuBuilder from './MenuBuilder';
import HubSpotForm from './HubSpotForm';
import PaymentOptions from './PaymentOptions';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [bookingFormData, setBookingFormData] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const contactSectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    const savedMenuSelection = localStorage.getItem('menuSelection');
    const savedBookingFormData = localStorage.getItem('bookingFormData');
    const savedBookingSubmitted = localStorage.getItem('bookingSubmitted');
    
    if (savedActiveTab && savedMenuSelection) {
      setActiveTab(savedActiveTab);
    }
    
    if (savedMenuSelection) {
      setMenuSelection(JSON.parse(savedMenuSelection));
    }
    
    if (savedBookingFormData) {
      setBookingFormData(JSON.parse(savedBookingFormData));
    }
    
    if (savedBookingSubmitted === 'true') {
      setBookingSubmitted(true);
      setActiveTab('payment');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  useEffect(() => {
    if (bookingSubmitted) {
      localStorage.setItem('bookingSubmitted', 'true');
      setActiveTab('payment');
      
      // Scroll to the top of the contact section after form submission
      setTimeout(() => {
        scrollToSectionTop();
      }, 100);
    }
  }, [bookingSubmitted]);

  const handleMenuSelectionChange = (selection: any) => {
    setMenuSelection(selection);
    if (selection) {
      localStorage.setItem('menuSelection', JSON.stringify(selection));
    } else {
      localStorage.removeItem('menuSelection');
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'book' && !menuSelection) {
      return;
    }
    setActiveTab(value);
    
    // Scroll to the top of the contact section when changing tabs
    scrollToSectionTop();
  };
  
  const scrollToSectionTop = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handleNavigateTab = (tabValue: string) => {
    // Direct tab navigation from child components
    if (tabValue === 'book' && !menuSelection) {
      return;
    }
    setActiveTab(tabValue);
    
    // Scroll to the top of the contact section when navigating tabs
    scrollToSectionTop();
  };

  const handleBookingFormDataChange = (data: any) => {
    setBookingFormData(data);
    localStorage.setItem('bookingFormData', JSON.stringify(data));
  };
  
  const handleBookingSubmitted = () => {
    setBookingSubmitted(true);
    setBookingFormData(null);
    localStorage.removeItem('bookingFormData');
    
    // Ensure we scroll to the top after submission
    setTimeout(() => {
      scrollToSectionTop();
    }, 100);
  };

  const defaultNumGuests = 50;
  const defaultTotalPrice = 0;

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
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
            <TabsTrigger value="book" disabled={!menuSelection}>Booking Enquiry</TabsTrigger>
            <TabsTrigger value="payment">Payment Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="px-1">
            <MenuBuilder 
              onSelectionChange={handleMenuSelectionChange} 
              initialSelection={menuSelection}
              onNavigateTab={handleNavigateTab}
            />
          </TabsContent>
          
          <TabsContent value="book">
            <HubSpotForm 
              menuSelection={menuSelection}
              savedFormData={bookingFormData}
              onFormDataChange={handleBookingFormDataChange}
              onFormSubmitted={handleBookingSubmitted}
              onNavigateTab={handleNavigateTab}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card shadow-subtle">
            <h3 className="text-xl font-semibold mb-3">Contact Us Directly</h3>
            <p className="text-muted-foreground mb-4">
              Have questions or need to discuss special requirements? Reach out to us directly.
            </p>
            <div className="space-y-3">
              <div>
                <div className="font-medium">Phone</div>
                <a href="tel:+27674567784" className="text-primary hover:underline">+27 67 456 7784</a>
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
              <li>Build your Menu</li>
              <li>Submit your enquiry through our booking form</li>
              <li>Receive confirmation of availability</li>
              <li>Pay the booking fee to secure your date</li>
              <li>Finalize menu details</li>
              <li>Pay the remaining balance before the event</li>
              <li>Enjoy premium spitbraai catering at your event</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
