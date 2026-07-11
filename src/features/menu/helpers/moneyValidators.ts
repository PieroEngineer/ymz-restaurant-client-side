export function centsToDecimal(cents: number): number {
  return +(cents / 100).toFixed(2);
}

export function decimalToCents(amount: number): number {
  return Math.round(amount * 100);
}

// Validation Guard: Restricts the Cost string value to maximum of 2 decimal places and remove no digits except dot
export const ensureCostFormat = (val: string): string => {
    // Allows digits, and a optional single decimal dot followed by up to 2 decimal places max
    const sanitized = val.replace(/[^0-9.]/g, '');
    const split = sanitized.split('.');
    if (split.length > 2) return `${split[0]}.${split[1]}`;
    if (split[1] && split[1].length > 2) return `${split[0]}.${split[1].slice(0, 2)}`;
    return sanitized;
  };