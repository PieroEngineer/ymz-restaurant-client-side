import type { Restaurant } from "@/features/profile/types/domain.types";

export function areRestaurantsEqual(a: Restaurant, b: Restaurant): boolean {
  // 1. Instant referential check
  if (a === b) return true;

  // 2. High-probability changes / Flat primitives first
  if (a.restaurantId !== b.restaurantId) return false;
  if (a.restaurantName !== b.restaurantName) return false;
  if (a.peruvianContactNumber !== b.peruvianContactNumber) return false;
  if (a.peruvianPaymentNumber !== b.peruvianPaymentNumber) return false;
  if (a.logoUrl !== b.logoUrl) return false;
  if (a.qrUrl !== b.qrUrl) return false;

  // 3. File references (Fast identity check)
  if (a.logoFile !== b.logoFile) return false;
  if (a.qrFile !== b.qrFile) return false;

  // 4. Coordinates Tuple [number, number]
  const coordA = a.coordinates;
  const coordB = b.coordinates;
  if (coordA !== coordB) {
    if (coordA[0] !== coordB[0] || coordA[1] !== coordB[1]) return false;
  }

  // 5. Dishes URLs Tuple [string, string, string]
  const urlsA = a.dishesToShowUrls;
  const urlsB = b.dishesToShowUrls;
  if (urlsA !== urlsB) {
    if (urlsA[0] !== urlsB[0] || urlsA[1] !== urlsB[1] || urlsA[2] !== urlsB[2]) return false;
  }

  // 6. Dishes Files Tuple [File | null, File | null, File | null]
  const filesA = a.dishesToShowFiles;
  const filesB = b.dishesToShowFiles;
  if (filesA !== filesB) {
    if (filesA[0] !== filesB[0] || filesA[1] !== filesB[1] || filesA[2] !== filesB[2]) return false;
  }

  return true;
}