
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeGoogleConsentMode } from './utils/cookieConsent'

// Add detailed console logs for debugging
console.log('Main.tsx is executing');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

// Initialize Google Consent Mode before any tracking code loads
initializeGoogleConsentMode();

// Try/catch to identify exact error points
try {
  const rootElement = document.getElementById("root");
  console.log('Root element found:', !!rootElement);

  if (rootElement) {
    console.log('Attempting to render app...');
    createRoot(rootElement).render(<App />);
    console.log('App rendered successfully');
  } else {
    console.error('Root element not found, unable to mount React application');
  }
} catch (error) {
  console.error('Critical error during app initialization:', error);
}
