import React from 'react';
import "./globals.scss";
  import ClientProvider from './context/ClientProvider';

  export const metadata = {
    title: "Traq",
    description: "Minimal Traq app",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <ClientProvider>
            {children}
          </ClientProvider>
        </body>
      </html>
    );
  }
