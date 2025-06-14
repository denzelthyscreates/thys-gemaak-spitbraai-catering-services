
import React from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
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
    onSubmit
  } = useBookingForm(menuSelection);

  // Show success message after successful submission
  if (submissionComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-serif text-green-700">
            Booking Submitted Successfully!
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for your booking request. We have received all your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">What happens next?</p>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• We will review your booking details</li>
              <li>• You'll receive a confirmation email within 24-48 hours</li>
              <li>• We'll contact you to finalize the arrangements</li>
            </ul>
          </div>
          
          <p className="text-muted-foreground">
            If you have any questions, please contact us at{' '}
            <a href="mailto:spitbookings@thysgemaak.com" className="text-primary hover:underline">
              spitbookings@thysgemaak.com
            </a>
          </p>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-6"
          >
            Make Another Booking
          </Button>
        </CardContent>
      </Card>
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
