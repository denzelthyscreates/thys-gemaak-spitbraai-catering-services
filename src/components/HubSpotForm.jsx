
import React, { useEffect } from 'react';

// HubSpotForm component with your specific IDs and menu selection field
const HubSpotForm = () => {
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
          // Add custom fields to capture menu selection
          additionalFieldsMap: [
            {
              name: "menu_selection",
              label: "Menu Selection",
              fieldType: "hidden",
              defaultValue: ""
            }
          ],
          onFormReady: function(form) {
            // Add a hidden field for menu selection if it doesn't exist
            const existingField = form.querySelector('input[name="menu_selection"]');
            if (!existingField) {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = 'menu_selection';
              form.appendChild(hiddenField);
            }
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
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div
      id="hubspot-form-container"
      style={{ minHeight: "600px" }}
      className="hubspot-form-wrapper"
    />
  );
};

export default HubSpotForm;
