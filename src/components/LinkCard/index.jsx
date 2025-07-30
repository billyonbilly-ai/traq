import { useState, useMemo } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './index.module.scss';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--accent)', padding: '4px 8px', borderRadius: 4, fontSize: 12, color: 'var(--foreground)' }}>
        <div>{label}</div>
        <div style={{ fontWeight: 600 }}>{payload[0].value} visits</div>
      </div>
    );
  }
  return null;
}

export default function LinkCard({ customLink, redirectUrl, clicks = 0, visits = [] }) {
  // Helper function to split custom link into base and path
  const splitCustomLink = (link) => {
    if (!link) return { base: 'traq.site/', path: 'placeholder' };
    
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

  // Prepare chart data (visits per day)
  const chartData = useMemo(() => {
    if (!visits || visits.length === 0) return [];

    const counts = {};
    visits.forEach(v => {
      const ts = v.timestamp || v; // v could be object or ISO string
      const dayKey = new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD
      counts[dayKey] = (counts[dayKey] || 0) + 1;
    });

    const todayKey = new Date().toISOString().slice(0, 10);
    const formatLabel = (key) => {
      if (key === todayKey) return 'Today';
      const d = new Date(key);
      return d.toLocaleString('en-US', { month: 'short', day: 'numeric' }); // e.g., Aug 3
    };

    const data = Object.entries(counts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([k, count]) => ({ date: formatLabel(k), count }));
    // Keep only last 56 days (≈8 weeks)
    return data.slice(-56);
  }, [visits]);

  // Helper function to truncate redirect URL
  const truncateRedirectUrl = (url) => {
    if (!url) return 'www.unicode.org/charts/name...';
    
    const cleanUrl = url.replace(/^https?:\/\//, '');
    if (cleanUrl.length > 40) {
      return cleanUrl.slice(0, 40) + '...';
    }
    return cleanUrl;
  };

    const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const { base, path } = splitCustomLink(customLink);
  const truncatedRedirect = truncateRedirectUrl(redirectUrl);

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span><span className={styles.baseURL}>{base}</span><span className={styles.path}>{path}</span></span>
          <div className={styles.copyIconWrapper} title="Copy" role="button" aria-label="Copy" onClick={handleCopy}>
            {copied ? (
              <svg className={styles.copyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="9.7 21.1 80.5 60.9" width="15" height="11" fill="currentColor" aria-label="Copied">
                <path d="M35.9,75.5c0.9,0.9,2.2,1.5,3.5,1.5s2.6-0.5,3.5-1.5l40.8-40.8c2-2,2-5.1,0-7.1c-2-2-5.1-2-7.1,0L39.4,64.8L23.3,48.8   c-2-2-5.1-2-7.1,0c-2,2-2,5.1,0,7.1L35.9,75.5z"/>
              </svg>
            ) : (
              <svg className={styles.copyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="9.062702178955078 0 81.87520599365234 100.62470245361328" width="15" height="18.5" fill="currentColor" aria-label="Copy icon" vectorEffect="non-scaling-stroke">
                <path d="m79.547 15.625h-7.7578c-0.46094-2.6562-2.7812-4.6875-5.5703-4.6875h-7.375c-1.2969-3.6406-4.7734-6.25-8.8438-6.25s-7.5469 2.6094-8.8359 6.25h-7.375c-2.7891 0-5.1094 2.0312-5.5703 4.6875h-7.7578c-3.5312 0-6.3984 2.8672-6.3984 6.3906v66.906c0 3.5234 2.8672 6.3906 6.3906 6.3906h59.094c3.5234 0 6.3906-2.8672 6.3906-6.3906v-66.906c0-3.5234-2.8672-6.3906-6.3906-6.3906zm-45.172 1.5625h9.375c1.7266 0 3.125-1.3984 3.125-3.125s1.3984-3.125 3.125-3.125 3.125 1.3984 3.125 3.125 1.3984 3.125 3.125 3.125h9.375v6.25h-31.25zm45.312 71.734c0 0.078125-0.0625 0.14062-0.14062 0.14062h-59.094c-0.078125 0-0.14062-0.0625-0.14062-0.14062v-66.906c0-0.078125 0.0625-0.14062 0.14062-0.14062h7.6719v2.1484c0 3.125 2.5391 5.6641 5.6641 5.6641h32.43c3.125 0 5.6641-2.5391 5.6641-5.6641v-2.1484h7.6719c0.078124 0 0.14062 0.0625 0.14062 0.14062v66.906zm-6.25-12.359c0 1.7266-1.3984 3.125-3.125 3.125h-28.273c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h28.273c1.7266 0 3.125 1.3984 3.125 3.125zm0-17.188c0 1.7266-1.3984 3.125-3.125 3.125h-28.273c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h28.273c1.7266 0 3.125 1.3984 3.125 3.125zm0-17.188c0 1.7266-1.3984 3.125-3.125 3.125h-28.273c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h28.273c1.7266 0 3.125 1.3984 3.125 3.125zm-39.062 34.375c0 1.7266-1.3984 3.125-3.125 3.125h-1.5625c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h1.5625c1.7266 0 3.125 1.3984 3.125 3.125zm0-17.188c0 1.7266-1.3984 3.125-3.125 3.125h-1.5625c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h1.5625c1.7266 0 3.125 1.3984 3.125 3.125zm0-17.188c0 1.7266-1.3984 3.125-3.125 3.125h-1.5625c-1.7266 0-3.125-1.3984-3.125-3.125s1.3984-3.125 3.125-3.125h1.5625c1.7266 0 3.125 1.3984 3.125 3.125z"/>
            </svg>
            )} 
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
          {(chartData.length > 0) ? (
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 2 }}>
                <XAxis dataKey="date" hide tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 'dataMax']} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="count" stroke="none" fill="#a855f7" fillOpacity={0.2} />
                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={[{ date: ' ', count: 0 }, { date: ' ', count: 0 }]} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[0, 1]} />
                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.cardSummary}>
          <div className={styles.clickCount}>
            <span className={styles.counter}>{clicks}</span>
            <span>visitors</span>
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
