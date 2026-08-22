import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function TextInput({
  label,
  icon,
  endAdornment,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
}) {
  return (
    <label className={cn('grid min-w-0 gap-2 text-xs font-semibold text-[var(--color-text-secondary)]', className)}>
      {label && <span>{label}</span>}
      <span className="flex min-h-12 items-center gap-2.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-canvas)] px-3.5 transition-colors focus-within:border-[var(--color-accent-soft)]">
        {icon && <span className="flex shrink-0 text-[var(--color-text-muted)] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-disabled)]"
          {...props}
        />
        {endAdornment}
      </span>
    </label>
  );
}
