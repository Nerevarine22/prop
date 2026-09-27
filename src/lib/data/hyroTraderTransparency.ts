import type { FirmTransparencyProfile, FirmNormalizedProfileV2 } from '@/types/database';

export const HYROTRADER_TRANSPARENCY: FirmTransparencyProfile = {
  checkedAt: '27 Sep 2026',
  dashboardUrl: 'https://www.hyrotrader.com/transparency/',
  passRateArticleUrl: 'https://www.hyrotrader.com/blog/prop-firm-pass-rates/',
  metrics: [
    { value: '$8.38M', label: 'Total payouts', context: 'Company-reported total' },
    { value: '$874.6K', label: 'On-chain payout records', context: 'Transactions have public IDs', tone: 'lime' },
    { value: '10h 18m', label: 'Average payout processing', context: 'Company-reported average' },
  ],
  challengeOutcomes: [
    { value: '13.31%', label: 'One-Step pass rate' },
    { value: '8.80%', label: 'Two-Step pass rate' },
  ],
  verification: {
    amount: '$874,601',
    wallet: '98TfAq...ionGu',
    walletAddress: '98TfAqVwRrwA36b9dx2WXeP75TyJhULskjET4c6ionGu',
    walletUrl: 'https://solscan.io/account/98TfAqVwRrwA36b9dx2WXeP75TyJhULskjET4c6ionGu',
  },
  supportingFacts: [
    { label: 'Funded traders', value: '2,890' },
    { label: 'Largest single payout', value: '$9,606' },
    { label: 'Network', value: 'Solana' },
    { label: 'Payout history', value: '123 pages' },
  ],
  companyAndTeam: {
    founded: '2022',
    ceo: 'Samuel Drnda',
    teamSize: '30+ people',
    headquarters: 'Dubai, UAE',
    locationsNote: 'The About page also lists a Prague address. Current Terms place the Slovak payment agent in Bratislava.',
    entities: [
      {
        label: 'Challenge provider',
        name: 'HYRO TECHNOLOGIES FZ-LLC',
        jurisdiction: 'Ras Al Khaimah, UAE',
        details: 'Your contracting party for the challenge under the current Terms.',
      },
      {
        label: 'Platform IP & funded phase',
        name: 'HYROTRADER TECHNOLOGIES LTD',
        jurisdiction: 'British Virgin Islands',
        details: 'Owns the platform IP and operates the funded phase; performance rewards are paid under a separate Funded Trader Agreement.',
      },
      {
        label: 'EEA / UK payment agent',
        name: 'Hyro Finance, j. s. a.',
        jurisdiction: 'Slovakia · IČO 55072275',
        details: 'Commercial agent for card and fiat payments in the EEA and UK. Current Terms describe this arrangement as transitional.',
      },
    ],
    slovakRegistryNote: 'The Slovak Commercial Bulletin also lists Hyro Trading s. r. o., with Samuel Drnda as its managing director.',
    regulatoryNote: 'The Terms describe the service as non-brokerage and outside investment services. They state the provider is not registered with or regulated by the financial authorities listed there; the UAE commercial licence is not presented as a financial-services licence.',
    termsUrl: 'https://www.hyrotrader.com/terms-and-conditions/',
    aboutUrl: 'https://www.hyrotrader.com/about-us/',
    registryUrl: 'https://obchodnyvestnik.justice.gov.sk/ObchodnyVestnik/Web/Stiahnut.aspx?IdOvSubor=157055',
  },
};

export function withHyroTraderTransparency(profile: FirmNormalizedProfileV2): FirmNormalizedProfileV2 {
  if (profile.slug !== 'hyrotrader') return profile;
  return { ...profile, publicTransparency: HYROTRADER_TRANSPARENCY };
}
