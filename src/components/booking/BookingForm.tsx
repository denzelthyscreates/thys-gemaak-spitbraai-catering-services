
import React from 'react';
import { Form } from '@/components/ui/form';
import { BookingFormProps } from './types';
import { useBookingForm } from './hooks/useBookingForm';
import ContactSection from './ContactSection';
import EventDetailsSection from './EventDetailsSection';
import VenueSection from './VenueSection';
import BillingSection from './BillingSection';
import MenuSummary from './MenuSummary';
import PaymentComplete from './PaymentComplete';
import AdditionalNotesSection from './AdditionalNotesSection';
import SubmitButton from './SubmitButton';

const BookingForm: React.FC<BookingFormProps> = ({ 
  menuSelection, 
  savedFormData, 
  onFormDataChange,
  onFormSubmitted,
  onNavigateTab
}) => {
  const {
    form,
    isSubmitting,
    submissionComplete,
    showPaymentOptions,
    bookingId,
    onSubmit
  } = useBookingForm(menuSelection, savedFormData, onFormDataChange, onFormSubmitted);

  // Show payment page after successful submission
  if (submissionComplete && showPaymentOptions) {
    return (
      <PaymentComplete 
        bookingId={bookingId}
        menuSelection={menuSelection}
        form={form}
      />
    );
  }

  // Only log in development mode to prevent infinite console spam
  if (process.env.NODE_ENV === 'development') {
    console.log("Rendering booking form with menu selection:", menuSelection);
    console.log("Form errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
  }

  return (
    <div className="booking-form-wrapper space-y-6">
      <div className="space-y-6">
        {/* Top - Menu Summary */}
        <MenuSummary menuSelection={menuSelection} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Middle - Contact Information and Billing Address side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactSection form={form} />
              <BillingSection form={form} />
            </div>

            {/* Bottom - Event Details section with Venue and Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VenueSection form={form} />
                <EventDetailsSection form={form} menuSelection={menuSelection} />
              </div>
            </div>
            
            <AdditionalNotesSection form={form} />
            
            <SubmitButton isSubmitting={isSubmitting} menuSelection={menuSelection} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingForm;
