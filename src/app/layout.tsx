import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'PropHub — Real-Time Transparency & Crypto Prop Directory',
  description: 'The CoinMarketCap for crypto prop firms. Track verified payouts, 95% profit splits, 1:100 leverage, and real-time pass rates.',
  keywords: ['crypto prop firm', 'prop trading crypto', 'crypto funded account', 'fundingpips', 'bybit prop', 'bitcoin prop firm'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body className="min-h-[100dvh] bg-[#090909] text-zinc-100 antialiased font-sans flex flex-col justify-between selection:bg-sky-500/30 selection:text-sky-200">
        
        {/* Subtle Background Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-80" />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
