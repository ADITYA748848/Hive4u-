// ===== DATA LAYER =====

let cachedData = null;

/**
 * Fetch and cache listings data
 */
export async function getData() {
  if (cachedData) return cachedData;

  try {
    let response = await fetch('/data/listings.json');
    if (!response.ok) {
      // Fallback to API
      response = await fetch('/api/listings');
    }
    if (!response.ok) throw new Error('Failed to load listings data');
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return { listings: [], cities: [], amenityLabels: {} };
  }
}

/**
 * Get a single listing by ID
 */
export async function getListingById(id) {
  const data = await getData();
  return data.listings.find(l => l.id === id) || null;
}

/**
 * Get featured listings
 */
export async function getFeaturedListings(count = 6) {
  const data = await getData();
  return data.listings.filter(l => l.featured && l.available).slice(0, count);
}

/**
 * Get nearby listings (same city, excluding current)
 */
export async function getNearbyListings(listing, count = 3) {
  const data = await getData();
  return data.listings
    .filter(l => l.id !== listing.id && l.location.city === listing.location.city && l.available)
    .slice(0, count);
}
