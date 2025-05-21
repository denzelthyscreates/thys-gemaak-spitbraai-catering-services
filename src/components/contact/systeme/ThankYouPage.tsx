
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook, Instagram } from "lucide-react";

interface ThankYouPageProps {
  onReturnHome?: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onReturnHome }) => {
  const handleReturnClick = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.href = '/';
    }
  };
  
  return (
    <div className="systeme-thankyou-wrapper">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="https://res.cloudinary.com/dlsjdyti8/image/upload/t_Thumbnail/v1747774078/2025-05-20_TGS_full_round_gswynv.png" 
            alt="Thys Gemaak Spitbraai Catering Services Logo" 
            className="h-32 w-auto"
          />
        </div>
        
        <h2 className="text-2xl font-semibold font-serif text-primary mb-4">Thank You For Your Booking!</h2>
        
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            We've received your booking request and we're excited to cater for your event. 
            Our team will review your details and get back to you within 24-48 hours.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm my-8 max-w-lg mx-auto text-left">
            <p className="font-medium text-amber-800">What happens next?</p>
            <ol className="list-decimal list-inside mt-2 ml-2 space-y-1 text-amber-700">
              <li>We'll review your booking details</li>
              <li>You'll receive a confirmation email within 24-48 hours</li>
              <li>We'll provide payment instructions to secure your booking</li>
              <li>A final consultation will be scheduled closer to your event date</li>
            </ol>
          </div>
          
          <p className="text-muted-foreground">
            If you have any questions in the meantime, please don't hesitate to contact us at{' '}
            <a href="mailto:spitbookings@thysgemaak.com" className="text-primary hover:underline">
              spitbookings@thysgemaak.com
            </a>
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <a 
              href="https://www.instagram.com/thys_gemaak_spitbraai?igsh=MXhqdDh2MmJjemZhNw==" 
              className="p-2 rounded-full bg-primary hover:bg-secondary transition-colors text-white"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.facebook.com/share/15vy455DHt/" 
              className="p-2 rounded-full bg-primary hover:bg-secondary transition-colors text-white"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <Button onClick={handleReturnClick} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home Page
        </Button>
      </div>
    </div>
  );
};

export default ThankYouPage;
