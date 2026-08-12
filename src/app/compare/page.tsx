import { Suspense } from 'react';
import { CompareExperience } from '@/components/product/CompareExperience';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CompareExperience />
    </Suspense>
  );
}
