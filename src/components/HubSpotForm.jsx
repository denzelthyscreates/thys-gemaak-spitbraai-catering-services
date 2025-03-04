
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
              updateVisibleSummary(menuSelection);
            }
            
            // Add listener for form submission
            form.addEventListener('submit', function() {
              console.log('Form submitted with menu selection:', menuSelection);
              // We can't directly create the HubSpot automation tasks here as 
              // those must be set up in the HubSpot workflow/automation system
            });
          },
          onFormSubmit: function($form) {
            // Let users know about the automated reminders
            // This creates better user experience by setting clear expectations
            console.log("Form submitted - HubSpot will handle automated reminders");
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
    // Only proceed if we have menu data
    if (menuSelection) {
      console.log("Menu selection update received in HubSpotForm:", menuSelection);
      
      // Always update the visible summary regardless of form initialization
      updateVisibleSummary(menuSelection);
      
      if (formInitialized) {
        // Get the current form
        const form = document.querySelector('form.hs-form');
        if (form) {
          // Always update the hidden field with the latest data
          updateFormWithMenuData(form, menuSelection);
          setLastUpdateData(menuSelection);
        } else {
          console.log("Form not found, can't update fields");
        }
      }
    }
  }, [menuSelection, formInitialized]);

  // Function to update the visible summary without waiting for HubSpot form
  const updateVisibleSummary = (menuData) => {
    if (!menuData || !summaryRef.current) {
      console.log("Can't update summary - missing data or ref");
      return;
    }
    
    // Format the total price
    const formattedPrice = `R${menuData.totalPrice} pp`;
    
    // Create summary HTML with improved checks for each field
    const summaryHTML = `
      <div class="menu-selection-content">
        <div class="menu-item"><strong>Menu Package:</strong> ${menuData.menuPackage || 'Not selected'}</div>
        <div class="menu-item"><strong>Number of Guests:</strong> ${menuData.numberOfGuests || 0}</div>
        ${menuData.season ? `<div class="menu-item"><strong>Season:</strong> ${menuData.season}</div>` : ''}
        ${menuData.starters && menuData.starters.length > 0 ? `<div class="menu-item"><strong>Starters:</strong> ${menuData.starters}</div>` : ''}
        ${menuData.sides && menuData.sides.length > 0 ? `<div class="menu-item"><strong>Sides:</strong> ${menuData.sides}</div>` : ''}
        ${menuData.desserts && menuData.desserts.length > 0 ? `<div class="menu-item"><strong>Desserts:</strong> ${menuData.desserts}</div>` : ''}
        ${menuData.extras && menuData.extras.length > 0 ? `<div class="menu-item"><strong>Extras:</strong> ${menuData.extras}</div>` : ''}
        <div class="menu-item price"><strong>Total Price:</strong> ${formattedPrice}</div>
        <div class="mt-2 text-sm text-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Menu data will be sent with your enquiry
        </div>
        <div class="mt-4 p-3 bg-primary/5 rounded border border-primary/20 text-sm">
          <p><strong>What happens next?</strong></p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>You'll receive a confirmation email immediately</li>
            <li>We'll send a reminder to confirm your booking within 2 days</li>
            <li>You'll receive payment details for the booking fee and deposit</li>
          </ul>
        </div>
      </div>
    `;
    
    summaryRef.current.innerHTML = summaryHTML;
    console.log("Summary updated with:", menuData);
  };

  // Function to update the form with menu data
  const updateFormWithMenuData = (form, menuData) => {
    if (!menuData || !form) {
      console.log("Can't update form - missing data or form element");
      return;
    }
    
    // Look for existing field
    let menuField = form.querySelector('input[name="menu_selection"]');
    
    // Create field if it doesn't exist
    if (!menuField) {
      menuField = document.createElement('input');
      menuField.type = 'hidden';
      menuField.name = 'menu_selection';
      form.appendChild(menuField);
      console.log("Created new hidden field for menu data");
    }
    
    // Update field value with complete data
    menuField.value = JSON.stringify(menuData);
    console.log("Form data updated with menu selection");
  };

  return (
    <div className="hubspot-form-wrapper">
      <div id="hubspot-form-container" style={{ minHeight: "600px" }} />
      
      {/* Add a container for the menu selection summary that will be updated */}
      {menuSelection && (
        <div className="menu-selection-summary mt-4 p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-2">Your Menu Selection</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Your menu selection will be included with your enquiry.
          </p>
          <div ref={summaryRef}></div>
        </div>
      )}
    </div>
  );
};

export default HubSpotForm;
