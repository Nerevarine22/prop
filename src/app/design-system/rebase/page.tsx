import type { Metadata } from 'next';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { GroundedHome } from './GroundedHome';

export const metadata: Metadata = {
  title: 'Grounded Dark · Design system lab',
  description: 'A rebase direction combining the original PropHub mood with the current card structure.',
  robots: { index: false, follow: false },
};

const featuredSlugs = ['propr', 'hyperpnl', 'solana-funded'];

export default function RebaseDirectionPage() {
  const firms = featuredSlugs
    .map((slug) => MOCK_PROP_FIRMS.find((firm) => firm.slug === slug))
    .filter((firm): firm is (typeof MOCK_PROP_FIRMS)[number] => Boolean(firm));

  return <GroundedHome firms={firms} />;
}
