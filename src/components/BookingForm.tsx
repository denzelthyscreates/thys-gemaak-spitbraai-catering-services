
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
import { Calendar, Mail, Phone, User, MapPin, CalendarClock, Check, CreditCard, DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PaymentGateway from './payment/PaymentGateway';
import { submitBookingToLatenode } from '@/services/LatenodeService';

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
  onFormSubmitted?: () => void;
  onNavigateTab?: (tab: string) => void;
}

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

  const generateBookingReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `TGS-${timestamp}-${random}`;
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (!menuSelection) {
      toast.error("Please select a menu package first");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Starting enhanced booking submission...");
    
    try {
      const bookingReference = generateBookingReference();
      const totalAmount = menuSelection.travelFee 
        ? (menuSelection.totalPrice * menuSelection.numberOfGuests) + menuSelection.travelFee
        : menuSelection.totalPrice * menuSelection.numberOfGuests;

      const enhancedBookingData = {
        // Contact Information
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate ? format(data.eventDate, 'yyyy-MM-dd') : undefined,
        eventType: data.eventType,
        eventLocation: data.eventLocation,
        additionalNotes: data.additionalNotes,
        
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
        
        // Pricing Information
        pricePerPerson: menuSelection.totalPrice,
        totalAmount: totalAmount,
        travelFee: menuSelection.travelFee || 0,
        postalCode: menuSelection.postalCode || "",
        areaName: menuSelection.areaName || "",
        discountApplied: menuSelection.discountApplied || false,
        
        // Booking Management
        bookingReference: bookingReference,
        status: 'pending_payment',
        submittedAt: new Date().toISOString(),
      };
      
      console.log("Enhanced booking data being sent:", enhancedBookingData);
      
      const result = await submitBookingToLatenode(enhancedBookingData);
      
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
        throw new Error(result.error || "Failed to submit booking");
      }
      
    } catch (error) {
      console.error("Error submitting enhanced booking:", error);
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
  
  const handleNavigateToPayment = () => {
    if (onNavigateTab) {
      onNavigateTab('payment');
    }
  };

  if (submissionComplete && showPaymentOptions) {
    const totalAmount = menuSelection.travelFee 
      ? (menuSelection.totalPrice * menuSelection.numberOfGuests) + menuSelection.travelFee
      : menuSelection.totalPrice * menuSelection.numberOfGuests;

    const bookingData = {
      client_name: form.getValues('name'),
      client_email: form.getValues('email'),
      client_phone: form.getValues('phone'),
      event_date: form.getValues('eventDate') ? format(form.getValues('eventDate')!, 'yyyy-MM-dd') : undefined,
      total_amount: totalAmount
    };

    return (
      <div className="space-y-6">
        {/* Success Message */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-green-800">Booking Confirmed!</CardTitle>
            <CardDescription className="text-green-700">
              Your booking reference: <Badge variant="secondary" className="ml-2">{bookingId}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-green-700 mb-4">
              Thank you for your booking! We've sent a confirmation email with all the details.
            </p>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Payment
            </CardTitle>
            <CardDescription>
              Choose your payment option to secure your booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Deposit Payment */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Booking Deposit
                  </CardTitle>
                  <CardDescription>
                    Secure your booking with a R500 deposit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-blue-600">R500</div>
                    <PaymentGateway 
                      bookingData={bookingData}
                      paymentType="deposit"
                    />
                    <p className="text-sm text-muted-foreground">
                      Remaining balance of R{totalAmount - 500} due before event
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Full Payment */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Full Payment
                  </CardTitle>
                  <CardDescription>
                    Pay the full amount and save on processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-green-600">R{totalAmount}</div>
                    <PaymentGateway 
                      bookingData={bookingData}
                      paymentType="full"
                    />
                    <Badge variant="secondary" className="text-xs">
                      No additional payments required
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Payment confirmation will be sent to your email</li>
                <li>• Our team will contact you to finalize event details</li>
                <li>• Final coordination call 2-3 days before your event</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="booking-form-wrapper space-y-6">
      {/* Enhanced Menu Selection Summary */}
      {menuSelection && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Your Menu Selection</CardTitle>
            <CardDescription>Review your selection before booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><strong>Package:</strong> {menuSelection.menuPackage}</div>
                <div><strong>Guests:</strong> {menuSelection.numberOfGuests}</div>
                {menuSelection.season && <div><strong>Season:</strong> {menuSelection.season}</div>}
                {menuSelection.starters && <div><strong>Starters:</strong> {menuSelection.starters}</div>}
                {menuSelection.sides && <div><strong>Sides:</strong> {menuSelection.sides}</div>}
                {menuSelection.desserts && <div><strong>Desserts:</strong> {menuSelection.desserts}</div>}
              </div>
              <div className="space-y-2">
                {menuSelection.extras && <div><strong>Extras:</strong> {menuSelection.extras}</div>}
                <div><strong>Cutlery:</strong> {menuSelection.includeCutlery ? 'Included' : 'Not included'}</div>
                {menuSelection.travelFee && (
                  <div><strong>Travel Fee:</strong> R{menuSelection.travelFee}</div>
                )}
                <Separator />
                <div className="text-lg"><strong>Total: R{
                  menuSelection.travelFee 
                    ? (menuSelection.totalPrice * menuSelection.numberOfGuests) + menuSelection.travelFee
                    : menuSelection.totalPrice * menuSelection.numberOfGuests
                }</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !menuSelection}
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking & Choose Payment"}
          </Button>
          
          {!menuSelection && (
            <p className="text-sm text-muted-foreground text-center">
              Please select a menu package before submitting your booking.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
