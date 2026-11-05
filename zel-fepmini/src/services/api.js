const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all tourism destinations.
 * @returns {Promise<Destination[]>}
 * @throws {Error} on non-ok HTTP response
 */
export async function getAllDestinations() {
  const res = await fetch(`${BASE_URL}/destinations`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Fetch a single tourism destination by ID.
 * @param {string} id
 * @returns {Promise<Destination|null>} null when not found (404)
 * @throws {Error} on non-ok HTTP response other than 404
 */
export async function getDestinationById(id) {
  const res = await fetch(`${BASE_URL}/destinations/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
