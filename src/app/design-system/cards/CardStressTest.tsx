'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Database,
  Layers3,
  Monitor,
  Scale,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { FirmLogo as ResilientFirmLogo } from '@/components/firms/FirmLogo';
import styles from './page.module.css';

type LogoTreatment = 'contained' | 'bare' | 'brandKeyed';

function FirmLogo({ firm, treatment = 'contained' }: { firm: PropFirm; treatment?: LogoTreatment }) {
  const style = { '--firm-brand': firm.brandColor ?? '#615fff' } as CSSProperties;

  return (
    <span className={`${styles.logoFrame} ${styles[treatment]}`} style={style}>
      <ResilientFirmLogo src={firm.logo} name={firm.name} fallbackClassName={styles.logoFallback} />
    </span>
  );
}

export function ResearchCard({
  firm,
  selected,
  onToggle,
  compact = false,
}: {
  firm: PropFirm;
  selected: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  const minPrice = firm.accountTiers[0]?.price ? `$${firm.accountTiers[0].price}` : '—';
  const profitSplit = firm.profitSplit.replace(/^Up to\s*/i, '');
  const maxFunding = `$${Math.round(firm.maxCapital / 1000)}K`;

  return (
    <article className={`${styles.researchCard} ${selected ? styles.selected : ''} ${compact ? styles.compactCard : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.identity}>
          <FirmLogo firm={firm} />
          <div>
            <span>Research profile</span>
            <h3>{firm.name}</h3>
            <small>{firm.dataStatus === 'mock' ? 'Demo research data' : firm.dataStatus}</small>
          </div>
        </div>
        <button
          type="button"
          aria-label={selected ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
          aria-pressed={selected}
          onClick={onToggle}
        >
          {selected ? <Check aria-hidden="true" /> : <Scale aria-hidden="true" />}
          <span>{selected ? 'Added' : 'Compare'}</span>
        </button>
      </div>

      {!compact && <p className={styles.summary}>{firm.tagline}</p>}

      <div className={styles.metrics}>
        <div><span>Challenge</span><strong>{minPrice}</strong><small>From</small></div>
        <div><span>Profit split</span><strong>{profitSplit}</strong><small>Up to</small></div>
        <div><span>Max funding</span><strong>{maxFunding}</strong><small>Available</small></div>
      </div>

      {!compact && (
        <div className={styles.rules}>
          <span><Shield aria-hidden="true" /> {firm.maxDrawdown}</span>
          <span><Layers3 aria-hidden="true" /> {firm.evaluationSteps.join(' / ')}</span>
          <span><Monitor aria-hidden="true" /> {firm.platforms.slice(0, 2).join(', ')}</span>
        </div>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.demo}><Database aria-hidden="true" /> Demo data</span>
        <Link href={`/prop-firms/${firm.slug}`}>View research <ArrowRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export function CardStressTest({ firms }: { firms: PropFirm[] }) {
  const [selected, setSelected] = useState<string[]>([firms[1]?.slug].filter(Boolean) as string[]);
  const logoFirms = firms.slice(0, 4);
  const surfaceFirms = firms.slice(0, 3);

  const toggleFirm = (slug: string) => {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  };

  return (
    <main className={styles.lab}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.shell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link href="/design-system">Candidate A</Link>
          <Link href="/design-system/directions">Page directions</Link>
          <Link className={styles.labNavActive} href="/design-system/cards">Card stress test</Link>
          <Link href="/design-system/home">Home prototype</Link>
        </nav>

        <header className={styles.intro}>
          <div>
            <span>PropHub design lab / Real content test</span>
            <h1>Let the firms keep their identity without taking over the interface.</h1>
          </div>
          <div className={styles.decision}>
            <BadgeCheck aria-hidden="true" />
            <div><span>Working direction</span><strong>Deep Indigo hero + neutral research cards</strong><p>Brand color is contained inside the logo treatment. No card glow.</p></div>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="logo-heading">
          <div className={styles.sectionHeading}>
            <div><span>01 / Logo resilience</span><h2 id="logo-heading">One logo set, three treatments</h2></div>
            <p>Testing black, colorful and gradient avatars before choosing a permanent container.</p>
          </div>
          <div className={styles.treatmentGrid}>
            <article className={`${styles.treatment} ${styles.recommended}`}>
              <div><span>Recommended</span><h3>Neutral container</h3><p>Consistent silhouette and reliable contrast across every brand.</p></div>
              <div className={styles.logoRow}>{logoFirms.map((firm) => <FirmLogo key={firm.slug} firm={firm} treatment="contained" />)}</div>
            </article>
            <article className={styles.treatment}>
              <div><span>Alternative</span><h3>Bare asset</h3><p>Feels lighter, but transparent and dark marks become unpredictable.</p></div>
              <div className={styles.logoRow}>{logoFirms.map((firm) => <FirmLogo key={firm.slug} firm={firm} treatment="bare" />)}</div>
            </article>
            <article className={styles.treatment}>
              <div><span>Alternative</span><h3>Brand-keyed edge</h3><p>More identity, with a higher risk of a visually noisy directory.</p></div>
              <div className={styles.logoRow}>{logoFirms.map((firm) => <FirmLogo key={firm.slug} firm={firm} treatment="brandKeyed" />)}</div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cards-heading">
          <div className={styles.sectionHeading}>
            <div><span>02 / Full-card stress test</span><h2 id="cards-heading">Real firms on the working background</h2></div>
            <p>Hover is intentionally quiet. Use Compare to test a persistent selected state.</p>
          </div>
          <div className={styles.cardGrid}>
            {firms.map((firm) => (
              <ResearchCard
                key={firm.slug}
                firm={firm}
                selected={selected.includes(firm.slug)}
                onToggle={() => toggleFirm(firm.slug)}
              />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="surface-heading">
          <div className={styles.sectionHeading}>
            <div><span>03 / Surface comparison</span><h2 id="surface-heading">The card stays stable when the page tone changes</h2></div>
            <p>The surrounding surface changes; hierarchy, logo container and interaction do not.</p>
          </div>
          <div className={styles.surfaceGrid}>
            <div className={`${styles.surface} ${styles.graphiteSurface}`}>
              <span>Editorial Graphite</span>
              <ResearchCard firm={surfaceFirms[0]} selected={false} onToggle={() => toggleFirm(surfaceFirms[0].slug)} compact />
            </div>
            <div className={`${styles.surface} ${styles.indigoSurface}`}>
              <span>Deep Indigo</span>
              <ResearchCard firm={surfaceFirms[0]} selected={true} onToggle={() => toggleFirm(surfaceFirms[0].slug)} compact />
            </div>
          </div>
        </section>

        <footer className={styles.reviewNote}>
          <Sparkles aria-hidden="true" />
          <div><span>What to judge now</span><p>Logo balance, information density, selected state and whether the card feels neutral enough beside the decorative hero.</p></div>
        </footer>
      </div>
    </main>
  );
}
