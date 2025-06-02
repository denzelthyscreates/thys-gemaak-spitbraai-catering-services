
export interface LatenodeBookingData {
  // Contact Information
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  eventType: string;
  eventLocation: string;
  additionalNotes?: string;
  
  // Event Venue Details
  venueName?: string;
  venueStreetAddress: string;
  venueCity: string;
  venueProvince: string;
  venuePostalCode: string;
  
  // Address Information for Invoicing
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCodeAddress: string;
  
  // Menu Selection Details
  menuPackage: string;
  numberOfGuests: number;
  season?: string;
  starters?: string;
  sides?: string;
  desserts?: string;
  extras?: string;
  extraSaladType?: string;
  includeCutlery: boolean;
  
  // Pricing Information with Travel Fee breakdown
  pricePerPerson: number;
  menuSubtotal: number;
  travelFee: number;
  totalAmount: number;
  postalCode?: string;
  areaName?: string;
  discountApplied: boolean;
  
  // Booking Management
  bookingReference: string;
  status: string;
  submittedAt: string;
}

export interface LatenodeResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
  message?: string;
}

export interface PaymentData {
  paymentId: string;
  amount: number;
  status: string;
  paymentMethod: string;
}
