'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { ComparisonSelectionItem } from '@/hooks/useComparisonSelection';
import styles from './ComparisonTray.module.css';

export function ComparisonTray({ items }: { items: ComparisonSelectionItem[] }) {
  if (!items.length) return null;

  const compareHref = `/compare?ids=${items.map((item) => item.id).join(',')}`;

  return (
    <div className={styles.tray} aria-live="polite">
      <div className={styles.firms}>
        {items.map((firm) => (
          <span key={firm.id}>
            <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.logo} fallbackClassName={styles.fallback} />
            {firm.name}
          </span>
        ))}
      </div>
      <p>{items.length}/3 selected</p>
      <Link href={compareHref}>Compare firms <ArrowRight /></Link>
    </div>
  );
}

