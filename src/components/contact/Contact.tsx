
import React, { useRef } from 'react';
import ContactHeader from './ContactHeader';
import BookingFlowContainer from '../booking/BookingFlowContainer';
import ContactInfo from './ContactInfo';

const Contact = () => {
  const contactSectionRef = useRef<HTMLElement>(null);

  const scrollToBookingForm = () => {
    // Only scroll when we're moving to the booking form
    const bookingFormElement = document.getElementById('booking-form-start');
    if (bookingFormElement) {
      bookingFormElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else if (contactSectionRef.current) {
      // Fallback to contact section if booking form element not found
      contactSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <BookingFlowContainer onBookingFormReached={scrollToBookingForm} />
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
