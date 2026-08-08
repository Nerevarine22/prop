import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home/HomePageClient';

export const metadata: Metadata = {
  title: 'Crypto prop firm directory',
  description: 'Browse and compare crypto prop firms by evaluation model, profit split, drawdown, platform and reward programs.',
  alternates: { canonical: '/prop-firms' },
};

type PropFirmsPageProps = {
  searchParams: Promise<{ step?: string; platform?: string }>;
};

export default async function PropFirmsPage({ searchParams }: PropFirmsPageProps) {
  const { step, platform } = await searchParams;
  const initialStep = ['1-Step', '2-Step', 'Instant Funding'].includes(step ?? '') ? step : 'all';

  return (
    <HomePageClient
      mode="directory"
      initialStep={initialStep}
      initialSearch={platform ?? ''}
    />
  );
}
