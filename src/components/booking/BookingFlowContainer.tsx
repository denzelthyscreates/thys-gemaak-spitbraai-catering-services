
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
    setBookingResult(result);
    setCurrentStep('bookingConfirmed');
    
    // Scroll to top when showing confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <BookingSummary
            bookingData={bookingResult.bookingData}
            bookingId={bookingResult.booking.id}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="booking-flow-container">
      {renderCurrentStep()}
    </div>
  );
};

export default BookingFlowContainer;
