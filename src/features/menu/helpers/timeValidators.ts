// 📝 Validation Guard: Restricts the Prep Time to whole numbers only
export const ensureTimeFormat = (val: string): string => {
    return val.replace(/[^0-9]/g, ''); // Strip out non-integers entirely
  };