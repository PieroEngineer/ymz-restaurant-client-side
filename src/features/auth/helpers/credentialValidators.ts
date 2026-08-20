
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
 * Validates a Peruvian mobile number.
 * Criteria: Must be exactly 9 digits long and start with the number 9.
 * 
 * @param phone - The string or numeric phone input to validate
 * @returns boolean - True if the number matches Peruvian format criteria
 */
export function isValidPeruvianNumber(phone: string | number): boolean {
  // Convert to string and strip out spaces, dashes, or parentheses
  const cleaned = phone.toString().replace(/[\s().-]/g, "");

  // Optional: Strip out Peru's country code (+51 or 51) if included at the start
  const targetNumber = cleaned.startsWith("51") && cleaned.length > 9 
    ? cleaned.substring(2) 
    : cleaned;

  // Regex checks if the string is exactly 9 digits and starts with 9
  const peruvianMobileRegex = /^9\d{8}$/;

  return peruvianMobileRegex.test(targetNumber);
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