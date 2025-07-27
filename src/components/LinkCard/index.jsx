import styles from './index.module.scss';

export default function LinkCard({ customLink, redirectUrl }) {
  // Helper function to split custom link into base and path
  const splitCustomLink = (link) => {
    if (!link) return { base: 'traq.site/', path: 'thegiftofdreamingtwo' };
    
    // Remove protocol if present
    const cleanLink = link.replace(/^https?:\/\//, '');
    const slashIndex = cleanLink.indexOf('/');
    
    if (slashIndex === -1) {
      return { base: cleanLink, path: '' };
    }
    
    return {
      base: cleanLink.slice(0, slashIndex + 1),
      path: cleanLink.slice(slashIndex + 1)
    };
  };

  // Helper function to truncate redirect URL
  const truncateRedirectUrl = (url) => {
    if (!url) return 'www.unicode.org/charts/name...';
    
    const cleanUrl = url.replace(/^https?:\/\//, '');
    if (cleanUrl.length > 27) {
      return cleanUrl.slice(0, 27) + '...';
    }
    return cleanUrl;
  };

  const { base, path } = splitCustomLink(customLink);
  const truncatedRedirect = truncateRedirectUrl(redirectUrl);

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLink} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className={styles.linkIconCircle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 90 90" width="12px" height="12px">
              <g>
                <g>
                  <path fill="var(--background)" d="M75.394,58.138l12.673-12.675c9.245-9.243,9.245-24.286,0-33.529c-9.244-9.246-24.286-9.246-33.53,0L36.248,30.223    c-9.245,9.243-9.245,24.286,0,33.529c1.365,1.366,2.859,2.524,4.44,3.486l9.791-9.792c-1.865-0.446-3.634-1.387-5.086-2.838    c-4.202-4.202-4.202-11.04,0-15.241l18.289-18.289c4.202-4.202,11.04-4.202,15.241,0c4.202,4.202,4.202,11.039,0,15.241    l-5.373,5.374C75.764,46.904,76.376,52.635,75.394,58.138z"/>
                </g>
                <g>
                  <path fill="var(--background)" d="M24.607,41.862L11.934,54.536c-9.246,9.244-9.246,24.286,0,33.53c9.243,9.245,24.286,9.245,33.53,0l18.288-18.289    c9.245-9.244,9.244-24.286,0-33.529c-1.364-1.366-2.858-2.524-4.439-3.486l-9.791,9.792c1.864,0.447,3.633,1.386,5.086,2.838    c4.202,4.202,4.202,11.039,0,15.241l-18.29,18.289c-4.202,4.202-11.039,4.202-15.241,0c-4.202-4.202-4.202-11.039,0-15.241    l5.374-5.373C24.236,53.097,23.624,47.365,24.607,41.862z"/>
                </g>
              </g>
            </svg>
          </span>
          <span><span className={styles.baseURL}>{base}</span><span className={styles.path}>{path}</span></span>
        </div>
        

     <div className={styles.cardRedirect}>
          <span className={styles.arrow}>➥</span>
          <span className={styles.redirectSite}>{truncatedRedirect}</span>
      </div>
      </div>
      
      <div className={styles.cardBottom}>
      
        <div className={styles.cardStats}>
        
      </div>
      </div>
    </div>
  );
}
