
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  
  eventType: z.string().min(1, 'Please select an event type'),
  numberOfGuests: z.number().min(1, 'Number of guests is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  
  venueName: z.string().optional(),
  venueStreetAddress: z.string().min(1, 'Venue address is required'),
  venueCity: z.string().min(1, 'Venue city is required'),
  venueProvince: z.string().min(1, 'Venue province is required'),
  venuePostalCode: z.string().min(1, 'Venue postal code is required'),
  
  addressLine1: z.string().min(1, 'Billing address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCodeAddress: z.string().min(1, 'Postal code is required'),
  
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const useBookingForm = (menuSelection: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
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

  const onSubmit = async (data: FormData) => {
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
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
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

      setBookingResult(insertedData);
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
