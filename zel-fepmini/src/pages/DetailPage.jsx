import { useParams, useNavigate } from 'react-router-dom';
import { useTourism } from '../context/TourismContext';
import NotFoundPage from './NotFoundPage';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from './DetailPage.module.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x450?text=No+Image';

/**
 * DetailPage — displays full information for a single tourism destination.
 *
 * Covers Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 3.2, 3.3
 */
function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDestinationById } = useTourism();

  const destination = getDestinationById(id);

  // Requirement 2.2 / 3.3: invalid id → show 404 page
  if (destination === null || destination === undefined) {
    return <NotFoundPage />;
  }

  const handleImageError = (e) => {
    // Requirement 2.8: fallback to placeholder when image fails to load
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const { name, description, image, location, operatingHours, pricing } = destination;

  return (
    <div className={styles.page}>
      {/* Requirement layout: Header at top */}
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Requirement 2.9: back button */}
          <div className={styles.backRow}>
            <Button variant="secondary" onClick={() => navigate('/')}>
              ← Kembali ke Beranda
            </Button>
          </div>

          {/* Requirement 2.1: destination name as page title */}
          <h1 className={styles.title}>{name}</h1>

          {/* Requirement 2.7: main image */}
          <div className={styles.imageWrapper}>
            <img
              className={styles.image}
              src={image || PLACEHOLDER_IMAGE}
              alt={name}
              onError={handleImageError}
            />
          </div>

          <div className={styles.details}>
            {/* Requirement 2.3: full description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Deskripsi</h2>
              <p className={styles.description}>{description}</p>
            </section>

            {/* Requirement 2.4: location address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Lokasi</h2>
              <p className={styles.text}>
                {location?.address}
                {location?.city ? `, ${location.city}` : ''}
              </p>
            </section>

            {/* Requirement 2.5: operating hours — only when available */}
            {operatingHours && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Jam Operasional</h2>
                <p className={styles.text}>{operatingHours}</p>
              </section>
            )}

            {/* Requirement 2.6: ticket pricing — only when available */}
            {pricing && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Harga Tiket</h2>
                <p className={styles.text}>
                  {pricing.currency}{' '}
                  {typeof pricing.amount === 'number'
                    ? pricing.amount.toLocaleString('id-ID')
                    : pricing.amount}
                </p>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}

export default DetailPage;
