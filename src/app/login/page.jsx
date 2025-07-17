'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import GoogleButton from '../../components/GoogleButton';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import PasswordInput from '../../components/PasswordInput';
import FormError from '../../components/FormError';
import { checkUserStatus, sendOtp, verifyOtp, signinWithPassword } from '../../lib/auth';

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
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

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

  // Countdown effect for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Toast auto-hide effect (5s)
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  async function handleEmailContinue() {
    setLoading(true);
    setError('');
    // Check user status
    const data = await checkUserStatus(email);
    if (data.status === 'new' || data.status === 'code') {
      // Send OTP
      const otpRes = await sendOtp(email);
      if (!otpRes.success) {
        setError('Failed to send code.');
        setLoading(false);
        return;
      }
      setStep('code');
      setResendCountdown(60); 
      setToastMessage('Verification code sent to your email.');
      setToastVisible(true);
    } else if (data.status === 'password') {
      setStep('password');
    }
    setLoading(false);
  }

  async function handleResendCode() {
    setLoading(true);
    setError('');
    const otpRes = await sendOtp(email);
    if (!otpRes.success) {
      setError('Failed to resend code.');
      setLoading(false);
      return;
    }
    setResendCountdown(60);
    setToastMessage('Verification code resent to your email.');
    setToastVisible(true);
    setLoading(false);
  }

  async function handleCodeContinue() {
    setLoading(true);
    setError('');
    const data = await verifyOtp(email, code);
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
    const data = await signinWithPassword(email, password);
    if (data.success) {
      await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
    } else {
      setError(data.error || 'Invalid credentials.');
    }
    setLoading(false);
  }

  const isAnyLoading = loading || googleLoading;

  return (
    <>
      <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>Traq.</div>
        <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} disabled={isAnyLoading} />
        <div className={styles.divider}><span>or</span></div>
        <div className={styles.emailSection}>
            <label htmlFor="email" className={styles.label}>Email</label>
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
              <form onSubmit={(e) => { e.preventDefault(); handleEmailContinue(); }} className={styles.formFields}>
                <Button type="submit" loading={isAnyLoading}>
              Sign up with email
            </Button>
              </form>
          )}
          {step === 'code' && (
            <>
                <label htmlFor="code" className={styles.codeLabel}>Verification code</label>
                <form onSubmit={(e) => { e.preventDefault(); handleCodeContinue(); }} className={styles.form}>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className={styles.emailInput}
                disabled={isAnyLoading}
                autoComplete="one-time-code"
              />
                  {error && <FormError message={error} />}
                  <Button type="submit" loading={isAnyLoading}>
                Continue
              </Button>
                </form>
                <div className={styles.resendContainer}>
                  <span
                    onClick={resendCountdown > 0 || isAnyLoading ? undefined : handleResendCode}
                    className={`${styles.resendLink} ${styles.resendLink}`}
                    tabIndex={0}
                    role="button"
                    aria-disabled={resendCountdown > 0 || isAnyLoading}
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                  </span>
                </div>
            </>
          )}
          {step === 'password' && (
            <>
                <label htmlFor="password" className={styles.passwordLabel}>Password</label>
                <form onSubmit={(e) => { e.preventDefault(); handlePasswordContinue(); }}>
                  <PasswordInput
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isAnyLoading}
                  autoComplete="current-password"
                    required={true}
                    id="password"
                  />
                  {error && <FormError message={error} />}
                  <Button type="submit" loading={isAnyLoading} disabled={!password}>
                Continue with password
              </Button>
                </form>
            </>
          )}
            {step !== 'code' && step !== 'password' && error && <FormError message={error} />}
          </div>
          <div className={styles.termsText}>
            By signing up, you agree to our <a href="#" className={styles.termsLink}>Terms of Service</a>.
        </div>
        </div>
      </div>
    </>
  );
} 