import type { Metadata } from 'next';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { CardStressTest } from './CardStressTest';

export const metadata: Metadata = {
  title: 'Card stress test · Design system lab',
  description: 'Private logo and card stress test for the PropHub design system.',
  robots: { index: false, follow: false },
};

const preferredOrder = [
  'propr',
  'hyperpnl',
  'solana-funded',
  'foxify',
  'chainfunded',
  'polyquid',
];

export default function CardStressTestPage() {
  const firms = preferredOrder
    .map((slug) => MOCK_PROP_FIRMS.find((firm) => firm.slug === slug))
    .filter((firm): firm is (typeof MOCK_PROP_FIRMS)[number] => Boolean(firm));

  return <CardStressTest firms={firms} />;
}
