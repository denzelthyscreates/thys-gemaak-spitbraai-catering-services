
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
    setMenuSelection(selection);
  };

  const handleContinueToBooking = () => {
    setCurrentStep('bookingForm');
  };

  const handleBookingSubmitted = (result: any) => {
    setBookingResult(result);
    setCurrentStep('bookingConfirmed');
    
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

  const renderCurrentStep = () => {
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
      {renderCurrentStep()}
    </div>
  );
};

export default BookingFlowContainer;
