export type EvaluationStep = '1-Step' | '2-Step' | 'Instant Funding';

export type TradingPlatform = 'MT4' | 'MT5' | 'cTrader' | 'Bybit' | 'TradeLocker' | 'Match-Trader' | 'Propr Terminal' | 'Hyperliquid';

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
  referralUrl?: string;
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

export type ChallengeProgramKind = 'evaluation' | 'instant-funding' | 'collateralized' | 'competition';

export type DrawdownType = 'static' | 'trailing-high-water-mark' | 'trailing-daily' | 'dynamic' | 'none';

export interface ChallengeStage {
  id: string;
  name: string;
  profitTargetPercent?: number;
  timeLimitDays?: number;
  minimumTradingDays?: number;
  funded?: boolean;
}

export interface ChallengeTier {
  accountSize: number;
  fee: number;
  originalFee?: number;
  currency: 'USD' | 'USDC' | 'USDT';
  available: boolean;
  sourceIds: string[];
}

export interface DailyLossRule {
  percent: number;
  reference: 'starting-balance' | 'start-of-day-balance' | 'start-of-day-equity' | 'daily-high-water-mark';
  resetTimeUtc?: string;
  equityBased: boolean;
  floatingPnlIncluded: boolean;
  breachOnTouch: boolean;
}

export interface DrawdownRule {
  percent: number;
  type: DrawdownType;
  reference: 'starting-balance' | 'equity-high-water-mark' | 'balance-high-water-mark';
  equityBased: boolean;
  floatingPnlIncluded: boolean;
  breachOnTouch: boolean;
  trailingCap?: 'starting-balance';
  resetsAfterPayout?: boolean;
}

export interface ChallengeProgram {
  id: string;
  name: string;
  shortName: string;
  kind: ChallengeProgramKind;
  description: string;
  stages: ChallengeStage[];
  tiers: ChallengeTier[];
  dailyLoss: DailyLossRule;
  maxDrawdown: DrawdownRule;
  fundedProfitSplitPercent: number;
  feeRefundable: boolean;
  noTimeLimit: boolean;
  sourceIds: string[];
}

export interface PayoutPolicy {
  schedule: 'on-demand' | 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'conditional';
  profitSplitPercent: number;
  minimumAmount?: number;
  currencies: Array<'USD' | 'USDC' | 'USDT' | 'BTC' | 'ETH' | 'SOL'>;
  processingTimeHours?: number;
  positionsMustBeClosed?: boolean;
  partialWithdrawalsAllowed?: boolean;
  payoutResetsBalance?: boolean;
  sourceIds: string[];
}

export interface LeverageRule {
  market: string;
  maxLeverage: string;
}

export interface TradingPolicy {
  executionVenue?: string;
  markets: string[];
  leverage: LeverageRule[];
  consistencyRule: 'none' | 'applies' | 'unknown';
  newsTrading: 'allowed' | 'restricted' | 'conditional' | 'unknown';
  weekendHolding: 'allowed' | 'restricted' | 'conditional' | 'unknown';
  automatedTrading: 'allowed' | 'restricted' | 'conditional' | 'unknown';
  copyTrading: 'allowed' | 'restricted' | 'conditional' | 'unknown';
  mandatoryStopLoss: boolean;
  tradingFees: string;
  fundingRatesAffectEquity: boolean;
  sourceIds: string[];
}

export interface ExecutionPolicy {
  model: 'a-book' | 'b-book' | 'hybrid' | 'simulated' | 'unknown';
  onchainVenue?: string;
  traderCanChooseRouting: boolean;
  tradeLevelRoutingVisible: boolean;
  notes: string;
  sourceIds: string[];
}

export interface CompliancePolicy {
  legalEntity?: string;
  registrationJurisdiction?: string;
  regulatoryStatus?: string;
  kycRequiredAt: 'registration' | 'purchase' | 'funded-activation' | 'payout' | 'not-required' | 'unknown';
  restrictedJurisdictions: string[];
  maximumAggregateFundedBalance?: number;
  simulatedAccounts: boolean;
  sourceIds: string[];
}

export type RewardTag = 'Points' | 'Token' | 'Airdrop' | 'Potential';

export type DataStatus = 'mock' | 'reported' | 'verified';

export type SourceType =
  | 'official-website'
  | 'rulebook'
  | 'blockchain'
  | 'social'
  | 'community'
  | 'manual-research';

export interface DataSource {
  id: string;
  label: string;
  type: SourceType;
  url?: string;
  accessedAt: string;
  publishedAt?: string;
  notes?: string;
}

export interface VerificationRecord {
  status: DataStatus;
  method: 'demo-seed' | 'manual-review' | 'automated-check' | 'onchain-proof';
  checkedAt: string;
  sourceIds: string[];
  reviewer?: string;
  confidence?: 'low' | 'medium' | 'high';
}

export interface FirmChangeRecord {
  id: string;
  changedAt: string;
  field: string;
  previousValue?: string;
  nextValue: string;
  sourceIds: string[];
  note?: string;
}

export interface EvidenceClaim {
  id: string;
  field: string;
  value: string;
  status: 'reported' | 'verified' | 'conflict';
  sourceIds: string[];
  checkedAt: string;
  notes?: string;
}

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

  // Rich research model. Legacy summary fields above remain during migration.
  challengePrograms?: ChallengeProgram[];
  payoutPolicy?: PayoutPolicy;
  tradingPolicy?: TradingPolicy;
  executionPolicy?: ExecutionPolicy;
  compliancePolicy?: CompliancePolicy;
  
  // Verification & Company info
  verifiedCoupon?: Coupon;
  website?: string;
  brandColor?: string;
  yearEstablished: number;
  headquarters: string;
  trustScore: number; // 0 to 100

  // Data provenance. Mock records must never be presented as independently verified.
  dataStatus: DataStatus;
  lastReviewedAt: string;
  sources: DataSource[];
  verification: VerificationRecord;
  changeHistory: FirmChangeRecord[];
  claims?: EvidenceClaim[];
  
  // Tokenomics, Points & Airdrop Ecosystem
  rewardTags?: RewardTag[];
  tokenomicsInfo?: TokenomicsInfo;

  reviews?: Review[];
}
