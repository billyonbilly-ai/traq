'use client';
import React, { createContext, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';

const TrackedLinksContext = createContext();

export function TrackedLinksProvider({ children }) {
  const [trackedLinks, setTrackedLinks] = useState([]);

  // Add a new tracked link (persist to DB via API)
  const addTrackedLink = async (customLink, redirectUrl) => {
    try {
      const res = await fetch('/api/links', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customLink, redirectUrl })
      });
      if (res.ok) {
        const saved = await res.json();
        setTrackedLinks(prev => [...prev, saved]);
      }
    } catch (e) {
      console.error('Failed to save link', e);
    }
  };

  // Optional removal helper (DB deletion not yet implemented)
  const removeTrackedLink = id => {
    setTrackedLinks(prev => prev.filter(l => l._id !== id));
  };

  // Load existing links for this user when session is available
  const { data: session } = useSession();
  React.useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        const res = await fetch('/api/links', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setTrackedLinks(data);
        }
      } catch (e) {
        console.error('Failed to load links', e);
      }
    })();
  }, [session]);

  return (
    <TrackedLinksContext.Provider value={{ trackedLinks, addTrackedLink, removeTrackedLink }}>
      {children}
    </TrackedLinksContext.Provider>
  );
}

export function useTrackedLinks() {
  const ctx = useContext(TrackedLinksContext);
  if (!ctx) throw new Error('useTrackedLinks must be used within a TrackedLinksProvider');
  return ctx;
}
