import type { Metadata } from 'next';
import { PublicHome } from '@/components/product/PublicHome';
import { getPublicFirmDirectoryItems, getPublishedFirmProfiles } from '@/lib/data/publicFirmRegistry';

export const metadata: Metadata = {
  title: 'On-chain prop firm research and comparison',
  description: 'Compare crypto-native prop firms by evaluation rules, on-chain evidence, trading conditions and reward programs.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [firms, directoryItems] = await Promise.all([getPublishedFirmProfiles(), getPublicFirmDirectoryItems()]);
  return <PublicHome firms={firms} directoryItems={directoryItems} />;
}
