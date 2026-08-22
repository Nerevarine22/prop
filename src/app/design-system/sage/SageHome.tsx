'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Database,
  ExternalLink,
  GitCompareArrows,
  Monitor,
  Search,
  Shield,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { HeroChartBackdrop } from '@/components/home/HeroChartBackdrop';
import styles from './page.module.css';

const quickFilters = ['All firms', 'Points', 'Airdrop', '1-Step', 'Weekend holding'];

function SageCard({ firm }: { firm: PropFirm }) {
  const [compared, setCompared] = useState(false);
  const minPrice = firm.accountTiers[0]?.price ? `$${firm.accountTiers[0].price}` : '—';
  const profitSplit = firm.profitSplit.replace(/^Up to\s*/i, '');
  const maxFunding = `$${Math.round(firm.maxCapital / 1000)}K`;

  return (
    <article className={`${styles.card} ${compared ? styles.cardSelected : ''}`}>
      <header className={styles.cardHeader}>
        <Link href={`/prop-firms/${firm.slug}`} className={styles.identity}>
          <span className={styles.logoFrame}>
            <FirmLogo src={firm.logo} name={firm.name} fallbackClassName={styles.logoFallback} />
          </span>
          <span className={styles.identityCopy}>
            <span><BadgeCheck aria-hidden="true" /> Research profile</span>
            <strong>{firm.name}</strong>
            <small><Star aria-hidden="true" /> {firm.rating.toFixed(1)} · {firm.reviewCount.toLocaleString()} reviews</small>
          </span>
        </Link>
        <button
          type="button"
          className={styles.compareButton}
          aria-label={compared ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
          aria-pressed={compared}
          onClick={() => setCompared((value) => !value)}
        >
          <GitCompareArrows aria-hidden="true" />
          <span>{compared ? 'Added' : 'Compare'}</span>
        </button>
      </header>

      <div className={styles.tags}>
        <span className={styles.demoTag}><Database aria-hidden="true" /> Demo data</span>
        {firm.rewardTags?.slice(0, 3).map((tag) => (
          <span key={tag} className={styles.rewardTag}>{tag}</span>
        ))}
      </div>

      <p className={styles.summary}>{firm.tagline}</p>

      <Link href={`/prop-firms/${firm.slug}`} className={styles.metrics}>
        <span><small>Challenge</small><strong>{minPrice}</strong><i>From</i></span>
        <span><small>Profit split</small><strong>{profitSplit}</strong><i>Up to</i></span>
        <span><small>Max funding</small><strong>{maxFunding}</strong><i>Available</i></span>
      </Link>

      <div className={styles.rules}>
        <span><Shield aria-hidden="true" /> {firm.maxDrawdown}</span>
        <span><Zap aria-hidden="true" /> {firm.evaluationSteps.join(' / ')}</span>
        <span><Monitor aria-hidden="true" /> {firm.platforms.slice(0, 2).join(', ')}</span>
      </div>

      <div className={styles.promo}>
        <span><strong>Sample promo</strong> · Code {firm.verifiedCoupon?.code ?? '—'}</span>
      </div>

      <footer className={styles.cardFooter}>
        <a href={firm.website} target="_blank" rel="noopener noreferrer">Official site <ExternalLink aria-hidden="true" /></a>
        <Link href={`/prop-firms/${firm.slug}`}>View details <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </article>
  );
}

export function SageHome({ firms }: { firms: PropFirm[] }) {
  const [activeFilter, setActiveFilter] = useState('All firms');

  return (
    <main className={styles.lab}>
      <div className={styles.labShell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link href="/design-system">Components</Link>
          <Link href="/design-system/directions">Directions</Link>
          <Link href="/design-system/cards">Cards</Link>
          <Link href="/design-system/home">Indigo home</Link>
          <Link href="/design-system/surfaces">Surfaces</Link>
          <Link href="/design-system/rebase">Rebase</Link>
          <Link className={styles.labNavActive} href="/design-system/sage">Sage field</Link>
        </nav>

        <div className={styles.prototype}>
          <header className={styles.siteHeader}>
            <a className={styles.wordmark} href="#top" aria-label="PropHub sage prototype home">
              <span>PH</span> PropHub
            </a>
            <nav aria-label="Prototype navigation">
              <a href="#firms">Prop firms</a>
              <a href="#firms">Compare</a>
              <a href="#rewards">Rewards</a>
              <a href="#about">How it works</a>
            </nav>
            <a className={styles.headerAction} href="#firms">Browse firms</a>
          </header>

          <section className={styles.hero} id="top">
            <div className={styles.chartLayer}><HeroChartBackdrop tone="sage" /></div>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}><BadgeCheck aria-hidden="true" /> Research field active</span>
              <h1>Find the right on-chain prop firm.</h1>
              <strong>Compare the rules, proof and rewards before you pay.</strong>
              <p>A calmer research layer for traders: core costs first, verification when it matters, reward potential clearly separated.</p>
              <div className={styles.heroActions}>
                <a href="#firms">Browse prop firms <ArrowRight aria-hidden="true" /></a>
                <a href="#about">How comparisons work</a>
              </div>
              <div className={styles.marketPulse} aria-label="Research pulse">
                <div><span>Research coverage</span><strong>10</strong><small>profiles in the demo</small></div>
                <div><span>Average reward signal</span><strong className={styles.positive}><TrendingUp aria-hidden="true" /> +12.4%</strong><small>illustrative status</small></div>
                <div><span>Primary focus</span><strong>On-chain</strong><small>rules, proof, rewards</small></div>
              </div>
            </div>
          </section>

          <section className={styles.directoryPreview} id="firms">
            <div className={styles.workspace}>
              <header className={styles.sectionHeading}>
                <div><span>Research workspace</span><h2>Three profiles worth opening first.</h2></div>
                <div><p>Quiet surfaces for scanning. Real logos and reward colours keep the directory human.</p><Link href="/prop-firms">View all firms <ArrowRight aria-hidden="true" /></Link></div>
              </header>

              <div className={styles.quickTools}>
                <label><Search aria-hidden="true" /><span className="sr-only">Search firms</span><input type="search" placeholder="Search firms or platforms" /></label>
                <div>
                  {quickFilters.map((filter) => (
                    <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
                  ))}
                </div>
              </div>

              <div className={styles.cardGrid}>{firms.map((firm) => <SageCard key={firm.id} firm={firm} />)}</div>

              <div className={styles.browseRow}>
                <div><span>Comparison field</span><strong>Put two firms on equal terms.</strong></div>
                <Link href="/compare">Open comparison <GitCompareArrows aria-hidden="true" /></Link>
              </div>
            </div>
          </section>

          <section className={styles.rewardBand} id="rewards">
            <div><Bot aria-hidden="true" /><span>Rewards + AI layer</span></div>
            <strong>Violet stays where the product becomes speculative, assisted or reward-driven.</strong>
            <div className={styles.rewardTags}><span>Points</span><span>Airdrops</span><span>AI analysis</span></div>
          </section>

          <section className={styles.about} id="about">
            <div><span>Serious, not severe</span><h2>Trading context without a terminal interface.</h2></div>
            <div className={styles.aboutSteps}>
              <article><strong>01</strong><h3>Sage for trust</h3><p>Research, verification and primary actions share one calm field colour.</p></article>
              <article><strong>02</strong><h3>Grain for depth</h3><p>Static texture makes dark surfaces tactile without glass or heavy shadows.</p></article>
              <article><strong>03</strong><h3>Violet for upside</h3><p>Rewards and AI remain distinct from the core challenge economics.</p></article>
            </div>
          </section>

          <footer className={styles.prototypeFooter}><span>Sage field / colour hypothesis</span><p>Muted green for research. Violet for rewards and AI.</p></footer>
        </div>
      </div>
    </main>
  );
}
