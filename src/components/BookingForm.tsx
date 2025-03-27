import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, Phone, User, MapPin, CalendarClock, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { submitBookingToMake, BookingData } from '@/services/GoogleSheetsService';

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  eventDate: z.date().optional(),
  eventType: z.string().min(1, { message: 'Please select an event type' }),
  eventLocation: z.string().min(2, { message: 'Please enter an event location' }),
  additionalNotes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  menuSelection: any;
  savedFormData?: BookingFormValues | null;
  onFormDataChange?: (data: BookingFormValues) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  menuSelection, 
  savedFormData, 
  onFormDataChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const defaultValues: BookingFormValues = {
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventLocation: '',
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
  }, [savedFormData, form]);

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

  useEffect(() => {
    if (!menuSelection || !summaryRef.current) return;
    
    const formattedPrice = `R${menuSelection.totalPrice} pp`;
    
    const summaryHTML = `
      <div class="menu-selection-content">
        <div class="menu-item"><strong>Menu Package:</strong> ${menuSelection.menuPackage || 'Not selected'}</div>
        <div class="menu-item"><strong>Number of Guests:</strong> ${menuSelection.numberOfGuests || 0}</div>
        ${menuSelection.season ? `<div class="menu-item"><strong>Season:</strong> ${menuSelection.season}</div>` : ''}
        ${menuSelection.starters && menuSelection.starters.length > 0 ? `<div class="menu-item"><strong>Starters:</strong> ${menuSelection.starters}</div>` : ''}
        ${menuSelection.sides && menuSelection.sides.length > 0 ? `<div class="menu-item"><strong>Sides:</strong> ${menuSelection.sides}</div>` : ''}
        ${menuSelection.desserts && menuSelection.desserts.length > 0 ? `<div class="menu-item"><strong>Desserts:</strong> ${menuSelection.desserts}</div>` : ''}
        ${menuSelection.extras && menuSelection.extras.length > 0 ? `<div class="menu-item"><strong>Extras:</strong> ${menuSelection.extras}</div>` : ''}
        ${menuSelection.discountApplied ? `<div class="menu-item text-success"><strong>Discount:</strong> 10% volume discount applied</div>` : ''}
        <div class="menu-item price"><strong>Total Price:</strong> ${formattedPrice}</div>
      </div>
    `;
    
    summaryRef.current.innerHTML = summaryHTML;
  }, [menuSelection]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!menuSelection) {
      toast.error("Please select a menu package first");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Starting form submission process...");
    
    try {
      const bookingData: BookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate ? format(data.eventDate, 'yyyy-MM-dd') : undefined,
        eventType: data.eventType,
        eventLocation: data.eventLocation,
        additionalNotes: data.additionalNotes,
        menuPackage: menuSelection.menuPackage,
        numberOfGuests: menuSelection.numberOfGuests,
        season: menuSelection.season || "",
        starters: menuSelection.starters || "",
        sides: menuSelection.sides || "",
        desserts: menuSelection.desserts || "",
        extras: menuSelection.extras || "",
        totalPrice: menuSelection.totalPrice,
        discountApplied: menuSelection.discountApplied || false,
        submittedAt: new Date().toISOString(),
      };
      
      console.log("Form data being sent to Make:", bookingData);
      
      const success = await submitBookingToMake(bookingData);
      
      if (success) {
        console.log("Booking submission successful, showing success message");
        toast.success("Booking enquiry submitted successfully!", {
          description: "You'll receive a confirmation email shortly."
        });
        
        setSubmissionComplete(true);
        
        localStorage.removeItem('bookingFormData');
        if (onFormDataChange) {
          onFormDataChange(null);
        }
      } else {
        throw new Error("Failed to submit booking");
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem submitting your booking", {
        description: "Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    "Birthday Party",
    "Wedding",
    "Business Event",
    "Year-End Function",
    "Matric Farewell",
    "Family Gathering",
    "Other"
  ];

  if (submissionComplete) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Booking Request Received!</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your booking request. We've sent a confirmation email to your inbox. 
          Our team will review your request and get back to you within 24 hours.
        </p>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">What happens next?</p>
          <ol className="list-decimal list-inside mt-2 text-left space-y-1">
            <li>You'll receive an automated confirmation email</li>
            <li>Our team will review your booking details</li>
            <li>You'll receive a follow-up email within 24-48 hours</li>
            <li>Once confirmed, you'll get payment instructions for the deposit</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-wrapper">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="John Doe" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="email" placeholder="your@email.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="071 123 4567" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Details</h3>
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full px-3 py-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Select Event Type</option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal pl-10"
                            >
                              <CalendarClock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Venue or Address" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
          
          {menuSelection && (
            <div className="menu-selection-summary p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Your Menu Selection</h4>
              <div ref={summaryRef}></div>
              
              <div className="mt-4 p-3 bg-white rounded border border-border text-sm">
                <p><strong>What happens next?</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>You'll receive a confirmation email immediately</li>
                  <li>Our team will contact you within 1-2 business days</li>
                  <li>We'll send payment details for the deposit</li>
                  <li>Your booking will be finalized after deposit payment</li>
                </ul>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !menuSelection}
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
          
          {!menuSelection && (
            <p className="text-sm text-muted-foreground text-center">
              Please select a menu package before submitting your booking request.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
