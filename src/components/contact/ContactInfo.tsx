import React from 'react';
import { Separator } from "@/components/ui/separator";

const ContactInfo = () => {
  return (
    <>
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
              <a href="mailto:spitbookings@thysgemaak.com" className="text-primary hover:underline">spitbookings@thysgemaak.com</a>
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
    </>
  );
};

export default ContactInfo;
