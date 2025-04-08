
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeGoogleConsentMode } from './utils/cookieConsent'

// Initialize Google Consent Mode before any tracking code loads
initializeGoogleConsentMode();

createRoot(document.getElementById("root")!).render(<App />);
