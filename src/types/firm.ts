export type EvaluationStep = '1-Step' | '2-Step' | 'Instant Funding';

export type TradingPlatform = 'MT4' | 'MT5' | 'cTrader' | 'Bybit' | 'TradeLocker' | 'Match-Trader';

export interface Coupon {
  id: string;
  firmId: string;
  firmName: string;
  code: string;
  discount: string; // e.g. "20% OFF"
  description: string;
  verified: boolean;
  expiryDate?: string;
  highlight?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1-5
  date: string;
  title: string;
  content: string;
  verifiedTrader: boolean;
  likes: number;
}

export interface PlanTier {
  accountSize: number; // in USD e.g. 10000, 50000, 100000
  price: number; // in USD
  originalPrice?: number;
  profitTarget: string; // e.g. "8%"
  maxDrawdown: string; // e.g. "10%"
  dailyDrawdown: string; // e.g. "5%"
}

export type RewardTag = 'Points' | 'Token' | 'Airdrop' | 'Potential';

export interface TokenomicsInfo {
  hasToken: boolean;
  tokenTicker?: string;
  hasPoints: boolean;
  pointsProgramName?: string;
  hasAirdrop: boolean;
  airdropStatus?: 'Confirmed' | 'Unconfirmed' | 'Active' | 'Potential';
  rewardDescription?: string;
}

export interface PropFirm {
  id: string;
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  rating: number; // 0 to 5
  reviewCount: number;
  featured: boolean;
  trending?: boolean;
  badge?: string; // e.g. "Top Choice 2026", "Best Crypto Leverage"
  
  // Core Specs
  profitSplit: string; // e.g. "Up to 95%"
  maxDrawdown: string; // e.g. "10% Trailing"
  dailyDrawdown: string; // e.g. "5%"
  profitTarget: string; // e.g. "8% / 5%"
  minCapital: number; // $5,000
  maxCapital: number; // $400,000
  cryptoLeverage: string; // e.g. "1:100"
  
  // Features & Rules
  evaluationSteps: EvaluationStep[];
  platforms: TradingPlatform[];
  payoutFrequency: string; // e.g. "Bi-weekly / On Demand"
  newsTradingAllowed: boolean;
  weekendHoldingAllowed: boolean;
  eaAllowed: boolean; // Expert Advisors
  noTimeLimit: boolean;
  cryptoPairsCount: number; // e.g. 50+
  
  // Pricing & Tier Options
  accountTiers: PlanTier[];
  
  // Verification & Company info
  verifiedCoupon?: Coupon;
  website?: string;
  brandColor?: string;
  yearEstablished: number;
  headquarters: string;
  trustScore: number; // 0 to 100
  
  // Tokenomics, Points & Airdrop Ecosystem
  rewardTags?: RewardTag[];
  tokenomicsInfo?: TokenomicsInfo;

  reviews?: Review[];
}
