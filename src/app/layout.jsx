import "./globals.scss";

export const metadata = {
  title: "Traq",
  description: "Minimal Traq app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
