import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Metric({
  label,
  value,
  note,
  icon,
  accent = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={cn('grid min-w-0 content-start gap-1.5', className)} {...props}>
      <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <strong className={cn('data-number text-2xl font-bold tracking-[-0.035em]', accent ? 'text-[var(--color-accent-soft)]' : 'text-[var(--color-text)]')}>
        {value}
      </strong>
      {note && <small className="text-[11px] text-[var(--color-text-secondary)]">{note}</small>}
    </div>
  );
}
