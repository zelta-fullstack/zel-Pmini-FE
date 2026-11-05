import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import TourismCard from "./TourismCard";
import styles from "./TourismList.module.css";

/**
 * TourismList — renders the tourism destinations grid with loading and error states.
 *
 * Props:
 *   destinations {Destination[]} — array of destination objects to display
 *   loading      {boolean}       — when true, renders a loading spinner
 *   error        {string|null}   — when set, renders an error message with retry
 *   onRetry      {Function}      — callback passed to ErrorMessage for retry
 *   onClick      {Function}      — callback passed to each TourismCard on click
 */
function TourismList({ destinations, loading, error, onRetry, onClick }) {
  if (loading) {
    return <LoadingSpinner message="Memuat destinasi wisata..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!destinations || destinations.length === 0) {
    return (
      <p className={styles.empty}>Tidak ada destinasi wisata yang ditemukan.</p>
    );
  }

  return (
    <section className={styles.grid} aria-label="Daftar destinasi wisata">
      {destinations.map((destination) => (
        <TourismCard
          key={destination.id}
          destination={destination}
          onClick={onClick}
        />
      ))}
    </section>
  );
}

export default TourismList;
