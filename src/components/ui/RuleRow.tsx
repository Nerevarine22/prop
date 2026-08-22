import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function RuleRow({
  label,
  value,
  description,
  emphasis = false,
}: {
  label: string;
  value: ReactNode;
  description?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-1 border-b border-[var(--color-border-soft)] py-4 last:border-b-0">
      <strong className="text-sm text-[var(--color-text)]">{label}</strong>
      <span className={cn('data-number text-sm font-bold', emphasis ? 'text-[var(--color-accent-soft)]' : 'text-[var(--color-text)]')}>
        {value}
      </span>
      {description && <p className="col-span-2 m-0 text-xs leading-relaxed text-[var(--color-text-muted)]">{description}</p>}
    </div>
  );
}
