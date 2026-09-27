import type { FirmNormalizedProfileV2 } from '@/types/database';

export const HYROTRADER_PAYOUT_COPY: Record<string, string> = {
  'payouts.title': 'rises to 90% over time.',
  'payouts.description': 'The split increases by 5 percentage points every four months.',
  'payouts.minimum': '$100 profit',
  'payouts.processing': '12–24 hours',
  'payouts.rail': 'USDT, USDC',
  'payouts.rule.1': 'Your first request can be made the same day as your first funded trade.',
  'payouts.rule.2': 'The challenge fee is refunded with your first payout.',
  'payouts.rule.3': 'Selected payouts can be verified on-chain.',
  'payouts.rule.4': 'There is no withdrawal commission.',
  'payouts.cap': 'Max per payout: 5% of account balance. Profit left above 5% may not be paid.',
  'payouts.refund.title': 'Challenge fee refund',
  'payouts.refund.description': 'The fee you paid for the evaluation comes back with your first funded withdrawal. You receive two payments in the same payout cycle: your profit share, and the full challenge fee as a separate crypto transfer.',
  'payouts.cap.title': '5% payout cap',
  'payouts.cap.description': 'Each withdrawal is limited to 5% of the starting account balance. On a $100,000 account, that is $5,000 in profit per request. At an 80% split, about $4,000 reaches your wallet. If profit goes above 5% and you do not withdraw, the extra amount may not be paid. Withdraw near the cap, then keep trading. There is no limit on how many payouts you can request.',
};

export function withHyroTraderPayoutCopy(profile: FirmNormalizedProfileV2): FirmNormalizedProfileV2 {
  if (profile.slug !== 'hyrotrader') return profile;
  return { ...profile, editorialCopy: { ...profile.editorialCopy, ...HYROTRADER_PAYOUT_COPY } };
}
