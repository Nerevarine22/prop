import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/site';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ['crypto prop firm', 'on-chain prop firm', 'prop firm comparison', 'crypto funded account', 'prop firm rewards'],
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body className="min-h-[100dvh] bg-[var(--color-canvas)] text-zinc-100 antialiased font-sans flex flex-col justify-between selection:bg-[#4f8cff]/35 selection:text-white">
        <a href="#main-content" className="skip-link">Skip to content</a>
        
        {/* Subtle Background Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-80" />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
