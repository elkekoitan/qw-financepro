import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/providers';
import { initMonitoring } from '@/utils/monitoring';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Monitoring'i başlat
if (typeof window !== 'undefined') {
  initMonitoring();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
} 