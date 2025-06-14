
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
      console.log('Form data received:', data);
      console.log('Menu selection:', menuSelection);
      
      // Ensure event date is properly formatted
      const eventDate = data.eventDate ? data.eventDate.toISOString() : null;
      
      // Map form fields to database column names
      const bookingData = {
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone,
        event_date: eventDate,
        event_type: data.eventType || menuSelection?.eventType || '',
        number_of_guests: data.numberOfGuests,
        venue_name: data.venueName,
        venue_street_address: data.venueStreetAddress,
        venue_city: data.venueCity,
        venue_province: data.venueProvince,
        venue_postal_code: data.venuePostalCode,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || '',
        city: data.city,
        province: data.province,
        postal_code_address: data.postalCodeAddress,
        referral_source: data.referralSource || '',
        additional_notes: data.additionalNotes || '',
        menu_selection: menuSelection,
        total_price: calculateTotal(menuSelection, data.numberOfGuests),
        menu_package: menuSelection?.menuPackage || '',
        season: menuSelection?.season || '',
        starters: menuSelection?.starters || '',
        sides: menuSelection?.sides || '',
        desserts: menuSelection?.desserts || '',
        extras: menuSelection?.extras || '',
        extra_salad_type: menuSelection?.extraSaladType || '',
        notes: `Event Type: ${data.eventType || menuSelection?.eventType || ''}${data.additionalNotes ? '\n\nAdditional Notes: ' + data.additionalNotes : ''}`,
        status: 'pending'
      };

      console.log('Final booking data to be sent:', bookingData);

      const { data: result, error } = await createBooking(bookingData);
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Booking created successfully:', result);
      
      setIsSubmitted(true);
      setSubmissionComplete(true);
      setShowPaymentOptions(true);
      setBookingId(result?.id || null);
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
  return menuSelection?.totalPrice || 0;
}
