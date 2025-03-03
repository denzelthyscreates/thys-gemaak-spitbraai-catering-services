
import React, { useEffect, useState } from 'react';

// Updated HubSpotForm component with better menu selection handling
const HubSpotForm = ({ menuSelection }) => {
  const [formInitialized, setFormInitialized] = useState(false);
  const [lastUpdateData, setLastUpdateData] = useState(null);

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
    if (formInitialized && menuSelection) {
      // Get the current form
      const form = document.querySelector('form.hs-form');
      if (form) {
        // Stringify current menu data to compare with last update
        const currentData = JSON.stringify(menuSelection);
        const lastData = lastUpdateData ? JSON.stringify(lastUpdateData) : null;
        
        // Only update if data has changed
        if (currentData !== lastData) {
          updateFormWithMenuData(form, menuSelection);
          setLastUpdateData(menuSelection);
          console.log('HubSpot form updated with new menu data:', menuSelection);
        }
      }
    }
  }, [menuSelection, formInitialized, lastUpdateData]);

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
    
    // Create a complete data object with all necessary fields
    const completeData = {
      menuPackage: menuData.menuPackage || '',
      numberOfGuests: menuData.numberOfGuests || 0,
      season: menuData.season || '',
      starters: menuData.starters || '',
      sides: menuData.sides || '',
      desserts: menuData.desserts || '',
      extras: menuData.extras || '',
      totalPrice: menuData.totalPrice || 0
    };
    
    // Update field value with complete data
    menuField.value = JSON.stringify(completeData);
    
    // Also update the visible summary in the form if it exists
    const summaryElement = document.querySelector('.hubspot-form-wrapper .menu-selection-summary');
    if (summaryElement) {
      // Format the total price as a number with commas
      const formattedPrice = `R${completeData.totalPrice} pp`;
      
      // Create summary HTML
      const summaryHTML = `
        <div class="menu-selection-content">
          <div class="menu-item"><strong>Menu Package:</strong> ${completeData.menuPackage}</div>
          <div class="menu-item"><strong>Number of Guests:</strong> ${completeData.numberOfGuests}</div>
          ${completeData.season ? `<div class="menu-item"><strong>Season:</strong> ${completeData.season}</div>` : ''}
          ${completeData.starters ? `<div class="menu-item"><strong>Starters:</strong> ${completeData.starters}</div>` : ''}
          ${completeData.sides ? `<div class="menu-item"><strong>Sides:</strong> ${completeData.sides}</div>` : ''}
          ${completeData.desserts ? `<div class="menu-item"><strong>Desserts:</strong> ${completeData.desserts}</div>` : ''}
          ${completeData.extras ? `<div class="menu-item"><strong>Extras:</strong> ${completeData.extras}</div>` : ''}
          <div class="menu-item price"><strong>Total Price:</strong> ${formattedPrice}</div>
        </div>
      `;
      
      summaryElement.innerHTML = summaryHTML;
    }
    
    console.log('Form menu data updated:', completeData);
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
        </div>
      )}
    </div>
  );
};

export default HubSpotForm;

