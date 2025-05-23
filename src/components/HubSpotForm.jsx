import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const HubSpotForm = ({ menuSelection, savedFormData, onFormDataChange, onFormSubmitted, onNavigateTab }) => {
  const [formInitialized, setFormInitialized] = useState(false);
  const [lastUpdateData, setLastUpdateData] = useState(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const summaryRef = useRef(null);
  const formRef = useRef(null);

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
            formRef.current = form;
            
            // If we already have menu data (possible on re-render), apply it
            if (menuSelection) {
              updateFormWithMenuData(form, menuSelection);
              updateVisibleSummary(menuSelection);
            }

            // If we have saved form data, apply it to the form
            if (savedFormData) {
              applyFormData(form, savedFormData);
            }

            // Add listeners to track form field changes
            setupFormChangeTracking(form);
          },
          onFormSubmit: function($form) {
            // Add a hidden field for menu_workflow_trigger to signal HubSpot to start the workflow
            const menuWorkflowField = document.createElement('input');
            menuWorkflowField.type = 'hidden';
            menuWorkflowField.name = 'menu_workflow_trigger';
            menuWorkflowField.value = 'true';
            $form.append(menuWorkflowField);
            
            // Add a hidden field for send_reminders emails
            const reminderField = document.createElement('input');
            reminderField.type = 'hidden';
            reminderField.name = 'send_reminders';
            reminderField.value = 'true';
            $form.append(reminderField);

            // Add a hidden field for requires_reminders
            const requiresRemindersField = document.createElement('input');
            requiresRemindersField.type = 'hidden';
            requiresRemindersField.name = 'requires_reminders'; // Ensure this matches the HubSpot property name
            requiresRemindersField.value = 'true';
            $form.append(requiresRemindersField);

            // Add a hidden field for booking_reminder_due
            const bookingReminderField = document.createElement('input');
            bookingReminderField.type = 'hidden';
            bookingReminderField.name = 'booking_reminder_due'; // Ensure this matches the HubSpot property name
            bookingReminderField.value = '2'; // 2 days
            $form.append(bookingReminderField);

            // Add a hidden field for payment_reminder_due
            const paymentReminderField = document.createElement('input');
            paymentReminderField.type = 'hidden';
            paymentReminderField.name = 'payment_reminder_due'; // Ensure this matches the HubSpot property name
            paymentReminderField.value = '3'; // 3 days
            $form.append(paymentReminderField);
            console.log("Form submitted with menu data and workflow triggers");
            
            // Show toast to user that their booking was submitted
            toast.success("Booking enquiry submitted successfully!", {
              description: "You'll receive a confirmation email shortly."
            });

            // Clear saved form data when form is submitted
            if (onFormDataChange) {
              onFormDataChange(null);
              localStorage.removeItem('bookingFormData');
            }
            
            // Set the submission complete state to true to show the "Continue to Payment" button
            setSubmissionComplete(true);
            
            // Notify parent component that the form was submitted
            if (onFormSubmitted) {
              onFormSubmitted();
            }
          },
          onFormSubmitted: function() {
            // Log that HubSpot workflow will handle automated reminders
            console.log("Form submitted - HubSpot will handle automated reminders");
            
            // Log additional context for the HubSpot automation
            if (menuSelection) {
              console.log("Menu data for HubSpot automation:", JSON.stringify(menuSelection));
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

  // Effect to apply saved form data when it changes
  useEffect(() => {
    if (savedFormData && formInitialized) {
      const form = document.querySelector('form.hs-form');
      if (form) {
        applyFormData(form, savedFormData);
      }
    }
  }, [savedFormData, formInitialized]);

  // Setup form change tracking to save form data
  const setupFormChangeTracking = (form) => {
    if (!form || !onFormDataChange) return;

    // Add input change event listeners
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('change', () => {
        const currentFormData = collectFormData(form);
        
        // Only update if there are actual changes
        if (JSON.stringify(currentFormData) !== JSON.stringify(savedFormData)) {
          onFormDataChange(currentFormData);
        }
      });
      
      // For text inputs, also track input events for more responsive updates
      if (field.tagName === 'INPUT' && field.type === 'text' || field.tagName === 'TEXTAREA') {
        field.addEventListener('input', () => {
          const currentFormData = collectFormData(form);
          onFormDataChange(currentFormData);
        });
      }
    });
  };

  // Collect current form data
  const collectFormData = (form) => {
    if (!form) return {};
    
    const formData = {};
    form.querySelectorAll('input, select, textarea').forEach(field => {
      // Skip hidden fields and submit buttons
      if (field.type === 'hidden' || field.type === 'submit') return;
      
      const name = field.name;
      const value = field.value;
      
      if (name && value) {
        formData[name] = value;
      }
    });
    
    return formData;
  };

  // Apply saved form data to the form
  const applyFormData = (form, data) => {
    if (!form || !data) return;
    
    console.log("Applying saved form data to HubSpot form:", data);
    
    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field && fieldValue) {
        field.value = fieldValue;
        
        // Trigger change event to ensure HubSpot's validation recognizes the change
        const event = new Event('change', { bubbles: true });
        field.dispatchEvent(event);
      }
    });
  };

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
    
    // These will be used to create HubSpot properties and automation rules
    const propertiesToUpdate = {
      'menu_selection': JSON.stringify(menuData),
      'menu_package': menuData.menuPackage || '',
      'number_of_guests': menuData.numberOfGuests?.toString() || '0',
      'menu_season': menuData.season || '',
      'menu_starters': menuData.starters || '',
      'menu_sides': menuData.sides || '',
      'menu_desserts': menuData.desserts || '',
      'menu_extras': menuData.extras || '',
      'menu_total_price': menuData.totalPrice?.toString() || '0',
      'menu_extra_salad_type': menuData.extraSaladType || '',
      'requires_reminders': 'true',
      'booking_reminder_due': '2', // 2 days after submission
      'payment_reminder_due': '3'  // 3 days after submission
    };
    
    // Update or create hidden fields for each property
    Object.entries(propertiesToUpdate).forEach(([property, value]) => {
      // Look for existing field
      let field = form.querySelector(`input[name="${property}"]`);
      
      // Create field if it doesn't exist
      if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = property;
        form.appendChild(field);
        console.log(`Created new hidden field for ${property}`);
      }
      
      // Update field value
      field.value = value;
    });
    
    console.log("Form data updated with complete menu selection");
  };

  const handleNavigateToPayment = () => {
    if (onNavigateTab) {
      onNavigateTab('payment');
    }
  };

  return (
    <div className="hubspot-form-wrapper">
      {!submissionComplete ? (
        <>
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
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773661/2025-05-20_TGS_full_round_xtddvs.png" 
              alt="Thys Gemaak Spitbraai Catering Services Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">Booking Request Received!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your booking request. We've sent a confirmation email to your inbox. 
            Our team will review your request and get back to you within 24 hours.
          </p>
          <div className="text-sm text-muted-foreground mb-6">
            <p className="font-medium">What happens next?</p>
            <ol className="list-decimal list-inside mt-2 text-left space-y-1">
              <li>You'll receive an automated confirmation email</li>
              <li>Our team will review your booking details</li>
              <li>You'll receive a follow-up email within 24-48 hours</li>
              <li>Once confirmed, you'll receive payment instructions</li>
            </ol>
          </div>
          
          <Button 
            onClick={handleNavigateToPayment}
            className="w-full sm:w-auto"
            size="lg"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Continue to Payment Options
          </Button>
        </div>
      )}
    </div>
  );
};

export default HubSpotForm;
