'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import {
  factArrayText,
  factText,
  factValue,
  firstKnownFee,
  formatCapital,
  profileHasRewards,
  profileLogo,
  profilePrograms,
  profileRewardLabels,
} from '@/lib/data/publicFirmProfiles';
import type { FirmNormalizedProfile } from '@/types/database';
import styles from '@/app/product-lab/page.module.css';

type FirmDirectoryProps = {
  mode?: 'preview' | 'full';
  initialSearch?: string;
  initialStep?: string;
  firms: FirmNormalizedProfile[];
};

const stepOptions = ['All', '1-Step', '2-Step', 'Instant Funding'] as const;

function FirmRow({ firm, selected, onToggle }: { firm: FirmNormalizedProfile; selected: boolean; onToggle: () => void }) {
  const [drawdownValue, ...drawdownNoteParts] = factText(firm.summary.maxDrawdown).trim().split(/\s+/);
  const drawdownNote = drawdownNoteParts.join(' ') || 'Maximum';
  const programs = profilePrograms(firm);
  const fee = firstKnownFee(firm);
  const rewards = profileRewardLabels(firm);

  return (
    <article className={styles.firmRow}>
      <div className={styles.firmIdentity}>
        <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.firmLogo} fallbackClassName={styles.firmFallback} />
        <div>
          <span className={styles.statusLine}><i /> Research profile</span>
          <h3>{firm.name}</h3>
          <p>{factText(firm.identity.tagline)}</p>
          <div className={styles.tags}>{rewards.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>

      <div className={styles.rowMetrics}>
        <div><span>From</span><strong>{fee === undefined ? 'ND' : `$${fee}`}</strong><small>{programs[0]?.name ?? 'ND'}</small></div>
        <div><span>Drawdown</span><strong>{drawdownValue}</strong><small>{drawdownNote}</small></div>
        <div><span>Split</span><strong>{factText(firm.summary.profitSplit)}</strong><small>Reported</small></div>
        <div><span>Capital</span><strong>{formatCapital(factValue(firm.summary.maxCapital))}</strong><small>Maximum</small></div>
      </div>

      <div className={styles.rowActions}>
        <button className={selected ? styles.compareAdded : ''} type="button" onClick={onToggle}>
          {selected ? <Check /> : <span>+</span>} {selected ? 'Added' : 'Compare'}
        </button>
        <Link className={styles.profileLink} href={`/prop-firms/${firm.slug}`}>View brief <ArrowRight /></Link>
      </div>
    </article>
  );
}

export function FirmDirectory({ firms, mode = 'full', initialSearch = '', initialStep = 'All' }: FirmDirectoryProps) {
  const normalizedStep = stepOptions.includes(initialStep as typeof stepOptions[number]) ? initialStep : 'All';
  const [query, setQuery] = useState(initialSearch);
  const [step, setStep] = useState(normalizedStep);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [rewardsOnly, setRewardsOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return firms.filter((firm) => {
      const programs = profilePrograms(firm);
      const haystack = `${firm.name} ${factText(firm.identity.tagline)} ${factArrayText(firm.tradingPolicy.platforms)} ${profileRewardLabels(firm).join(' ')}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (step !== 'All' && !programs.some((program) => program.name.toLowerCase().includes(step.toLowerCase().replace(' funding', '')))) return false;
      if (weekendOnly && factValue(firm.tradingPolicy.weekendHolding) !== 'allowed') return false;
      if (rewardsOnly && !profileHasRewards(firm)) return false;
      return true;
    });
  }, [firms, query, rewardsOnly, step, weekendOnly]);

  const visible = mode === 'preview' ? filtered.slice(0, 3) : filtered;
  const selectedFirms = selected.map((id) => firms.find((firm) => firm.id === id)).filter(Boolean) as FirmNormalizedProfile[];
  const compareHref = selected.length > 1 ? `/compare?ids=${selected.join(',')}` : '/compare';

  function toggleCompare(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return [...current.slice(1), id];
      return [...current, id];
    });
  }

  function reset() {
    setQuery('');
    setStep('All');
    setWeekendOnly(false);
    setRewardsOnly(false);
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
        <p>{mode === 'preview' ? 'See the price, core constraints and reward layer before opening the full research profile.' : 'Filter normalized profiles by evaluation model and the constraints that matter to your trading style.'}</p>
      </div>

      <div className={mode === 'full' ? styles.directoryLayout : styles.previewDirectory}>
        {mode === 'full' && (
          <aside className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ''}`}>
            <div className={styles.filterTitle}><strong>Filters</strong><button type="button" onClick={reset}>Reset</button></div>
            <label className={styles.searchField}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Firm or platform" /></label>
            <fieldset>
              <legend>Evaluation</legend>
              {stepOptions.map((item) => (
                <label key={item}><input type="radio" name="step" checked={step === item} onChange={() => setStep(item)} /><span>{item}</span></label>
              ))}
            </fieldset>
            <fieldset>
              <legend>What matters</legend>
              <label><input type="checkbox" checked={weekendOnly} onChange={(event) => setWeekendOnly(event.target.checked)} /><span>Weekend holding</span></label>
              <label><input type="checkbox" checked={rewardsOnly} onChange={(event) => setRewardsOnly(event.target.checked)} /><span>Points or airdrop</span></label>
            </fieldset>
            <div className={styles.filterNote}><Sparkles /><p><strong>Later: AI match</strong><br />Turn a trader profile into a shortlist.</p></div>
          </aside>
        )}

        <div className={styles.results}>
          <div className={styles.resultToolbar}>
            <span><strong>{visible.length}</strong> {mode === 'preview' ? 'starting profiles' : 'firms found'}</span>
            {mode === 'full' && <button className={styles.mobileFilterToggle} type="button" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal /> Filters</button>}
            {mode === 'preview' && <Link className={styles.toolbarLink} href="/prop-firms">View directory <ArrowRight /></Link>}
          </div>

          <div className={styles.firmList}>
            {visible.map((firm) => <FirmRow key={firm.id} firm={firm} selected={selected.includes(firm.id)} onToggle={() => toggleCompare(firm.id)} />)}
            {!visible.length && <div className={styles.emptyResults}><strong>No matching firms</strong><button type="button" onClick={reset}>Reset filters</button></div>}
          </div>

          {selected.length > 0 && (
            <div className={styles.compareTray}>
              <div className={styles.trayFirms}>
                {selectedFirms.map((firm) => <span key={firm.id}><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.trayLogo} fallbackClassName={styles.trayFallback} /> {firm.name}</span>)}
              </div>
              <p>{selected.length}/3 selected</p>
              <Link href={compareHref}>Compare firms <ArrowRight /></Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
