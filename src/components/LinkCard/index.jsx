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
        <div className={styles.cardLink} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 90 90" width="12px" height="12px" fill="currentColor">
            <g>
              <g>
                <path d="M75.394,58.138l12.673-12.675c9.245-9.243,9.245-24.286,0-33.529c-9.244-9.246-24.286-9.246-33.53,0L36.248,30.223    c-9.245,9.243-9.245,24.286,0,33.529c1.365,1.366,2.859,2.524,4.44,3.486l9.791-9.792c-1.865-0.446-3.634-1.387-5.086-2.838    c-4.202-4.202-4.202-11.04,0-15.241l18.289-18.289c4.202-4.202,11.04-4.202,15.241,0c4.202,4.202,4.202,11.039,0,15.241    l-5.373,5.374C75.764,46.904,76.376,52.635,75.394,58.138z"/>
              </g>
              <g>
                <path d="M24.607,41.862L11.934,54.536c-9.246,9.244-9.246,24.286,0,33.53c9.243,9.245,24.286,9.245,33.53,0l18.288-18.289    c9.245-9.244,9.244-24.286,0-33.529c-1.364-1.366-2.858-2.524-4.439-3.486l-9.791,9.792c1.864,0.447,3.633,1.386,5.086,2.838    c4.202,4.202,4.202,11.039,0,15.241l-18.29,18.289c-4.202,4.202-11.039,4.202-15.241,0c-4.202-4.202-4.202-11.039,0-15.241    l5.374-5.373C24.236,53.097,23.624,47.365,24.607,41.862z"/>
              </g>
            </g>
          </svg>

          <span><span className={styles.baseURL}>localhost:3000/</span><span className={styles.path}></span>thegiftofdreamingtwo</span>
        </div>
        

     <div className={styles.cardRedirect}>
          <span className={styles.arrow}>Redirects to: </span>
          <span className={styles.redirectSite}>spotify.com/thegiftofdreami...</span>
      </div>
      </div>
      
      <div className={styles.cardBottom}>
      
        <div className={styles.cardStats}>
        
      </div>
      </div>
    </div>
  );
}
