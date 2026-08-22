import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'positive' | 'warning' | 'danger';

const tones: Record<BadgeTone, string> = {
  neutral: 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]',
  accent: 'border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-soft)]',
  info: 'border-[color-mix(in_srgb,var(--color-info)_35%,transparent)] bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  positive: 'border-[color-mix(in_srgb,var(--color-positive)_35%,transparent)] bg-[var(--color-positive-subtle)] text-[var(--color-positive)]',
  warning: 'border-[color-mix(in_srgb,var(--color-warning)_35%,transparent)] bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  danger: 'border-[color-mix(in_srgb,var(--color-danger)_35%,transparent)] bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
};

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn('inline-flex min-h-6 items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold leading-none', tones[tone], className)}
      {...props}
    />
  );
}
