import { BadgeCheck, Database, FileSearch } from 'lucide-react';
import { DataStatus } from '@/types/firm';

const STATUS_COPY: Record<DataStatus, { label: string; description: string }> = {
  mock: {
    label: 'Demo data',
    description: 'Sample content for product development. Not independently verified.',
  },
  reported: {
    label: 'Reported',
    description: 'Published by a firm or community source and linked to its origin.',
  },
  verified: {
    label: 'Verified',
    description: 'Checked against primary documentation or inspectable on-chain evidence.',
  },
};

export function DataStatusBadge({ status, compact = false, surface = 'dark', className = '' }: { status: DataStatus; compact?: boolean; surface?: 'dark' | 'light'; className?: string }) {
  const copy = STATUS_COPY[status];
  const Icon = status === 'verified' ? BadgeCheck : status === 'reported' ? FileSearch : Database;
  const color = surface === 'light'
    ? status === 'verified'
      ? 'border-emerald-800/15 bg-emerald-700/10 text-emerald-800'
      : status === 'reported'
        ? 'border-sky-800/15 bg-sky-700/10 text-sky-800'
        : 'border-amber-800/15 bg-amber-600/15 text-amber-800'
    : status === 'verified'
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
      : status === 'reported'
        ? 'border-sky-500/25 bg-sky-500/10 text-sky-300'
        : 'border-amber-500/25 bg-amber-500/10 text-amber-300';

  return (
    <span
      title={copy.description}
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold ${color} ${compact ? 'p-1' : 'px-2 py-1 text-[10px]'} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {!compact && copy.label}
    </span>
  );
}
