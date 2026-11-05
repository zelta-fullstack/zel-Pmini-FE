import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAllDestinations } from '../services/api';

/**
 * @typedef {Object} TourismState
 * @property {import('../services/api').Destination[]} destinations
 * @property {boolean} loading
 * @property {string|null} error
 * @property {() => void} fetchDestinations
 * @property {(id: string) => import('../services/api').Destination|undefined} getDestinationById
 */

const TourismContext = createContext(null);

/**
 * Provides tourism data state to the component tree.
 * Automatically fetches destination data on mount.
 */
export function TourismProvider({ children }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Requirements 4.1, 4.2, 4.3, 4.4: fetch destinations and manage loading/error state
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message || 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Requirement 4.1: initiate fetch on mount
  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Requirement 4.5 / design: synchronous lookup on already-fetched array
  const getDestinationById = useCallback(
    (id) => destinations.find((d) => String(d.id) === String(id)),
    [destinations]
  );

  return (
    <TourismContext.Provider
      value={{ destinations, loading, error, fetchDestinations, getDestinationById }}
    >
      {children}
    </TourismContext.Provider>
  );
}

/**
 * Hook to consume TourismContext.
 * Must be used inside <TourismProvider>.
 * @returns {TourismState}
 */
export function useTourism() {
  const ctx = useContext(TourismContext);
  if (!ctx) {
    throw new Error('useTourism must be used within a TourismProvider');
  }
  return ctx;
}
