import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SelectField({
  label,
  icon,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <label className={cn('grid min-w-0 gap-2 text-xs font-semibold text-[var(--color-text-secondary)]', className)}>
      {label && <span>{label}</span>}
      <span className="relative flex min-h-12 items-center gap-2.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-canvas)] px-3.5 transition-colors focus-within:border-[var(--color-accent-soft)]">
        {icon && <span className="flex shrink-0 text-[var(--color-text-muted)] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        <select
          className="min-w-0 flex-1 appearance-none bg-transparent pr-6 text-sm font-semibold text-[var(--color-text)] outline-none"
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
      </span>
    </label>
  );
}
