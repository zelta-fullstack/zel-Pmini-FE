import { useNavigate } from 'react-router-dom';
import { useTourism } from '../context/TourismContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TourismList from '../components/tourism/TourismList';
import styles from './HomePage.module.css';

/**
 * HomePage — displays the full list of Bandung tourism destinations.
 *
 * Reads destinations, loading, error, and fetchDestinations from TourismContext.
 * The context already triggers a fetch on mount; no double-fetch occurs here.
 * Card clicks navigate to /destinations/:id via React Router.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 4.1, 4.2, 4.3, 4.4, 4.5
 */
function HomePage() {
  const { destinations, loading, error, fetchDestinations } = useTourism();
  const navigate = useNavigate();

  // Requirement 1.6: navigate to detail page on card click
  function handleCardClick(id) {
    navigate(`/destinations/${id}`);
  }

  return (
    <div className={styles.page}>
      {/* Requirement 1.1: header with platform title */}
      <Header />

      <main className={styles.main}>
        {/* Requirements 1.2, 1.3, 1.4, 4.2, 4.3, 4.4, 4.5: list with loading/error/retry/cards */}
        <TourismList
          destinations={destinations}
          loading={loading}
          error={error}
          onRetry={fetchDestinations}
          onClick={handleCardClick}
        />
      </main>

      {/* Requirement 1.7: footer with platform name */}
      <Footer />
    </div>
  );
}

export default HomePage;
