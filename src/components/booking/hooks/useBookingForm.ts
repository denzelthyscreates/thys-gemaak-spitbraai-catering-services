
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueStreetAddress: z.string().min(1, 'Street address is required'),
  venueCity: z.string().min(1, 'City is required'),
  venueProvince: z.string().min(1, 'Province is required'),
  venuePostalCode: z.string().min(1, 'Postal code is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCodeAddress: z.string().min(1, 'Postal code is required'),
  additionalNotes: z.string().optional(),
  eventType: z.string().optional(),
  referralSource: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export const useBookingForm = (menuSelection: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      eventDate: '',
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
      additionalNotes: '',
      eventType: '',
      referralSource: '',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('Form submission started with data:', data);
    console.log('Menu selection:', menuSelection);
    
    if (!menuSelection) {
      console.error('No menu selection provided');
      toast({
        title: "Error",
        description: "Please select a menu package before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Inserting booking into database...');
      
      const bookingData = {
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        event_date: data.eventDate,
        venue_name: data.venueName,
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
        event_type: data.eventType || menuSelection.eventType || null,
        referral_source: data.referralSource || null,
        menu_package: menuSelection.menuPackage,
        number_of_guests: menuSelection.numberOfGuests,
        total_price: menuSelection.totalPrice,
        season: menuSelection.season || null,
        starters: menuSelection.starters || null,
        sides: menuSelection.sides || null,
        desserts: menuSelection.desserts || null,
        extras: menuSelection.extras || null,
        extra_salad_type: menuSelection.extraSaladType || null,
        menu_selection: menuSelection,
        status: 'pending',
        notes: `Travel Fee: R${menuSelection.travelFee || 0}, Area: ${menuSelection.areaName || 'Unknown'}`
      };

      console.log('Booking data prepared:', bookingData);

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Booking created successfully:', booking);
      setBookingId(booking.id);
      setSubmissionComplete(true);
      setShowPaymentOptions(true);

      toast({
        title: "Booking Submitted!",
        description: "Your booking has been submitted successfully. Please proceed with payment.",
        duration: 5000
      });

    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit booking. Please try again.",
        variant: "destructive"
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
