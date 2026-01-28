// Shared validation utilities for edge functions

/**
 * Escape HTML to prevent XSS in email templates
 */
export function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize text for safe inclusion in HTML emails
 * Allows basic line breaks but escapes everything else
 */
export function sanitizeForEmail(text: string | undefined | null): string {
  if (!text) return '';
  // First escape HTML, then convert newlines to <br>
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate phone number (South African format or international)
 */
export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, +, -, (), with reasonable length
  const phoneRegex = /^[\d\s+\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate string length
 */
export function isValidLength(text: string | undefined | null, maxLength: number): boolean {
  if (!text) return true;
  return text.length <= maxLength;
}

/**
 * Validate required string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && isFinite(value);
}

/**
 * Validate URL is from allowed domains (for OAuth redirects)
 */
export function isAllowedRedirectUri(uri: string, allowedDomains: string[]): boolean {
  try {
    const url = new URL(uri);
    return allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Validate action is one of allowed values
 */
export function isAllowedAction<T extends string>(action: unknown, allowedActions: readonly T[]): action is T {
  return typeof action === 'string' && allowedActions.includes(action as T);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate payment type
 */
export function isValidPaymentType(type: unknown): type is 'deposit' | 'full' | 'balance' {
  return type === 'deposit' || type === 'full' || type === 'balance';
}

/**
 * Validate inquiry type
 */
export function isValidInquiryType(type: unknown): type is string {
  const validTypes = ['general', 'booking', 'pricing', 'menu', 'availability', 'other'];
  return typeof type === 'string' && validTypes.includes(type.toLowerCase());
}

/**
 * Truncate string to max length
 */
export function truncate(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
