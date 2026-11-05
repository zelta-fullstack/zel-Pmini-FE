import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './NotFoundPage.module.css';

/**
 * NotFoundPage — displayed when a visitor navigates to an unknown route
 * or a detail page with an invalid destination identifier.
 *
 * Covers Requirements 2.2, 3.3, 3.4
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Halaman Tidak Ditemukan</h1>
        <p className={styles.description}>
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
