
import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { BookingFormProps } from './types';
import { useBookingForm } from './hooks/useBookingForm';
import ContactSection from './ContactSection';
import EventDetailsSection from './EventDetailsSection';
import VenueSection from './VenueSection';
import BillingSection from './BillingSection';
import MenuSummary from './MenuSummary';
import AdditionalNotesSection from './AdditionalNotesSection';
import SubmitButton from './SubmitButton';
import BookingSummary from './BookingSummary';

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
    bookingResult,
    onSubmit
  } = useBookingForm(menuSelection);

  // Pre-fill postal code from menu selection and restore saved form data
  useEffect(() => {
    if (menuSelection?.postalCode) {
      form.setValue('venuePostalCode', menuSelection.postalCode);
    }
    
    if (menuSelection?.eventType) {
      form.setValue('eventType', menuSelection.eventType);
    }
    
    if (menuSelection?.numberOfGuests) {
      form.setValue('numberOfGuests', menuSelection.numberOfGuests);
    }

    // Restore saved form data if available
    if (savedFormData) {
      Object.keys(savedFormData).forEach((key) => {
        if (savedFormData[key] !== undefined && savedFormData[key] !== null) {
          form.setValue(key as any, savedFormData[key]);
        }
      });
    }
  }, [menuSelection, savedFormData, form]);

  // Save form data when form values change
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (onFormDataChange) {
        onFormDataChange(data);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onFormDataChange]);

  // Show booking summary after successful submission
  if (submissionComplete && bookingResult) {
    return (
      <BookingSummary 
        bookingData={bookingResult.bookingData}
        bookingId={bookingResult.booking.id}
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
        {/* Always show Menu Summary at the top when menuSelection exists */}
        {menuSelection && <MenuSummary menuSelection={menuSelection} />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information and Billing Address side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactSection form={form} />
              <BillingSection form={form} />
            </div>

            {/* Event Details section with Venue and Date */}
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
