import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirmProfileClient } from '@/components/firms/FirmProfileClient';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';

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

  return <FirmProfileClient firm={firm} />;
}
