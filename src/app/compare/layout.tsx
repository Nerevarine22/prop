import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare crypto prop firms',
  description: 'Compare crypto prop firms side by side across evaluation rules, drawdown, leverage, platforms and rewards.',
  alternates: { canonical: '/compare' },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
