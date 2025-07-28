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
    if (cleanUrl.length > 31) {
      return cleanUrl.slice(0, 31) + '...';
    }
    return cleanUrl;
  };

  const { base, path } = splitCustomLink(customLink);
  const truncatedRedirect = truncateRedirectUrl(redirectUrl);

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><span className={styles.baseURL}>{base}</span><span className={styles.path}>{path}</span></span>
          <div className={styles.copyIconWrapper} title="Copy" role="button" aria-label="Copy">
            <svg className={styles.copyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="17.8 6.16 64.41 87.69" width="14.5" height="14.5" fill="currentColor" aria-label="Copy icon">
            
            <path fillRule="evenodd" clipRule="evenodd" d="M64.378,15.621h10.595c3.981,0,7.233,3.259,7.233,7.233v63.758c0,3.981-3.26,7.233-7.233,7.233H25.027  c-3.98,0-7.232-3.259-7.232-7.233V22.854c0-3.981,3.259-7.233,7.232-7.233h10.594c0-3.377,1.48-2.776,5.938-2.776  c2.021-8.919,14.859-8.919,16.88,0C62.899,12.844,64.378,12.243,64.378,15.621L64.378,15.621z M34.479,73.122H65.52  c2.528,0,2.528-3.84,0-3.84H34.479C31.952,69.282,31.952,73.122,34.479,73.122L34.479,73.122z M34.479,59.473H65.52  c2.528,0,2.528-3.84,0-3.84H34.479C31.952,55.633,31.952,59.473,34.479,59.473L34.479,59.473z M34.479,45.824H65.52  c2.528,0,2.528-3.84,0-3.84H34.479C31.952,41.984,31.952,45.824,34.479,45.824L34.479,45.824z M35.622,19.461H25.027  c-1.882,0-3.393,1.541-3.393,3.393v63.758c0,1.875,1.537,3.393,3.393,3.393h49.945c1.881,0,3.393-1.542,3.393-3.393V22.854  c0-1.875-1.537-3.393-3.393-3.393H64.378c0,2.459,0.575,5.641-1.92,5.641H37.542C35.047,25.102,35.622,21.92,35.622,19.461  L35.622,19.461z M43.266,16.684h-3.804v4.578h21.077v-4.578c-2.512,0-5.724,0.584-5.724-1.92c0-4.276-5.194-6.429-8.219-3.404  c-0.871,0.871-1.41,2.075-1.41,3.404C45.186,15.824,44.326,16.684,43.266,16.684z"/>
            </svg>
          
          
        </div>
      </div>

      <div className={styles.cardRedirect}>
          <span className={styles.arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 8.67 100 82.37" width="11" height="10" fill="#999" aria-label="Forward arrow icon">
              <path d="M97.64,44.1,64.72,11.18a8.06,8.06,0,1,0-11.4,11.39L72.78,42H8.06a8.06,8.06,0,0,0,0,16.12H72.6L53.32,77.43a8.06,8.06,0,0,0,11.4,11.39L97.64,55.9A8,8,0,0,0,100,50.2a1.27,1.27,0,0,0,0-.2,1.41,1.41,0,0,0,0-.2A8.07,8.07,0,0,0,97.64,44.1Z"/>
            </svg>
          </span>
          <span className={styles.redirectSite}>{truncatedRedirect}</span>
      </div>
      </div>
      
      <div className={styles.cardBottom}>
      
        <div className={styles.cardChart}>
        chart goes in here
      </div>
         <div className={styles.cardSummary}>
           <div className={styles.clickCount}>
           
              <span className={styles.counter}>
                0
              </span>
               <span>
                visitors  
              </span>
            
      </div>
       <div className={styles.viewAnalytics}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="13.06 17.76 73.88 64.49" width="14" height="14" fill="currentColor" aria-label="Analytics icon">
              <path d="m28.664 46.289c-3.4258-0.92578-7.0469-0.92578-10.469 0-2.6406 0.71094-4.5391 3.0234-4.7266 5.75-0.53906 7.8828-0.53906 15.879 0 23.758 0.1875 2.7266 2.0859 5.0391 4.7266 5.75 1.7109 0.46094 3.4766 0.69141 5.2344 0.69141 1.7617 0 3.5234-0.23047 5.2344-0.69141 2.6406-0.71094 4.5391-3.0234 4.7266-5.75 0.53906-7.8828 0.53906-15.879 0-23.758-0.1875-2.7266-2.0859-5.0352-4.7266-5.75zm-0.14453 29.18c-0.046875 0.64844-0.49609 1.2031-1.125 1.3711-2.5938 0.69922-5.3359 0.69922-7.9297 0-0.62891-0.17188-1.082-0.71875-1.125-1.3711-0.52344-7.6602-0.52344-15.43 0-23.094 0.046875-0.64844 0.49609-1.2031 1.125-1.3711 2.5938-0.69922 5.3359-0.69922 7.9297 0 0.62891 0.17188 1.082 0.71875 1.125 1.3711 0.52734 7.6641 0.52734 15.43 0 23.094z"/>
              <path d="m55.977 19.18c-3.7383-1.8984-8.1992-1.8984-11.938 0-2.3125 1.1758-3.8125 3.5195-3.9062 6.1094-0.59766 16.395-0.59766 33.02 0 49.414 0.09375 2.5938 1.5938 4.9375 3.9062 6.1094 1.8672 0.94922 3.918 1.4219 5.9688 1.4219 2.0508 0 4.1016-0.47656 5.9688-1.4219 2.3125-1.1758 3.8125-3.5195 3.9062-6.1094 0.59766-16.395 0.59766-33.02 0-49.414-0.09375-2.5898-1.5898-4.9297-3.9062-6.1094zm-0.96875 55.352c-0.03125 0.82031-0.50391 1.5625-1.2344 1.9375-2.3516 1.1953-5.1641 1.1953-7.5156 0-0.73437-0.375-1.207-1.1133-1.2344-1.9375-0.59375-16.277-0.59375-32.781 0-49.059 0.03125-0.82031 0.50391-1.5625 1.2344-1.9375 2.3516-1.1953 5.1641-1.1953 7.5156 0 0.73437 0.375 1.207 1.1133 1.2344 1.9375 0.58984 16.277 0.58984 32.777 0 49.059z"/>
              <path d="m81.883 32.82c-3.4102-1.3164-7.1641-1.3164-10.578 0-2.6797 1.0312-4.4961 3.5547-4.6328 6.418-0.56641 11.812-0.56641 23.789 0 35.602 0.13672 2.8672 1.9531 5.3867 4.6328 6.418 1.7031 0.65625 3.4961 0.98438 5.2891 0.98438s3.5859-0.32813 5.2891-0.98438c2.6797-1.0312 4.4961-3.5547 4.6328-6.418 0.56641-11.812 0.56641-23.789 0-35.602-0.13672-2.8633-1.9531-5.3867-4.6328-6.418zm-0.24219 41.789c-0.046875 0.9375-0.64062 1.7578-1.5156 2.0977-2.2773 0.87891-4.7812 0.87891-7.0625 0-0.875-0.33594-1.4688-1.1641-1.5156-2.0977-0.55859-11.656-0.55859-23.477 0-35.133 0.046875-0.9375 0.64062-1.7578 1.5156-2.0977 1.1406-0.4375 2.3359-0.65625 3.5312-0.65625s2.3906 0.21875 3.5312 0.65625c0.875 0.33594 1.4688 1.1641 1.5156 2.0977 0.55469 11.656 0.55469 23.477 0 35.133z"/>
            </svg>
            <span>View analytics</span>
      </div>
        
      </div>
      </div>
    </div>
  );
}
