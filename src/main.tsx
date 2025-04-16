
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeGoogleConsentMode } from './utils/cookieConsent'

// Add console logs for debugging
console.log('Main.tsx is executing');

// Initialize Google Consent Mode before any tracking code loads
initializeGoogleConsentMode();

const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);

if (rootElement) {
  createRoot(rootElement).render(<App />);
  console.log('App rendered successfully');
} else {
  console.error('Root element not found');
}
