import './globals.css';
import * as React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Red_Hat_Text } from 'next/font/google';

const redHat = Red_Hat_Text({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Event Ticketing System',
  description: 'Book tickets for events with QR code verification',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={redHat.variable}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
