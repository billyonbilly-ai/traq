'use client';
import styles from './page.module.scss';
import { useSession} from 'next-auth/react';

import DashboardNavbar from '../../components/DashboardNavbar';
import LinkCard from '../../components/LinkCard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = require('next/navigation').useRouter();

  if (status === 'loading') return <div className={styles.dashboardPage}>Loading...</div>;
  if (!session) return null;

  return (
    <div className={styles.dashboardPage}>
      <DashboardNavbar />
      <div className={styles.header}>
        <button className={styles.addUrlBtn} onClick={() => router.push('/dashboard/new')}>+ Add new URL</button>
      </div>
      <div className={styles.dashboardMain}>
        <LinkCard />
        <LinkCard />
        <LinkCard />
        <LinkCard />
      </div>
    </div>
  );
} 