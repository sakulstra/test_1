import { Inter } from 'next/font/google';
import React from 'react';

import AppLayout from '../src/ui/layouts/AppLayout';
import ThemeRegistry from '../src/ui/utils/ThemeRegistry';

export const interNextFont = Inter({
  weight: ['300', '400', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ThemeRegistry options={{ key: 'mui' }}>
          <AppLayout>{children}</AppLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
