
import React, { useState, useEffect } from 'react';
import MenuBuilder from '../MenuBuilder';
import BookingFormWithSummary from './BookingFormWithSummary';
import BookingSummary from './BookingSummary';

export type BookingStep = 'menuBuilder' | 'bookingForm' | 'bookingConfirmed';

interface BookingFlowContainerProps {
  initialMenuSelection?: any;
  onBookingFormReached?: () => void;
}

const BookingFlowContainer: React.FC<BookingFlowContainerProps> = ({
  initialMenuSelection,
  onBookingFormReached
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    initialMenuSelection ? 'bookingForm' : 'menuBuilder'
  );
  const [menuSelection, setMenuSelection] = useState<any>(initialMenuSelection || null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Only call scroll callback when reaching booking form step
  useEffect(() => {
    if (currentStep === 'bookingForm' && onBookingFormReached) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        onBookingFormReached();
      }, 100);
    }
  }, [currentStep, onBookingFormReached]);

  const handleMenuSelectionChange = (selection: any) => {
    console.log('Menu selection changed in flow:', selection);
    setMenuSelection(selection);
  };

  const handleContinueToBooking = () => {
    console.log('Continuing to booking form with menu selection:', menuSelection);
    setCurrentStep('bookingForm');
  };

  const handleBookingSubmitted = (result: any) => {
    console.log('Booking submitted successfully:', result);
    setBookingResult(result);
    setCurrentStep('bookingConfirmed');
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
