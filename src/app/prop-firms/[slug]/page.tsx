import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirmProfileExperience } from '@/components/product/FirmProfileExperience';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/site';

type FirmPageProps = {
  params: Promise<{ slug: string }>;
};

function getFirm(slug: string) {
  return MOCK_PROP_FIRMS.find((firm) => firm.slug === slug);
}

export function generateStaticParams() {
  return MOCK_PROP_FIRMS.map((firm) => ({ slug: firm.slug }));
}

export async function generateMetadata({ params }: FirmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const firm = getFirm(slug);

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
  const firm = getFirm(slug);

  if (!firm) notFound();

  return (
    <>
      <JsonLd
        id="prop-firm-profile-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${firm.name} prop firm research profile`,
          description: firm.description,
          url: `${siteConfig.url}/prop-firms/${firm.slug}`,
          dateModified: firm.lastReviewedAt,
          mainEntity: {
            '@type': 'Organization',
            name: firm.name,
            url: firm.website,
            description: firm.tagline,
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
