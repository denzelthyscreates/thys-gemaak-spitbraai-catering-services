import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { initializeConsentedScripts } from '@/utils/cookieConsent';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  
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
    setIsVisible(false);
    initializeConsentedScripts(); // Initialize scripts after consent
  };
  
  const acceptNecessaryCookies = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookieAnalytics', 'false');
    localStorage.setItem('cookieMarketing', 'false');
    setIsVisible(false);
    initializeConsentedScripts(); // Initialize scripts after consent
  };
  
  const saveSelection = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookieAnalytics', analytics ? 'true' : 'false');
    localStorage.setItem('cookieMarketing', marketing ? 'true' : 'false');
    setIsVisible(false);
    initializeConsentedScripts(); // Initialize scripts after consent
  };
  
  const handleClose = () => {
    setIsVisible(false);
    // Store that user has seen the banner but not accepted
    localStorage.setItem('cookieConsent', 'dismissed');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-md py-4 animate-slide-up">
      <div className="container-width">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
            <p className="text-muted-foreground mb-3">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              By clicking "Accept All Cookies", you agree to the storing of cookies on your device.
              Visit our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> to learn more.
            </p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="necessary" checked={true} disabled />
                <label htmlFor="necessary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Necessary cookies (required)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analytics" 
                  checked={analytics}
                  onCheckedChange={(checked) => setAnalytics(checked as boolean)}
                />
                <label htmlFor="analytics" className="text-sm font-medium leading-none">
                  Analytics cookies
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="marketing" 
                  checked={marketing}
                  onCheckedChange={(checked) => setMarketing(checked as boolean)}  
                />
                <label htmlFor="marketing" className="text-sm font-medium leading-none">
                  Marketing cookies
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 items-center md:items-start">
            <button 
              onClick={acceptNecessaryCookies}
              className="px-4 py-2 border border-primary text-primary text-sm rounded-md hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Necessary Only
            </button>
            <button 
              onClick={saveSelection}
              className="px-4 py-2 border border-primary bg-white text-primary text-sm rounded-md hover:bg-primary/10 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Save size={16} /> Save Selection
            </button>
            <button 
              onClick={acceptAllCookies}
              className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Accept All Cookies
            </button>
            <button 
              onClick={handleClose} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 md:static"
              aria-label="Close cookie banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
