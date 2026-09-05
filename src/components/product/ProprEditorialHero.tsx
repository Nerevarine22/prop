import type { CSSProperties } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { ComparisonRangeProjection, FirmNormalizedProfile, FirmNormalizedProfileV2 } from '@/types/database';
import { comparisonListText, comparisonRangeText, firmModelTypeLabel, getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factValue, formatCapital, profileLogo, profileTrustpilotRating, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
import { ProfileCompareButton, ProfileComparisonTray } from './ProfileCompareControl';
import styles from './ProprEditorialHero.module.css';

function XMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

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
    split !== 'Not published' ? { label: 'Profit split', value: split, note: 'Trader share', tone: 'value' } : undefined,
    entry ? { label: entryLabel, value: entryValue, note: research.comparison.entryCost.notes ?? 'Offer dependent', tone: 'condition' } : undefined,
    capital ? { label: 'Maximum capital', value: capitalValue, note: research.comparison.capital.notes ?? 'Offer dependent', tone: 'research' } : undefined,
    payout !== 'Not published' ? { label: 'Payout access', value: payout, note: research.comparison.payoutSchedules.notes ?? 'See payout terms', tone: 'settlement' } : undefined,
    execution !== 'ND' && execution !== 'N/A' ? { label: 'Execution', value: platforms.slice(0, 2).join(' + ') || execution, note: modelLabel, tone: 'settlement' } : undefined,
  ].filter((item): item is { label: string; value: string; note: string; tone: string } => Boolean(item));

  return (
    <>
    <section className={styles.hero} aria-labelledby="firm-profile-title" data-cms-hero>
      <div className={styles.ambient} aria-hidden="true" />

      <header className={styles.metaBar}>
        <span><i /> Independent research profile</span>
        <span>Reviewed {shortDate(research.checkedAt)}</span>
      </header>

      <div className={styles.heroBody}>
        <div className={styles.identity}>
          <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.logo} fallbackClassName={styles.fallback} />
          <div className={styles.identityCopy}>
            <div className={styles.identityHeader}>
              <span className={styles.modelLabel}>{modelLabel}</span>
              <div className={styles.nameRow}>
                <h1 id="firm-profile-title" data-long={firm.name.length > 13}>{firm.name}</h1>
                {xUrl && <a className={styles.xLink} href={xUrl} target="_blank" rel="noreferrer" aria-label={`${firm.name} on X`}><XMark /></a>}
              </div>
            </div>
            <p>{description}</p>
          </div>
        </div>

        <aside className={styles.actionPanel}>
          <div className={styles.rating} aria-label={trustpilotRating ? `${trustpilotRating.score} out of 5 on Trustpilot from ${trustpilotRating.reviewCountLabel} reviews` : 'No external trader rating added'}>
            <div><strong>{trustpilotRating ? trustpilotRating.score.toFixed(1) : '—'}</strong><span>{trustpilotRating ? 'Trustpilot' : 'External rating'}</span></div>
            <div className={styles.stars} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star data-filled={Boolean(trustpilotRating && index < Math.floor(trustpilotRating.score))} key={index} />)}</div>
            {trustpilotRating
              ? <small><a href={trustpilotRating.url} target="_blank" rel="noreferrer">{trustpilotRating.reviewCountApproximate ? '≈' : ''}{trustpilotRating.reviewCountLabel} reviews · external source</a></small>
              : <small>No rating added</small>}
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
