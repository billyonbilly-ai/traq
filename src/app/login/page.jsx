'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './index.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Log in</h2>
        <button className={styles.loginButton} onClick={() => signIn('google')}>
          Sign up with Google
        </button>
        <div className={styles.emailSection}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          <button className={styles.loginButton} onClick={() => signIn('email', { email })}>
            Sign up with Email
          </button>
        </div>
      </div>
    </div>
  );
} 