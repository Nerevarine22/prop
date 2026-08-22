import type { Metadata } from 'next';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { SageHome } from './SageHome';

export const metadata: Metadata = {
  title: 'Sage field · Design system lab',
  description: 'A private PropHub direction exploring sage as the primary brand colour and grainy research surfaces.',
  robots: { index: false, follow: false },
};

const featuredSlugs = ['propr', 'hyperpnl', 'solana-funded'];

export default function SageDirectionPage() {
  const firms = featuredSlugs
    .map((slug) => MOCK_PROP_FIRMS.find((firm) => firm.slug === slug))
    .filter((firm): firm is (typeof MOCK_PROP_FIRMS)[number] => Boolean(firm));

  return <SageHome firms={firms} />;
}
