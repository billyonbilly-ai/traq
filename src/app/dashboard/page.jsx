'use client';
import styles from './page.module.scss';
import { useSession} from 'next-auth/react';
import Button from '../../components/Button';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = require('next/navigation').useRouter();

  if (status === 'loading') return <div className={styles.dashboardPage}>Loading...</div>;
  if (!session) return null;

  return (
    <div className={styles.dashboardPage}>
      <DashboardNavbar />
      <div className={styles.dashboardMain}>
        <Button onClick={() => router.push('/dashboard/new')}>Add new URL</Button>
      </div>
    </div>
  );
} 