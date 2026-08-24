/**
 * Validates a Peruvian mobile number.
 * Criteria: Must be exactly 9 digits long and start with the number 9 (can include +51 or 51 prefix).
 * 
 * @param phone - The string or numeric phone input to validate
 * @returns boolean - True if the number matches Peruvian format criteria
 */
export function isValidPeruvianNumber(phone: string): boolean {
  // Convert to string and strip out spaces, dashes, or parentheses
  let cleaned = phone.toString().replace(/[\s().-]/g, "");

  // Strip out Peru's country code (+51 or 51) if included at the start
  if (cleaned.startsWith("+51")) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("51") && cleaned.length > 9) {
    cleaned = cleaned.substring(2);
  }

  // Regex checks if the string is exactly 9 digits and starts with 9
  const peruvianMobileRegex = /^9\d{8}$/;

  return peruvianMobileRegex.test(cleaned);
}

/**
 * Formats a validated Peruvian mobile number with its country code.
 * Assumes the input has already passed prior format validation.
 * 
 * @param phone - The validated string or numeric phone input
 * @returns string - The formatted number in international format (e.g., "+51987654321")
 */
export function formatPeruvianNumberWithCountryCode(phone: string): string {
  // Strip out spaces, dashes, or parentheses but temporarily keep the "+" sign
  const cleaned = phone.replace(/[\s().-]/g, "");

  // Remove Peru's country code (+51 or 51) if it is already present at the start
  let localNineDigits = cleaned;
  if (cleaned.startsWith("+51")) {
    localNineDigits = cleaned.substring(3);
  } else if (cleaned.startsWith("51") && cleaned.replace(/\D/g, "").length > 9) {
    localNineDigits = cleaned.substring(2);
  }

  // Strip any remaining non-digits just in case, leaving only the 9 local digits
  localNineDigits = localNineDigits.replace(/\D/g, "");

  // Append the international prefix to the 9 local digits
  return `+51${localNineDigits}`;
}
