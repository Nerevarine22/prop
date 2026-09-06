'use client';

import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { useComparisonSelection, type ComparisonSelectionItem } from '@/hooks/useComparisonSelection';
import styles from './ComparisonTray.module.css';

export function ComparisonTray({ items }: { items: ComparisonSelectionItem[] }) {
  const { remove } = useComparisonSelection();
  if (!items.length) return null;

  const compareHref = `/compare?ids=${items.map((item) => item.id).join(',')}`;

  return (
    <div className={styles.tray} aria-live="polite">
      <div className={styles.firms}>
        {items.map((firm) => (
          <div className={styles.firm} key={firm.id}>
            <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.logo} fallbackClassName={styles.fallback} />
            <span>{firm.name}</span>
            <button type="button" onClick={() => remove(firm.id)} aria-label={`Remove ${firm.name} from comparison`} title="Remove from comparison"><X /></button>
          </div>
        ))}
      </div>
      <p>{items.length}/3 selected</p>
      <Link href={compareHref}>Compare firms <ArrowRight /></Link>
    </div>
  );
}
