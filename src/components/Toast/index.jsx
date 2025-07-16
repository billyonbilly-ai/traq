import { useEffect } from 'react';
import styles from './index.module.scss';

export default function Toast({ message, visible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;
  return (
    <div className={styles.toast} role="alert">
      {message}
    </div>
  );
} 