import type { PropFirm } from '@/types/firm';

export const compareRows: Array<{
  label: string;
  value: (firm: PropFirm) => string;
  emphasis?: boolean;
}> = [
  { label: 'Challenge from', value: (firm) => `$${firm.accountTiers[0]?.price ?? '—'}`, emphasis: true },
  { label: 'Evaluation', value: (firm) => firm.evaluationSteps.join(' / ') },
  { label: 'Profit target', value: (firm) => firm.profitTarget },
  { label: 'Maximum drawdown', value: (firm) => firm.maxDrawdown, emphasis: true },
  { label: 'Daily drawdown', value: (firm) => firm.dailyDrawdown },
  { label: 'Profit split', value: (firm) => firm.profitSplit, emphasis: true },
  { label: 'Payout schedule', value: (firm) => firm.payoutFrequency },
  { label: 'Platforms', value: (firm) => firm.platforms.join(', ') },
  { label: 'Weekend holding', value: (firm) => firm.weekendHoldingAllowed ? 'Allowed' : 'Restricted' },
  { label: 'News trading', value: (firm) => firm.newsTradingAllowed ? 'Allowed' : 'Restricted' },
  { label: 'Rewards', value: (firm) => firm.rewardTags?.join(', ') || 'No program listed' },
];

export function formatCapital(value: number) {
  if (value >= 1_000_000) return `$${value / 1_000_000}M`;
  return `$${Math.round(value / 1000)}K`;
}

export function shortDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function decisionCopy(firm: PropFirm) {
  if (firm.weekendHoldingAllowed && firm.newsTradingAllowed) {
    return 'Flexible rule set for traders who hold through market events.';
  }
  if (firm.evaluationSteps.includes('Instant Funding')) {
    return 'Fast route to funding, but inspect the drawdown mechanics first.';
  }
  return 'A structured evaluation for traders who prefer predictable limits.';
}
