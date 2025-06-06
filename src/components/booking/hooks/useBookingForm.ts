
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { submitBookingToLatenode } from '@/services/LatenodeService';
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
  });

  useEffect(() => {
    console.log('BookingForm useEffect - Menu selection:', menuSelection);
    console.log('BookingForm useEffect - Saved form data:', savedFormData);
    
    if (savedFormData) {
      Object.entries(savedFormData).forEach(([field, value]) => {
        if (field !== 'eventDate') {
          form.setValue(field as keyof BookingFormValues, value);
          console.log(`Set form field ${field} to:`, value);
        }
      });
      
      if (savedFormData.eventDate) {
        form.setValue('eventDate', new Date(savedFormData.eventDate));
      }
    }

    // Pre-populate fields from menu selection
    if (menuSelection) {
      if (menuSelection.eventType) {
        form.setValue('eventType', menuSelection.eventType);
        console.log('Set eventType to:', menuSelection.eventType);
      }
      if (menuSelection.postalCode) {
        form.setValue('venuePostalCode', menuSelection.postalCode);
        console.log('Set venuePostalCode to:', menuSelection.postalCode);
      }
      if (menuSelection.numberOfGuests) {
        form.setValue('numberOfGuests', menuSelection.numberOfGuests);
        console.log('Set numberOfGuests to:', menuSelection.numberOfGuests);
      }
    }
  }, [savedFormData, menuSelection, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log('Form values changed:', values);
      if (onFormDataChange && Object.keys(form.formState.dirtyFields).length > 0) {
        onFormDataChange(values as BookingFormValues);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form, onFormDataChange]);

  const onSubmit = async (data: BookingFormValues) => {
    console.log("Form submission started with data:", data);
    console.log("Menu selection at submission:", menuSelection);
    
    if (!menuSelection) {
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

      // Combine venue address into eventLocation for backward compatibility
      const eventLocation = data.venueName 
        ? `${data.venueName}, ${data.venueStreetAddress}, ${data.venueCity}, ${data.venueProvince} ${data.venuePostalCode}`
        : `${data.venueStreetAddress}, ${data.venueCity}, ${data.venueProvince} ${data.venuePostalCode}`;

      const enhancedBookingData = {
        // Contact Information
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate ? format(data.eventDate, 'yyyy-MM-dd') : undefined,
        eventType: menuSelection.eventType || data.eventType,
        eventLocation: eventLocation,
        additionalNotes: data.additionalNotes,
        referralSource: data.referralSource || "",
        
        // Event Venue Details
        venueName: data.venueName || "",
        venueStreetAddress: data.venueStreetAddress,
        venueCity: data.venueCity,
        venueProvince: data.venueProvince,
        venuePostalCode: data.venuePostalCode,
        
        // Address Information for Invoicing
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || "",
        city: data.city,
        province: data.province,
        postalCodeAddress: data.postalCodeAddress,
        
        // Menu Selection Details
        menuPackage: menuSelection.menuPackage,
        numberOfGuests: menuSelection.numberOfGuests,
        season: menuSelection.season || "",
        starters: menuSelection.starters || "",
        sides: menuSelection.sides || "",
        desserts: menuSelection.desserts || "",
        extras: menuSelection.extras || "",
        extraSaladType: menuSelection.extraSaladType || "",
        includeCutlery: menuSelection.includeCutlery || false,
        
        // Pricing Information with Travel Fee
        pricePerPerson: menuSelection.totalPrice,
        menuSubtotal: menuSubtotal,
        travelFee: travelFee,
        totalAmount: totalAmount,
        postalCode: menuSelection.postalCode || "",
        areaName: menuSelection.areaName || "",
        discountApplied: menuSelection.discountApplied || false,
        
        // Booking Management
        bookingReference: bookingReference,
        status: 'pending_payment',
        submittedAt: new Date().toISOString(),
      };
      
      console.log("Prepared booking data for Latenode:", enhancedBookingData);
      
      const result = await submitBookingToLatenode(enhancedBookingData);
      console.log("Latenode submission result:", result);
      
      if (result.success) {
        console.log("Booking submission successful");
        setBookingId(result.bookingId || bookingReference);
        
        toast.success("Booking enquiry submitted successfully!", {
          description: "Your booking reference: " + bookingReference
        });
        
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
      } else {
        console.error("Latenode submission failed:", result.error);
        throw new Error(result.error || "Failed to submit booking to Latenode");
      }
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("There was a problem submitting your booking", {
        description: "Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
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
