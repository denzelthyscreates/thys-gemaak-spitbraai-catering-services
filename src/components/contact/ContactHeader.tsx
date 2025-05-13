
import React from 'react';

const ContactHeader = () => {
  return (
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
  );
};

export default ContactHeader;
