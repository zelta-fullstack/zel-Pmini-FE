import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Explore Bandung</h1>
        <p className={styles.subtitle}>Temukan Destinasi Wisata Terbaik di Kota Kembang</p>
      </div>
    </header>
  );
}

export default Header;
