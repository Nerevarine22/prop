import { Suspense } from 'react';
import { CompareExperience } from '@/components/product/CompareExperience';
import { getPublicFirmProfiles } from '@/lib/services/publicFirmProfileService';

export const revalidate = 300;

export default async function ComparePage() {
  const firms = await getPublicFirmProfiles();
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CompareExperience firms={firms} />
    </Suspense>
  );
}
