import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirmProfileExperience } from '@/components/product/FirmProfileExperience';
import { factText, profileWebsite, PUBLIC_FIRM_PROFILES } from '@/lib/data/publicFirmProfiles';
import { getPublicFirmProfile } from '@/lib/services/publicFirmProfileService';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/site';

type FirmPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return PUBLIC_FIRM_PROFILES.map((firm) => ({ slug: firm.slug }));
}

export async function generateMetadata({ params }: FirmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const firm = await getPublicFirmProfile(slug);

  if (!firm) {
    return { title: 'Prop firm not found', robots: { index: false, follow: false } };
  }

  return {
    title: `${firm.name} review, rules and rewards`,
    description: `Research profile for ${firm.name}: evaluation rules, profit split, drawdown, platforms and reward program status.`,
    alternates: { canonical: `/prop-firms/${firm.slug}` },
    openGraph: {
      type: 'article',
      title: `${firm.name} prop firm research profile`,
      description: `Compare ${firm.name} rules, trading conditions and rewards.`,
      url: `/prop-firms/${firm.slug}`,
    },
  };
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { slug } = await params;
  const firm = await getPublicFirmProfile(slug);

  if (!firm) notFound();

  return (
    <>
      <JsonLd
        id="prop-firm-profile-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${firm.name} prop firm research profile`,
          description: factText(firm.identity.description),
          url: `${siteConfig.url}/prop-firms/${firm.slug}`,
          dateModified: firm.checkedAt,
          mainEntity: {
            '@type': 'Organization',
            name: firm.name,
            url: profileWebsite(firm),
            description: factText(firm.identity.tagline),
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Prop firms', item: `${siteConfig.url}/prop-firms` },
              { '@type': 'ListItem', position: 2, name: firm.name, item: `${siteConfig.url}/prop-firms/${firm.slug}` },
            ],
          },
        }}
      />
      <FirmProfileExperience firm={firm} />
    </>
  );
}
