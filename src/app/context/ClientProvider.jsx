'use client';
import { SessionProvider } from "next-auth/react";
import { TrackedLinksProvider } from './TrackedLinksContext';
 
export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <TrackedLinksProvider>
        {children}
      </TrackedLinksProvider>
    </SessionProvider>
  );
} 