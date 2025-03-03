
import React, { useEffect, useState } from 'react';

// Updated HubSpotForm component with menu selection prop and real-time updates
const HubSpotForm = ({ menuSelection }) => {
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';

    // Append the script to the document
    document.body.appendChild(script);

    // Initialize the form once the script is loaded
    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "47808663",
          formId: "f9d120e6-b8c3-46d4-9a5e-f1640a4450d8",
          region: "na1",
          target: "#hubspot-form-container",
          onFormReady: function(form) {
            setFormInitialized(true);
            updateFormWithMenuData(form, menuSelection);
            
            // Add listener for form submission
            form.addEventListener('submit', function() {
              console.log('Form submitted with menu selection:', menuSelection);
            });
          }
        });
      }
    });

    // Clean up function
    return () => {
      // Only remove the script if it exists in the document
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      // Clean up any form elements created by HubSpot
      const formContainer = document.getElementById('hubspot-form-container');
      if (formContainer) {
        formContainer.innerHTML = '';
      }
    };
  }, []); // We remove menuSelection from dependencies and handle it separately

  // Effect to update the form when menuSelection changes
  useEffect(() => {
    if (formInitialized && menuSelection) {
      const form = document.querySelector('form.hs-form');
      if (form) {
        updateFormWithMenuData(form, menuSelection);
      }
    }
  }, [menuSelection, formInitialized]);

  // Function to update the form with menu data
  const updateFormWithMenuData = (form, menuData) => {
    if (!menuData) return;
    
    // Look for existing field
    let menuField = form.querySelector('input[name="menu_selection"]');
    
    // Create field if it doesn't exist
    if (!menuField) {
      menuField = document.createElement('input');
      menuField.type = 'hidden';
      menuField.name = 'menu_selection';
      form.appendChild(menuField);
    }
    
    // Update field value with complete data
    menuField.value = JSON.stringify({
      menuPackage: menuData.menuPackage,
      numberOfGuests: menuData.numberOfGuests,
      season: menuData.season,
      starters: menuData.starters,
      sides: menuData.sides,
      desserts: menuData.desserts,
      extras: menuData.extras,
      totalPrice: menuData.totalPrice
    });
    
    console.log('Updated HubSpot form with menu data:', menuData);
  };

  return (
    <div
      id="hubspot-form-container"
      style={{ minHeight: "600px" }}
      className="hubspot-form-wrapper"
    />
  );
};

export default HubSpotForm;
