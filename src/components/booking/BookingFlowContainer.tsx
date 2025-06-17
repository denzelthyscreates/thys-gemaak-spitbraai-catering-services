
import React, { useState, useEffect } from 'react';
import MenuBuilder from '../MenuBuilder';
import BookingFormWithSummary from './BookingFormWithSummary';
import BookingSummary from './BookingSummary';

export type BookingStep = 'menuBuilder' | 'bookingForm' | 'bookingConfirmed';

interface BookingFlowContainerProps {
  initialMenuSelection?: any;
}

const BookingFlowContainer: React.FC<BookingFlowContainerProps> = ({
  initialMenuSelection
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    initialMenuSelection ? 'bookingForm' : 'menuBuilder'
  );
  const [menuSelection, setMenuSelection] = useState<any>(initialMenuSelection || null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const handleMenuSelectionChange = (selection: any) => {
    console.log('Menu selection changed in flow:', selection);
    setMenuSelection(selection);
  };

  const handleContinueToBooking = () => {
    console.log('Continuing to booking form with menu selection:', menuSelection);
    setCurrentStep('bookingForm');
  };

  const handleBookingSubmitted = (result: any) => {
    console.log('Booking submitted successfully, transitioning to confirmation:', result);
    console.log('Current step before transition:', currentStep);
    
    setBookingResult(result);
    setCurrentStep('bookingConfirmed');
    
    console.log('Set step to bookingConfirmed, result:', result);
    
    // Ensure we scroll to the top of the confirmation section smoothly
    setTimeout(() => {
      const confirmationElement = document.getElementById('booking-confirmation');
      if (confirmationElement) {
        confirmationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToMenu = () => {
    setCurrentStep('menuBuilder');
  };

  // Debug logging for step changes
  useEffect(() => {
    console.log('BookingFlowContainer step changed to:', currentStep);
    console.log('Booking result available:', !!bookingResult);
  }, [currentStep, bookingResult]);

  const renderCurrentStep = () => {
    console.log('Rendering step:', currentStep, 'with booking result:', !!bookingResult);
    
    switch (currentStep) {
      case 'menuBuilder':
        return (
          <MenuBuilder 
            onSelectionChange={handleMenuSelectionChange}
            initialSelection={menuSelection}
            onNavigateTab={handleContinueToBooking}
          />
        );
      
      case 'bookingForm':
        return (
          <BookingFormWithSummary
            menuSelection={menuSelection}
            onFormSubmitted={handleBookingSubmitted}
            onBackToMenu={handleBackToMenu}
          />
        );
      
      case 'bookingConfirmed':
        console.log('Rendering BookingSummary with:', bookingResult);
        return bookingResult ? (
          <div id="booking-confirmation">
            <BookingSummary
              bookingData={bookingResult.bookingData}
              bookingId={bookingResult.booking.id}
            />
          </div>
        ) : (
          <div>Loading confirmation...</div>
        );
      
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  return (
    <div className="booking-flow-container">
      <div style={{ display: 'none' }}>Debug: {currentStep}</div>
      {renderCurrentStep()}
    </div>
  );
};

export default BookingFlowContainer;
