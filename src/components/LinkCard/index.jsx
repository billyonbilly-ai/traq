import styles from './index.module.scss';

export default function LinkCard({ onCopy }) {
  const handleCopy = () => {
    const link = 'traq.li/thegiftofdreamingtwo';
    navigator.clipboard.writeText(link);

    const message = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'currentColor',
          marginRight: 8,
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="18.84 27.24 62.27 45.46"
            width={16}
            height={16}
            style={{ display: 'block' }}
          >
            <path
              d="m41.906 72.699c-1.582 0-3.2031-0.625-4.4102-1.832l-16.812-16.812c-2.457-2.457-2.457-6.4102 0-8.8242 2.457-2.457 6.4102-2.457 8.8242 0l12.402 12.402 28.547-28.547c2.457-2.457 6.4102-2.457 8.8242 0 2.4141 2.457 2.457 6.4102 0 8.8242l-32.957 32.957c-1.207 1.207-2.8281 1.832-4.4102 1.832z"
              fill="var(--toast-bg)"
            />
          </svg>
        </span>
        Link copied!
      </div>
    );

    onCopy(message);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLink}>
        .../thegiftofdreamingtwo
      </div>

      <div className={styles.actionLinks}>
   <div className={styles.copy} onClick={handleCopy}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="9.38 5.21 81.25 89.58" fill="currentColor" className={styles.copyIcon}>
          <path d="m90.625 50v33.332c0 6.3203-5.1406 11.457-11.457 11.457h-41.668c-5.9609 0-10.816-4.5938-11.352-10.418h36.352c9.7617 0 17.707-7.9453 17.707-17.707v-28.02c5.8242 0.53516 10.418 5.3906 10.418 11.352zm-16.668-21.875v38.543c0 6.3203-5.1406 11.457-11.457 11.457h-41.668c-6.3203 0-11.457-5.1406-11.457-11.457v-50c0-6.3203 5.1406-11.457 11.457-11.457h30.207v15.625c0 4.0195 3.2695 7.293 7.293 7.293h15.625zm-52.082-3.125c0 1.7266 1.3984 3.125 3.125 3.125h16.668c1.7266 0 3.125-1.3984 3.125-3.125s-1.3984-3.125-3.125-3.125h-16.668c-1.7266 0-3.125 1.3984-3.125 3.125zm39.582 33.332c0-1.7266-1.3984-3.125-3.125-3.125h-33.332c-1.7266 0-3.125 1.3984-3.125 3.125 0 1.7266 1.3984 3.125 3.125 3.125h33.332c1.7266 0 3.125-1.3984 3.125-3.125zm0-16.668c0-1.7266-1.3984-3.125-3.125-3.125l-33.332 0.003907c-1.7266 0-3.125 1.3984-3.125 3.125 0 1.7266 1.3984 3.125 3.125 3.125h33.332c1.7266 0 3.125-1.3984 3.125-3.125zm-3.125-19.793h13.793l-14.836-14.836v13.793c0 0.57422 0.46875 1.043 1.043 1.043z"/>
        </svg>
      </div>
         {/* <div className={styles.share}>
        -
      </div> */}
      </div>
   
      </div>
      
      <div className={styles.cardBottom}>
        <div className={styles.cardStats}>
        
      </div>
      </div>
    </div>
  );
}
