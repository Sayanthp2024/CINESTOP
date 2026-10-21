import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import CineBot from '@/components/CineBot';

export const metadata: Metadata = {
  title: 'CineStop - Toxic Pop Cinema',
  description: 'The Rebellious Underground Movie Magazine & Cinema Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome CDN for Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          {/* Main Content */}
          <main id="mainContent">{children}</main>
          {/* Floating AI Movie Suggestion Bot */}
          <CineBot />
        </Providers>
      </body>
    </html>
  );
}
