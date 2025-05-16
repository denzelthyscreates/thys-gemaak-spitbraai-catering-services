
import React, { useState, useEffect, useRef } from 'react';
import ContactHeader from './ContactHeader';
import ContactTabs from './ContactTabs';
import ContactInfo from './ContactInfo';

const Contact = () => {
  const [menuSelection, setMenuSelection] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const contactSectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('activeTab');
    const savedMenuSelection = localStorage.getItem('menuSelection');
    
    if (savedActiveTab && savedMenuSelection) {
      setActiveTab(savedActiveTab);
    }
    
    if (savedMenuSelection) {
      setMenuSelection(JSON.parse(savedMenuSelection));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

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

  return (
    <section id="contact" className="section scroll-mt-20" ref={contactSectionRef}>
      <div className="container-width py-16">
        <ContactHeader />
        
        <ContactTabs
          activeTab={activeTab}
          menuSelection={menuSelection}
          onMenuSelectionChange={handleMenuSelectionChange}
          onTabChange={handleTabChange}
          onNavigateTab={handleNavigateTab}
        />
        
        <ContactInfo />
      </div>
    </section>
  );
};

export default Contact;
