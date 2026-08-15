import { Suspense } from 'react';
import { CompareExperience } from '@/components/product/CompareExperience';
import { getPublishedFirmProfiles } from '@/lib/data/publicFirmRegistry';

export default async function ComparePage() {
  const firms = await getPublishedFirmProfiles();

  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CompareExperience firms={firms} />
    </Suspense>
  );
}
