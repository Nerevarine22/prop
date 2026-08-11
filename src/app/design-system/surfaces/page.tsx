import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { SurfaceDirections } from './SurfaceDirections';

export const metadata: Metadata = {
  title: 'Surface directions · Design system lab',
  description: 'Focused comparison of filters and card surfaces for PropHub.',
  robots: { index: false, follow: false },
};

export default function SurfaceDirectionsPage() {
  const firm = MOCK_PROP_FIRMS.find((item) => item.slug === 'propr');
  if (!firm) notFound();

  return <SurfaceDirections firm={firm} />;
}
