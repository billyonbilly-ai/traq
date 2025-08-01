import styles from './index.module.scss';
import Logo from '../Logo';
import ProfileMenu from '../ProfileMenu';


export default function DashboardNavbar() {
  return (
    <div className={styles.navbar}>
      <Logo />
      <ProfileMenu />
    </div>
  );
} 