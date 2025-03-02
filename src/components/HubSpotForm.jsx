
import React from 'react';

// HubSpotForm component with your specific IDs
const HubSpotForm = () => {
  React.useEffect(() => {
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
          target: "#hubspot-form-container"
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
