'use client';
import styles from './index.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import ClientProvider from '../client-provider';
import { useEffect } from 'react';

export default function Dashboard() {
  return (
    <ClientProvider>
      <DashboardContent />
    </ClientProvider>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname === '/dashboard') {
      router.push('/');
    }
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