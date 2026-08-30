import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Star } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { ComparisonRangeProjection, FirmNormalizedProfile } from '@/types/database';
import { comparisonListText, comparisonRangeText, getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factValue, formatCapital, profileLogo, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
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

export function ProprEditorialHero({ firm }: { firm: FirmNormalizedProfile }) {
  const research = getFirmModularProfile(firm);
  const website = profileWebsite(firm);
  const xHandle = factValue(firm.identity.xHandle);
  const xUrl = xHandle ? `https://x.com/${xHandle.replace(/^@/, '')}` : undefined;
  const overviewTexts = research.sections
    .find((section) => section.id === 'overview')
    ?.blocks.filter((block) => block.type === 'text') ?? [];
  const identityText = overviewTexts.find((block) => /identity|operating model/i.test(block.title ?? ''));
  const description = identityText?.paragraphs[0]
    ?.replace(/^Mission\s*/i, '')
    ?? 'A crypto-native evaluation model built around Hyperliquid execution and on-chain settlement.';
  const platforms = factValue(firm.tradingPolicy.platforms) ?? [];
  const venue = factValue(firm.executionPolicy.venue) ?? platforms[0] ?? 'Not stated';
  const entry = rangePoint(research.comparison.entryCost, 'min') ?? 'Not stated';
  const capital = rangePoint(research.comparison.capital, 'max') ?? 'Not stated';
  const split = comparisonRangeText(research.comparison.profitSplit);
  const payout = comparisonListText(research.comparison.payoutSchedules);

  return (
    <section className={styles.hero} aria-labelledby="firm-profile-title">
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
              <span className={styles.modelLabel}>Evaluation infrastructure · Hyperliquid</span>
              <div className={styles.nameRow}>
                <h1 id="firm-profile-title">{firm.name}</h1>
                {xUrl && <a className={styles.xLink} href={xUrl} target="_blank" rel="noreferrer" aria-label={`${firm.name} on X`}><XMark /></a>}
              </div>
            </div>
            <p>{description}</p>
          </div>
        </div>

        <aside className={styles.actionPanel}>
          <div className={styles.rating} aria-label="0 out of 5 stars from 0 reviews">
            <div><strong>0.0</strong><span>Trader rating</span></div>
            <div className={styles.stars} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} />)}</div>
            <small>0 verified reviews</small>
          </div>
          <div className={styles.actions}>
            {website && <a href={website} target="_blank" rel="noreferrer">Visit {firm.name} <ExternalLink /></a>}
            <Link href={`/compare?ids=${firm.id}`}>Add to comparison <ArrowUpRight /></Link>
          </div>
          <dl className={styles.execution}>
            <div><dt>Trading venue</dt><dd>{venue}</dd></div>
            <div><dt>Account environment</dt><dd>{factValue(firm.compliancePolicy.simulatedAccounts) ? 'Simulated' : 'Not stated'}</dd></div>
            <div><dt>Settlement</dt><dd>{factValue(firm.executionPolicy.onchainSettlement) ? 'On-chain' : 'Not stated'}</dd></div>
          </dl>
        </aside>
      </div>

      <div className={styles.decisionStrip} aria-label="Key Propr decision facts">
        <div><span>Profit split</span><strong>{split}</strong><small>Funded stage</small></div>
        <div><span>Entry price</span><strong>From {entry}</strong><small>Turbo 1-Step</small></div>
        <div><span>Maximum capital</span><strong>Up to {capital}</strong><small>Per account tier</small></div>
        <div><span>Payout access</span><strong>{payout}</strong><small>Full-balance request</small></div>
        <div><span>Execution</span><strong>{platforms.slice(0, 2).join(' + ') || venue}</strong><small>Crypto perpetuals</small></div>
      </div>
    </section>
  );
}
