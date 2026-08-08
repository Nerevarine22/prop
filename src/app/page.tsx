import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home/HomePageClient';

export const metadata: Metadata = {
  title: 'On-chain prop firm research and comparison',
  description: 'Compare crypto-native prop firms by evaluation rules, on-chain evidence, trading conditions and reward programs.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <HomePageClient />;
}
