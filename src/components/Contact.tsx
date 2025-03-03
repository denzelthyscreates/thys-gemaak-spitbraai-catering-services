
import { MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import HubSpotForm from './HubSpotForm';
import MenuBuilder from './MenuBuilder';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState<any>(null);
  const [showMenuBuilder, setShowMenuBuilder] = useState(false);
  const [menuDataSent, setMenuDataSent] = useState(false);

  // Function to handle menu selection changes from MenuBuilder
  const handleMenuSelectionChange = (selection: any) => {
    setMenuSelection(selection);
    setMenuDataSent(true); // Mark as sent immediately since we're updating in real-time
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
        
        {/* Bottom Row: Inquiry Form + Menu Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HubSpot Form - Left Column */}
          <div className="bg-white rounded-xl p-8 shadow-prominent border border-border animate-fade-in">
            <h3 className="text-xl font-semibold mb-6">Inquiry Form</h3>
            
            {/* HubSpot Form Component */}
            <HubSpotForm menuSelection={menuSelection} />
            
            {/* Menu Selection Summary (if available) - Updated for real-time display */}
            {menuSelection && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg animate-scale-in">
                <h4 className="font-semibold mb-2">Your Menu Selection</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Your menu selection will be included with your inquiry.
                </p>
                
                <div className="text-sm border-t border-border pt-2">
                  <p><strong>Menu Package:</strong> {menuSelection.menuPackage}</p>
                  <p><strong>Number of Guests:</strong> {menuSelection.numberOfGuests}</p>
                  {menuSelection.season && <p><strong>Season:</strong> {menuSelection.season}</p>}
                  {menuSelection.starters && <p><strong>Starters:</strong> {menuSelection.starters}</p>}
                  {menuSelection.sides && <p><strong>Sides:</strong> {menuSelection.sides}</p>}
                  {menuSelection.desserts && <p><strong>Desserts:</strong> {menuSelection.desserts}</p>}
                  {menuSelection.extras && <p><strong>Extras:</strong> {menuSelection.extras}</p>}
                  <p className="font-semibold mt-1"><strong>Total Price:</strong> R{menuSelection.totalPrice} pp</p>
                </div>
                
                {menuDataSent ? (
                  <p className="text-xs text-green-600 mt-2">✓ Menu data will be sent with your inquiry</p>
                ) : (
                  <p className="text-xs text-amber-600 mt-2">Menu data will be attached when you submit</p>
                )}
              </div>
            )}
          </div>
          
          {/* Menu Builder - Right Column */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
