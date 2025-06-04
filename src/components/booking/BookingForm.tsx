
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { submitBookingToLatenode } from '@/services/LatenodeService';
import { BookingFormProps, BookingFormValues, bookingFormSchema } from './types';
import { generateBookingReference } from './utils';
import ContactSection from './ContactSection';
import EventDetailsSection from './EventDetailsSection';
import VenueSection from './VenueSection';
import BillingSection from './BillingSection';
import MenuSummary from './MenuSummary';
import PaymentComplete from './PaymentComplete';

const BookingForm: React.FC<BookingFormProps> = ({ 
  menuSelection, 
  savedFormData, 
  onFormDataChange,
  onFormSubmitted,
  onNavigateTab
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const defaultValues: BookingFormValues = {
    name: '',
    email: '',
    phone: '',
    eventType: menuSelection?.eventType || '',
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

    // Pre-populate event type and postal code from menu selection
    if (menuSelection) {
      if (menuSelection.eventType) {
        form.setValue('eventType', menuSelection.eventType);
      }
      if (menuSelection.postalCode) {
        form.setValue('venuePostalCode', menuSelection.postalCode);
      }
    }
  }, [savedFormData, menuSelection, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (onFormDataChange && Object.keys(form.formState.dirtyFields).length > 0) {
        onFormDataChange(values as BookingFormValues);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form, onFormDataChange]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!menuSelection) {
      toast.error("Please select a menu package first");
      return;
    }
    
    console.log("Form submission started with data:", data);
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

  if (submissionComplete && showPaymentOptions) {
    return (
      <PaymentComplete 
        bookingId={bookingId}
        menuSelection={menuSelection}
        form={form}
      />
    );
  }

  console.log("Rendering booking form with menu selection:", menuSelection);
  console.log("Form errors:", form.formState.errors);
  console.log("Form is valid:", form.formState.isValid);

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
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information or Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share any specific requirements or questions you have..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !menuSelection}
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking Form"}
            </Button>
            
            {!menuSelection && (
              <p className="text-sm text-muted-foreground text-center">
                Please select a menu package before submitting your booking.
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingForm;
