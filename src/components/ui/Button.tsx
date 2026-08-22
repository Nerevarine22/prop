import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-hover)]',
  secondary: 'border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]',
  quiet: 'border-transparent bg-transparent text-[var(--color-accent-soft)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-tint)]',
  danger: 'border-[var(--color-danger)] bg-[var(--color-danger)] text-white hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-11 px-4 text-[13px]',
  lg: 'min-h-12 px-5 text-sm',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border font-bold transition-[background-color,border-color,color,transform] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-soft)] disabled:pointer-events-none disabled:border-[var(--color-border-soft)] disabled:bg-[var(--color-surface-raised)] disabled:text-[var(--color-text-disabled)]',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
