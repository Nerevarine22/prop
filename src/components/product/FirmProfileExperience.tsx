import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, FileCheck2, Star } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { ComparisonRangeProjection, FirmContentFact, FirmNormalizedProfile } from '@/types/database';
import { comparisonListText, comparisonRangeText, firmModelTypeLabel, getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factText, factValue, formatCapital, profileLogo, profileSourceCount, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
import { FirmResearchTabs } from './FirmResearchTabs';
import styles from '@/app/product-lab/page.module.css';

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

function compactAccessLabel(value: string): string {
  const knownNames = ['Hyperliquid', 'Propr terminal', 'Arbitrum', 'Robinhood Chain', 'Solana', 'Ethereum', 'HyperEVM', 'Base', 'TON', 'BSC', 'Bybit', 'cTrader', 'MT5', 'MT4', 'TradeLocker', 'Match-Trader'];
  const matches = knownNames.filter((name) => value.toLowerCase().includes(name.toLowerCase()));
  if (matches.length) return [...new Set(matches)].slice(0, 3).join(' · ');
  return value.length <= 48 ? value : `${value.slice(0, 45).trimEnd()}…`;
}

export function FirmProfileExperience({ firm }: { firm: FirmNormalizedProfile }) {
  const modularProfile = getFirmModularProfile(firm);
  const isModelFirst = modularProfile.researchStandard === 'model-first-v1';
  const isManualResearch = modularProfile.researchMode === 'manual';
  const evidenceLabel = isManualResearch ? 'Manual research record' : isModelFirst ? 'Model-first primary-source record' : 'Primary-source record';
  const offerUrl = profileWebsite(firm);
  const facts = new Map<string, FirmContentFact>();
  for (const section of modularProfile.sections) {
    for (const block of section.blocks) {
      if (block.type === 'fact-grid') block.items.forEach((item) => facts.set(item.id, item));
      if (block.type === 'record-list') block.items.flatMap((item) => item.facts ?? []).forEach((item) => facts.set(item.id, item));
    }
  }
  const modelFirstNdCount = [...facts.values()].filter((fact) => fact.status === 'ND').length;
  const displayedNdCount = isModelFirst ? modelFirstNdCount : firm.ndFields.length;
  const sourceCount = modularProfile.sourcesInspected
    ? new Set(modularProfile.sourcesInspected.map((source) => source.url)).size
    : profileSourceCount(firm);
  const checkedAt = isModelFirst ? modularProfile.checkedAt : firm.checkedAt;
  const storedDescription = factValue(firm.identity.description);
  const overviewNarratives = modularProfile.sections
    .find((section) => section.id === 'overview')
    ?.blocks.filter((block) => block.type === 'text') ?? [];
  const preferredNarrative = overviewNarratives.find((block) => (
    /about|identity|operating model|project overview/i.test(block.title ?? '')
  )) ?? overviewNarratives[0];
  const heroDescription = (storedDescription && storedDescription.length > 48 ? storedDescription : undefined)
    ?? preferredNarrative?.paragraphs[0]
    ?? factValue(firm.identity.tagline)
    ?? modularProfile.operatingModel?.classification.value
    ?? 'Independent research profile built from available first-party sources.';
  const xHandle = factValue(firm.identity.xHandle);
  const xUrl = xHandle ? `https://x.com/${xHandle.replace(/^@/, '')}` : undefined;
  const modelLabels = modularProfile.modelTypes.map(firmModelTypeLabel);
  const offerText = modularProfile.offerNames.join(' ');
  const programLabels = [
    /(?:^|\W)1[- ]?(?:step|phase)(?:\W|$)/i.test(offerText) ? '1-Step' : undefined,
    /(?:^|\W)2[- ]?(?:step|phase)(?:\W|$)/i.test(offerText) ? '2-Step' : undefined,
    /instant/i.test(offerText) ? 'Instant funding' : undefined,
  ].filter((value): value is string => Boolean(value));
  const platformValues = factValue(firm.tradingPolicy.platforms) ?? [];
  const recordedAccess = platformValues.join(' · ')
    || factValue(firm.executionPolicy.venue)
    || [...facts.values()].find((fact) => /^(platforms?|venue|supported deployments|where it runs|network|chain)$/i.test(fact.label) && fact.status !== 'ND')?.value;
  const splitText = comparisonRangeText(modularProfile.comparison.profitSplit);
  const payoutText = comparisonListText(modularProfile.comparison.payoutSchedules);
  const programText = programLabels.length
    ? `${programLabels.join(' · ')} ${programLabels.some((label) => label === 'Instant funding') ? 'programs' : 'evaluation'}`
    : `${modelLabels.join(' · ')} model`;
  const minimumEntry = rangePoint(modularProfile.comparison.entryCost, 'min');
  const maximumCapital = rangePoint(modularProfile.comparison.capital, 'max');
  const heroTags = [
    splitText !== 'ND' && splitText !== 'N/A' ? `${splitText} profit split` : undefined,
    payoutText !== 'ND' && payoutText !== 'N/A' ? `${payoutText} payouts` : undefined,
    programText,
    minimumEntry ? `From ${minimumEntry}` : undefined,
    maximumCapital ? `Up to ${maximumCapital} capital` : undefined,
    recordedAccess ? compactAccessLabel(recordedAccess) : undefined,
  ].filter((value): value is string => Boolean(value));
  const evidenceDescription = isManualResearch
    ? 'This profile was structured from a human-authored research file. Only recorded facts are published; remaining gaps stay outside the profile until the next research pass.'
    : isModelFirst
      ? 'The profile follows this project’s own operating model. Every claim is linked to primary evidence, and differing official sources remain visible.'
    : 'Claims are manually extracted from official sources. ND means the value was not documented; resolved source differences remain visible with both URLs.';

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>

      <section className={styles.profileHero} aria-labelledby="firm-profile-title">
        <div className={styles.profileHeroTop}>
          <div className={styles.profileIdentity}>
            <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
            <div>
              <span className={styles.kicker}><span /> Research profile</span>
              <div className={styles.profileNameRow}>
                <h1 id="firm-profile-title">{firm.name}</h1>
                {xUrl && <div className={styles.profileSocials} aria-label={`${firm.name} social links`}><a href={xUrl} target="_blank" rel="noreferrer" aria-label={`${firm.name} on X`}><XMark /></a></div>}
              </div>
            </div>
          </div>

          <div className={styles.profileHeroControls}>
            <div className={styles.profileActions}>
              {offerUrl && <a className={styles.primaryProfileAction} href={offerUrl} target="_blank" rel="noreferrer">Visit {firm.name} <ExternalLink /></a>}
              <Link className={styles.compactCompareAction} href={`/compare?ids=${firm.id}`}>+ Compare</Link>
            </div>
          </div>
        </div>

        <div className={styles.profileAbout}>
          <h2>About {firm.name}</h2>
          <p>{heroDescription}</p>
        </div>

        <div className={styles.profileHeroBottom}>
          {!!heroTags.length && <div className={styles.profileHeroFacts} aria-label="Key firm facts">
            {heroTags.map((item) => <article key={item}><Check /><strong>{item}</strong></article>)}
          </div>}
          <div className={styles.profileRating} aria-label="0 out of 5 stars from 0 reviews">
            <strong className={styles.profileRatingValue}>0.0</strong>
            <div className={styles.profileRatingStars} aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} />)}
            </div>
            <span className={styles.profileRatingReviews}>0 reviews</span>
          </div>
        </div>
      </section>

      <section className={styles.profileLayout}>
        <main className={styles.profilePrimary}><FirmResearchTabs firm={firm} offerUrl={offerUrl} /></main>
        <aside className={styles.profileAside}>
          <section className={styles.evidenceCard}>
            <div><FileCheck2 /><span>Evidence status</span></div>
            <strong>{evidenceLabel}</strong>
            <p>{evidenceDescription}</p>
            <dl><div><dt>Last reviewed</dt><dd>{shortDate(checkedAt)}</dd></div><div><dt>Sources attached</dt><dd>{sourceCount}</dd></div><div><dt>Method</dt><dd>{isManualResearch ? 'Manual research · structured import' : isModelFirst ? 'Model first · primary only' : 'Primary sources only'}</dd></div><div><dt>Profile facts</dt><dd>{facts.size}</dd></div><div><dt>Not documented</dt><dd>{displayedNdCount}</dd></div></dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
