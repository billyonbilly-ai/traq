'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.scss';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import FormError from '../../components/FormError';
import { setPassword as setUserPassword } from '../../lib/auth';

export default function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const email = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    console.log('handleSubmit called');
    setLoading(true);
    setError('');
    console.log('Submitting onboarding form...');
    const data = await setUserPassword(email, name, password);
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
          <div className={styles.formFields}>
            <label htmlFor="name" className={styles.onboardingLabel}>Display Name</label>
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
            <label htmlFor="password" className={styles.onboardingPasswordLabel}>Password</label>
            <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
              required={true}
              id="password"
                autoComplete="new-password"
              />
          </div>
          <Button type="submit" loading={loading} disabled={!name || !password}>
            Continue
          </Button>
        </form>
        {error && <FormError message={error} />}
      </div>
    </div>
  );
} 