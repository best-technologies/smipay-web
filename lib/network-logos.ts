/**
 * Network Logo Mapping
 * Maps VTPass service IDs to local logo assets
 */

export const NETWORK_LOGOS: Record<string, string> = {
  mtn: "/vtu-logo/mtn-logo.jpg",
  glo: "/vtu-logo/glo-logo.png",
  airtel: "/vtu-logo/airtel-logo.svg",
  etisalat: "/vtu-logo/9mobile-logo.png",
  "9-mobile": "/vtu-logo/9mobile-logo.png",
  "foreign-airtime": "/vtu-logo/9mobile-logo.png", // Using 9mobile as fallback for international
};

/**
 * Get local logo path for a service ID
 * Returns null if logo not found
 */
export function getNetworkLogo(serviceID: string): string | null {
  // Normalize service ID to lowercase
  const normalizedId = serviceID.toLowerCase().trim();
  
  // Return mapped logo or null if not found
  const logo = NETWORK_LOGOS[normalizedId];
  return logo ?? null;
}

/**
 * Check if a logo exists for a service ID
 */
export function hasNetworkLogo(serviceID: string): boolean {
  return getNetworkLogo(serviceID) !== null;
}
