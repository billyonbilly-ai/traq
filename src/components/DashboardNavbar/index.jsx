import styles from './index.module.scss';
import { signOut } from 'next-auth/react';

export default function DashboardNavbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Traq.</div>
      <button className={styles.logoutButton} onClick={() => signOut({ callbackUrl: '/' })}>
        Log out
      </button>
    </div>
  );
} 