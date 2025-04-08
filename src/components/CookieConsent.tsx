
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { initializeConsentedScripts, updateGoogleConsent } from '@/utils/cookieConsent';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false); // Default to false (opt-in)
  const [marketing, setMarketing] = useState(false); // Default to false (opt-in)
  const [preferences, setPreferences] = useState(false); // Default to false (opt-in)
  
  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAllCookies = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieAnalytics', 'true');
    localStorage.setItem('cookieMarketing', 'true');
    localStorage.setItem('cookiePreferences', 'true');
    setIsVisible(false);
    
    // Update Google consent settings
    updateGoogleConsent(true, true);
    
    // Initialize other scripts after consent
    initializeConsentedScripts();
  };
  
  const rejectAllCookies = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookieAnalytics', 'false');
    localStorage.setItem('cookieMarketing', 'false');
    localStorage.setItem('cookiePreferences', 'false');
    setIsVisible(false);
    
    // Update Google consent settings
    updateGoogleConsent(false, false);
    
    // Initialize necessary scripts only
    initializeConsentedScripts();
  };
  
  const acceptSelection = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookieAnalytics', analytics ? 'true' : 'false');
    localStorage.setItem('cookieMarketing', marketing ? 'true' : 'false');
    localStorage.setItem('cookiePreferences', preferences ? 'true' : 'false');
    setIsVisible(false);
    
    // Update Google consent settings with user selections
    updateGoogleConsent(analytics, marketing);
    
    // Initialize scripts based on selections
    initializeConsentedScripts();
  };
  
  const handleClose = () => {
    setIsVisible(false);
    // Store that user has seen the banner but not accepted
    localStorage.setItem('cookieConsent', 'dismissed');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-border shadow-md py-4 animate-slide-up">
      <div className="container-width max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <button 
            onClick={handleClose} 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            aria-label="Close cookie banner"
          >
            <X size={18} />
          </button>
          
          <h3 className="text-xl font-semibold text-center">Cookie settings</h3>
          <p className="text-center text-muted-foreground mb-2">
            We use cookies to provide you with the best possible experience. They also allow us to analyze user behavior in order to constantly improve the website for you.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button 
              onClick={acceptAllCookies}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Accept All
            </button>
            <button 
              onClick={acceptSelection}
              className="px-4 py-2 bg-white border border-green-600 text-green-600 text-sm rounded-md hover:bg-green-50 transition-colors"
            >
              Accept Selection
            </button>
            <button 
              onClick={rejectAllCookies}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
            >
              Reject All
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="necessary" checked={true} disabled />
              <label htmlFor="necessary" className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Necessary
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analytics" 
                checked={analytics}
                onCheckedChange={(checked) => setAnalytics(checked as boolean)}
              />
              <label htmlFor="analytics" className="font-medium leading-none">
                Analytics
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preferences" 
                checked={preferences}
                onCheckedChange={(checked) => setPreferences(checked as boolean)}  
              />
              <label htmlFor="preferences" className="font-medium leading-none">
                Preferences
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={marketing}
                onCheckedChange={(checked) => setMarketing(checked as boolean)}  
              />
              <label htmlFor="marketing" className="font-medium leading-none">
                Marketing
              </label>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            <Link to="/cookie-policy" className="text-primary hover:underline">
              Learn more about cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
