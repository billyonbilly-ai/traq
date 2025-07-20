'use client';
import styles from './page.module.scss';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardNew() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const router = useRouter();

  // Timezone and live clock logic
  const [timezone, setTimezone] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const customLinkInputRef = useRef(null);
  const [customPath, setCustomPath] = useState('');

  // Generate random 6-char string
  function generateRandomPath(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Split customLink into base and path
  function splitCustomLink(link) {
    const idx = link.indexOf('/');
    if (idx === -1) return { base: '', path: link };
    // Find the first / after the domain (e.g., localhost:3000/)
    const firstSlash = link.indexOf('/', link.indexOf(':') + 3);
    if (firstSlash === -1) return { base: link + '/', path: '' };
    return { base: link.slice(0, firstSlash + 1), path: link.slice(firstSlash + 1) };
  }

  // When customLink changes (on step 2), update customPath
  useEffect(() => {
    if (step === 2 && url) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const randomPath = generateRandomPath(6);
      // Remove protocol for display
      const displayLink = `${baseUrl}/${randomPath}`.replace(/^https?:\/\//, '');
      setCustomLink(displayLink);
      setCustomPath(randomPath);
    }
  }, [step, url]);

  // Focus input and move cursor to end in edit mode
  useEffect(() => {
    if (editMode && customLinkInputRef.current) {
      customLinkInputRef.current.focus();
      // Move cursor to end
      const len = customPath.length;
      customLinkInputRef.current.setSelectionRange(len, len);
    }
  }, [editMode]);

  // Timezone and live clock logic
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

  const { base, path } = splitCustomLink(customLink);

  // Format timezone for display (e.g., 'Africa/Lagos' -> 'Africa - Lagos')
  function formatTimezone(tz) {
    if (!tz) return '';
    const parts = tz.split('/');
    if (parts.length === 2) {
      return `${parts[0]} - ${parts[1].replace(/_/g, ' ')}`;
    }
    return tz.replace(/_/g, ' ');
  }

  function isValidUrl(value) {
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(value.trim());
  }

  // When leaving edit mode, update the customLink with the new path
  useEffect(() => {
    if (!editMode && step === 2 && customLink) {
      setCustomLink(base + customPath);
    }
    // eslint-disable-next-line
  }, [editMode]);

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
              <span className={styles.stepLabel}>Get Custom Link</span>
            </div>
          </div>
        </div>
        <div className={styles.cardWrap}>
          {step === 1 ? (
            <form className={styles.card} onSubmit={e => {
              e.preventDefault();
              if (!isValidUrl(url)) {
                setUrlError('Please enter a valid URL.');
                return;
              }
              setUrlError('');
              setStep(2);
            }}>
              <div className={styles.cardTitle}>Add a new URL to track</div>
              <label className={styles.inputLabel} htmlFor="domain">URL</label>
              <div className={styles.domainInputWrap}>
                <input
                  id="domain"
                  className={styles.domainInput}
                  placeholder="https://spotify.com/mysong"
                  autoComplete="off"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </div>
              {urlError && <div style={{ color: '#ff4d4f', marginBottom: 8, marginTop: -20 }}>{urlError}</div>}
              <label className={styles.inputLabel} htmlFor="timezone">Timezone</label>
              <div className={styles.timezoneBox}>
                <span className={styles.timezoneDisplay}>{formatTimezone(timezone)} <span className={styles.timezoneHelper}>current time is {currentTime}</span></span>
              </div>
              <div className={styles.subText}>Used for accurate daily analytics.</div>
              <button className={styles.addBtn} type="submit">Add URL</button>
            </form>
          ) : (
            <div className={`${styles.card} ${styles.card2}`}>
              <div className={`${styles.cardTitle} ${styles.cardTitle2}`}>
                Your custom link
                </div>
                <div className={styles.domainInputWrap}>
                  <span className={styles.customLinkPrefix} style={{ color: editMode ? 'var(--foreground)' : 'var(--primary)', fontWeight: 500, userSelect: 'none' }}>{base}</span>
                  <input
                    ref={customLinkInputRef}
                    className={`${styles.domanInput} ${styles.customLink}`}
                    autoComplete="off"
                    value={customPath}
                    readOnly={!editMode}
                    style={{ color: editMode ? 'var(--foreground)' : 'var(--primary)', fontWeight: 500, background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                    onChange={e => setCustomPath(e.target.value.replace(/\//g, ''))}
                  />
                <div className={styles.linkBtns}>
                  <div className={styles.copy + ' ' + (editMode ? styles.inactiveCopyBtn : '')}
                    onClick={editMode ? undefined : async () => {
                      if (!customLink) return;
                      try {
                        await navigator.clipboard.writeText(customLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      } catch (e) {}
                    }}
                    style={{ userSelect: 'none' }}
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="18.84 27.24 62.27 45.46" width="13" height="13" style={editMode ? { fill: '#b0b0b0' } : {}}><path fill={editMode ? '#b0b0b0' : '#a855f7'} d="m41.906 72.699c-1.582 0-3.2031-0.625-4.4102-1.832l-16.812-16.812c-2.457-2.457-2.457-6.4102 0-8.8242 2.457-2.457 6.4102-2.457 8.8242 0l12.402 12.402 28.547-28.547c2.457-2.457 6.4102-2.457 8.8242 0 2.4141 2.457 2.457 6.4102 0 8.8242l-32.957 32.957c-1.207 1.207-2.8281 1.832-4.4102 1.832z"/></svg>
                        <span style={editMode ? { color: '#b0b0b0' } : {}}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 90 90" width="13.5" height="13.5" style={editMode ? { fill: '#b0b0b0' } : {}}><g><g><path fill={editMode ? '#b0b0b0' : '#a855f7'} d="M75.394,58.138l12.673-12.675c9.245-9.243,9.245-24.286,0-33.529c-9.244-9.246-24.286-9.246-33.53,0L36.248,30.223    c-9.245,9.243-9.245,24.286,0,33.529c1.365,1.366,2.859,2.524,4.44,3.486l9.791-9.792c-1.865-0.446-3.634-1.387-5.086-2.838    c-4.202-4.202-4.202-11.04,0-15.241l18.289-18.289c4.202-4.202,11.04-4.202,15.241,0c4.202,4.202,4.202,11.039,0,15.241    l-5.373,5.374C75.764,46.904,76.376,52.635,75.394,58.138z"/></g><g><path fill={editMode ? '#b0b0b0' : '#a855f7'} d="M24.607,41.862L11.934,54.536c-9.246,9.244-9.246,24.286,0,33.53c9.243,9.245,24.286,9.245,33.53,0l18.288-18.289    c9.245-9.244,9.244-24.286,0-33.529c-1.364-1.366-2.858-2.524-4.439-3.486l-9.791,9.792c1.864,0.447,3.633,1.386,5.086,2.838    c4.202,4.202,4.202,11.039,0,15.241l-18.29,18.289c-4.202,4.202-11.039,4.202-15.241,0c-4.202-4.202-4.202-11.039,0-15.241    l5.374-5.373C24.236,53.097,23.624,47.365,24.607,41.862z"/></g></g></svg>
                        <span style={editMode ? { color: '#b0b0b0' } : {}}>Copy</span>
                      </>
                    )}
                  </div>
                  <div className={styles.edit + (editMode ? ' ' + styles.doneState : '')}
                    onClick={() => setEditMode(editMode => !editMode)}
                  >
                    {editMode ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="18.84 27.24 62.27 45.46" width="13" height="13" style={{ fill: 'var(--background)' }}><path fill="var(--background)" d="m41.906 72.699c-1.582 0-3.2031-0.625-4.4102-1.832l-16.812-16.812c-2.457-2.457-2.457-6.4102 0-8.8242 2.457-2.457 6.4102-2.457 8.8242 0l12.402 12.402 28.547-28.547c2.457-2.457 6.4102-2.457 8.8242 0 2.4141 2.457 2.457 6.4102 0 8.8242l-32.957 32.957c-1.207 1.207-2.8281 1.832-4.4102 1.832z"/></svg>
                        <span style={{ color: 'var(--background)' }}>Done</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="7.17 7.16 85.67 85.67" width="13.5" height="13.5">
                          <path fill="currentColor" d="m14.016 72.492-6.7539 18.238c-0.21094 0.57422-0.070313 1.2148 0.35938 1.6484 0.43359 0.42969 1.0742 0.57031 1.6484 0.35938l18.242-6.7539h-0.003907c0.125-0.046875 0.21875-0.15234 0.24609-0.28125 0.03125-0.12891-0.007812-0.26562-0.10547-0.35938l-12.992-12.992c-0.09375-0.097656-0.23047-0.13672-0.35938-0.10547-0.12891 0.027344-0.23828 0.12109-0.28125 0.24609z"/>
                          <path fill="currentColor" d="m15.078 70.559 48.895-48.895c0.30469-0.30469 0.85938-0.24609 1.1055 0l13.258 13.258c0.30469 0.30469 0.30469 0.80078 0 1.1055l-48.895 48.895c-0.30469 0.30469-0.85938 0.24609-1.1055 0l-13.258-13.258c-0.30469-0.30469-0.30469-0.80078 0-1.1055z"/>
                          <path fill="currentColor" d="m90.551 12.766-3.3164-3.3164c-3.0508-3.0508-7.9961-3.0508-11.047 0l-10.559 10.559c-0.30469 0.30469-0.30469 0.80078 0 1.1055l13.258 13.258c0.30469 0.30469 0.80078 0.30469 1.1055 0l10.559-10.559c1.4648-1.4648 2.2891-3.4531 2.2891-5.5234 0-2.0742-0.82422-4.0586-2.2891-5.5234z"/>
                        </svg>
                        Edit
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.subText}>Redirects to <span className={styles.subTextBold}>{(() => {
                if (!url) return '';
                let noProtocol = url.replace(/^https?:\/\//, '');
                if (noProtocol.length > 27) {
                  return noProtocol.slice(0, 27) + '...';
                }
                return noProtocol;
              })()}</span></div>
               <button className={styles.addBtn + ' ' + (editMode ? styles.inactiveBtn : '')} type="submit" disabled={editMode}>Start Tracking</button>
              </div>
          
          )}
        </div>
        <div className={styles.helpText}>Need help? Email <a href="mailto:billy@traq.site">billy@traq.site</a></div>
      </div>
    </div>
  );
}
