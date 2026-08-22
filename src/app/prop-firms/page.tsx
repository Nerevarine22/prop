import type { Metadata } from 'next';
import { FirmDirectory } from '@/components/product/FirmDirectory';
import { JsonLd } from '@/components/seo/JsonLd';
import { getPublicFirmProfiles } from '@/lib/services/publicFirmProfileService';
import { siteConfig } from '@/lib/site';

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
  const initialStep = ['evaluation', 'instant-funding', 'collateralized', 'competition', 'progression', 'other'].includes(step ?? '') ? step : 'All';
  const firms = await getPublicFirmProfiles();

  return (
    <>
      <JsonLd
        id="prop-firm-directory-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'On-chain prop firm directory',
          itemListElement: firms.map((firm, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: firm.name,
            url: `${siteConfig.url}/prop-firms/${firm.slug}`,
          })),
        }}
      />
      <FirmDirectory firms={firms} initialStep={initialStep} initialSearch={platform ?? ''} />
    </>
  );
}
