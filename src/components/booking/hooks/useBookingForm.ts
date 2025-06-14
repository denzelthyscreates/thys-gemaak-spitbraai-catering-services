
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  eventDate: z.date().optional(),
  eventType: z.string().optional(),
  numberOfGuests: z.number().optional(),
  venueName: z.string().optional(),
  venueStreetAddress: z.string().min(2, { message: 'Please enter the venue street address' }),
  venueCity: z.string().min(2, { message: 'Please enter the venue city' }),
  venueProvince: z.string().min(2, { message: 'Please enter the venue province' }),
  venuePostalCode: z.string().min(4, { message: 'Please enter the venue postal code' }),
  addressLine1: z.string().min(2, { message: 'Please enter your street address' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'Please enter your city' }),
  province: z.string().min(2, { message: 'Please enter your province' }),
  postalCodeAddress: z.string().min(4, { message: 'Please enter your postal code' }),
  additionalNotes: z.string().optional(),
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
      name: '',
      email: '',
      phone: '',
      eventDate: undefined,
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
    console.log('=== BOOKING FORM SUBMISSION STARTED ===');
    console.log('Form submission started with data:', data);
    console.log('Menu selection:', menuSelection);
    
    if (!menuSelection) {
      console.error('❌ No menu selection provided');
      toast({
        title: "Error",
        description: "Please select a menu package before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!data.eventDate) {
      console.error('❌ No event date provided');
      toast({
        title: "Error",
        description: "Please select an event date.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('🔄 Setting isSubmitting to true');

    try {
      console.log('📝 Preparing booking data for database insertion...');
      
      const bookingData = {
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone,
        event_date: data.eventDate.toISOString(),
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

      console.log('📤 Booking data prepared for database:', bookingData);

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database insertion error:', error);
        throw error;
      }

      console.log('✅ Booking created successfully in database:', booking);
      setBookingId(booking.id);
      setSubmissionComplete(true);
      setShowPaymentOptions(true);
      console.log('🎉 Booking process completed, showing payment options');

      toast({
        title: "Booking Submitted!",
        description: "Your booking has been submitted successfully. Please proceed with payment.",
        duration: 5000
      });

    } catch (error) {
      console.error('❌ BOOKING SUBMISSION ERROR:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      console.log('🔄 Setting isSubmitting to false');
      setIsSubmitting(false);
      console.log('=== BOOKING FORM SUBMISSION ENDED ===');
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
