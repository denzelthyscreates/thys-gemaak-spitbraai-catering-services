
import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'securityAnnouncementDismissed';

export const SecurityAnnouncementBanner = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    // Initialize from localStorage immediately to prevent flash
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground shadow-md">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <p className="text-xs sm:text-sm md:text-base whitespace-normal break-words leading-snug">
              <span className="font-semibold">Your security matters!</span>{' '}
              <span>Account creation is now required to protect your booking information.</span>
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link to="/auth">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-primary-foreground/10 rounded-md transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnnouncementBanner;
