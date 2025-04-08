
/**
 * Utility functions for checking cookie consent preferences and Google Consent Mode
 * Compliant with Protection of Personal Information Act (POPIA) requirements
 */

// Initialize Google Consent Mode with default consent states (all denied by default - opt-in model)
export const initializeGoogleConsentMode = (): void => {
  window.dataLayer = window.dataLayer || [];
  // Define gtag function properly for TypeScript
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  
  // Default consent settings - POPIA compliant (opt-in)
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'functionality_storage': 'granted', // Necessary for website function
    'personalization_storage': 'denied',
    'security_storage': 'granted', // Necessary for security features
    'wait_for_update': 500 // Wait for user input for consent update
  });
  
  console.log('Google Consent Mode initialized with default settings');
};

// Update Google consent settings based on user preferences
export const updateGoogleConsent = (
  analytics: boolean, 
  marketing: boolean
): void => {
  if (!window.dataLayer) return;
  
  window.dataLayer.push({
    'event': 'consent_update',
    'consent': {
      'analytics_storage': analytics ? 'granted' : 'denied',
      'ad_storage': marketing ? 'granted' : 'denied',
      'functionality_storage': 'granted', // Always allowed (necessary)
      'personalization_storage': marketing ? 'granted' : 'denied',
      'security_storage': 'granted' // Always allowed (necessary)
    }
  });
  
  console.log('Google Consent updated - analytics:', analytics ? 'granted' : 'denied', 'marketing:', marketing ? 'granted' : 'denied');
};

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
  // Initialize Google Consent Mode (updates consent if needed)
  const analyticsConsent = hasCookieConsent('analytics');
  const marketingConsent = hasCookieConsent('marketing');
  updateGoogleConsent(analyticsConsent, marketingConsent);
  
  // Example: Initialize Google Analytics if analytics cookies are allowed
  if (hasCookieConsent('analytics')) {
    console.log('Analytics consent given: initializing analytics scripts');
    // Example: initializeGoogleAnalytics();
  }
  
  // Example: Initialize marketing cookies if allowed
  if (hasCookieConsent('marketing')) {
    console.log('Marketing consent given: initializing marketing scripts');
    // Example: initializeMarketingPixels();
  }
};
