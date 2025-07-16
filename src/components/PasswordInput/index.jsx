import { useState } from 'react';
import styles from './index.module.scss';
import EyeIcon from '../EyeIcon';

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter your password',
  disabled = false,
  autoComplete = 'current-password',
  required = false,
  id = 'password',
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`${styles.passwordInputWrap} ${className}`} tabIndex={-1}>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.passwordInput}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
      />
      <span className={styles.eyeIcon} onClick={() => setShowPassword(v => !v)}>
        <EyeIcon open={!showPassword} />
      </span>
    </div>
  );
} 