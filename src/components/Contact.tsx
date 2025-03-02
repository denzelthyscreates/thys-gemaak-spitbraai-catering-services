import { MapPin, Phone, Mail } from 'lucide-react';
import HubSpotForm from './HubSpotForm'; // Import the new component

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information - Keep this part unchanged */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Get In Touch
            </span>
            <h2 className="h2 mb-6">Book Your Spitbraai Experience</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Ready to elevate your event with authentic South African spitbraai? Fill out the form to discuss your 
              catering needs, or contact us directly using the information below.
            </p>
            
            {/* Contact Details - Keep this unchanged */}
            <div className="space-y-6 mb-10">
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
              
              {/* Other contact details remain unchanged */}
            </div>
            
            {/* Logo Image - Keep this unchanged */}
            <div className="rounded-xl overflow-hidden shadow-subtle border border-border">
              <img 
                src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1740792199/unnamed_ffvctc.jpg" 
                alt="Thys Gemaak Spitbraai Catering Services Logo" 
                className="w-full h-auto object-contain p-4"
              />
            </div>
          </div>
          
          {/* Replace the Contact Form with HubSpot Form */}
          <div className="bg-white rounded-xl p-8 shadow-prominent border border-border">
            <h3 className="text-xl font-semibold mb-6">Inquiry Form</h3>
            
            {/* HubSpot Form Component */}
            <HubSpotForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
