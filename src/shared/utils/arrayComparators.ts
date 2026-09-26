export function areArraysEquivalent(arr1: string[], arr2: string[]): boolean {
  // 1. Quick length check (Instant O(1) exit)
  if (arr1.length !== arr2.length) return false;

  // 2. Build frequency map for the first array
  const frequencyMap = new Map<string, number>();
  
  for (let i = 0; i < arr1.length; i++) {
    const str = arr1[i];
    frequencyMap.set(str, (frequencyMap.get(str) || 0) + 1);
  }

  // 3. Subtract frequencies using the second array
  for (let i = 0; i < arr2.length; i++) {
    const str = arr2[i];
    const count = frequencyMap.get(str);

    // If the element doesn't exist in arr1, or exists fewer times
    if (count === undefined || count === 0) {
      return false; 
    }
    
    frequencyMap.set(str, count - 1);
  }

  return true;
}
