'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './index.module.scss';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import EyeIcon from '../../components/EyeIcon';
import Button from '../../components/Button';

console.log('Onboarding page loaded');

export default function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [awaitingSession, setAwaitingSession] = useState(false);
  const email = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (awaitingSession && status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [awaitingSession, status, router]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    console.log('handleSubmit called');
    setLoading(true);
    setError('');
    console.log('Submitting onboarding form...');
    const res = await fetch('/api/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    console.log('set-password response:', data);
    if (data.success) {
      console.log('Attempting credentials signIn...');
      console.log('signIn params:', {
        email,
        password,
        callbackUrl: `${window.location.origin}/dashboard`,
        redirect: false
      });
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: `${window.location.origin}/dashboard`,
        redirect: false
      });
      console.log('signIn result:', result);
      if (result?.ok) {
        window.location.href = result.url;
      } else if (result?.error) {
        setError(result.error);
      }
    } else {
      setError(data.error || 'Failed to set up account.');
    }
    setLoading(false);
  }

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.onboardingBox}>
        <div className={styles.divider}><span>Set up your account</span></div>
        <div className={styles.dividerSub}><span>Set a Display Name and Password</span></div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <label htmlFor="name" style={{ fontWeight: 500, marginBottom: 0 }}>Display Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.onboardingInput}
              required
              autoComplete="name"
            />
            <label htmlFor="password" style={{ fontWeight: 500, marginBottom: 0, marginTop: '1.5rem' }}>Password</label>
            <div
              className={styles.passwordInputWrap}
              tabIndex={-1}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: 8 }}
            >
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={styles.passwordInput}
                required
                autoComplete="new-password"
                style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', flex: 1, paddingRight: 40 }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 2 }} onClick={() => setShowPassword(v => !v)}>
                <EyeIcon open={!showPassword} />
              </span>
            </div>
          </div>
          <Button type="submit" loading={loading} disabled={!name || !password}>
            Continue
          </Button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
} 