import styles from './Button.module.css';

/**
 * Button component
 *
 * @param {'primary'|'secondary'} variant - Visual style of the button
 * @param {() => void} onClick - Click handler
 * @param {React.ReactNode} children - Button label/content
 * @param {boolean} [disabled] - Whether the button is disabled
 */
function Button({ variant = 'primary', onClick, children, disabled = false }) {
  const variantClass = variant === 'secondary' ? styles.secondary : styles.primary;

  return (
    <button
      className={`${styles.button} ${variantClass}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

export default Button;
