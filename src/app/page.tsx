import type { Metadata } from 'next';
import { PublicHome } from '@/components/product/PublicHome';
import { getPublicFirmProfiles } from '@/lib/services/publicFirmProfileService';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'On-chain prop firm research and comparison',
  description: 'Compare crypto-native prop firms by evaluation rules, on-chain evidence, trading conditions and reward programs.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  return <PublicHome firms={await getPublicFirmProfiles()} />;
}
