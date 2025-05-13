
import React, { useState, useEffect, useRef } from 'react';
import ContactHeader from './ContactHeader';
import ContactTabs from './ContactTabs';
import ContactInfo from './ContactInfo';

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

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <ContactTabs
          activeTab={activeTab}
          menuSelection={menuSelection}
          bookingFormData={bookingFormData}
          onMenuSelectionChange={handleMenuSelectionChange}
          onTabChange={handleTabChange}
          onNavigateTab={handleNavigateTab}
          onBookingFormDataChange={handleBookingFormDataChange}
          onBookingSubmitted={handleBookingSubmitted}
        />
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
