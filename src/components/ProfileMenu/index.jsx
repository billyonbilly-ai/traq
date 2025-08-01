"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "./index.module.scss";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const userEmail = session?.user?.email || "";
  const emailName = userEmail.split("@")[0];
  const displayName = session?.user?.name || emailName;

  const avatarUrl = session?.user?.image;
  const nameForPlaceholder = session?.user?.name || emailName;
  const avatarPlaceholder = nameForPlaceholder.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  return (
    <div className={styles.profileWrapper} ref={menuRef}>
      <button className={styles.profileBtn} onClick={toggleMenu}>
        {avatarUrl ? (
          // Google sign-in
          <img src={avatarUrl} alt="profile" className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarPlaceholder}>{avatarPlaceholder}</span>
        )}
        <span className={styles.displayName}>{displayName}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{displayName}</span>
            <span className={styles.email}>{userEmail}</span>
          </div>
          <button className={styles.logoutItem} onClick={() => signOut({ callbackUrl: "/" })}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
