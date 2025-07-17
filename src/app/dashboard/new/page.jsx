'use client';
import styles from './page.module.scss';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardNew() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Timezone and live clock logic
  const [timezone, setTimezone] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Get user's IANA timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);

    function formatTime(date, tz) {
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      });
    }

    function updateTime() {
      setCurrentTime(formatTime(new Date(), tz));
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format timezone for display (e.g., 'Africa/Lagos' -> 'Africa - Lagos')
  function formatTimezone(tz) {
    if (!tz) return '';
    const parts = tz.split('/');
    if (parts.length === 2) {
      return `${parts[0]} - ${parts[1].replace(/_/g, ' ')}`;
    }
    return tz.replace(/_/g, ' ');
  }

  return (
    <div className={styles.pageBg}>
      <DashboardNavbar />
      <div className={styles.addNewContainer}>
        <div className={styles.btnContainer}>
 <button className={styles.dashboardBtn} onClick={() => router.push('/dashboard')}>
          &larr; My Links
        </button>
        </div>
       
        <div className={styles.stepperWrap}>
          <div className={styles.stepper}>
            <div className={styles.step + ' ' + (step === 1 ? styles.active : '')}>
              <span className={styles.dotWrap}>
                <span className={styles.dotBg} style={{ opacity: step === 1 ? 1 : 0 }} />
                <span className={styles.dot} />
              </span>
              <span className={styles.stepLabel}>Add URL</span>
            </div>
            <div className={styles.step + ' ' + (step === 2 ? styles.active : '')}>
              <span className={styles.dotWrap}>
                <span className={styles.dotBg} style={{ opacity: step === 2 ? 1 : 0 }} />
                <span className={styles.dot} />
              </span>
              <span className={styles.stepLabel}>Customize</span>
            </div>
          </div>
        </div>
        <div className={styles.cardWrap}>
          {step === 1 ? (
            <form className={styles.card} onSubmit={e => { e.preventDefault(); setStep(2); }}>
              <div className={styles.cardTitle}>Add a new URL to track</div>
              <label className={styles.inputLabel} htmlFor="domain">URL</label>
              <div className={styles.domainInputWrap}>
                <input id="domain" className={styles.domainInput} placeholder="https://spotify.com/mysong" autoComplete="off" />
              </div>
              <label className={styles.inputLabel} htmlFor="timezone">Timezone</label>
              <div className={styles.timezoneBox}>
                <span className={styles.timezoneDisplay}>{formatTimezone(timezone)} <span className={styles.timezoneHelper}>current time is {currentTime}</span></span>
              </div>
              <div className={styles.subText}>Daily analytics are shown in this timezone.</div>
              <button className={styles.addBtn} type="submit">Add URL</button>
            </form>
          ) : (
            <div className={styles.card} style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className={styles.step2Text}>step 2</span>
            </div>
          )}
        </div>
        <div className={styles.helpText}>Need help? Email <a href="mailto:marc@datafa.st">billy@traq.site</a></div>
      </div>
    </div>
  );
}
