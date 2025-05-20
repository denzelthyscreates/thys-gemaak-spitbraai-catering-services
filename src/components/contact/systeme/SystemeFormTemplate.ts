
export const getSystemeFormHtml = () => {
  return `<!DOCTYPE html>
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
};
