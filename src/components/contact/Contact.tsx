
import React, { useState, useEffect, useRef } from 'react';
import ContactHeader from './ContactHeader';
import ContactTabs from './ContactTabs';
import ContactInfo from './ContactInfo';

const Contact = () => {
  const contactSectionRef = useRef<HTMLElement>(null);

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <ContactTabs />
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
