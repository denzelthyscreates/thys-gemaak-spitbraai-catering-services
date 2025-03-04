import React, { useEffect, useState, useRef } from 'react';

const HubSpotForm = ({ menuSelection }) => {
  const [formInitialized, setFormInitialized] = useState(false);
  const [lastUpdateData, setLastUpdateData] = useState(null);
  const summaryRef = useRef(null);

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
            
            // If we already have menu data (possible on re-render), apply it
            if (menuSelection) {
              updateFormWithMenuData(form, menuSelection);
            }
            
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
  }, []); // We keep the dependency array empty for form initialization

  // Effect to update the form when menuSelection changes
  useEffect(() => {
    // Only proceed if we have both initialized form and menu data
    if (menuSelection) {
      // Update the visible summary immediately regardless of form initialization
      updateVisibleSummary(menuSelection);
      
      if (formInitialized) {
        // Get the current form
        const form = document.querySelector('form.hs-form');
        if (form) {
          // Always update the hidden field with the latest data
          updateFormWithMenuData(form, menuSelection);
          setLastUpdateData(menuSelection);
        }
      }
    }
  }, [menuSelection, formInitialized]);

  // Function to update the visible summary without waiting for HubSpot form
  const updateVisibleSummary = (menuData) => {
    if (!menuData || !summaryRef.current) return;
    
    // Format the total price
    const formattedPrice = `R${menuData.totalPrice} pp`;
    
    // Create summary HTML
    const summaryHTML = `
      <div class="menu-selection-content">
        <div class="menu-item"><strong>Menu Package:</strong> ${menuData.menuPackage || ''}</div>
        <div class="menu-item"><strong>Number of Guests:</strong> ${menuData.numberOfGuests || 0}</div>
        ${menuData.season ? `<div class="menu-item"><strong>Season:</strong> ${menuData.season}</div>` : ''}
        ${menuData.starters ? `<div class="menu-item"><strong>Starters:</strong> ${menuData.starters}</div>` : ''}
        ${menuData.sides ? `<div class="menu-item"><strong>Sides:</strong> ${menuData.sides}</div>` : ''}
        ${menuData.desserts ? `<div class="menu-item"><strong>Desserts:</strong> ${menuData.desserts}</div>` : ''}
        ${menuData.extras ? `<div class="menu-item"><strong>Extras:</strong> ${menuData.extras}</div>` : ''}
        <div class="menu-item price"><strong>Total Price:</strong> ${formattedPrice}</div>
        <div class="mt-2 text-sm text-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Menu data will be sent with your inquiry
        </div>
      </div>
    `;
    
    summaryRef.current.innerHTML = summaryHTML;
  };

  // Function to update the form with menu data
  const updateFormWithMenuData = (form, menuData) => {
    if (!menuData || !form) return;
    
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
    menuField.value = JSON.stringify(menuData);
  };

  return (
    <div className="hubspot-form-wrapper">
      <div id="hubspot-form-container" style={{ minHeight: "600px" }} />
      
      {/* Add a container for the menu selection summary that will be updated */}
      {menuSelection && (
        <div className="menu-selection-summary mt-4 p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-2">Your Menu Selection</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Your menu selection will be included with your inquiry.
          </p>
          <div ref={summaryRef}></div>
        </div>
      )}
    </div>
  );
};

export default HubSpotForm;
