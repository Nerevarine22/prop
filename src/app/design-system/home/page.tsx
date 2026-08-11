import type { Metadata } from 'next';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { HomePrototype } from './HomePrototype';

export const metadata: Metadata = {
  title: 'Home prototype · Design system lab',
  description: 'Private integrated homepage prototype for the PropHub design system.',
  robots: { index: false, follow: false },
};

const featuredSlugs = ['propr', 'hyperpnl', 'solana-funded'];

export default function HomePrototypePage() {
  const featuredFirms = featuredSlugs
    .map((slug) => MOCK_PROP_FIRMS.find((firm) => firm.slug === slug))
    .filter((firm): firm is (typeof MOCK_PROP_FIRMS)[number] => Boolean(firm));

  return <HomePrototype featuredFirms={featuredFirms} />;
}
