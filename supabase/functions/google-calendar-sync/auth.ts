
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { GoogleServiceAccount } from './types.ts';

export class GoogleAuthService {
  static async createJWT(serviceAccount: GoogleServiceAccount): Promise<string> {
    console.log('Creating JWT for authentication...');
    console.log('Service account email:', serviceAccount.client_email);

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    console.log('JWT payload:', JSON.stringify(jwtPayload, null, 2));

    const privateKey = await this.importPrivateKey(serviceAccount.private_key);
    const jwt = await create({ alg: "RS256", typ: "JWT" }, jwtPayload, privateKey);
    
    console.log('JWT created successfully, length:', jwt.length);
    return jwt;
  }

  private static async importPrivateKey(privateKeyString: string): Promise<CryptoKey> {
    try {
      console.log('Importing private key...');
      console.log('Private key starts with:', privateKeyString.substring(0, 50));
      
      // Handle escaped newlines
      privateKeyString = privateKeyString.replace(/\\n/g, '\n');
      
      // Ensure proper PEM format
      if (!privateKeyString.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('Private key missing proper headers');
        throw new Error('Private key must be in PEM format with proper headers');
      }
      
      // Convert PEM to DER format for Web Crypto API
      const pemHeader = '-----BEGIN PRIVATE KEY-----';
      const pemFooter = '-----END PRIVATE KEY-----';
      const pemContents = privateKeyString
        .replace(pemHeader, '')
        .replace(pemFooter, '')
        .replace(/\s+/g, '');
      
      console.log('PEM contents length after cleanup:', pemContents.length);
      
      // Decode base64 to get DER format
      const binaryDerString = atob(pemContents);
      const binaryDer = new Uint8Array(binaryDerString.length);
      for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
      }
      
      console.log('Binary DER length:', binaryDer.length);
      
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        false,
        ["sign"]
      );
      
      console.log('Private key imported successfully');
      return privateKey;
    } catch (keyError) {
      console.error('Failed to import private key:', keyError.message);
      console.error('Key error stack:', keyError.stack);
      throw new Error(`Invalid private key format: ${keyError.message}`);
    }
  }

  static async getAccessToken(jwt: string): Promise<string> {
    console.log('Requesting access token from Google...');
    console.log('JWT length:', jwt.length);
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Token response error:', tokenError);
      throw new Error(`Failed to get access token: ${tokenError}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token response keys:', Object.keys(tokenData));
    
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Token data:', tokenData);
      throw new Error('No access token received from Google');
    }

    console.log('Access token received successfully, length:', accessToken.length);
    console.log('Token type:', tokenData.token_type);
    console.log('Expires in:', tokenData.expires_in);
    return accessToken;
  }
}
