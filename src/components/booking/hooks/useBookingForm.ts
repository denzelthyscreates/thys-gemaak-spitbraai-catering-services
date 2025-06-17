
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { bookingFormSchema, BookingFormValues } from '../types';

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
      additionalNotes: '',
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    if (!menuSelection) {
      toast({
        title: "Error",
        description: "Menu selection is required to complete booking",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting booking with data:', data);
      console.log('Menu selection:', menuSelection);

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
        status: 'pending'
      };

      const { data: insertedData, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Booking inserted successfully:', insertedData);

      // Automatically send the summary email
      try {
        console.log('Sending automatic booking summary email to:', insertedData.contact_email);
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-booking-summary', {
          body: {
            bookingData: insertedData,
            bookingId: insertedData.id
          }
        });

        if (emailError) {
          console.error('Email sending error:', emailError);
          // Don't throw error here - booking was successful, just email failed
          toast({
            title: "Booking Successful!",
            description: "Your booking was created successfully, but there was an issue sending the confirmation email. You can still access your booking details below.",
            duration: 7000
          });
        } else {
          console.log('Automatic email sent successfully:', emailData);
          toast({
            title: "Booking Successful!",
            description: `Your booking has been created and a confirmation email has been sent to ${insertedData.contact_email}`,
            duration: 5000
          });
        }
      } catch (emailError) {
        console.error('Error sending automatic email:', emailError);
        // Don't fail the booking if email fails
        toast({
          title: "Booking Successful!",
          description: "Your booking was created successfully, but there was an issue sending the confirmation email. You can still access your booking details below.",
          duration: 7000
        });
      }

      // Prepare the result data in the expected format
      const result = {
        bookingData: insertedData,
        booking: insertedData
      };

      setBookingResult(result);
      setSubmissionComplete(true);

    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again or contact support.",
        variant: "destructive",
        duration: 7000
      });
    } finally {
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
