// ===== UTILITY FUNCTIONS =====

const WHATSAPP_PHONE = "917033237130";

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(title, location) {
  const message = encodeURIComponent(
    `Hi, I'm interested in "${title}" at ${location}. Please share availability and details.`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

/**
 * Generate generic WhatsApp link
 */
export function getWhatsAppLink() {
  return `https://wa.me/${WHATSAPP_PHONE}`;
}

/**
 * Format price for display
 */
export function formatPrice(price) {
  const amount = price.amount.toLocaleString('en-IN');
  const period = price.period === 'month' ? '/mo' : '/yr';
  return `<span class="currency">₹</span>${amount}<span>${period}</span>`;
}

/**
 * Get URL query parameters
 */
export function getUrlParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

/**
 * Set URL query parameters without reload
 */
export function setUrlParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, val]) => {
    if (val === null || val === undefined || val === '' || val === 'all') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, val);
    }
  });
  history.replaceState(null, '', url);
}

/**
 * Get badge class based on listing type
 */
export function getBadgeClass(type) {
  const map = { pg: 'badge-pg', flat: 'badge-flat', hostel: 'badge-hostel' };
  return map[type] || 'badge-pg';
}

/**
 * Get top N amenity labels from listing
 */
export function getAmenityLabels(amenities, labels, count = 3) {
  return amenities.slice(0, count).map(a => labels[a] || a);
}

/**
 * Render a listing card HTML
 */
export function renderCard(listing, amenityLabels) {
  const badgeClass = getBadgeClass(listing.type);
  const typeLabel = listing.type.toUpperCase();
  const amenities = getAmenityLabels(listing.amenities, amenityLabels);
  const price = formatPrice(listing.price);

  return `
    <a href="listing.html?id=${listing.id}" class="listing-card">
      <div class="listing-card__image">
        <img src="${listing.images[0]}" alt="${listing.title}" loading="lazy">
        <span class="badge ${badgeClass} listing-card__badge">${typeLabel}</span>
        <span class="listing-card__gender">${listing.gender}</span>
      </div>
      <div class="listing-card__body">
        <h3 class="listing-card__title">${listing.title}</h3>
        <div class="listing-card__location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${listing.location.area}, ${listing.location.city}
        </div>
        <div class="listing-card__amenities">
          ${amenities.map(a => `<span class="amenity-chip">${a}</span>`).join('')}
        </div>
        <div class="listing-card__footer">
          <div class="listing-card__price">${price}</div>
          <div class="listing-card__rating">
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${listing.rating}
          </div>
        </div>
      </div>
    </a>
  `;
}

/**
 * Filter listings based on criteria
 */
export function filterListings(listings, filters) {
  return listings.filter(l => {
    if (filters.type && filters.type !== 'all' && l.type !== filters.type) return false;
    if (filters.subtype && filters.subtype !== 'all' && l.subtype !== filters.subtype) return false;
    if (filters.city && filters.city !== 'all' && l.location.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.gender && filters.gender !== 'all' && l.gender !== filters.gender) return false;
    if (filters.minPrice && l.price.amount < Number(filters.minPrice)) return false;
    if (filters.maxPrice && l.price.amount > Number(filters.maxPrice)) return false;
    if (filters.amenities && filters.amenities.length > 0) {
      if (!filters.amenities.every(a => l.amenities.includes(a))) return false;
    }
    if (!l.available) return false;
    return true;
  });
}

/**
 * Sort listings
 */
export function sortListings(listings, sortBy) {
  const sorted = [...listings];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case 'price-desc':
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    default:
      return sorted;
  }
}
