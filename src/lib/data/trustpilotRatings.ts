import type { FirmExternalRating } from '@/types/database';

const CHECKED_AT = '2026-09-05T00:00:00.000Z';

type RatingInput = Omit<FirmExternalRating, 'source' | 'sourceName' | 'scale' | 'checkedAt' | 'captureMethod' | 'distributionBasis' | 'distribution'> & {
  distribution?: [number, number, number, number, number];
};

function rating(input: RatingInput): FirmExternalRating {
  const { distribution, ...details } = input;
  return {
    source: 'trustpilot',
    sourceName: 'Trustpilot',
    scale: 5,
    checkedAt: CHECKED_AT,
    captureMethod: 'user-supplied-snapshot',
    ...details,
    ...(distribution ? {
      distributionBasis: 'visual-estimate' as const,
      distribution: distribution.map((sharePercent, index) => ({
        stars: (5 - index) as 1 | 2 | 3 | 4 | 5,
        sharePercent,
        approximate: true,
      })),
    } : {}),
  };
}

export const TRUSTPILOT_RATINGS_BY_SLUG: Record<string, FirmExternalRating> = {
  breakout: rating({ url: 'https://www.trustpilot.com/review/breakoutprop.com', score: 4.6, label: 'Excellent', reviewCount: 1000, reviewCountLabel: '1K', reviewCountApproximate: true, distribution: [91, 4, 1, 0, 0] }),
  propr: rating({ url: 'https://www.trustpilot.com/review/propr.xyz', score: 4.5, label: 'Excellent', reviewCount: 61, reviewCountLabel: '61', distribution: [90, 3, 0, 1, 6] }),
  acetrader: rating({ url: 'https://www.trustpilot.com/review/acetrader.com', score: 4.1, label: 'Great', reviewCount: 9, reviewCountLabel: '9', distribution: [88, 0, 0, 0, 11] }),
  'carrot-funding': rating({ url: 'https://www.trustpilot.com/review/carrotfunding.io', score: 4.6, label: 'Excellent', reviewCount: 25, reviewCountLabel: '25', distribution: [95, 4, 0, 0, 0] }),
  dizso: rating({ url: 'https://www.trustpilot.com/review/dizso.com', score: 3.8, label: 'Great', reviewCount: 2, reviewCountLabel: '2', distribution: [100, 0, 0, 0, 0] }),
  fundex: rating({ url: 'https://www.trustpilot.com/review/fundex.gg', score: 3.2, label: 'Average', reviewCount: 45, reviewCountLabel: '45', distribution: [53, 9, 4, 2, 31] }),
  'hyper-stack': rating({ url: 'https://www.trustpilot.com/review/hyperstack.trade', score: 3.8, label: 'Great', reviewCount: 2, reviewCountLabel: '2', distribution: [100, 0, 0, 0, 0] }),
  hyperpnl: rating({ url: 'https://www.trustpilot.com/review/hyperpnl.com', score: 4.3, label: 'Excellent', reviewCount: 23, reviewCountLabel: '23', distribution: [82, 9, 0, 0, 9] }),
  hyrotrader: rating({ url: 'https://www.trustpilot.com/review/hyrotrader.com', score: 4.2, label: 'Great', reviewCount: 239, reviewCountLabel: '239', distribution: [75, 6, 3, 2, 12] }),
  sizeprop: rating({ url: 'https://www.trustpilot.com/review/sizeprop.com', score: 4.4, label: 'Excellent', reviewCount: 43, reviewCountLabel: '43', distribution: [85, 5, 0, 0, 9] }),
  'solana-funded': rating({ url: 'https://www.trustpilot.com/review/solanafunded.com', score: 2.6, label: 'Poor', reviewCount: 25, reviewCountLabel: '25', distribution: [28, 8, 0, 4, 60] }),
  'vanta-trading': rating({ url: 'https://www.trustpilot.com/review/vantatrading.io', score: 4.6, label: 'Excellent', reviewCount: 25, reviewCountLabel: '25', distribution: [95, 0, 0, 4, 0] }),
};

export function trustpilotRatingsForSlug(slug: string): FirmExternalRating[] | undefined {
  const record = TRUSTPILOT_RATINGS_BY_SLUG[slug];
  return record ? [record] : undefined;
}
