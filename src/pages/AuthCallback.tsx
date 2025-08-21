import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    // Check if this is a Zoho Books OAuth callback
    // We can identify this by the presence of a code parameter and the redirect context
    if (code || error) {
      // Redirect to ZohoSetup page with the parameters
      const params = new URLSearchParams();
      if (code) params.set('code', code);
      if (error) params.set('error', error);
      if (state) params.set('state', state);
      
      navigate(`/zoho-setup?${params.toString()}`);
    } else {
      // If no relevant parameters, redirect to home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Processing OAuth Response...</h2>
        <p className="text-muted-foreground">Please wait while we complete the authorization process.</p>
      </div>
    </div>
  );
}