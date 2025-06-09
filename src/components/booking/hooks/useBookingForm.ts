
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback, useRef } from 'react';
import { BookingFormValues, bookingFormSchema } from '../types';
import { createBooking } from '../../../lib/supabase';

export const useBookingForm = (menuSelection: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const initializationRef = useRef(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventDate: undefined,
      eventType: '',
      numberOfGuests: 50,
      venueName: '',
      venueStreetAddress: '',
      venueCity: '',
      venueProvince: '',
      venuePostalCode: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCodeAddress: '',
      referralSource: '',
      additionalNotes: '',
    },
  });

  // Debounced form data change handler
  const handleFormDataChange = useCallback(
    debounce((data: BookingFormValues) => {
      if (initializationRef.current) {
        localStorage.setItem('bookingFormData', JSON.stringify(data));
      }
    }, 300),
    []
  );

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('bookingFormData');
    if (savedData && !initializationRef.current) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          form.setValue(key as keyof BookingFormValues, parsedData[key], { shouldDirty: false });
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
    initializationRef.current = true;
  }, []);

  // Watch form changes with debouncing
  useEffect(() => {
    const subscription = form.watch(handleFormDataChange);
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [handleFormDataChange]);

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData = {
        ...data,
        menuSelection,
        totalAmount: calculateTotal(menuSelection, data.numberOfGuests),
      };

      const result = await createBooking(bookingData);
      setIsSubmitted(true);
      setSubmissionComplete(true);
      setShowPaymentOptions(true);
      setBookingId(result.id);
      localStorage.removeItem('bookingFormData');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    submitError,
    isSubmitted,
    submissionComplete,
    showPaymentOptions,
    bookingId,
  };
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }) as T;
}

function calculateTotal(menuSelection: any, numberOfGuests: number): number {
  // Add your pricing calculation logic here
  return 0;
}
