
/**
 * Utility functions for checking cookie consent preferences
 */

// Check if user has given consent for all cookies
export const hasFullCookieConsent = (): boolean => {
  const consent = localStorage.getItem('cookieConsent');
  return consent === 'all';
};

// Check if user has given consent for a specific cookie type
export const hasCookieConsent = (type: 'necessary' | 'analytics' | 'marketing'): boolean => {
  // Necessary cookies are always allowed if any consent is given
  if (type === 'necessary') {
    const consent = localStorage.getItem('cookieConsent');
    return !!consent && consent !== 'dismissed';
  }
  
  // For analytics and marketing, check the specific setting
  const consent = localStorage.getItem(`cookie${type.charAt(0).toUpperCase() + type.slice(1)}`);
  return consent === 'true';
};

// Initialize third-party scripts based on consent
export const initializeConsentedScripts = (): void => {
  // Example: Initialize Google Analytics if analytics cookies are allowed
  if (hasCookieConsent('analytics')) {
    console.log('Analytics consent given: initializing analytics scripts');
    // Here you would initialize your analytics scripts
    // Example: initializeGoogleAnalytics();
  }
  
  // Example: Initialize marketing cookies if allowed
  if (hasCookieConsent('marketing')) {
    console.log('Marketing consent given: initializing marketing scripts');
    // Here you would initialize your marketing scripts
    // Example: initializeMarketingPixels();
  }
};
