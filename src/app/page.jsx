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
          style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => router.push('/login')}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
