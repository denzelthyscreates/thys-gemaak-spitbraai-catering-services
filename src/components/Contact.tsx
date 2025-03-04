
import { MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import HubSpotForm from './HubSpotForm';
import MenuBuilder from './MenuBuilder';
import PaymentOptions from './PaymentOptions';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState<any>(null);
  const [showMenuBuilder, setShowMenuBuilder] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Function to handle menu selection changes from MenuBuilder
  const handleMenuSelectionChange = (selection: any) => {
    console.log('Menu selection changed:', selection);
    // Update with the complete selection data
    setMenuSelection(selection);
  };

  return (
    <section id="contact" className="section scroll-mt-20 transition-all duration-700 transform">
      <div className="container-width">
        {/* Top Row: Text/Contact Details + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Contact Information */}
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 mb-6 text-xl font-medium rounded-full bg-primary/10 text-primary">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6 animate-slide-down">
              Book Your Spitbraai Experience
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Ready to elevate your event with authentic South African spitbraai? Fill out the form to discuss your 
              catering needs, or contact us directly using the information below.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-6 mb-10 animate-slide-in-right">
              <div className="flex items-start gap-4">
                <div className="bg-secondary/50 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-muted-foreground">75 School Street, Kylemore</p>
                  <p className="text-muted-foreground">Stellenbosch, 7600</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/50 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-muted-foreground">+27 60 461 3766</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/50 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-muted-foreground">wade@thysgemaak.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logo Image */}
          <div className="rounded-xl overflow-hidden shadow-subtle border border-border animate-scale-in">
            <img 
              src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740792199/unnamed_ffvctc.jpg" 
              alt="Thys Gemaak Spitbraai Catering Services Logo" 
              className="w-full h-auto object-contain p-4"
            />
          </div>
        </div>
        
        {/* Bottom Row: Enquiry Form + Menu Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HubSpot Form - Left Column */}
          <div className="bg-white rounded-xl p-8 shadow-prominent border border-border animate-fade-in">
            <h3 className="text-xl font-semibold mb-6">Booking Enquiry</h3>
            
            {/* HubSpot Form Component with the current menu selection */}
            <HubSpotForm menuSelection={menuSelection} />
          </div>
          
          {/* Menu Builder & Payment Options - Right Column */}
          <div className="space-y-8">
            {/* Menu Builder Toggle */}
            <div className="bg-white rounded-xl p-6 shadow-prominent border border-border animate-fade-in">
              <button 
                onClick={() => setShowMenuBuilder(!showMenuBuilder)}
                className="w-full button-secondary flex items-center justify-center gap-2"
              >
                {showMenuBuilder ? "Hide Menu Builder" : "Build Your Custom Menu"}
              </button>
              
              {showMenuBuilder && (
                <div className="mt-6 animate-scale-in">
                  <MenuBuilder onSelectionChange={handleMenuSelectionChange} />
                </div>
              )}
            </div>
            
            {/* Payment Options Toggle - Only show if a menu is selected */}
            {menuSelection && (
              <div className="bg-white rounded-xl p-6 shadow-prominent border border-border animate-fade-in">
                <button 
                  onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                  className="w-full button-primary flex items-center justify-center gap-2"
                >
                  {showPaymentOptions ? "Hide Payment Options" : "View Payment Options"}
                </button>
                
                {showPaymentOptions && (
                  <div className="mt-6 animate-scale-in">
                    <PaymentOptions 
                      totalPrice={menuSelection.totalPrice || 0} 
                      numGuests={menuSelection.numberOfGuests || 0}
                      onClose={() => setShowPaymentOptions(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
