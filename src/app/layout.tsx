import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'LandGuard AI — Tamil Nadu Land Document Reconciliation',
  description:
    'AI-assisted land document intake, cross-document reconciliation and spatial review.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}