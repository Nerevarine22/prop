'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, GitCompareArrows, Plus, X } from 'lucide-react';
import { ComparisonTray } from './ComparisonTray';
import { useComparisonSelection, type ComparisonSelectionItem } from '@/hooks/useComparisonSelection';
import styles from './ProfileCompareControl.module.css';

export function ProfileCompareButton({ firm }: { firm: ComparisonSelectionItem }) {
  const { items, selectedIds, add, remove } = useComparisonSelection();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = selectedIds.includes(firm.id);
  const immediateItems = selected ? items : [...items, firm].slice(-3);
  const compareHref = `/compare?ids=${immediateItems.map((item) => item.id).join(',')}`;

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <div className={styles.control} ref={rootRef}>
      <button className={styles.trigger} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <GitCompareArrows /> Compare <span>{open ? <X /> : <Plus />}</span>
      </button>
      {open && (
        <div className={styles.menu}>
          <button type="button" onClick={() => selected ? remove(firm.id) : add(firm)}>
            {selected ? <Check /> : <Plus />}
            <span><strong>{selected ? 'Added to comparison' : 'Add to comparison'}</strong><small>{selected ? 'Click to remove this firm' : 'Stay on this profile'}</small></span>
          </button>
          <Link href={compareHref} onClick={() => { if (!selected) add(firm); }}>
            <ArrowRight />
            <span><strong>Compare now</strong><small>Open the comparison workspace</small></span>
          </Link>
        </div>
      )}
    </div>
  );
}

export function ProfileComparisonTray() {
  const { items } = useComparisonSelection();
  return <ComparisonTray items={items} />;
}

