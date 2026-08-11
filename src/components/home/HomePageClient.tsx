'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  BookOpen,
  Bot,
  Building2,
  Check,
  Database,
  Gift,
  Layers3,
  Moon,
  Scale,
  Search,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { MOCK_COUPONS, MOCK_PROP_FIRMS } from '@/lib/data/firms';
import type { EvaluationStep, PropFirm } from '@/types/firm';
import { FirmCard } from '@/components/firms/FirmCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import styles from './HomePageClient.module.css';
import { HeroChartBackdrop } from './HeroChartBackdrop';

interface HomePageClientProps {
  mode?: 'home' | 'directory';
  initialSearch?: string;
  initialStep?: string;
}

const evaluationOptions = [
  { id: 'all', label: 'All' },
  { id: '1-Step', label: '1-Step' },
  { id: '2-Step', label: '2-Step' },
  { id: 'Instant Funding', label: 'Instant' },
];

const profitOptions = [
  { id: 'all', label: 'All' },
  { id: '90', label: '90%+' },
  { id: '95', label: '95%+' },
];

export function HomePageClient({ mode = 'home', initialSearch = '', initialStep = 'all' }: HomePageClientProps) {
  const firms: PropFirm[] = MOCK_PROP_FIRMS;
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedStep, setSelectedStep] = useState(initialStep);
  const [minProfitSplit, setMinProfitSplit] = useState('all');
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [eaAllowedOnly, setEaAllowedOnly] = useState(false);
  const [hasPointsOnly, setHasPointsOnly] = useState(false);
  const [hasTokenOnly, setHasTokenOnly] = useState(false);
  const [confirmedAirdropOnly, setConfirmedAirdropOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'trust' | 'split' | 'price' | 'capital'>('trust');
  const [selectedFirmIds, setSelectedFirmIds] = useState<string[]>([]);

  const filteredFirms = useMemo(() => {
    return firms
      .filter((firm) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matches =
            firm.name.toLowerCase().includes(query) ||
            firm.tagline.toLowerCase().includes(query) ||
            firm.platforms.some((platform) => platform.toLowerCase().includes(query)) ||
            firm.rewardTags?.some((tag) => tag.toLowerCase().includes(query));
          if (!matches) return false;
        }

        if (selectedStep !== 'all' && !firm.evaluationSteps.includes(selectedStep as EvaluationStep)) return false;
        if (minProfitSplit === '90' && !firm.profitSplit.includes('90%') && !firm.profitSplit.includes('95%')) return false;
        if (minProfitSplit === '95' && !firm.profitSplit.includes('95%')) return false;
        if (newsAllowedOnly && !firm.newsTradingAllowed) return false;
        if (weekendAllowedOnly && !firm.weekendHoldingAllowed) return false;
        if (eaAllowedOnly && !firm.eaAllowed) return false;
        if (hasPointsOnly && !firm.rewardTags?.includes('Points')) return false;
        if (hasTokenOnly && !firm.rewardTags?.includes('Token')) return false;
        if (confirmedAirdropOnly && !firm.rewardTags?.includes('Airdrop')) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trust') return b.trustScore - a.trustScore;
        if (sortBy === 'split') return (parseInt(b.profitSplit.replace(/\D/g, '')) || 0) - (parseInt(a.profitSplit.replace(/\D/g, '')) || 0);
        if (sortBy === 'price') return (a.accountTiers[0]?.price || 999) - (b.accountTiers[0]?.price || 999);
        if (sortBy === 'capital') return b.maxCapital - a.maxCapital;
        return 0;
      });
  }, [firms, searchQuery, selectedStep, minProfitSplit, newsAllowedOnly, weekendAllowedOnly, eaAllowedOnly, hasPointsOnly, hasTokenOnly, confirmedAirdropOnly, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedStep !== 'all' ||
      minProfitSplit !== 'all' ||
      newsAllowedOnly ||
      weekendAllowedOnly ||
      eaAllowedOnly ||
      hasPointsOnly ||
      hasTokenOnly ||
      confirmedAirdropOnly,
  );

  const visibleFirms = mode === 'home' ? filteredFirms.slice(0, 3) : filteredFirms;
  const compareHref = selectedFirmIds.length ? `/compare?ids=${selectedFirmIds.join(',')}` : '/compare';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStep('all');
    setMinProfitSplit('all');
    setNewsAllowedOnly(false);
    setWeekendAllowedOnly(false);
    setEaAllowedOnly(false);
    setHasPointsOnly(false);
    setHasTokenOnly(false);
    setConfirmedAirdropOnly(false);
    setSortBy('trust');
  };

  const toggleCompare = (firm: PropFirm) => {
    setSelectedFirmIds((current) => {
      if (current.includes(firm.id)) return current.filter((id) => id !== firm.id);
      if (current.length >= 4) return current;
      return [...current, firm.id];
    });
  };

  return (
    <div className={styles.page}>
      {mode === 'home' && (
        <section className={styles.hero} aria-labelledby="home-heading">
          <HeroChartBackdrop tone="sage" />
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}><Scale aria-hidden="true" /> Compare on equal terms</span>
            <h1 id="home-heading">
              <span className={styles.heroLine}>Find the right <span className={styles.noWrap}>on-chain</span></span>
              <span className={styles.heroLine}>prop firm.</span>
            </h1>
            <strong>Compare the rules, proof and rewards before you pay.</strong>
            <p>Independent research that turns scattered rules, on-chain evidence and reward programs into decisions traders can understand.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} href="/prop-firms">Explore prop firms <ArrowRight aria-hidden="true" /></Link>
              <Link className={styles.secondaryAction} href="/methodology">How verification works <ShieldCheck aria-hidden="true" /></Link>
            </div>
            <div className={styles.proofBar} aria-label="Research overview">
              <div><Building2 aria-hidden="true" /><span><strong>{firms.length}+</strong> firms tracked</span></div>
              <div><BadgeCheck aria-hidden="true" /><span><strong>Manual</strong> research reviews</span></div>
              <div><Database aria-hidden="true" /><span><strong>Visible</strong> data status</span></div>
              <div><Gift aria-hidden="true" /><span><strong>Points</strong> and rewards</span></div>
            </div>
          </div>
        </section>
      )}

      <section className={`${styles.research} ${mode === 'directory' ? styles.directoryResearch : ''}`} aria-labelledby="research-heading">
        <div className={styles.researchWorkspace}>
        {mode === 'home' && (
          <div className={styles.sectionHeading}>
            <div><span>Research starting points</span><h2 id="research-heading">Three profiles worth opening first.</h2></div>
            <div><p>See the price, core rules and reward tags first. Open the research profile when you need the full context.</p><Link href="/prop-firms">View directory <ArrowRight aria-hidden="true" /></Link></div>
          </div>
        )}

        {mode === 'directory' && (
          <>
            <div className={styles.directoryHeading}>
              <div><h1 id="research-heading">Find a workable challenge model.</h1></div>
              <p>Filter the current demo records by evaluation, economics, trading permissions and reward structure.</p>
            </div>
            <div className={styles.filterPanel}>
              <div className={styles.filterTopRow}>
                <label className={styles.searchField}>
                  <span>Search firms</span>
                  <div className={styles.searchControl}>
                    <Search aria-hidden="true" />
                    <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Name, platform or feature" />
                    {searchQuery && <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')}><X aria-hidden="true" /></button>}
                  </div>
                </label>
                <div className={styles.sortControl}>
                  <span>Sort by</span>
                  <CustomSelect
                    value={sortBy}
                    onChange={(value) => setSortBy(value as typeof sortBy)}
                    icon={<ArrowUpDown aria-hidden="true" />}
                    buttonClassName={styles.directorySortButton}
                    options={[
                      { value: 'trust', label: 'Highest trust score' },
                      { value: 'split', label: 'Highest profit split' },
                      { value: 'price', label: 'Lowest entry price' },
                      { value: 'capital', label: 'Maximum funding' },
                    ]}
                  />
                </div>
              </div>

              <div className={styles.filterGroups}>
                <div className={styles.filterGroup}>
                  <span>Evaluation</span>
                  <div>{evaluationOptions.map((item) => <button type="button" aria-pressed={selectedStep === item.id} key={item.id} onClick={() => setSelectedStep(item.id)}>{item.label}</button>)}</div>
                </div>
                <div className={styles.filterGroup}>
                  <span>Profit split</span>
                  <div>{profitOptions.map((item) => <button type="button" aria-pressed={minProfitSplit === item.id} key={item.id} onClick={() => setMinProfitSplit(item.id)}>{item.label}</button>)}</div>
                </div>
              </div>

              <div className={styles.featureRow}>
                <span>Features</span>
                <button type="button" aria-pressed={hasPointsOnly} onClick={() => setHasPointsOnly(!hasPointsOnly)}>Points</button>
                <button type="button" aria-pressed={hasTokenOnly} onClick={() => setHasTokenOnly(!hasTokenOnly)}>Token</button>
                <button type="button" aria-pressed={confirmedAirdropOnly} onClick={() => setConfirmedAirdropOnly(!confirmedAirdropOnly)}>Airdrop</button>
                <button type="button" aria-pressed={newsAllowedOnly} onClick={() => setNewsAllowedOnly(!newsAllowedOnly)}><Zap aria-hidden="true" /> News trading</button>
                <button type="button" aria-pressed={weekendAllowedOnly} onClick={() => setWeekendAllowedOnly(!weekendAllowedOnly)}><Moon aria-hidden="true" /> Weekend holding</button>
                <button type="button" aria-pressed={eaAllowedOnly} onClick={() => setEaAllowedOnly(!eaAllowedOnly)}><Bot aria-hidden="true" /> EA &amp; bots</button>
              </div>

              <div className={styles.resultRow}>
                <span>Showing <strong>{filteredFirms.length}</strong> prop firms</span>
                <button type="button" disabled={!hasActiveFilters} onClick={resetFilters}>Reset filters</button>
              </div>
            </div>
          </>
        )}

        {visibleFirms.length ? (
          <div className={styles.cardGrid}>
            {visibleFirms.map((firm) => (
              <FirmCard
                key={firm.id}
                firm={firm}
                onCompareToggle={toggleCompare}
                isCompared={selectedFirmIds.includes(firm.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search aria-hidden="true" />
            <h3>No matching prop firms</h3>
            <p>Try removing one of the filters or searching with a broader term.</p>
            <button type="button" onClick={resetFilters}>Reset all filters</button>
          </div>
        )}

        <div className={styles.compareBar}>
          <Scale aria-hidden="true" />
          <span>{selectedFirmIds.length ? `${selectedFirmIds.length} selected for comparison` : 'Select up to four firms for a side-by-side comparison'}</span>
          <Link href={compareHref}>Open comparison <ArrowRight aria-hidden="true" /></Link>
        </div>
        </div>
      </section>

      {mode === 'home' && (
        <>
          <section className={styles.method} aria-labelledby="method-heading">
            <div className={styles.methodIntro}>
              <span>Research, not rankings</span>
              <h2 id="method-heading">Confidence should be visible, not implied.</h2>
              <p>PropHub separates what a firm says, what can be checked and what remains demo data. The trader sees the difference before making a purchase.</p>
              <Link href="/methodology">Read the methodology <ArrowRight aria-hidden="true" /></Link>
            </div>
            <div className={styles.methodSteps}>
              <article><span>01</span><BookOpen aria-hidden="true" /><h3>Rules normalized</h3><p>Different language is translated into comparable evaluation, drawdown and payout fields.</p></article>
              <article><span>02</span><ShieldCheck aria-hidden="true" /><h3>Sources attached</h3><p>Material claims have a source, review status and date instead of an unexplained trust score.</p></article>
              <article><span>03</span><Layers3 aria-hidden="true" /><h3>Rewards separated</h3><p>Points, token utility and potential airdrops stay distinct from the core challenge economics.</p></article>
            </div>
          </section>

          <section className={styles.rewardSection} aria-labelledby="rewards-heading">
            <div className={styles.rewardVisual} aria-hidden="true">
              <Gift />
              <div className={styles.rewardLabels}><span>Points</span><span>Airdrops</span><span>Tokens</span></div>
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
            <div><span>Make the next challenge a researched decision.</span><h2>Start with rules. Verify the proof. Understand the reward.</h2><p>{MOCK_COUPONS.length} sample promotions are already represented in the research model.</p></div>
            <Link href="/prop-firms">Browse all prop firms <ArrowRight aria-hidden="true" /></Link>
          </section>
        </>
      )}
    </div>
  );
}
