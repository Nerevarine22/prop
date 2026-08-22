import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transparency data prototype',
  description: 'A development prototype for future on-chain payout evidence, data provenance and prop firm verification.',
  alternates: { canonical: '/transparency' },
  robots: { index: false, follow: true },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
