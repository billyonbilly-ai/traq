import styles from './index.module.scss';
import Image from 'next/image';

export default function GoogleButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      className={styles.googleButton}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.logoWrap}>
        <Image src="/google.png" alt="Google" width={22} height={22} />
      </span>
      <span className={styles.text}>{'Sign up with Google'}</span>
    </button>
  );
} 