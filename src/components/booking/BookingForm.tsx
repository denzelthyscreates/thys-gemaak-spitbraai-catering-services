
import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { BookingFormProps } from './types';
import { useBookingForm } from './hooks/useBookingForm';
import ContactSection from './ContactSection';
import EventDetailsSection from './EventDetailsSection';
import VenueSection from './VenueSection';
import BillingSection from './BillingSection';
import AdditionalNotesSection from './AdditionalNotesSection';
import SubmitButton from './SubmitButton';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

  // Pre-fill form data from menu selection and restore saved form data
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

  // Handle successful submission by calling the parent's onFormSubmitted immediately
  useEffect(() => {
    if (submissionComplete && bookingResult && onFormSubmitted) {
      console.log('Booking submission complete, calling onFormSubmitted with:', bookingResult);
      // Call the callback to navigate to confirmation
      onFormSubmitted(bookingResult);
    }
  }, [submissionComplete, bookingResult, onFormSubmitted]);

  return (
    <div className="booking-form-wrapper space-y-6">
      <div className="space-y-6">
        {/* Security notice (always visible here even if the top banner is dismissed/hidden) */}
        <div className="rounded-lg border bg-primary/5 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground whitespace-normal break-words leading-snug">
                <span className="font-semibold">Your security matters!</span>{' '}
                <span className="text-muted-foreground">
                  Account creation is required to protect your booking information.
                </span>
              </p>
            </div>
            <Link to="/auth" className="flex-shrink-0">
              <Button size="sm" variant="outline" className="whitespace-nowrap">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

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
