
import React, { useRef } from 'react';
import ContactHeader from './ContactHeader';
import BookingFlowContainer from '../booking/BookingFlowContainer';
import ContactInfo from './ContactInfo';

const Contact = () => {
  const contactSectionRef = useRef<HTMLElement>(null);

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <BookingFlowContainer />
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
