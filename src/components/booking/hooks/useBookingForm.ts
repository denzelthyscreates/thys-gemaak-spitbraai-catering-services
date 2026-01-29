
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { bookingFormSchema, BookingFormValues } from '../types';
import { generateBookingReference } from '../utils';

export const useBookingForm = (menuSelection: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: menuSelection?.eventType || '',
      numberOfGuests: menuSelection?.numberOfGuests || 50,
      eventDate: '',
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
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    console.log("=== BOOKING SUBMISSION STARTED ===");
    console.log("Form data received:", data);
    console.log("Menu selection:", menuSelection);

    if (!menuSelection) {
      console.error("ERROR: No menu selection provided");
      toast({
        title: "Error",
        description: "Menu selection is required to complete booking",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a shorter booking reference
      const bookingReference = generateBookingReference();
      console.log("Generated booking reference:", bookingReference);

      // Prepare booking data - user_id is set server-side by database trigger
      // to prevent identity spoofing attacks
      const bookingData = {
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone,
        event_date: data.eventDate,
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
        additional_notes: data.additionalNotes || null,
        event_type: data.eventType,
        menu_package: menuSelection.menuPackage,
        number_of_guests: data.numberOfGuests,
        total_price: menuSelection.totalPrice,
        season: menuSelection.season || null,
        starters: menuSelection.starters || null,
        sides: menuSelection.sides || null,
        desserts: menuSelection.desserts || null,
        extras: menuSelection.extras || null,
        extra_salad_type: menuSelection.extraSaladType || null,
        menu_selection: menuSelection,
        notes: data.additionalNotes || '',
        referral_source: data.referralSource || null,
        status: 'pending',
        booking_reference: bookingReference
        // Note: user_id is NOT included here - it's set server-side by the enforce_booking_user_id trigger
      };

      console.log("=== ATTEMPTING SUPABASE INSERT ===");
      console.log("Booking data to insert:", bookingData);

      // Check if Supabase client is available
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      console.log("Supabase client available, attempting insert...");

      const { data: insertedData, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      console.log("=== SUPABASE INSERT RESPONSE ===");
      console.log("Inserted data:", insertedData);
      console.log("Error:", error);

      if (error) {
        console.error("=== SUPABASE INSERT ERROR DETAILS ===");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        console.error("Full error object:", error);
        
        // Provide more specific error messages based on error type
        let errorMessage = "Failed to create booking. ";
        
        if (error.code === '42501') {
          errorMessage += "Permission denied - this might be a database policy issue.";
        } else if (error.code === '23502') {
          errorMessage += "Required field missing.";
        } else if (error.code === '23505') {
          errorMessage += "Duplicate booking detected.";
        } else {
          errorMessage += `Database error: ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!insertedData) {
        console.error("No data returned from insert operation");
        throw new Error("No booking data returned from database");
      }

      console.log("=== BOOKING CREATED SUCCESSFULLY ===");
      console.log("Booking ID:", insertedData.id);
      console.log("Booking Reference:", insertedData.booking_reference || bookingReference);
      console.log("Created booking:", insertedData);

      // Use the custom reference from the inserted data or fallback to generated one
      const finalBookingReference = insertedData.booking_reference || bookingReference;

      // Create Zoho estimate first, then send email
      try {
        console.log("=== ATTEMPTING TO CREATE ZOHO QUOTE ===");
        
        const { data: zohoData, error: zohoError } = await supabase.functions.invoke('zoho-books-integration', {
          body: {
            action: 'create-estimate',
            bookingId: insertedData.id
          }
        });

        console.log("=== ZOHO QUOTE RESPONSE ===");
        console.log("Zoho data:", zohoData);
        console.log("Zoho error:", zohoError);

        let zohoEstimate = null;
        if (zohoError) {
          console.error("Zoho quote creation failed:", zohoError);
        } else {
          console.log("Zoho quote created successfully");
          zohoEstimate = zohoData;
        }

        // Send the summary email (with or without Zoho data)
        console.log("=== ATTEMPTING TO SEND EMAIL ===");
        console.log("Sending email to:", insertedData.contact_email);
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-booking-summary', {
          body: {
            bookingData: insertedData,
            bookingId: finalBookingReference,
            zohoEstimate: zohoEstimate
          }
        });

        console.log("=== EMAIL SEND RESPONSE ===");
        console.log("Email data:", emailData);
        console.log("Email error:", emailError);

        if (emailError) {
          console.error("Email sending failed:", emailError);
          toast({
            title: "Booking Successful!",
            description: "Your booking was created successfully, but there was an issue sending the confirmation email. You can still access your booking details below.",
            duration: 7000
          });
        } else {
          console.log("Email sent successfully");
          const message = zohoEstimate 
            ? `Your booking and professional quote have been created. Confirmation email sent to ${insertedData.contact_email}`
            : `Your booking has been created and a confirmation email has been sent to ${insertedData.contact_email}`;
          
          toast({
            title: "Booking Successful!",
            description: message,
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Email/Zoho processing exception:", error);
        toast({
          title: "Booking Successful!",
          description: "Your booking was created successfully, but there was an issue with additional processing. You can still access your booking details below.",
          duration: 7000
        });
      }

      // Prepare the result data with the custom reference
      const result = {
        bookingData: {
          ...insertedData,
          booking_reference: finalBookingReference
        },
        booking: {
          ...insertedData,
          booking_reference: finalBookingReference
        },
        bookingReference: finalBookingReference
      };

      console.log("=== BOOKING PROCESS COMPLETED ===");
      console.log("Final result:", result);

      setBookingResult(result);
      setSubmissionComplete(true);

    } catch (error) {
      console.error("=== BOOKING SUBMISSION ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error instance:", error instanceof Error);
      console.error("Error message:", error?.message || "Unknown error");
      console.error("Error stack:", error?.stack);
      console.error("Full error object:", error);
      
      toast({
        title: "Booking Failed",
        description: error?.message || "There was an error creating your booking. Please try again or contact support.",
        variant: "destructive",
        duration: 10000
      });
    } finally {
      console.log("=== BOOKING SUBMISSION CLEANUP ===");
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submissionComplete,
    bookingResult,
    onSubmit,
  };
};
