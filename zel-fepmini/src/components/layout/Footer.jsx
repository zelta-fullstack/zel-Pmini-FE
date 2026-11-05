import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>Wisata Bandung</p>
        <p className={styles.copy}>&copy; {new Date().getFullYear()} Platform Wisata Bandung. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
