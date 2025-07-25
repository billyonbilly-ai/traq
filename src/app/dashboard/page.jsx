'use client';
import { useState } from 'react';
import styles from './page.module.scss';
import { useSession} from 'next-auth/react';

import DashboardNavbar from '../../components/DashboardNavbar';
import LinkCard from '../../components/LinkCard';
import Toast from '../../components/Toast';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = require('next/navigation').useRouter();
  const [toastInfo, setToastInfo] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToastInfo({ visible: true, message });
  };

  const closeToast = () => {
    setToastInfo({ visible: false, message: '' });
  };

  if (status === 'loading') return <div className={styles.dashboardPage}>Loading...</div>;
  if (!session) return null;

  return (
    <div className={styles.dashboardPage}>
      <DashboardNavbar />
      <div className={styles.header}>
        <button className={styles.addUrlBtn} onClick={() => router.push('/dashboard/new')}>+ Add new URL</button>
      </div>
      <div className={styles.dashboardMain}>
        <LinkCard onCopy={showToast} />
        <LinkCard onCopy={showToast} />
        <LinkCard onCopy={showToast} />
        <LinkCard onCopy={showToast} />
      </div>
      <Toast 
        message={toastInfo.message} 
        visible={toastInfo.visible} 
        onClose={closeToast} 
      />
    </div>
  );
} 