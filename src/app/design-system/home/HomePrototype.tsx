'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  Database,
  Gift,
  Layers3,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { ResearchCard } from '../cards/CardStressTest';
import { HeroChartBackdrop } from '@/components/home/HeroChartBackdrop';
import styles from './page.module.css';

export function HomePrototype({ featuredFirms }: { featuredFirms: PropFirm[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFirm = (slug: string) => {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  };

  return (
    <main className={styles.lab}>
      <div className={styles.labShell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link href="/design-system">Candidate A</Link>
          <Link href="/design-system/directions">Directions</Link>
          <Link href="/design-system/cards">Cards</Link>
          <Link className={styles.labNavActive} href="/design-system/home">Home prototype</Link>
          <Link href="/design-system/surfaces">Surfaces</Link>
          <Link href="/design-system/rebase">Rebase</Link>
        </nav>

        <div className={styles.prototype}>
          <header className={styles.siteHeader}>
            <a className={styles.wordmark} href="#top" aria-label="PropHub prototype home">
              <ShieldCheck aria-hidden="true" /> PropHub
            </a>
            <nav aria-label="Prototype navigation">
              <a href="#research">Prop firms</a>
              <a href="#research">Compare</a>
              <a href="#rewards">Rewards</a>
              <a href="#method">Methodology</a>
            </nav>
            <a className={styles.headerAction} href="#research">Browse firms</a>
          </header>

          <section className={styles.hero} id="top">
            <HeroChartBackdrop />
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}><Scale aria-hidden="true" /> Compare on equal terms</span>
              <h1>Find the right on-chain prop firm.</h1>
              <strong>Compare the rules, proof and rewards before you pay.</strong>
              <p>Independent research that turns scattered rules, on-chain evidence and reward programs into decisions traders can understand.</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#research">Explore prop firms <ArrowRight aria-hidden="true" /></a>
                <a className={styles.secondaryAction} href="#method">How verification works <ShieldCheck aria-hidden="true" /></a>
              </div>
              <div className={styles.proofBar} aria-label="Research overview">
                <div><Building2 aria-hidden="true" /><span><strong>10+</strong> firms tracked</span></div>
                <div><BadgeCheck aria-hidden="true" /><span><strong>Manual</strong> research reviews</span></div>
                <div><Database aria-hidden="true" /><span><strong>Visible</strong> data status</span></div>
                <div><Gift aria-hidden="true" /><span><strong>Points</strong> and rewards</span></div>
              </div>
            </div>
          </section>

          <section className={styles.research} id="research" aria-labelledby="research-heading">
            <div className={styles.sectionHeading}>
              <div><span>Research starting points</span><h2 id="research-heading">A shortlist with context built in.</h2></div>
              <div><p>Start with the trade-offs that matter, then open the full rule and source history when you need it.</p><Link href="/prop-firms">View directory <ArrowRight aria-hidden="true" /></Link></div>
            </div>
            <div className={styles.cardGrid}>
              {featuredFirms.map((firm) => (
                <ResearchCard
                  key={firm.slug}
                  firm={firm}
                  selected={selected.includes(firm.slug)}
                  onToggle={() => toggleFirm(firm.slug)}
                />
              ))}
            </div>
            <div className={styles.compareHint}>
              <Scale aria-hidden="true" />
              <span>{selected.length > 0 ? `${selected.length} selected for comparison` : 'Select firms to build a side-by-side comparison'}</span>
              <a href="#research">Open comparison <ArrowRight aria-hidden="true" /></a>
            </div>
          </section>

          <section className={styles.method} id="method" aria-labelledby="method-heading">
            <div className={styles.methodIntro}>
              <span>Research, not rankings</span>
              <h2 id="method-heading">Confidence should be visible, not implied.</h2>
              <p>PropHub separates what a firm says, what can be checked and what remains demo data. The trader sees the difference before making a purchase.</p>
              <Link href="/methodology">Read the methodology <ArrowRight aria-hidden="true" /></Link>
            </div>
            <div className={styles.methodSteps}>
              <article><span>01</span><BookOpen aria-hidden="true" /><h3>Rules made comparable</h3><p>Different language is translated into comparable evaluation, drawdown and payout fields.</p></article>
              <article><span>02</span><ShieldCheck aria-hidden="true" /><h3>Sources attached</h3><p>Material claims have a source, review status and date instead of an unexplained trust score.</p></article>
              <article><span>03</span><Layers3 aria-hidden="true" /><h3>Rewards separated</h3><p>Points, token utility and potential airdrops stay distinct from the core challenge economics.</p></article>
            </div>
          </section>

          <section className={styles.rewardSection} id="rewards" aria-labelledby="rewards-heading">
            <div className={styles.rewardVisual} aria-hidden="true">
              <div className={styles.rewardOrbit}><span>XP</span><span>PTS</span><span>Token</span></div>
              <Sparkles />
            </div>
            <div className={styles.rewardCopy}>
              <span>Reward intelligence</span>
              <h2 id="rewards-heading">A challenge can be more than a fee.</h2>
              <p>Track points programs, token utility and possible airdrops without confusing potential upside with verified value.</p>
              <div className={styles.rewardChecks}>
                <span><Check aria-hidden="true" /> Program status</span>
                <span><Check aria-hidden="true" /> Eligibility rules</span>
                <span><Check aria-hidden="true" /> Evidence and updates</span>
              </div>
              <Link href="/rewards">Explore rewards <ArrowRight aria-hidden="true" /></Link>
            </div>
          </section>

          <section className={styles.finalCta}>
            <div><span>Make the next challenge a researched decision.</span><h2>Start with rules. Verify the proof. Understand the reward.</h2></div>
            <Link href="/prop-firms">Browse all prop firms <ArrowRight aria-hidden="true" /></Link>
          </section>

          <footer className={styles.prototypeFooter}>
            <a className={styles.wordmark} href="#top"><ShieldCheck aria-hidden="true" /> PropHub</a>
            <p>Independent research for on-chain prop traders.</p>
            <span>Prototype / Not production</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
