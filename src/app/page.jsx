'use client';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.traqHome}>
      <div>
        <h1>Traq</h1>
        <button
          className={styles.loginButton}
          onClick={() => router.push('/login')}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
