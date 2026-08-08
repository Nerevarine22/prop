export const siteConfig = {
  name: 'PropHub',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://prophub.xyz').replace(/\/$/, ''),
  title: 'PropHub | On-chain prop firm research',
  description: 'Independent research on crypto-native prop firms, evaluation rules, on-chain evidence and trader reward programs.',
} as const;
