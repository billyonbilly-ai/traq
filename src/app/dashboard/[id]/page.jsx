'use client';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from './page.module.scss';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const { id } = params || {};

  if (status === 'loading') return <div className={styles.analyticsPage}>Loading...</div>;
  if (!session) {
    // If not authenticated, redirect to login or dashboard
    router.push('/');
    return null;
  }

  return (
    <div className={styles.analyticsPage}>
      <DashboardNavbar />
      <div className={styles.contentWrapper}>
        <h2>Analytics for link {id}</h2>
        <p>This page is under construction. Select a timeframe and view detailed stats soon.</p>
      </div>
    </div>
  );
}
