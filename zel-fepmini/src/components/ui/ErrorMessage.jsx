import styles from './ErrorMessage.module.css';

/**
 * ErrorMessage — displays an error message with an optional retry button.
 *
 * Props:
 *   message  {string}    — error text to display
 *   onRetry  {Function}  [optional] — callback invoked when the retry button is clicked
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert" aria-live="assertive">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
