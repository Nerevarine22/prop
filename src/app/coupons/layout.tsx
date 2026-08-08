import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prop firm coupon research',
  description: 'Track prop firm coupon and promotion records with clear verification status and source history.',
  alternates: { canonical: '/coupons' },
  robots: { index: false, follow: true },
};

export default function CouponsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
