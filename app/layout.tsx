import './globals.css';
import * as React from 'react';
import { AuthProvider } from '../components/AuthProvider';

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
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
