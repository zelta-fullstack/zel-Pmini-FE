import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner — centered animated spinner with an optional message.
 *
 * Props:
 *   message {string} [optional] — text displayed below the spinner
 */
function LoadingSpinner({ message }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
