import type {
  ComparisonListProjection,
  ComparisonRangeProjection,
  FirmComparisonProjection,
  FirmContentFact,
  FirmContentRecord,
  FirmModelType,
  FirmNormalizedProfile,
  FirmNormalizedProfileV2,
  FirmProfileSection,
  NormalizedChallengeProgram,
  NormalizedChallengeTier,
  NormalizedFact,
} from '@/types/database';
import { MODEL_FIRST_FIRM_PROFILES_BY_SLUG } from './modelFirstFirmProfiles';

type FactFormatter<T> = (value: T) => string;

function knownValue<T>(fact: NormalizedFact<T>): T | undefined {
  return fact.status === 'reported' || fact.status === 'verified' ? fact.value : undefined;
}

function factValueText<T>(fact: NormalizedFact<T>, formatter?: FactFormatter<T>): string {
  const value = knownValue(fact);
  if (value === undefined) return 'ND';
  if (formatter) return formatter(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(' · ') : 'ND';
  return String(value);
}

function sourceUrls<T>(fact: NormalizedFact<T>): string[] {
  return [...new Set(fact.evidence.map((item) => item.sourceUrl))];
}

function contentFact<T>(
  id: string,
  label: string,
  fact: NormalizedFact<T>,
  formatter?: FactFormatter<T>,
  note?: string,
): FirmContentFact {
  const urls = sourceUrls(fact);
  return {
    id,
    label,
    value: factValueText(fact, formatter),
    status: fact.status,
    ...(note ? { note } : {}),
    ...(urls.length ? { sourceUrls: urls } : {}),
  };
}

function formatPercent(value: number): string {
  return `${value}%`;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

function formatCapital(value: number): string {
  if (value >= 1_000_000) return `$${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `$${Number((value / 1_000).toFixed(1))}K`;
  return `$${value.toLocaleString('en-US')}`;
}

function programs(profile: FirmNormalizedProfile): NormalizedChallengeProgram[] {
  return knownValue(profile.challengePrograms) ?? [];
}

function modelTypeForProgram(program: NormalizedChallengeProgram): FirmModelType {
  return knownValue(program.kind) ?? 'other';
}

function modelTypesFor(sourcePrograms: NormalizedChallengeProgram[]): FirmModelType[] {
  const values = [...new Set(sourcePrograms.map(modelTypeForProgram))];
  return values.length ? values : ['other'];
}

function numericValues(facts: NormalizedFact<number>[]): number[] {
  return facts.flatMap((fact) => {
    const value = knownValue(fact);
    return value === undefined ? [] : [value];
  });
}

function tierValues(sourcePrograms: NormalizedChallengeProgram[], key: 'accountSize' | 'fee'): number[] {
  return sourcePrograms.flatMap((program) => {
    const tiers = knownValue(program.tiers) ?? [];
    return tiers.flatMap((tier: NormalizedChallengeTier) => {
      const value = knownValue(tier[key]);
      return value === undefined ? [] : [value];
    });
  });
}

function rangeProjection(
  values: number[],
  unit: ComparisonRangeProjection['unit'],
  notes: string,
): ComparisonRangeProjection {
  if (!values.length) return { status: 'ND', unit, notes };
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    status: min === max ? 'known' : 'varies',
    min,
    max,
    unit,
    ...(min === max ? {} : { notes }),
  };
}

function numericRangeFromText(value: string | undefined): number[] {
  if (!value) return [];
  return [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

function listProjection(values: Array<string | undefined>, notes?: string): ComparisonListProjection {
  const unique = [...new Set(values.filter((value): value is string => Boolean(value)))];
  if (!unique.length) return { status: 'ND', values: [], ...(notes ? { notes } : {}) };
  return {
    status: unique.length === 1 ? 'known' : 'varies',
    values: unique,
    ...(notes ? { notes } : {}),
  };
}

function comparisonProjection(
  profile: FirmNormalizedProfile,
  sourcePrograms: NormalizedChallengeProgram[],
  modelTypes: FirmModelType[],
): FirmComparisonProjection {
  const tierCapital = tierValues(sourcePrograms, 'accountSize');
  const fallbackCapital = [knownValue(profile.summary.minCapital), knownValue(profile.summary.maxCapital)]
    .filter((value): value is number => value !== undefined);
  const programSplits = numericValues(sourcePrograms.map((program) => program.fundedProfitSplitPercent));
  const summarySplits = numericRangeFromText(knownValue(profile.summary.profitSplit));
  const programDrawdowns = numericValues(sourcePrograms.map((program) => program.maxDrawdownPercent));
  const summaryDrawdowns = numericRangeFromText(knownValue(profile.summary.maxDrawdown));
  const executionModel = knownValue(profile.executionPolicy.model)?.replaceAll('-', ' ');
  const onchain = knownValue(profile.executionPolicy.onchainSettlement);

  return {
    modelTypes,
    capital: rangeProjection(tierCapital.length ? tierCapital : fallbackCapital, 'USD', 'Capital varies by offer.'),
    entryCost: rangeProjection(tierValues(sourcePrograms, 'fee'), 'USD', 'Entry cost varies by offer and account size.'),
    profitSplit: rangeProjection(programSplits.length ? programSplits : summarySplits, 'percent', 'Profit split varies by offer or tier.'),
    maxDrawdown: rangeProjection(programDrawdowns.length ? programDrawdowns : summaryDrawdowns, 'percent', 'Maximum drawdown varies by offer.'),
    payoutSchedules: listProjection([knownValue(profile.payoutPolicy.schedule)], 'See the payout policy for eligibility conditions.'),
    executionModels: listProjection([executionModel, onchain === true ? 'on-chain settlement' : undefined]),
  };
}

function formatStages(program: NormalizedChallengeProgram): string {
  const stages = knownValue(program.stages);
  if (!stages?.length) return 'ND';
  return stages.map((stage) => {
    const target = knownValue(stage.profitTargetPercent);
    return `${stage.name}${target === undefined ? '' : ` · ${target}% target`}`;
  }).join(' → ');
}

function formatTiers(program: NormalizedChallengeProgram): string {
  const tiers = knownValue(program.tiers);
  if (!tiers?.length) return 'ND';
  return tiers.map((tier) => {
    const capital = knownValue(tier.accountSize);
    const fee = knownValue(tier.fee);
    const currency = knownValue(tier.currency) ?? 'USD';
    const capitalText = capital === undefined ? 'ND' : formatCapital(capital);
    const feeText = fee === undefined ? 'ND' : `${currency === 'USD' ? '$' : ''}${fee.toLocaleString('en-US')} ${currency === 'USD' ? '' : currency}`.trim();
    return `${capitalText} · ${feeText}`;
  }).join(' | ');
}

function offerRecord(profile: FirmNormalizedProfile, program: NormalizedChallengeProgram): FirmContentRecord {
  const website = knownValue(profile.identity.officialWebsite);
  return {
    id: program.id,
    eyebrow: firmModelTypeLabel(modelTypeForProgram(program)),
    title: program.name,
    description: factValueText(program.notes),
    facts: [
      contentFact(`${program.id}-stages`, 'Stages', program.stages, () => formatStages(program)),
      contentFact(`${program.id}-pricing`, 'Pricing tiers', program.tiers, () => formatTiers(program)),
      contentFact(`${program.id}-daily-loss`, 'Daily loss', program.dailyLossPercent, formatPercent),
      contentFact(`${program.id}-drawdown`, 'Maximum drawdown', program.maxDrawdownPercent, formatPercent),
      contentFact(`${program.id}-drawdown-type`, 'Drawdown type', program.maxDrawdownType, (value) => value.replaceAll('-', ' ')),
      contentFact(`${program.id}-split`, 'Funded split', program.fundedProfitSplitPercent, formatPercent),
      contentFact(`${program.id}-refund`, 'Fee refundable', program.feeRefundable),
      contentFact(`${program.id}-time-limit`, 'No time limit', program.noTimeLimit),
    ],
    ...(website ? { links: [{ label: 'Official site', url: website }] } : {}),
  };
}

function overviewSection(
  profile: FirmNormalizedProfile,
  modelTypes: FirmModelType[],
  offerNames: string[],
  comparison: FirmComparisonProjection,
): FirmProfileSection {
  const description = knownValue(profile.identity.description) ?? knownValue(profile.identity.tagline);
  const companyFacts: FirmContentFact[] = [
    contentFact('company-established', 'Established', profile.company.yearEstablished),
    contentFact('company-headquarters', 'Headquarters', profile.company.headquarters),
  ];
  const knownCompanyFacts = companyFacts.filter((item) => item.status !== 'ND');

  return {
    id: 'overview',
    tabLabel: 'Overview',
    title: 'Firm overview',
    description: 'A shared comparison layer without flattening the firm-specific operating model.',
    blocks: [
      ...(description ? [{ id: 'about', type: 'text' as const, eyebrow: 'Company positioning', title: `About ${profile.name}`, paragraphs: [description], meta: `Primary sources only · checked ${profile.checkedAt.slice(0, 10)}` }] : []),
      {
        id: 'overview-facts',
        type: 'fact-grid',
        columns: 3,
        items: [
          { id: 'business-model', label: 'Business model', value: modelTypes.map(firmModelTypeLabel).join(' · '), note: `${offerNames.length} documented offer${offerNames.length === 1 ? '' : 's'}` },
          { id: 'capital', label: 'Capital', value: comparisonRangeText(comparison.capital), note: comparison.capital.notes },
          { id: 'entry-cost', label: 'Entry cost', value: comparisonRangeText(comparison.entryCost), note: comparison.entryCost.notes },
          { id: 'profit-split', label: 'Profit split', value: comparisonRangeText(comparison.profitSplit), note: comparison.profitSplit.notes },
          { id: 'max-drawdown', label: 'Maximum drawdown', value: comparisonRangeText(comparison.maxDrawdown), note: comparison.maxDrawdown.notes },
          { id: 'payout-schedule', label: 'Payout schedule', value: comparisonListText(comparison.payoutSchedules), note: comparison.payoutSchedules.notes },
        ],
      },
      {
        id: 'company-records',
        type: 'record-list',
        items: [
          {
            id: 'execution',
            eyebrow: 'Execution model',
            title: factValueText(profile.executionPolicy.model, (value) => value.replaceAll('-', ' ')),
            description: factValueText(profile.executionPolicy.notes),
            facts: [
              contentFact('execution-venue', 'Venue', profile.executionPolicy.venue),
              contentFact('execution-onchain', 'On-chain settlement', profile.executionPolicy.onchainSettlement),
              { id: 'execution-comparison', label: 'Comparison', value: comparisonListText(comparison.executionModels) },
            ],
          },
          {
            id: 'legal',
            eyebrow: 'Legal record',
            title: factValueText(profile.compliancePolicy.legalEntity),
            description: factValueText(profile.compliancePolicy.regulatoryStatus),
            facts: [
              contentFact('legal-jurisdiction', 'Jurisdiction', profile.compliancePolicy.registrationJurisdiction),
              contentFact('legal-kyc', 'KYC stage', profile.compliancePolicy.kycRequiredAt, (value) => value.replaceAll('-', ' ')),
              contentFact('legal-simulated', 'Account environment', profile.compliancePolicy.simulatedAccounts, (value) => value ? 'Simulated' : 'Not simulated'),
              ...knownCompanyFacts,
            ],
          },
        ],
      },
    ],
  };
}

function offersSection(profile: FirmNormalizedProfile, sourcePrograms: NormalizedChallengeProgram[]): FirmProfileSection {
  const modelTypes = modelTypesFor(sourcePrograms);
  const singleLabel: Record<FirmModelType, string> = {
    evaluation: 'Evaluations & pricing',
    'instant-funding': 'Instant funding',
    collateralized: 'Collateral & funding',
    competition: 'Competitions',
    progression: 'Progression',
    other: 'Offers & pricing',
  };
  const tabLabel = modelTypes.length === 1 ? singleLabel[modelTypes[0]] : 'Offers & pricing';
  return {
    id: 'offers',
    tabLabel,
    title: tabLabel,
    description: 'Each offer keeps the fields and language documented for its own operating model.',
    blocks: sourcePrograms.length ? [{ id: 'offer-records', type: 'record-list', items: sourcePrograms.map((program) => offerRecord(profile, program)) }] : [{ id: 'offers-nd', type: 'notice', tone: 'neutral', text: 'ND — no offer structure was documented in the inspected official sources.' }],
  };
}

function hasKnownFact(facts: NormalizedFact<unknown>[]): boolean {
  return facts.some((fact) => fact.status === 'reported' || fact.status === 'verified');
}

function tradingSection(profile: FirmNormalizedProfile): FirmProfileSection | undefined {
  const trading = profile.tradingPolicy;
  if (!hasKnownFact(Object.values(trading) as NormalizedFact<unknown>[])) return undefined;
  return {
    id: 'trading',
    tabLabel: 'Trading rules',
    title: 'Trading rules',
    description: 'Unknown values remain ND and are not interpreted as allowed or restricted.',
    blocks: [{
      id: 'trading-facts', type: 'fact-grid', columns: 3, items: [
        contentFact('trading-weekend', 'Weekend holding', trading.weekendHolding),
        contentFact('trading-news', 'News trading', trading.newsTrading),
        contentFact('trading-automation', 'Automated trading', trading.automatedTrading),
        contentFact('trading-copy', 'Copy trading', trading.copyTrading),
        contentFact('trading-stop-loss', 'Mandatory stop loss', trading.mandatoryStopLoss),
        contentFact('trading-platforms', 'Platforms', trading.platforms),
        contentFact('trading-markets', 'Markets', trading.markets),
        contentFact('trading-leverage', 'Leverage', trading.leverage),
        contentFact('trading-consistency', 'Consistency rule', trading.consistencyRule),
        contentFact('trading-profit-day', 'Profit-day definition', trading.profitDayDefinition),
        contentFact('trading-fees', 'Trading fees', trading.tradingFees),
      ],
    }],
  };
}

function payoutSection(profile: FirmNormalizedProfile): FirmProfileSection | undefined {
  const payout = profile.payoutPolicy;
  if (!hasKnownFact(Object.values(payout) as NormalizedFact<unknown>[])) return undefined;
  return {
    id: 'payouts', tabLabel: 'Payouts', title: 'Funding & payouts', description: 'Payout policy is stored independently from the offer model.',
    blocks: [{
      id: 'payout-facts', type: 'fact-grid', columns: 3, items: [
        contentFact('payout-split', 'Profit split', payout.profitSplitPercent, formatPercent),
        contentFact('payout-schedule', 'Request timing', payout.schedule),
        contentFact('payout-minimum', 'Minimum payout', payout.minimumAmount, formatCurrency),
        contentFact('payout-currencies', 'Currencies', payout.currencies),
        contentFact('payout-processing', 'Processing time', payout.processingTimeHours, (value) => `Within ${value} hours`),
        contentFact('payout-close-positions', 'Positions must be closed', payout.positionsMustBeClosed),
        contentFact('payout-partial', 'Partial withdrawals', payout.partialWithdrawalsAllowed),
        contentFact('payout-reset', 'Withdrawal resets balance', payout.payoutResetsBalance),
      ],
    }, { id: 'payout-notes', type: 'notice', tone: 'neutral', text: factValueText(payout.notes) }],
  };
}

function rewardsSection(profile: FirmNormalizedProfile): FirmProfileSection | undefined {
  const rewards = profile.tokenRewards;
  if (!hasKnownFact(Object.values(rewards) as NormalizedFact<unknown>[])) return undefined;
  return {
    id: 'rewards', tabLabel: 'Rewards', title: 'Tokenomics & rewards', description: 'Reward claims stay separate from the core trading offer.',
    blocks: [{
      id: 'reward-facts', type: 'fact-grid', columns: 3, items: [
        contentFact('reward-token', 'Token', rewards.hasToken),
        contentFact('reward-token-ticker', 'Token ticker', rewards.tokenTicker),
        contentFact('reward-token-supply', 'Token supply', rewards.tokenSupply, (value) => value.toLocaleString('en-US')),
        contentFact('reward-points', 'Points program', rewards.hasPoints),
        contentFact('reward-points-name', 'Points name', rewards.pointsProgramName),
        contentFact('reward-airdrop', 'Airdrop', rewards.hasAirdrop),
        contentFact('reward-airdrop-status', 'Airdrop status', rewards.airdropStatus),
      ],
    }, { id: 'reward-description', type: 'notice', tone: 'neutral', text: factValueText(rewards.description) }],
  };
}

function sourcesSection(profile: FirmNormalizedProfile): FirmProfileSection {
  const discrepancyRecords: FirmContentRecord[] = profile.sourceDiscrepancies.map((item) => ({
    id: item.id,
    eyebrow: `Resolved · ${item.resolutionBasis.replaceAll('-', ' ')}`,
    title: item.label,
    description: item.notes,
    facts: [
      { id: `${item.id}-canonical`, label: 'Canonical', value: item.canonical.value, status: 'reported' },
      { id: `${item.id}-alternate`, label: 'Alternate', value: item.alternates.map((candidate) => candidate.value).join(' · '), status: 'conflict' },
    ],
    links: [{ label: 'Canonical source', url: item.canonical.sourceUrl }, ...item.alternates.map((candidate) => ({ label: 'Alternate source', url: candidate.sourceUrl }))],
    meta: [item.checkedAt],
  }));
  const claimRecords: FirmContentRecord[] = profile.claims.map((claim) => ({
    id: claim.id,
    eyebrow: `${claim.field} · ${claim.status === 'conflict' ? 'archived observation' : claim.status}`,
    title: claim.value,
    description: claim.notes || 'Official-source observation.',
    links: [{ label: 'Open source', url: claim.sourceUrl }],
    meta: [claim.checkedAt],
  }));
  return {
    id: 'sources', tabLabel: 'Sources & differences', title: 'Sources & resolved differences', description: 'Canonical values and alternate official observations remain inspectable.',
    blocks: [
      ...(discrepancyRecords.length ? [
        { id: 'source-differences-notice', type: 'notice' as const, tone: 'warning' as const, text: `${discrepancyRecords.length} official-source ${discrepancyRecords.length === 1 ? 'difference is' : 'differences are'} resolved and preserved with both URLs.` },
        { id: 'source-differences', type: 'record-list' as const, items: discrepancyRecords },
      ] : []),
      { id: 'source-claims', type: 'record-list', items: claimRecords },
    ],
  };
}

function buildSections(profile: FirmNormalizedProfile, sourcePrograms: NormalizedChallengeProgram[], modelTypes: FirmModelType[], comparison: FirmComparisonProjection): FirmProfileSection[] {
  const offerNames = sourcePrograms.map((program) => program.name);
  return [overviewSection(profile, modelTypes, offerNames, comparison), offersSection(profile, sourcePrograms), tradingSection(profile), payoutSection(profile), rewardsSection(profile), sourcesSection(profile)]
    .filter((section): section is FirmProfileSection => Boolean(section));
}

function buildProfile(profile: FirmNormalizedProfile): FirmNormalizedProfileV2 {
  const sourcePrograms = programs(profile);
  const modelTypes = modelTypesFor(sourcePrograms);
  const comparison = comparisonProjection(profile, sourcePrograms, modelTypes);
  return {
    version: 2,
    methodology: 'primary-sources-only',
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    checkedAt: profile.checkedAt,
    modelTypes,
    offerNames: sourcePrograms.map((program) => program.name),
    sections: buildSections(profile, sourcePrograms, modelTypes, comparison),
    comparison,
    sourceDiscrepancies: profile.sourceDiscrepancies,
  };
}

const CONTENT_BLOCK_TYPES = new Set(['text', 'fact-grid', 'record-list', 'table', 'notice']);

function isStoredProfileUsable(profile: FirmNormalizedProfileV2 | undefined): profile is FirmNormalizedProfileV2 {
  return Boolean(
    profile?.version === 2
    && Array.isArray(profile.modelTypes)
    && Array.isArray(profile.offerNames)
    && profile.comparison
    && Array.isArray(profile.sections)
    && profile.sections.length
    && profile.sections.every((section) => (
      typeof section.id === 'string'
      && typeof section.tabLabel === 'string'
      && typeof section.title === 'string'
      && Array.isArray(section.blocks)
      && section.blocks.every((block) => typeof block.id === 'string' && CONTENT_BLOCK_TYPES.has(block.type))
    )),
  );
}

export function getFirmModularProfile(profile: FirmNormalizedProfile): FirmNormalizedProfileV2 {
  if (isStoredProfileUsable(profile.modularProfile) && profile.modularProfile.researchStandard === 'model-first-v1') {
    return profile.modularProfile;
  }
  return MODEL_FIRST_FIRM_PROFILES_BY_SLUG[profile.slug]
    ?? (isStoredProfileUsable(profile.modularProfile) ? profile.modularProfile : buildProfile(profile));
}

export function attachFirmModularProfile(profile: FirmNormalizedProfile, storedProfile?: FirmNormalizedProfileV2): FirmNormalizedProfile {
  const modularProfile = isStoredProfileUsable(storedProfile) && storedProfile.researchStandard === 'model-first-v1'
    ? storedProfile
    : MODEL_FIRST_FIRM_PROFILES_BY_SLUG[profile.slug]
      ?? (isStoredProfileUsable(storedProfile) ? storedProfile : buildProfile(profile));
  return { ...profile, modularProfile };
}

export function firmModelTypeLabel(modelType: FirmModelType): string {
  const labels: Record<FirmModelType, string> = {
    evaluation: 'Evaluation', 'instant-funding': 'Instant funding', collateralized: 'Collateralized funding', competition: 'Competition', progression: 'Progression', other: 'Other model',
  };
  return labels[modelType];
}

export function comparisonRangeText(value: ComparisonRangeProjection): string {
  if (value.displayValue) return value.displayValue;
  if (value.status === 'ND' || value.status === 'N/A' || value.min === undefined) return value.status;
  const format = (number: number) => value.unit === 'percent'
    ? `${number}%`
    : value.unit === 'USDC'
      ? `${number.toLocaleString('en-US')} USDC`
      : formatCapital(number);
  if (value.max === undefined || value.max === value.min) return format(value.min);
  return `${format(value.min)}–${format(value.max)}`;
}

export function comparisonListText(value: ComparisonListProjection): string {
  if (value.displayValue) return value.displayValue;
  if (value.status === 'ND' || value.status === 'N/A') return value.status;
  return value.values.join(' · ');
}
