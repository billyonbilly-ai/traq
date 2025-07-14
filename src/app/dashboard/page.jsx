'use client';
import styles from './index.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Add a ref to track the timeout
  const redirectTimeout = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname === '/dashboard') {
      // Add a small delay to allow session to hydrate after OAuth
      redirectTimeout.current = setTimeout(() => {
        router.push('/');
      }, 500); // 500ms delay
      return () => clearTimeout(redirectTimeout.current);
    }
    // Clear timeout if status changes
    return () => clearTimeout(redirectTimeout.current);
  }, [status, router, pathname]);

  if (status === 'loading') return <div className={styles.dashboardPage}>Loading...</div>;
  if (!session) return null;

  const user = session.user;
  let displayName = '';
  if (user.name) {
    displayName = user.name;
  } else if (user.email) {
    displayName = user.email.replace('@gmail.com', '');
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardBox}>
        <h2>Welcome, {displayName}</h2>
        <button
          className={styles.logoutButton}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Log out
        </button>
      </div>
    </div>
  );
} 