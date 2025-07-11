'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './index.module.scss';
import { signIn } from 'next-auth/react';

console.log('Onboarding page loaded');

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        router.push('/dashboard');
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
        <h2>Set up your account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.onboardingInput}
            required
          />
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.onboardingInput}
            required
          />
          <button
            className={styles.onboardingButton}
            type="submit"
            disabled={loading || !name || !password}
          >
            Continue
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}
