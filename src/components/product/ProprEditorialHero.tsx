import type { CSSProperties } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { ComparisonRangeProjection, FirmNormalizedProfile, FirmNormalizedProfileV2 } from '@/types/database';
import { comparisonListText, comparisonRangeText, firmModelTypeLabel, getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factValue, formatCapital, profileLogo, profileTrustpilotRating, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
import { ProfileCompareButton, ProfileComparisonTray } from './ProfileCompareControl';
import { SorsaScoreBadge } from './SorsaScoreBadge';
import styles from './ProprEditorialHero.module.css';

function rangePoint(value: ComparisonRangeProjection, point: 'min' | 'max'): string | undefined {
  const amount = value[point] ?? value.min;
  if (amount === undefined) return undefined;
  if (value.unit === 'percent') return `${amount}%`;
  if (value.unit === 'USDC') return `${amount.toLocaleString('en-US')} USDC`;
  return formatCapital(amount);
}

function displayComparison(value: string): string {
  return value === 'ND' || value === 'N/A' ? 'Not published' : value;
}

function compactValue(value: string | undefined, fallback = 'Not published'): string {
  if (!value) return fallback;
  const firstLine = value.split(/\n|\.|;/)[0]?.trim() ?? value;
  return firstLine.length > 42 ? `${firstLine.slice(0, 39).trimEnd()}…` : firstLine;
}

function editorialSummary(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/^Mission\s*/i, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return undefined;
  if (cleaned.length <= 430) return cleaned;
  const sentenceEnd = cleaned.lastIndexOf('. ', 430);
  return sentenceEnd > 220 ? cleaned.slice(0, sentenceEnd + 1) : `${cleaned.slice(0, 427).trimEnd()}…`;
}

export function FirmEditorialHero({ firm, profileOverride, showCompareControls = true }: { firm: FirmNormalizedProfile; profileOverride?: FirmNormalizedProfileV2; showCompareControls?: boolean }) {
  const research = profileOverride ?? getFirmModularProfile(firm);
  const website = profileWebsite(firm);
  const xHandle = factValue(firm.identity.xHandle);
  const xUrl = xHandle ? `https://x.com/${xHandle.replace(/^@/, '')}` : undefined;
  const isHyroTrader = firm.slug === 'hyrotrader';
  const editorialTitle = research.editorialCopy?.['hero.title'];
  const trustpilotRating = profileTrustpilotRating(firm);
  const overviewTexts = research.sections
    .find((section) => section.id === 'overview')
    ?.blocks.filter((block) => block.type === 'text') ?? [];
  const identityText = research.contentStage === 'editorial'
    ? overviewTexts[0]
    : overviewTexts.find((block) => /identity|operating model|project overview|about/i.test(block.title ?? ''));
  const description = editorialSummary(identityText?.paragraphs[0])
    ?? editorialSummary(research.operatingModel?.summary.value)
    ?? 'An independent research profile structured around the project’s documented operating model.';
  const platforms = factValue(firm.tradingPolicy.platforms) ?? [];
  const execution = comparisonListText(research.comparison.executionModels);
  const venue = compactValue(factValue(firm.executionPolicy.venue) ?? platforms[0] ?? (execution !== 'ND' ? execution : undefined));
  const entry = rangePoint(research.comparison.entryCost, 'min');
  const capital = rangePoint(research.comparison.capital, 'max');
  const split = displayComparison(comparisonRangeText(research.comparison.profitSplit));
  const payout = displayComparison(comparisonListText(research.comparison.payoutSchedules));
  const modelLabel = research.modelTypes.map(firmModelTypeLabel).join(' · ') || 'Independent model';
  const simulatedAccounts = factValue(firm.compliancePolicy.simulatedAccounts);
  const accountEnvironment = research.operatingModel?.accountEnvironment?.value
    ?? (simulatedAccounts === true ? 'Simulated account' : simulatedAccounts === false ? 'Live or on-chain environment' : undefined);
  const entryLabel = research.modelTypes.includes('collateralized') ? 'Trader commitment' : 'Entry price';
  const entryValue = entry ? `${research.modelTypes.includes('collateralized') ? '' : 'From '}${entry}` : 'Not published';
  const capitalValue = capital ? `Up to ${capital}` : 'Not published';
  const actionFacts = [
    venue !== 'Not published' ? ['Trading venue', venue] : undefined,
    accountEnvironment ? ['Account environment', compactValue(accountEnvironment)] : undefined,
    ['Documented offers', String(research.offerNames.length)],
  ].filter((item): item is [string, string] => Boolean(item));
  const decisionFacts = [
    split !== 'Not published' ? { label: 'Profit split', value: split, note: 'Trader share', tone: 'neutral' } : undefined,
    entry ? { label: entryLabel, value: entryValue, note: isHyroTrader ? 'Base eval fee; Swing extra.' : research.comparison.entryCost.notes ?? 'Offer dependent', tone: 'condition' } : undefined,
    capital ? { label: 'Maximum capital', value: capitalValue, note: isHyroTrader ? 'USDT-equivalent account value.' : research.comparison.capital.notes ?? 'Offer dependent', tone: 'neutral' } : undefined,
    payout !== 'Not published' ? { label: 'Payout access', value: payout, note: research.comparison.payoutSchedules.notes ?? 'See payout terms', tone: 'settlement' } : undefined,
    execution !== 'ND' && execution !== 'N/A' ? { label: 'Execution', value: platforms.slice(0, 2).join(' + ') || execution, note: isHyroTrader ? 'Evaluation route' : modelLabel, tone: 'neutral' } : undefined,
  ].filter((item): item is { label: string; value: string; note: string; tone: string } => Boolean(item));

  const displayedDescription = research.editorialCopy?.['hero.description'] ?? description;

  return (
    <>
    <section className={styles.hero} aria-labelledby="firm-profile-title" data-cms-hero>
      <header className={styles.metaBar}>
        <span><i /> Independent research profile</span>
        <span>Reviewed {shortDate(research.checkedAt)}</span>
      </header>

      <div className={styles.heroBody}>
        <div className={styles.identity}>
          <div className={styles.brandMark}>
            <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.logo} fallbackClassName={styles.fallback} />
          </div>
          <div className={styles.identityCopy}>
            <div className={styles.identityHeader}>
              <span className={styles.modelLabel}>{modelLabel}</span>
              <div className={styles.nameRow}>
                <h1 id="firm-profile-title" data-long={firm.name.length > 13}>{firm.name}</h1>
              </div>
            </div>
            <div className={styles.profileDescription}>
              {(isHyroTrader || editorialTitle) && <p className={styles.profileDescriptor}>{isHyroTrader ? 'Crypto prop firm with up to $200K simulated capital and on-demand payouts.' : editorialTitle}</p>}
              <p className={styles.profileBody}>{displayedDescription}</p>
              {research.editorialCopy?.['hero.attribution'] && <small className={styles.companyAttribution}>{research.editorialCopy['hero.attribution']}</small>}
              {xUrl && <a className={styles.xLink} href={xUrl} target="_blank" rel="noreferrer" aria-label={`${firm.name} on X`}><ExternalLink /><span>X profile</span></a>}
            </div>
          </div>
        </div>

        <aside className={styles.actionPanel}>
          <div className={styles.externalSignals}>
            <div className={styles.rating} aria-label={trustpilotRating ? `${trustpilotRating.score} out of 5 on Trustpilot from ${trustpilotRating.reviewCountLabel} reviews` : 'No external trader rating added'}>
              <div className={styles.ratingLine}>
                <strong>{trustpilotRating ? trustpilotRating.score.toFixed(1) : '—'}</strong>
                {trustpilotRating && <span className={styles.ratingOutOf}>/ 5</span>}
                <span>{trustpilotRating ? 'Trustpilot' : 'External rating'}</span>
              </div>
              <div className={styles.stars} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star data-filled={Boolean(trustpilotRating && index < Math.floor(trustpilotRating.score))} key={index} />)}</div>
              {trustpilotRating
                ? <small><a href={trustpilotRating.url} target="_blank" rel="noreferrer">Trustpilot · {trustpilotRating.reviewCountApproximate ? '≈' : ''}{trustpilotRating.reviewCountLabel} reviews</a></small>
                : <small>No rating added</small>}
            </div>
            {xUrl && <SorsaScoreBadge username={xHandle ?? ''} />}
          </div>
          <div className={styles.actions}>
            {website && <a href={website} target="_blank" rel="noreferrer">Visit {firm.name} <ExternalLink /></a>}
            {showCompareControls && <ProfileCompareButton firm={{ id: firm.id, name: firm.name, slug: firm.slug, logo: profileLogo(firm) }} />}
          </div>
          <dl className={styles.execution}>
            {actionFacts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </aside>
      </div>

      <div className={styles.decisionStrip} style={{ '--decision-columns': decisionFacts.length } as CSSProperties} aria-label={`Key ${firm.name} decision facts`}>
        {decisionFacts.map((fact) => <div data-tone={fact.tone} key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong><small>{fact.note}</small></div>)}
      </div>
    </section>
    {showCompareControls && <ProfileComparisonTray />}
    </>
  );
}

export const ProprEditorialHero = FirmEditorialHero;
