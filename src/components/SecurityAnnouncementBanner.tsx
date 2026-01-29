
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
      <div className="container-width py-3">
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3 flex-1">
            <Shield className="h-5 w-5 flex-shrink-0 mt-0.5 md:mt-0" />
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
              <p className="text-sm md:text-base">
                <span className="font-semibold">Your security matters!</span>{' '}
                <span className="hidden sm:inline">
                  To protect your personal information, we now require a quick account creation before booking. 
                  This ensures only you can access your booking details and history.
                </span>
                <span className="sm:hidden">
                  Account creation is now required to protect your booking information.
                </span>
              </p>
              <Link to="/auth" className="flex-shrink-0">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-primary-foreground/10 rounded-md transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnnouncementBanner;
