
/**
 * Validates an email string against format and length restrictions.
 * Ref: RFC 5321 (Max length 254 characters)
 */
export function isValidEmail(email: string): boolean {
  const MAX_EMAIL_LENGTH = 254;

  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  // Standard regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string has a minimum length of 5 characters.
 * 
 * @param input - The string value to check
 * @param trimWhitespace - If true, ignores spaces at the beginning and end (Default: true)
 * @returns boolean - True if the string meets the 5-character requirement
 */
export function isValidPassword(pw: string): boolean {
  // Check the character length
  return pw.length >= 5;
}

export const isBlank = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};