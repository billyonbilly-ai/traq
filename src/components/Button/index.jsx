import styles from './index.module.scss';

export default function Button({ children, onClick, loading, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
} 