'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import GoogleButton from '../../components/GoogleButton';
import Button from '../../components/Button';
import EyeIcon from '../../components/EyeIcon';

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
  const [showPassword, setShowPassword] = useState(false);

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
        <div className={styles.logo}>Traq.</div>
        <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} disabled={isAnyLoading} />
        <div className={styles.divider}><span>or</span></div>
        <div className={styles.emailSection}>
          <label htmlFor="email" style={{ fontWeight: 500, marginBottom: 0 }}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.emailInput}
            disabled={step !== 'email' || isAnyLoading}
            autoComplete="email"
          />
          {step === 'email' && (
            <Button onClick={handleEmailContinue} loading={isAnyLoading} >
              Sign up with email
            </Button>
          )}
          {step === 'code' && (
            <>
            <label htmlFor="code" style={{ fontWeight: 500, marginBottom: 0 }} className={styles.codeLabel}>Verification code</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className={styles.emailInput}
                disabled={isAnyLoading}
                autoComplete="one-time-code"
              />
              <Button onClick={handleCodeContinue} loading={isAnyLoading} >
                Continue
              </Button>
            </>
          )}
          {step === 'password' && (
            <>
            <label htmlFor="password" style={{ fontWeight: 500, marginBottom: 0 }} className={styles.codeLabel}>Password</label>
              <div
                className={styles.passwordInputWrap}
                tabIndex={-1}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: 8 }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  disabled={isAnyLoading}
                  autoComplete="current-password"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', flex: 1, paddingRight: 40 }}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 2 }} onClick={() => setShowPassword(v => !v)}>
                  <EyeIcon open={!showPassword} />
                </span>
              </div>
              <Button onClick={handlePasswordContinue} loading={isAnyLoading} disabled={!password}>
                Continue with password
              </Button>
            </>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div style={{ color: '#888', fontSize: '0.95rem', marginTop: '1.5rem', textAlign: 'center' }}>
          By signing up, you agree to our <a href="#" style={{ color: '#ff7750', textDecoration: 'underline' }}>Terms of Service</a>.
        </div>
      </div>
    </div>
  );
} 