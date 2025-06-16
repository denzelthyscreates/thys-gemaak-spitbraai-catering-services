
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MenuSummary from './MenuSummary';
import BookingForm from './BookingForm';

interface BookingFormWithSummaryProps {
  menuSelection: any;
  onFormSubmitted: (result: any) => void;
  onBackToMenu: () => void;
}

const BookingFormWithSummary: React.FC<BookingFormWithSummaryProps> = ({
  menuSelection,
  onFormSubmitted,
  onBackToMenu
}) => {
  const [bookingFormData, setBookingFormData] = useState<any>(null);

  // Ensure we scroll to top when this component mounts
  useEffect(() => {
    // Scroll to the top of this component smoothly
    const element = document.getElementById('booking-form-with-summary');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleFormDataChange = (data: any) => {
    setBookingFormData(data);
  };

  if (!menuSelection) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No menu selection available.</p>
        <Button onClick={onBackToMenu} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu Builder
        </Button>
      </div>
    );
  }

  return (
    <div id="booking-form-with-summary" className="space-y-6">
      {/* Back to Menu Button */}
      <div className="flex justify-start">
        <Button onClick={onBackToMenu} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu Builder
        </Button>
      </div>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-serif font-semibold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">Review your menu selection and provide your details</p>
      </div>

      {/* Menu Summary at the top */}
      <MenuSummary menuSelection={menuSelection} />

      {/* Booking Form below */}
      <div>
        <BookingForm
          menuSelection={menuSelection}
          savedFormData={bookingFormData}
          onFormDataChange={handleFormDataChange}
          onFormSubmitted={onFormSubmitted}
        />
      </div>
    </div>
  );
};

export default BookingFormWithSummary;
