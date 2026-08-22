'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  Bot,
  Database,
  Gift,
  Moon,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { FirmLogo } from '@/components/firms/FirmLogo';
import styles from './page.module.css';

type Direction = 'soft' | 'editorial';

const filters = [
  { id: 'all', label: 'All firms' },
  { id: 'points', label: 'Points', icon: Sparkles },
  { id: 'airdrop', label: 'Airdrop', icon: Gift },
  { id: 'weekend', label: 'Weekend', icon: Moon },
  { id: 'bots', label: 'Bots allowed', icon: Bot },
];

function FilterPreview({ direction }: { direction: Direction }) {
  const [active, setActive] = useState('all');

  return (
    <div className={direction === 'soft' ? styles.softFilters : styles.editorialFilters}>
      <div className={styles.filterHeading}>
        <div>
          <span>{direction === 'soft' ? 'Find your fit' : 'Explore the directory'}</span>
          <strong>10 firms to compare</strong>
        </div>
        <button type="button"><ArrowDownUp aria-hidden="true" /> Trust score</button>
      </div>

      <label className={styles.searchField}>
        <Search aria-hidden="true" />
        <span className="sr-only">Search firms</span>
        <input type="search" placeholder="Search by firm, platform or feature" />
        <kbd>⌘ K</kbd>
      </label>

      <div className={styles.filterRow} aria-label="Example firm filters">
        {filters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            className={active === id ? styles.activeChip : ''}
            onClick={() => setActive(id)}
          >
            {Icon && <Icon aria-hidden="true" />}
            {label}
          </button>
        ))}
        <button type="button" className={styles.moreFilters}><SlidersHorizontal aria-hidden="true" /> More filters</button>
      </div>
    </div>
  );
}

function FirmPreview({ firm, direction }: { firm: PropFirm; direction: Direction }) {
  const [compared, setCompared] = useState(false);
  const minPrice = firm.accountTiers[0]?.price ? `$${firm.accountTiers[0].price}` : '—';
  const profitSplit = firm.profitSplit.replace(/^Up to\s*/i, '');
  const maxFunding = `$${Math.round(firm.maxCapital / 1000)}K`;
  const cardStyle = { '--brand': firm.brandColor ?? '#615fff' } as CSSProperties;

  return (
    <article
      className={direction === 'soft' ? styles.softCard : styles.editorialCard}
      style={cardStyle}
    >
      <header className={styles.cardHeader}>
        <div className={styles.identity}>
          <span className={styles.logoWell}>
            <FirmLogo src={firm.logo} name={firm.name} fallbackClassName={styles.logoFallback} />
          </span>
          <div>
            <span className={styles.profileStatus}><BadgeCheck aria-hidden="true" /> Demo profile</span>
            <h3>{firm.name}</h3>
            <p><Star aria-hidden="true" /> {firm.rating.toFixed(1)} from {firm.reviewCount.toLocaleString()} reviews</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.compareToggle}
          aria-pressed={compared}
          onClick={() => setCompared((value) => !value)}
        >
          <span aria-hidden="true" />
          {compared ? 'Added' : 'Compare'}
        </button>
      </header>

      <div className={styles.tags}>
        <span className={styles.proofTag}><Database aria-hidden="true" /> Demo data</span>
        {firm.rewardTags?.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <p className={styles.summary}>A crypto-native challenge with transparent rules, points potential and on-chain context.</p>

      <div className={styles.metrics}>
        <div><span>Starts at</span><strong>{minPrice}</strong><small>Challenge fee</small></div>
        <div><span>Keep up to</span><strong>{profitSplit}</strong><small>Profit split</small></div>
        <div><span>Trade with</span><strong>{maxFunding}</strong><small>Max funding</small></div>
      </div>

      <div className={styles.rules}>
        <span><Shield aria-hidden="true" /> {firm.maxDrawdown}</span>
        <span><Zap aria-hidden="true" /> {firm.evaluationSteps[0]}</span>
        <span>{firm.platforms[0]}</span>
      </div>

      <footer className={styles.cardFooter}>
        <div><span>Sample reward</span><strong>Points + potential airdrop</strong></div>
        <Link href={`/prop-firms/${firm.slug}`}>View research <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </article>
  );
}

function DirectionPanel({ firm, direction }: { firm: PropFirm; direction: Direction }) {
  const isSoft = direction === 'soft';

  return (
    <section className={`${styles.direction} ${isSoft ? styles.softDirection : styles.editorialDirection}`}>
      <header className={styles.directionHeader}>
        <div><span>{isSoft ? 'Direction A' : 'Direction B'}</span><h2>{isSoft ? 'Soft Layered' : 'Editorial Contrast'}</h2></div>
        <p>{isSoft ? 'An evolution of Deep Indigo with softer layers, friendlier controls and restrained depth.' : 'A bolder dark-to-light rhythm that makes every firm feel like a product worth opening.'}</p>
      </header>

      <div className={styles.canvas}>
        <FilterPreview direction={direction} />
        <div className={styles.resultLabel}><span>Recommended starting point</span><strong>Realistic three-column width</strong></div>
        <FirmPreview firm={firm} direction={direction} />
      </div>

      <footer className={styles.directionNotes}>
        <span>{isSoft ? 'Likely safer' : 'More expressive'}</span>
        <p>{isSoft ? 'Keeps the current dark identity while removing dashboard flatness.' : 'Creates stronger section rhythm and feels less like a financial terminal.'}</p>
      </footer>
    </section>
  );
}

export function SurfaceDirections({ firm }: { firm: PropFirm }) {
  return (
    <main className={styles.lab}>
      <div className={styles.shell}>
        <nav className={styles.labNav} aria-label="Design lab navigation">
          <Link href="/design-system">Components</Link>
          <Link href="/design-system/directions">Directions</Link>
          <Link href="/design-system/cards">Cards</Link>
          <Link href="/design-system/home">Home prototype</Link>
          <Link className={styles.labNavActive} href="/design-system/surfaces">Surfaces</Link>
          <Link href="/design-system/rebase">Rebase</Link>
        </nav>

        <header className={styles.intro}>
          <div><span>PropHub design lab / Focused test</span><h1>Same structure. A less serious skin.</h1></div>
          <p>Compare the feeling of the filters and card—not the content. Both use the same firm, metrics and actions.</p>
        </header>

        <div className={styles.directionGrid}>
          <DirectionPanel firm={firm} direction="soft" />
          <DirectionPanel firm={firm} direction="editorial" />
        </div>

        <footer className={styles.reviewGuide}>
          <span>Look for three things</span>
          <div><strong>01</strong><p>Which surface feels inviting without becoming promotional?</p></div>
          <div><strong>02</strong><p>Which filter treatment feels easier before you even click it?</p></div>
          <div><strong>03</strong><p>Which card makes you want to open the research profile?</p></div>
        </footer>
      </div>
    </main>
  );
}
