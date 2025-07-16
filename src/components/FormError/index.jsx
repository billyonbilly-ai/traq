import styles from './index.module.scss';

export default function FormError({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div className={`${styles.error} ${className}`}>
      {message}
    </div>
  );
} 