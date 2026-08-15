import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirmProfileExperience } from '@/components/product/FirmProfileExperience';
import { PartialFirmProfileExperience } from '@/components/product/PartialFirmProfileExperience';
import { getPublicFirmRecordBySlug } from '@/lib/data/publicFirmRegistry';
import { hasPrimaryResearch, hasResearchProfile } from '@/types/database';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/site';

type FirmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: FirmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await getPublicFirmRecordBySlug(slug);

  if (!record) {
    return { title: 'Prop firm not found', robots: { index: false, follow: false } };
  }

  const firm = hasResearchProfile(record) ? { ...record.profile, logo: record.brandAssets?.logoPath || record.profile.logo } : undefined;

  return {
    title: firm ? `${record.name} review, rules and rewards` : `${record.name} primary research notes`,
    description: firm ? `Research profile for ${record.name}: evaluation rules, profit split, drawdown, platforms and reward program status.` : `Primary-source research notes for ${record.name}, including rules, pricing, payouts and unresolved data gaps.`,
    alternates: { canonical: `/prop-firms/${record.slug}` },
    openGraph: {
      type: 'article',
      title: `${record.name} prop firm research profile`,
      description: firm ? `Compare ${record.name} rules, trading conditions and rewards.` : `Inspect the available primary-source research for ${record.name}.`,
      url: `/prop-firms/${record.slug}`,
    },
  };
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { slug } = await params;
  const record = await getPublicFirmRecordBySlug(slug);

  if (!record) notFound();

  const firm = hasResearchProfile(record) ? { ...record.profile, logo: record.brandAssets?.logoPath || record.profile.logo } : undefined;
  const description = firm?.description || `Primary-source research notes for ${record.name}.`;
  const officialWebsite = firm?.website || record.primaryResearch?.observations.find((observation) => observation.field === 'officialWebsite' && observation.status !== 'ND')?.value || record.links.officialWebsite;

  return (
    <>
      <JsonLd
        id="prop-firm-profile-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${record.name} prop firm research profile`,
          description,
          url: `${siteConfig.url}/prop-firms/${record.slug}`,
          dateModified: record.updatedAt,
          mainEntity: {
            '@type': 'Organization',
            name: record.name,
            url: officialWebsite,
            description,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Prop firms', item: `${siteConfig.url}/prop-firms` },
              { '@type': 'ListItem', position: 2, name: record.name, item: `${siteConfig.url}/prop-firms/${record.slug}` },
            ],
          },
        }}
      />
      {firm ? <FirmProfileExperience firm={firm} /> : hasPrimaryResearch(record) ? <PartialFirmProfileExperience record={record} /> : notFound()}
    </>
  );
}
