
import { GoogleServiceAccount } from './types.ts';

export class ValidationService {
  static validateEnvironmentVariables(): { calendarId: string; serviceAccount: GoogleServiceAccount } {
    console.log('Validating environment variables...');
    
    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID');
    const googleServiceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

    console.log('Calendar ID exists:', !!googleCalendarId);
    console.log('Calendar ID value:', googleCalendarId ? `${googleCalendarId.substring(0, 20)}...` : 'NOT SET');
    console.log('Service account key exists:', !!googleServiceAccountKey);
    console.log('Service account key length:', googleServiceAccountKey ? googleServiceAccountKey.length : 0);

    if (!googleCalendarId) {
      console.error('GOOGLE_CALENDAR_ID environment variable is not set');
      throw new Error('GOOGLE_CALENDAR_ID environment variable is not set');
    }

    if (!googleServiceAccountKey) {
      console.error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    let serviceAccount: GoogleServiceAccount;
    try {
      serviceAccount = JSON.parse(googleServiceAccountKey);
      console.log('Service account key parsed successfully');
      console.log('Service account client_email:', serviceAccount.client_email);
      console.log('Service account has private_key:', !!serviceAccount.private_key);
      console.log('Private key length:', serviceAccount.private_key ? serviceAccount.private_key.length : 0);
    } catch (parseError) {
      console.error('Failed to parse service account key:', parseError.message);
      console.error('Service account key preview:', googleServiceAccountKey.substring(0, 100));
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format - must be valid JSON');
    }
    
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      console.error('Service account missing fields:', {
        has_private_key: !!serviceAccount.private_key,
        has_client_email: !!serviceAccount.client_email
      });
      throw new Error('Service account key is missing required fields (private_key or client_email)');
    }

    console.log('Environment variables validation completed successfully');
    return { calendarId: googleCalendarId, serviceAccount };
  }
}
