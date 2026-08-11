import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  Database,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Page directions · Design system lab',
  description: 'Private page-level visual directions for the PropHub design system.',
  robots: { index: false, follow: false },
};

const headline = (
  <>
    Find the right on-chain prop firm.
    <br />
    Compare the rules, proof and rewards before you pay.
  </>
);

function FirmPreview({ mode }: { mode: 'editorial' | 'contrast' | 'indigo' }) {
  return (
    <article className={`${styles.firmCard} ${styles[`${mode}Card`]}`}>
      <div className={styles.firmHead}>
        <div className={styles.firmIdentity}>
          <span className={styles.firmMark}>P</span>
          <div>
            <small>Research profile</small>
            <h4>Propr</h4>
          </div>
        </div>
        <span className={styles.status}><Database size={12} /> Demo data</span>
      </div>
      <p>On-chain challenge with public trading activity and a reported points program.</p>
      <div className={styles.metrics}>
        <div><small>Challenge</small><strong>$60</strong><span>From</span></div>
        <div><small>Profit split</small><strong>80%</strong><span>Up to</span></div>
        <div><small>Max funding</small><strong>$100K</strong><span>Available</span></div>
      </div>
      <div className={styles.cardFoot}>
        <span><ShieldCheck size={14} /> 6% static drawdown</span>
        <a href="#direction-review">View research <ArrowRight size={14} /></a>
      </div>
    </article>
  );
}

function MiniHeader({ mode }: { mode: 'editorial' | 'contrast' | 'indigo' }) {
  return (
    <header className={`${styles.previewHeader} ${styles[`${mode}Header`]}`}>
      <a className={styles.wordmark} href="#direction-review" aria-label="PropHub preview home">
        <ShieldCheck size={18} /> PropHub
      </a>
      <nav aria-label={`${mode} preview navigation`}>
        <a href="#direction-review">Prop firms</a>
        <a href="#direction-review">Compare</a>
        <a href="#direction-review">Rewards</a>
        <a href="#direction-review">Methodology</a>
      </nav>
      <a className={styles.headerAction} href="#direction-review">Browse firms</a>
    </header>
  );
}

export default function DesignDirectionsPage() {
  return (
    <main className={styles.lab}>
      <div className={styles.shell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link href="/design-system">Candidate A components</Link>
          <Link className={styles.labNavActive} href="/design-system/directions">Page directions</Link>
          <Link href="/design-system/cards">Card stress test</Link>
          <Link href="/design-system/home">Home prototype</Link>
        </nav>

        <header className={styles.intro}>
          <div>
            <span>PropHub design lab / Page-level test</span>
            <h1>Choose the atmosphere before polishing components.</h1>
          </div>
          <p>
            The same content is shown three ways. Compare the page background, header, hero,
            section transition and card treatment—not individual colors in isolation.
          </p>
        </header>

        <section className={styles.direction} aria-labelledby="editorial-title">
          <div className={styles.directionMeta}>
            <div><span>Direction A</span><h2 id="editorial-title">Editorial Graphite</h2></div>
            <p>Calm, spacious and research-led. Violet works as a signal, not a flood fill.</p>
            <div className={styles.metaTags}><span>Quiet confidence</span><span>Flat surfaces</span><span>Asymmetric hero</span></div>
          </div>
          <div className={`${styles.preview} ${styles.editorial}`}>
            <MiniHeader mode="editorial" />
            <div className={styles.editorialHero}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}><BadgeCheck size={14} /> Independent research</span>
                <h3>{headline}</h3>
                <p>Clear comparisons for crypto-native traders, backed by visible sources and review dates.</p>
                <div className={styles.actions}><a href="#direction-review">Browse firms <ArrowRight size={15} /></a><a href="#direction-review">Our methodology</a></div>
              </div>
              <aside className={styles.editorialNote}>
                <span>What matters</span>
                <strong>Rules first.<br />Rewards second.</strong>
                <p>Proof remains visible at every decision point.</p>
              </aside>
            </div>
            <div className={styles.editorialResearch}>
              <div className={styles.sectionTitle}><div><span>Explore</span><h3>Research starting points</h3></div><a href="#direction-review">View directory <ArrowRight size={14} /></a></div>
              <FirmPreview mode="editorial" />
            </div>
          </div>
        </section>

        <section className={styles.direction} aria-labelledby="contrast-title">
          <div className={styles.directionMeta}>
            <div><span>Direction B</span><h2 id="contrast-title">Light / Dark Contrast</h2></div>
            <p>A more welcoming editorial hero, followed by a serious dark research workspace.</p>
            <div className={styles.metaTags}><span>Most approachable</span><span>Clear sections</span><span>Broader audience</span></div>
          </div>
          <div className={`${styles.preview} ${styles.contrast}`}>
            <MiniHeader mode="contrast" />
            <div className={styles.contrastHero}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}><Sparkles size={14} /> Evidence over hype</span>
                <h3>{headline}</h3>
                <p>Understand the trade-offs without reading every rulebook first.</p>
                <div className={styles.actions}><a href="#direction-review">Browse firms <ArrowRight size={15} /></a><a href="#direction-review">How verification works</a></div>
              </div>
              <aside className={styles.evidencePanel}>
                <span className={styles.evidenceIcon}><BookOpen size={20} /></span>
                <small>Research snapshot</small>
                <strong>10 firms reviewed</strong>
                <ul><li><Check size={13} /> Rules normalized</li><li><Check size={13} /> Sources linked</li><li><Check size={13} /> Rewards separated</li></ul>
              </aside>
            </div>
            <div className={styles.contrastResearch}>
              <div className={styles.sectionTitle}><div><span>Compare with context</span><h3>Research starting points</h3></div><a href="#direction-review">View directory <ArrowRight size={14} /></a></div>
              <FirmPreview mode="contrast" />
            </div>
          </div>
        </section>

        <section className={styles.direction} aria-labelledby="indigo-title">
          <div className={styles.directionMeta}>
            <div><span>Direction C</span><h2 id="indigo-title">Deep Indigo</h2></div>
            <p>More crypto-native and energetic, while keeping the hierarchy disciplined.</p>
            <div className={styles.metaTags}><span>Crypto-native</span><span>Tonal depth</span><span>Compact energy</span></div>
          </div>
          <div className={`${styles.preview} ${styles.indigo}`}>
            <MiniHeader mode="indigo" />
            <div className={styles.indigoHero}>
              <span className={styles.eyebrow}><Scale size={14} /> Compare on equal terms</span>
              <h3>{headline}</h3>
              <p>One place for rules, on-chain evidence, points programs and trader-ready comparisons.</p>
              <div className={styles.actions}><a href="#direction-review">Explore prop firms <ArrowRight size={15} /></a><a href="#direction-review">See comparison model</a></div>
              <div className={styles.proofBar}>
                <div><Building2 size={15} /><span><strong>10+</strong> firms</span></div>
                <div><BadgeCheck size={15} /><span><strong>Manual</strong> reviews</span></div>
                <div><Sparkles size={15} /><span><strong>Points</strong> tracked</span></div>
              </div>
            </div>
            <div className={styles.indigoResearch}>
              <div className={styles.sectionTitle}><div><span>Shortlist faster</span><h3>Research starting points</h3></div><a href="#direction-review">View directory <ArrowRight size={14} /></a></div>
              <FirmPreview mode="indigo" />
            </div>
          </div>
        </section>

        <footer className={styles.review} id="direction-review">
          <span>Review order</span>
          <p>1. Overall atmosphere · 2. Header and hero · 3. Section transition · 4. Card treatment</p>
          <strong>We will refine only the strongest direction, then retest it on the real home and directory pages.</strong>
        </footer>
      </div>
    </main>
  );
}
