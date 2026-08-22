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
 * Formats a validated Peruvian mobile number with its country code.
 * Assumes the input has already passed prior format validation.
 * 
 * @param phone - The validated string or numeric phone input
 * @returns string - The formatted number in international format (e.g., "+51987654321")
 */
function formatPeruvianNumberWithCountryCode(phone: string): string {
  // Remove all non-numeric characters (spaces, symbols, dashes)
  const digitsOnly = phone.replace(/\D/g, "");

  // Remove Peru's country code "51" if it is already present at the start
  const localNineDigits = digitsOnly.length > 9 && digitsOnly.startsWith("51")
    ? digitsOnly.substring(2)
    : digitsOnly;

  // Append the international prefix to the 9 local digits
  return `+51${localNineDigits}`;
}