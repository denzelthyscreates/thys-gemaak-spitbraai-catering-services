
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { submitBookingToLatenode } from '@/services/LatenodeService';
import { createBooking } from '@/lib/supabase';
import { BookingFormValues, bookingFormSchema } from '../types';
import { generateBookingReference } from '../utils';

export const useBookingForm = (
  menuSelection: any,
  savedFormData?: BookingFormValues | null,
  onFormDataChange?: (data: BookingFormValues | null) => void,
  onFormSubmitted?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
 
  const defaultValues: BookingFormValues = {
    name: '',
    email: '',
    phone: '',
    eventType: menuSelection?.eventType || '',
    numberOfGuests: menuSelection?.numberOfGuests || 0,
    venueName: '',
    venueStreetAddress: '',
    venueCity: '',
    venueProvince: '',
    venuePostalCode: menuSelection?.postalCode || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCodeAddress: '',
    referralSource: '',
    additionalNotes: '',
    ...savedFormData
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
    mode: 'onChange', // Enable real-time validation
  });

  // Memoize the form data change handler to prevent unnecessary re-renders
  const handleFormDataChange = useCallback((values: BookingFormValues) => {
    if (onFormDataChange && Object.keys(form.formState.dirtyFields).length > 0) {
      onFormDataChange(values);
    }
  }, [onFormDataChange, form.formState.dirtyFields]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('BookingForm useEffect - Menu selection:', menuSelection);
      console.log('BookingForm useEffect - Saved form data:', savedFormData);
    }
    
    if (savedFormData) {
      Object.entries(savedFormData).forEach(([field, value]) => {
        if (field !== 'eventDate') {
          form.setValue(field as keyof BookingFormValues, value);
        }
      });
      
      if (savedFormData.eventDate) {
        form.setValue('eventDate', new Date(savedFormData.eventDate));
      }
    }

    if (menuSelection) {
      if (menuSelection.eventType) {
        form.setValue('eventType', menuSelection.eventType);
      }
      if (menuSelection.postalCode) {
        form.setValue('venuePostalCode', menuSelection.postalCode);
      }
      if (menuSelection.numberOfGuests) {
        form.setValue('numberOfGuests', menuSelection.numberOfGuests);
      }
    }
  }, [savedFormData, menuSelection, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      handleFormDataChange(values as BookingFormValues);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form, handleFormDataChange]);

  const onSubmit = async (data: BookingFormValues) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submission started with data:", data);
    console.log("Menu selection at submission:", menuSelection);
    
    if (!menuSelection) {
      console.error("No menu selection found");
      toast.error("Please select a menu package first");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingReference = generateBookingReference();
      console.log("Generated booking reference:", bookingReference);
      
      // Calculate total amount including travel fee
      const menuSubtotal = menuSelection.totalPrice * menuSelection.numberOfGuests;
      const travelFee = menuSelection.travelFee || 0;
      const totalAmount = menuSubtotal + travelFee;

      console.log("Pricing calculation:", {
        menuSubtotal,
        travelFee,
        totalAmount,
        numberOfGuests: menuSelection.numberOfGuests
      });

      // Prepare booking data for Supabase (without user_id since we'll handle auth in createBooking)
      const supabaseBookingData = {
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone,
        event_date: data.eventDate ? data.eventDate.toISOString() : null,
        event_type: menuSelection.eventType || data.eventType,
        venue_name: data.venueName || null,
        venue_street_address: data.venueStreetAddress,
        venue_city: data.venueCity,
        venue_province: data.venueProvince,
        venue_postal_code: data.venuePostalCode,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || null,
        city: data.city,
        province: data.province,
        postal_code_address: data.postalCodeAddress,
        referral_source: data.referralSource || null,
        additional_notes: data.additionalNotes || null,
        menu_package: menuSelection.menuPackage,
        number_of_guests: menuSelection.numberOfGuests,
        season: menuSelection.season || null,
        starters: menuSelection.starters || null,
        sides: menuSelection.sides || null,
        desserts: menuSelection.desserts || null,
        extras: menuSelection.extras || null,
        extra_salad_type: menuSelection.extraSaladType || null,
        include_cutlery: menuSelection.includeCutlery || false,
        price_per_person: menuSelection.totalPrice,
        menu_subtotal: menuSubtotal,
        travel_fee: travelFee,
        total_price: totalAmount,
        area_name: menuSelection.areaName || null,
        discount_applied: menuSelection.discountApplied || false,
        booking_reference: bookingReference,
        status: 'pending_payment',
        submitted_at: new Date().toISOString(),
        notes: data.additionalNotes || ''
      };

      // Save to Supabase first
      console.log("Saving booking to Supabase:", supabaseBookingData);
      const { data: supabaseResult, error: supabaseError } = await createBooking(supabaseBookingData);
      
      if (supabaseError) {
        console.error("Failed to save to Supabase:", supabaseError);
        
        // Check if it's an authentication error
        if (supabaseError.message?.includes('auth') || supabaseError.message?.includes('authentication')) {
          // For anonymous bookings, we'll proceed without authentication
          console.log("Proceeding with anonymous booking submission");
          
          // Create a temporary booking ID for the session
          const tempBookingId = `temp_${bookingReference}`;
          setBookingId(tempBookingId);
          
          // Save to localStorage as fallback
          const fallbackData = {
            ...supabaseBookingData,
            id: tempBookingId,
            timestamp: new Date().toISOString(),
            status: 'pending_auth'
          };
          localStorage.setItem(`booking_${bookingReference}`, JSON.stringify(fallbackData));
          
          toast.success("Booking submitted successfully!", {
            description: "Your booking reference: " + bookingReference
          });
          
          // Show payment options even without Supabase save
          setSubmissionComplete(true);
          setShowPaymentOptions(true);
          
          // Clear form data
          localStorage.removeItem('bookingFormData');
          if (onFormDataChange) {
            onFormDataChange(null);
          }
          
          if (onFormSubmitted) {
            onFormSubmitted();
          }
          
          return;
        }
        
        toast.error("Failed to save booking", {
          description: "Please try again or contact us directly. Error: " + supabaseError.message
        });
        return;
      }

      console.log("Booking saved to Supabase successfully:", supabaseResult);

      // Combine venue address into eventLocation for backward compatibility with Latenode
      const eventLocation = data.venueName 
        ? `${data.venueName}, ${data.venueStreetAddress}, ${data.venueCity}, ${data.venueProvince} ${data.venuePostalCode}`
        : `${data.venueStreetAddress}, ${data.venueCity}, ${data.venueProvince} ${data.venuePostalCode}`;

      const enhancedBookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate ? format(data.eventDate, 'yyyy-MM-dd') : undefined,
        eventType: menuSelection.eventType || data.eventType,
        eventLocation: eventLocation,
        additionalNotes: data.additionalNotes,
        referralSource: data.referralSource || "",
        venueName: data.venueName || "",
        venueStreetAddress: data.venueStreetAddress,
        venueCity: data.venueCity,
        venueProvince: data.venueProvince,
        venuePostalCode: data.venuePostalCode,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || "",
        city: data.city,
        province: data.province,
        postalCodeAddress: data.postalCodeAddress,
        menuPackage: menuSelection.menuPackage,
        numberOfGuests: menuSelection.numberOfGuests,
        season: menuSelection.season || "",
        starters: menuSelection.starters || "",
        sides: menuSelection.sides || "",
        desserts: menuSelection.desserts || "",
        extras: menuSelection.extras || "",
        extraSaladType: menuSelection.extraSaladType || "",
        includeCutlery: menuSelection.includeCutlery || false,
        pricePerPerson: menuSelection.totalPrice,
        menuSubtotal: menuSubtotal,
        travelFee: travelFee,
        totalAmount: totalAmount,
        postalCode: menuSelection.postalCode || "",
        areaName: menuSelection.areaName || "",
        discountApplied: menuSelection.discountApplied || false,
        bookingReference: bookingReference,
        status: 'pending_payment',
        submittedAt: new Date().toISOString(),
        supabaseId: supabaseResult.id // Include the Supabase booking ID
      };
      
      console.log("Prepared booking data for Latenode:", enhancedBookingData);
      
      // Send to Latenode (secondary)
      const result = await submitBookingToLatenode(enhancedBookingData);
      console.log("Latenode submission result:", result);
      
      if (result.success) {
        console.log("Booking submission successful");
        setBookingId(supabaseResult.id);
        
        toast.success("Booking enquiry submitted successfully!", {
          description: "Your booking reference: " + bookingReference
        });
        
        setSubmissionComplete(true);
        setShowPaymentOptions(true);
        
        localStorage.removeItem('bookingFormData');
        if (onFormDataChange) {
          onFormDataChange(null);
        }
        
        if (onFormSubmitted) {
          onFormSubmitted();
        }

        // Redirect to payment page instead of staying on form
        // This ensures the user sees the payment options
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        
      } else {
        console.error("Latenode submission failed:", result.error);
        // Don't throw error here since Supabase save was successful
        toast.success("Booking saved successfully!", {
          description: "Your booking reference: " + bookingReference + " (Note: External notification may be delayed)"
        });
        
        setBookingId(supabaseResult.id);
        setSubmissionComplete(true);
        setShowPaymentOptions(true);
        
        if (onFormSubmitted) {
          onFormSubmitted();
        }

        // Scroll to top to show payment options
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("There was a problem submitting your booking", {
        description: "Please try again or contact us directly. Error: " + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsSubmitting(false);
      console.log("=== FORM SUBMISSION COMPLETED ===");
    }
  };

  return {
    form,
    isSubmitting,
    submissionComplete,
    showPaymentOptions,
    bookingId,
    onSubmit
  };
};
