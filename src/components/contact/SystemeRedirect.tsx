import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toast } from 'sonner';

interface SystemeRedirectProps {
  menuSelection: any;
  onNavigateTab?: (tabValue: string) => void;
}

const SystemeRedirect: React.FC<SystemeRedirectProps> = ({ 
  menuSelection, 
  onNavigateTab 
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Updated with the correct Systeme.io form URL
  const systemeBaseUrl = "https://spitbraai-thysgemaak.systeme.io/bookingform";
  
  // Sample HTML for the Systeme.io form - this will be inserted into their form editor
  const systemeFormHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thys Gemaak Spitbraai Booking Form</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: hsl(210, 50%, 10%);
            background-color: #fff;
        }
        .form-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03);
        }
        .form-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .form-header img {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }
        .form-header h2 {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            color: hsl(205, 100%, 30%);
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .form-header p {
            color: hsl(205, 30%, 45%);
            font-size: 1.1rem;
        }
        .form-row {
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;
            margin-right: -10px;
        }
        .form-col {
            flex: 1;
            padding: 0 10px;
            min-width: 250px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .section-header {
            font-family: 'Playfair Display', serif;
            margin-top: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid hsl(205, 20%, 92%);
            color: hsl(205, 100%, 30%);
            font-weight: 500;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: hsl(210, 50%, 10%);
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="date"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid hsl(205, 20%, 90%);
            border-radius: 0.5rem;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            color: hsl(210, 50%, 10%);
            background-color: #fff;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        .required:after {
            content: " *";
            color: hsl(354, 87%, 53%);
        }
        .radio-group {
            margin-top: 5px;
        }
        .radio-option {
            margin-right: 20px;
            display: inline-block;
            cursor: pointer;
        }
        .radio-option input {
            margin-right: 5px;
        }
        .submit-btn {
            background-color: hsl(205, 100%, 30%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        .submit-btn:hover {
            background-color: hsl(205, 100%, 25%);
        }
        .alt-btn {
            background-color: white;
            color: hsl(205, 100%, 30%);
            border: 1px solid hsl(205, 100%, 30%);
            padding: 12px 24px;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 10px;
        }
        .alt-btn:hover {
            background-color: hsl(205, 100%, 95%);
        }
        .menu-summary {
            background-color: hsl(205, 100%, 95%);
            border-radius: 0.5rem;
            padding: 15px;
            margin-bottom: 20px;
        }
        .menu-summary h4 {
            color: hsl(205, 100%, 30%);
            margin-top: 0;
            margin-bottom: 10px;
            font-family: 'Playfair Display', serif;
        }
        .address-fields {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .address-fields > div {
            flex: 1;
            min-width: 45%;
        }
        .note-box {
            background-color: hsl(39, 100%, 97%);
            border: 1px solid hsl(39, 90%, 85%);
            border-radius: 0.5rem;
            padding: 15px;
            margin-bottom: 20px;
            color: hsl(39, 80%, 30%);
        }
        @media (max-width: 768px) {
            .form-col {
                flex: 100%;
                margin-bottom: 0;
            }
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="form-header">
            <img src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773661/2025-05-20_TGS_full_round_xtddvs.png" 
                 alt="Thys Gemaak Spitbraai Catering Services Logo">
            <h2>Thys Gemaak Spitbraai Booking</h2>
            <p>Complete the form below to confirm your catering request</p>
        </div>
        
        <form id="bookingForm" method="post">
            <!-- Menu Summary Section -->
            <div class="menu-summary" id="menuSummarySection">
                <h4>Your Selected Menu</h4>
                <div id="menuSummaryContent">
                    <!-- This will be populated with JavaScript -->
                </div>
            </div>
            
            <div class="form-row">
                <!-- Left Column -->
                <div class="form-col">
                    <h3 class="section-header">Contact Information</h3>
                    
                    <div class="form-group">
                        <label for="fullName" class="required">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="required">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone" class="required">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    
                    <!-- Home Address for Invoicing -->
                    <div class="form-group">
                        <label for="homeAddress" class="required">Home Address (for invoicing)</label>
                        <input type="text" id="addressLine1" name="addressLine1" placeholder="Street Address" required>
                        <div class="address-fields">
                            <div class="form-group">
                                <input type="text" id="city" name="city" placeholder="City" required>
                            </div>
                            <div class="form-group">
                                <input type="text" id="postalCodeHome" name="postalCodeHome" placeholder="Postal Code" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactMethod">Preferred Contact Method</label>
                        <div class="radio-group">
                            <label class="radio-option"><input type="radio" name="contactMethod" value="Email"> Email</label>
                            <label class="radio-option"><input type="radio" name="contactMethod" value="Phone"> Phone</label>
                            <label class="radio-option"><input type="radio" name="contactMethod" value="WhatsApp"> WhatsApp</label>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="form-col">
                    <h3 class="section-header">Event Details</h3>
                    
                    <div class="form-group">
                        <label for="eventLocation" class="required">Event Location</label>
                        <input type="text" id="eventLocation" name="eventLocation" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="eventDate" class="required">Event Date</label>
                        <input type="date" id="eventDate" name="eventDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="hearAbout">How did you hear about us?</label>
                        <select id="hearAbout" name="hearAbout">
                            <option value="">-- Please Select --</option>
                            <option value="Google Search">Google Search</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Friend/Family">Friend or Family</option>
                            <option value="Previous Customer">Previous Customer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Full Width Sections -->
            <div class="form-group">
                <label for="additionalNotes">Additional Notes/Requests</label>
                <textarea id="additionalNotes" name="additionalNotes"></textarea>
            </div>
            
            <div class="note-box">
                <p><strong>What happens next?</strong></p>
                <ol>
                    <li>We'll review your booking details</li>
                    <li>You'll receive confirmation via email within 24-48 hours</li>
                    <li>We'll provide payment instructions to secure your booking</li>
                    <li>A final consultation will be arranged closer to your event date</li>
                </ol>
            </div>
            
            <!-- Hidden Fields for Menu Selection -->
            <input type="hidden" id="menuPackage" name="menuPackage">
            <input type="hidden" id="numberOfGuests" name="numberOfGuests">
            <input type="hidden" id="season" name="season">
            <input type="hidden" id="starters" name="starters">
            <input type="hidden" id="sides" name="sides">
            <input type="hidden" id="desserts" name="desserts">
            <input type="hidden" id="extras" name="extras">
            <input type="hidden" id="totalPrice" name="totalPrice">
            <input type="hidden" id="travelFee" name="travelFee">
            <input type="hidden" id="postalCode" name="postalCode">
            <input type="hidden" id="areaName" name="areaName">
            <input type="hidden" id="eventType" name="eventType">
            <input type="hidden" id="includeCutlery" name="includeCutlery">
            
            <!-- Submit Button -->
            <div class="form-group">
                <button type="submit" class="submit-btn">Submit Booking Request</button>
            </div>
        </form>
        
        <!-- JavaScript to populate hidden fields and menu summary -->
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Function to get URL parameters
                function getUrlParameter(name) {
                    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                    var results = regex.exec(location.search);
                    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
                }
                
                // List of hidden fields to populate from URL parameters
                var hiddenFields = [
                    'menuPackage', 
                    'numberOfGuests', 
                    'season', 
                    'starters', 
                    'sides', 
                    'desserts', 
                    'extras', 
                    'totalPrice', 
                    'travelFee', 
                    'postalCode', 
                    'areaName',
                    'eventType',
                    'includeCutlery'
                ];
                
                // Populate hidden fields and create menu summary
                var menuSummaryContent = document.getElementById('menuSummaryContent');
                var summaryHTML = '';
                
                // Populate each hidden field with its corresponding URL parameter value
                hiddenFields.forEach(function(field) {
                    var value = getUrlParameter(field);
                    if (value) {
                        document.getElementById(field).value = value;
                        
                        // Format field name for display
                        var displayName = field.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) {
                            return str.toUpperCase();
                        });
                        
                        // Add to summary if value exists
                        if (value && field !== 'postalCode' && field !== 'areaName') {
                            if (field === 'totalPrice') {
                                summaryHTML += '<div><strong>' + displayName + ':</strong> R' + value + '</div>';
                            } else if (field === 'includeCutlery') {
                                summaryHTML += '<div><strong>Cutlery & Crockery:</strong> ' + (value === 'true' ? 'Yes' : 'No') + '</div>';
                            } else {
                                summaryHTML += '<div><strong>' + displayName + ':</strong> ' + value + '</div>';
                            }
                        }
                    }
                });
                
                // Add total calculation if we have both price and guests
                var price = getUrlParameter('totalPrice');
                var guests = getUrlParameter('numberOfGuests');
                var travelFee = getUrlParameter('travelFee');
                
                if (price && guests) {
                    var total = parseFloat(price) * parseInt(guests);
                    summaryHTML += '<div style="margin-top: 10px;"><strong>Event Total:</strong> R' + total.toFixed(2) + '</div>';
                    
                    if (travelFee && parseFloat(travelFee) > 0) {
                        summaryHTML += '<div><strong>Travel Fee:</strong> R' + parseFloat(travelFee).toFixed(2) + '</div>';
                        var grandTotal = total + parseFloat(travelFee);
                        summaryHTML += '<div><strong>Grand Total:</strong> R' + grandTotal.toFixed(2) + '</div>';
                    }
                }
                
                // Update the summary section
                if (summaryHTML) {
                    menuSummaryContent.innerHTML = summaryHTML;
                } else {
                    document.getElementById('menuSummarySection').style.display = 'none';
                }
            });
        </script>
    </div>
</body>
</html>`;

  const generateRedirectUrl = () => {
    if (!menuSelection) return systemeBaseUrl;

    // Create an object with all the parameters we want to send
    const params = new URLSearchParams();

    // Add menu selection data to URL parameters
    params.append('menuPackage', menuSelection.menuPackage || '');
    params.append('numberOfGuests', String(menuSelection.numberOfGuests || 0));
    
    if (menuSelection.season) {
      params.append('season', menuSelection.season);
    }
    
    if (menuSelection.starters) {
      params.append('starters', menuSelection.starters);
    }
    
    if (menuSelection.sides) {
      params.append('sides', menuSelection.sides);
    }
    
    if (menuSelection.desserts) {
      params.append('desserts', menuSelection.desserts);
    }
    
    if (menuSelection.extras) {
      params.append('extras', menuSelection.extras);
    }
    
    params.append('totalPrice', String(menuSelection.totalPrice || 0));
    
    if (menuSelection.postalCode) {
      params.append('postalCode', menuSelection.postalCode);
    }
    
    if (menuSelection.areaName) {
      params.append('areaName', menuSelection.areaName);
    }
    
    if (menuSelection.travelFee !== null) {
      params.append('travelFee', String(menuSelection.travelFee));
    }

    // Add event type parameter
    if (menuSelection.eventType) {
      params.append('eventType', menuSelection.eventType);
    }

    // Add includeCutlery parameter
    if (menuSelection.includeCutlery !== undefined) {
      params.append('includeCutlery', String(menuSelection.includeCutlery));
    }

    // Format and join all parameters
    return `${systemeBaseUrl}?${params.toString()}`;
  };

  const handleRedirect = () => {
    // Show toast notification
    toast.success("Redirecting to booking form", {
      description: "You'll be taken to our booking form with your menu details"
    });

    setIsRedirecting(true);
    
    // Short delay for the toast to be visible before redirect
    setTimeout(() => {
      // Open in a new tab
      window.open(generateRedirectUrl(), '_blank');
      setIsRedirecting(false);
    }, 1000);
  };

  return (
    <div className="systeme-redirect-wrapper">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Complete Your Booking on Systeme.io</h3>
        
        <div className="flex justify-center mb-4">
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/v1747773661/2025-05-20_TGS_full_round_xtddvs.png" 
            alt="Thys Gemaak Spitbraai Catering Services Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <p className="text-muted-foreground mb-6">
          You've successfully built your menu. The next step is to complete your booking on our Systeme.io form.
          All your menu selections will be transferred automatically.
        </p>
        
        {menuSelection && (
          <div className="menu-selection-summary mb-6 bg-card p-4 rounded-md border">
            <h4 className="font-semibold mb-2">Your Menu Selection</h4>
            <div className="grid gap-1 text-sm">
              <div><strong>Event Type:</strong> {menuSelection.eventType}</div>
              <div><strong>Menu Package:</strong> {menuSelection.menuPackage}</div>
              <div><strong>Number of Guests:</strong> {menuSelection.numberOfGuests}</div>
              {menuSelection.season && <div><strong>Season:</strong> {menuSelection.season}</div>}
              {menuSelection.starters && <div><strong>Starters:</strong> {menuSelection.starters}</div>}
              {menuSelection.sides && <div><strong>Sides:</strong> {menuSelection.sides}</div>}
              {menuSelection.desserts && <div><strong>Desserts:</strong> {menuSelection.desserts}</div>}
              {menuSelection.extras && <div><strong>Extras:</strong> {menuSelection.extras}</div>}
              <div><strong>Cutlery & Crockery:</strong> {menuSelection.includeCutlery ? 'Yes' : 'No'}</div>
              <div className="mt-1"><strong>Price per person:</strong> R{menuSelection.totalPrice}</div>
              <div><strong>Total price:</strong> R{menuSelection.totalPrice * menuSelection.numberOfGuests} 
                {menuSelection.travelFee ? ` + R${menuSelection.travelFee} travel fee` : ''}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm">
            <p className="font-medium text-amber-800">What happens next?</p>
            <ol className="list-decimal list-inside mt-2 ml-2 space-y-1 text-amber-700">
              <li>You'll be redirected to our booking form</li>
              <li>Complete the required contact and event details</li>
              <li>Submit your booking request</li>
              <li>We'll confirm your booking via email within 24-48 hours</li>
              <li>You'll receive payment instructions for securing your date</li>
            </ol>
          </div>
          
          <Button
            onClick={handleRedirect}
            disabled={isRedirecting}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isRedirecting ? (
              "Redirecting..."
            ) : (
              <>
                Continue to Booking Form
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto mt-2"
              onClick={() => onNavigateTab && onNavigateTab('payment')}
              size="sm"
            >
              Skip to Payment Options
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemeRedirect;
