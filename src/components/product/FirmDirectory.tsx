'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import {
  comparisonRangeText,
  firmModelTypeLabel,
  getFirmModularProfile,
} from '@/lib/data/firmModularProfiles';
import {
  factArrayText,
  factText,
  factValue,
  profileHasRewards,
  profileLogo,
  profileRewardLabels,
  profileTrustpilotRating,
} from '@/lib/data/publicFirmProfiles';
import type { FirmModelType, FirmNormalizedProfile } from '@/types/database';
import { useComparisonSelection } from '@/hooks/useComparisonSelection';
import { ComparisonTray } from './ComparisonTray';
import styles from '@/app/product-lab/page.module.css';

type FirmDirectoryProps = {
  mode?: 'preview' | 'full';
  initialSearch?: string;
  initialStep?: string;
  firms: FirmNormalizedProfile[];
};

const modelOptions: Array<{ value: 'All' | FirmModelType; label: string }> = [
  { value: 'All', label: 'All models' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'instant-funding', label: 'Instant funding' },
  { value: 'collateralized', label: 'Collateralized' },
  { value: 'competition', label: 'Competition' },
  { value: 'progression', label: 'Progression' },
  { value: 'other', label: 'Other' },
];

type RatingFilter = 'all' | 'rated' | '4.0' | '4.5';
type DirectorySort = 'rating' | 'reviews' | 'name';

function FirmRow({ firm, selected, onToggle }: { firm: FirmNormalizedProfile; selected: boolean; onToggle: () => void }) {
  const modular = getFirmModularProfile(firm);
  const rewards = profileRewardLabels(firm);
  const modelLabel = modular.modelTypes.map(firmModelTypeLabel).join(' · ');
  const isModelFirst = modular.researchStandard === 'model-first-v1';
  const isProgressionModel = modular.modelTypes.includes('progression');
  const description = modular.operatingModel?.classification.value ?? factText(firm.identity.tagline);
  const rating = profileTrustpilotRating(firm);

  return (
    <article className={styles.firmRow}>
      <div className={styles.firmIdentity}>
        <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.firmLogo} fallbackClassName={styles.firmFallback} />
        <div>
          <span className={styles.statusLine}><i /> Research profile</span>
          <h3>{firm.name}</h3>
          {rating
            ? <a className={styles.directoryRating} href={rating.url} target="_blank" rel="noreferrer" aria-label={`${firm.name}: ${rating.score} out of 5 on Trustpilot from ${rating.reviewCountLabel} reviews`}><Star /> <strong>{rating.score.toFixed(1)}</strong><span>Trustpilot</span><i>·</i><small>{rating.reviewCountApproximate ? '≈' : ''}{rating.reviewCountLabel} reviews</small></a>
            : <span className={styles.directoryRatingEmpty}>No Trustpilot rating</span>}
          <p>{description}</p>
          <div className={styles.tags}>{rewards.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>

      <div className={styles.rowMetrics}>
        <div><span>{isProgressionModel ? 'Access' : 'Entry'}</span><strong>{comparisonRangeText(modular.comparison.entryCost)}</strong><small>{isProgressionModel ? 'Registration' : modelLabel}</small></div>
        <div><span>Drawdown</span><strong>{comparisonRangeText(modular.comparison.maxDrawdown)}</strong><small>{isProgressionModel ? 'Across tracks' : isModelFirst ? 'Core challenge rule' : 'Across offers'}</small></div>
        <div><span>Split</span><strong>{comparisonRangeText(modular.comparison.profitSplit)}</strong><small>{isProgressionModel ? 'By vault policy' : isModelFirst ? 'Funded stage' : 'Across offers'}</small></div>
        <div><span>Capital</span><strong>{comparisonRangeText(modular.comparison.capital)}</strong><small>{isProgressionModel ? 'Track allocations' : isModelFirst ? 'Recorded account range' : 'Available range'}</small></div>
      </div>

      <div className={styles.rowActions}>
        <button className={selected ? styles.compareAdded : ''} type="button" onClick={onToggle}>
          {selected ? <Check /> : <span>+</span>} {selected ? 'Added' : 'Compare'}
        </button>
        <Link className={styles.profileLink} href={`/prop-firms/${firm.slug}`} scroll={false} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}>View brief <ArrowRight /></Link>
      </div>
    </article>
  );
}

export function FirmDirectory({ firms, mode = 'full', initialSearch = '', initialStep = 'All' }: FirmDirectoryProps) {
  const normalizedStep = modelOptions.some((option) => option.value === initialStep) ? initialStep as 'All' | FirmModelType : 'All';
  const [query, setQuery] = useState(initialSearch);
  const [step, setStep] = useState(normalizedStep);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [rewardsOnly, setRewardsOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [sortBy, setSortBy] = useState<DirectorySort>('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { items: selectedFirms, selectedIds: selected, toggle } = useComparisonSelection();

  const filtered = useMemo(() => {
    const matches = firms.filter((firm) => {
      const modular = getFirmModularProfile(firm);
      const rating = profileTrustpilotRating(firm);
      const haystack = `${firm.name} ${modular.operatingModel?.classification.value ?? factText(firm.identity.tagline)} ${factArrayText(firm.tradingPolicy.platforms)} ${profileRewardLabels(firm).join(' ')} ${modular.modelTypes.map(firmModelTypeLabel).join(' ')} ${modular.offerNames.join(' ')}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (step !== 'All' && !modular.modelTypes.includes(step as FirmModelType)) return false;
      if (weekendOnly && factValue(firm.tradingPolicy.weekendHolding) !== 'allowed') return false;
      if (rewardsOnly && !profileHasRewards(firm)) return false;
      if (ratingFilter === 'rated' && !rating) return false;
      if ((ratingFilter === '4.0' || ratingFilter === '4.5') && (!rating || rating.score < Number(ratingFilter))) return false;
      return true;
    });

    if (mode !== 'full') return matches;
    return matches.sort((a, b) => {
      const aRating = profileTrustpilotRating(a);
      const bRating = profileTrustpilotRating(b);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'reviews') return (bRating?.reviewCount ?? -1) - (aRating?.reviewCount ?? -1) || (bRating?.score ?? -1) - (aRating?.score ?? -1) || a.name.localeCompare(b.name);
      return (bRating?.score ?? -1) - (aRating?.score ?? -1) || (bRating?.reviewCount ?? -1) - (aRating?.reviewCount ?? -1) || a.name.localeCompare(b.name);
    });
  }, [firms, mode, query, ratingFilter, rewardsOnly, sortBy, step, weekendOnly]);

  const visible = mode === 'preview' ? filtered.slice(0, 3) : filtered;
  function toggleCompare(id: string) {
    const firm = firms.find((item) => item.id === id);
    if (!firm) return;
    toggle({ id: firm.id, name: firm.name, slug: firm.slug, logo: profileLogo(firm) });
  }

  function reset() {
    setQuery('');
    setStep('All');
    setWeekendOnly(false);
    setRewardsOnly(false);
    setRatingFilter('all');
    setSortBy('rating');
  }

  return (
    <section className={styles.directory} id="firm-directory" aria-labelledby={mode === 'preview' ? 'starting-points-heading' : 'directory-heading'}>
      <div className={styles.sectionHeading}>
        <div>
          <span>{mode === 'preview' ? 'Research starting points' : 'Firm directory'}</span>
          <h2 id={mode === 'preview' ? 'starting-points-heading' : 'directory-heading'}>
            {mode === 'preview' ? 'Three profiles worth opening first.' : 'Start with fit, then inspect the proof.'}
          </h2>
        </div>
        <p>{mode === 'preview' ? 'See the access cost, core constraints and operating model before opening the full research profile.' : 'Browse firms by operating model, trading rules, payouts and the constraints that matter to your strategy.'}</p>
      </div>

      <div className={mode === 'full' ? styles.directoryLayout : styles.previewDirectory}>
        {mode === 'full' && (
          <aside className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ''}`}>
            <div className={styles.filterTitle}><strong>Filters</strong><button type="button" onClick={reset}>Reset</button></div>
            <label className={styles.searchField}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Firm or platform" /></label>
            <fieldset>
              <legend>Offer model</legend>
              {modelOptions.map((item) => (
                <label key={item.value}><input type="radio" name="step" checked={step === item.value} onChange={() => setStep(item.value)} /><span>{item.label}</span></label>
              ))}
            </fieldset>
            <fieldset>
              <legend>What matters</legend>
              <label><input type="checkbox" checked={weekendOnly} onChange={(event) => setWeekendOnly(event.target.checked)} /><span>Weekend holding</span></label>
              <label><input type="checkbox" checked={rewardsOnly} onChange={(event) => setRewardsOnly(event.target.checked)} /><span>Points or airdrop</span></label>
            </fieldset>
            <fieldset>
              <legend>Trustpilot rating</legend>
              <label><input type="radio" name="rating" checked={ratingFilter === 'all'} onChange={() => setRatingFilter('all')} /><span>All firms</span></label>
              <label><input type="radio" name="rating" checked={ratingFilter === '4.5'} onChange={() => setRatingFilter('4.5')} /><span>4.5 and higher</span></label>
              <label><input type="radio" name="rating" checked={ratingFilter === '4.0'} onChange={() => setRatingFilter('4.0')} /><span>4.0 and higher</span></label>
              <label><input type="radio" name="rating" checked={ratingFilter === 'rated'} onChange={() => setRatingFilter('rated')} /><span>Rated firms only</span></label>
            </fieldset>
            <div className={styles.filterNote}><Sparkles /><p><strong>Later: AI match</strong><br />Turn a trader profile into a shortlist.</p></div>
          </aside>
        )}

        <div className={styles.results}>
          <div className={styles.resultToolbar}>
            <span><strong>{visible.length}</strong> {mode === 'preview' ? 'starting profiles' : 'firms found'}</span>
            {mode === 'full' && <label className={styles.directorySort}><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as DirectorySort)}><option value="rating">Highest rating</option><option value="reviews">Most reviewed</option><option value="name">Firm name</option></select></label>}
            {mode === 'full' && <button className={styles.mobileFilterToggle} type="button" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal /> Filters</button>}
            {mode === 'preview' && <Link className={styles.toolbarLink} href="/prop-firms">View directory <ArrowRight /></Link>}
          </div>

          <div className={styles.firmList}>
            {visible.map((firm) => <FirmRow key={firm.id} firm={firm} selected={selected.includes(firm.id)} onToggle={() => toggleCompare(firm.id)} />)}
            {!visible.length && <div className={styles.emptyResults}><strong>No matching firms</strong><button type="button" onClick={reset}>Reset filters</button></div>}
          </div>

          <ComparisonTray items={selectedFirms} />
        </div>
      </div>
    </section>
  );
}
