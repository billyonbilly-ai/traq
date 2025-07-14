'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Spinner component
function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 16,
      height: 16,
      border: '2px solid #ccc',
      borderTop: '2px solid #333',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: 8,
      verticalAlign: 'middle',
    }} />
  );
}

// Add spinner keyframes to the page (for demo, ideally move to CSS)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'code', 'password'
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { status } = useSession();
  const router = useRouter();

  function handleGoogleSignIn() {
    sessionStorage.setItem('googleLoading', '1');
    setGoogleLoading(true);
    signIn('google');
  }

  // On mount, check for googleLoading flag
  useEffect(() => {
    if (sessionStorage.getItem('googleLoading') === '1') {
      setGoogleLoading(true);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      sessionStorage.removeItem('googleLoading');
      router.push('/dashboard');
    }
    if (status === 'unauthenticated') {
      sessionStorage.removeItem('googleLoading');
      setGoogleLoading(false);
    }
  }, [status, router]);

  async function handleEmailContinue() {
    setLoading(true);
    setError('');
    // Check user status
    const res = await fetch('/api/auth/user-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.status === 'new' || data.status === 'code') {
      // Send OTP
      const otpRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!otpRes.ok) {
        setError('Failed to send code.');
        setLoading(false);
        return;
      }
      setStep('code');
    } else if (data.status === 'password') {
      setStep('password');
    }
    setLoading(false);
  }

  async function handleCodeContinue() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.status === 'google') {
      sessionStorage.setItem('googleLoading', '1');
      setGoogleLoading(true);
      await signIn('google');
      return;
    }
    if (data.status === 'onboarding') {
      router.push(`/onboarding?email=${encodeURIComponent(email)}`);
    } else if (data.status === 'signin') {
      await signIn('email', { email, callbackUrl: '/dashboard' });
    } else {
      setError(data.error || 'Invalid code.');
    }
    setLoading(false);
  }

  async function handlePasswordContinue() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/signin-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
    } else {
      setError(data.error || 'Invalid credentials.');
    }
    setLoading(false);
  }

  const isAnyLoading = loading || googleLoading;

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Log in</h2>
        <button
          className={styles.loginButton}
          onClick={handleGoogleSignIn}
          disabled={isAnyLoading}
        >
          {googleLoading && <Spinner />}Sign up with Google
        </button>
        <div className={styles.emailSection}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.emailInput}
            disabled={step !== 'email' || isAnyLoading}
          />
          {step === 'email' && (
            <button className={styles.loginButton} onClick={handleEmailContinue} disabled={isAnyLoading || !email}>
              {isAnyLoading && <Spinner />}Continue
            </button>
          )}
          {step === 'code' && (
            <>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className={styles.emailInput}
                disabled={isAnyLoading}
              />
              <button className={styles.loginButton} onClick={handleCodeContinue} disabled={isAnyLoading || !code}>
                {isAnyLoading && <Spinner />}Continue
              </button>
            </>
          )}
          {step === 'password' && (
            <>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.emailInput}
                disabled={isAnyLoading}
              />
              <button className={styles.loginButton} onClick={handlePasswordContinue} disabled={isAnyLoading || !password}>
                {isAnyLoading && <Spinner />}Continue with password
              </button>
            </>
          )}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
} 