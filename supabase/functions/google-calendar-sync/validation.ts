
import { GoogleServiceAccount } from './types.ts';

export class ValidationService {
  static validateEnvironmentVariables(): { calendarId: string; serviceAccount: GoogleServiceAccount } {
    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID');
    const googleServiceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

    console.log('Calendar ID exists:', !!googleCalendarId);
    console.log('Service account key exists:', !!googleServiceAccountKey);

    if (!googleCalendarId) {
      throw new Error('GOOGLE_CALENDAR_ID environment variable is not set');
    }

    if (!googleServiceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    let serviceAccount: GoogleServiceAccount;
    try {
      serviceAccount = JSON.parse(googleServiceAccountKey);
      console.log('Service account key parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse service account key:', parseError.message);
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format - must be valid JSON');
    }
    
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Service account key is missing required fields (private_key or client_email)');
    }

    return { calendarId: googleCalendarId, serviceAccount };
  }
}
