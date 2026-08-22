'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Columns3,
  Database,
  ExternalLink,
  FileCheck2,
  Gift,
  LayoutList,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import type { PropFirm } from '@/types/firm';
import styles from './page.module.css';

type LabView = 'directory' | 'profile' | 'compare';
type LabTheme = 'light' | 'dark';

const featuredFirms = MOCK_PROP_FIRMS.slice(0, 6);

const compareRows: Array<{ label: string; value: (firm: PropFirm) => string; emphasis?: boolean }> = [
  { label: 'Challenge from', value: (firm) => `$${firm.accountTiers[0]?.price ?? '—'}`, emphasis: true },
  { label: 'Evaluation', value: (firm) => firm.evaluationSteps.join(' / ') },
  { label: 'Profit target', value: (firm) => firm.profitTarget },
  { label: 'Maximum drawdown', value: (firm) => firm.maxDrawdown, emphasis: true },
  { label: 'Daily drawdown', value: (firm) => firm.dailyDrawdown },
  { label: 'Profit split', value: (firm) => firm.profitSplit, emphasis: true },
  { label: 'Payout schedule', value: (firm) => firm.payoutFrequency },
  { label: 'Platforms', value: (firm) => firm.platforms.join(', ') },
  { label: 'Weekend holding', value: (firm) => firm.weekendHoldingAllowed ? 'Allowed' : 'Restricted' },
  { label: 'News trading', value: (firm) => firm.newsTradingAllowed ? 'Allowed' : 'Restricted' },
  { label: 'Rewards', value: (firm) => firm.rewardTags?.join(', ') || 'No program listed' },
];

function formatCapital(value: number) {
  if (value >= 1_000_000) return `$${value / 1_000_000}M`;
  return `$${Math.round(value / 1000)}K`;
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function decisionCopy(firm: PropFirm) {
  if (firm.weekendHoldingAllowed && firm.newsTradingAllowed) return 'Flexible rule set for traders who hold through market events.';
  if (firm.evaluationSteps.includes('Instant Funding')) return 'Fast route to funding, but inspect the drawdown mechanics first.';
  return 'A structured evaluation for traders who prefer predictable limits.';
}

export function ProductLab() {
  const [view, setView] = useState<LabView>('directory');
  const [profileFirm, setProfileFirm] = useState(featuredFirms[0]);
  const [selected, setSelected] = useState<string[]>(featuredFirms.slice(0, 2).map((firm) => firm.id));
  const [query, setQuery] = useState('');
  const [step, setStep] = useState('All');
  const [mobileNav, setMobileNav] = useState(false);
  const [theme, setTheme] = useState<LabTheme>('light');
  const themeReady = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage.getItem('prophub-theme');
      const resolvedTheme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      themeReady.current = true;
      setTheme(resolvedTheme);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!themeReady.current) return;
    window.localStorage.setItem('prophub-theme', theme);
  }, [theme]);

  const filtered = useMemo(() => {
    return featuredFirms.filter((firm) => {
      const matchesQuery = `${firm.name} ${firm.tagline} ${firm.platforms.join(' ')}`.toLowerCase().includes(query.toLowerCase());
      const matchesStep = step === 'All' || firm.evaluationSteps.includes(step as PropFirm['evaluationSteps'][number]);
      return matchesQuery && matchesStep;
    });
  }, [query, step]);

  const selectedFirms = selected.map((id) => featuredFirms.find((firm) => firm.id === id)).filter(Boolean) as PropFirm[];

  function toggleCompare(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return [...current.slice(1), id];
      return [...current, id];
    });
  }

  function openProfile(firm: PropFirm) {
    setProfileFirm(firm);
    setView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={`${styles.lab} ${theme === 'dark' ? styles.dark : ''}`} id="product-lab" data-theme={theme} suppressHydrationWarning>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.brand} type="button" onClick={() => setView('directory')} aria-label="Open PropHub directory">
            <span className={styles.brandMark}>P</span>
            <span>PropHub</span>
            <i>Concept 01</i>
          </button>

          <nav className={`${styles.nav} ${mobileNav ? styles.navOpen : ''}`} aria-label="Product lab navigation">
            <button className={view === 'directory' ? styles.navActive : ''} type="button" onClick={() => { setView('directory'); setMobileNav(false); }}>
              Firms
            </button>
            <button className={view === 'compare' ? styles.navActive : ''} type="button" onClick={() => { setView('compare'); setMobileNav(false); }}>
              Compare <span>{selected.length}</span>
            </button>
            <button type="button" onClick={() => setMobileNav(false)}>Rewards</button>
            <button type="button" onClick={() => setMobileNav(false)}>Methodology</button>
          </nav>

          <div className={styles.headerActions}>
            <button
              className={styles.themeToggle}
              type="button"
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button className={styles.headerSearch} type="button"><Search /> Search</button>
            <button className={styles.mobileMenu} type="button" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle menu">
              {mobileNav ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {view === 'directory' && (
        <div>
          <section className={styles.intro}>
            <div className={styles.introCopy}>
              <span className={styles.kicker}><span /> Independent prop research</span>
              <h1>Choose the rules.<br />Not the marketing.</h1>
              <p>Find an on-chain prop firm that fits the way you trade. Compare real constraints, reward programs and the evidence behind each claim.</p>
              <div className={styles.introActions}>
                <a href="#firm-directory">Browse firms <ArrowRight /></a>
                <button type="button" onClick={() => setView('compare')}>Open comparison</button>
              </div>
            </div>

            <aside className={styles.briefPreview} aria-label="Decision brief preview">
              <div className={styles.previewTop}>
                <span>Decision brief</span>
                <span className={styles.demoPill}>Prototype data</span>
              </div>
              <div className={styles.previewFirm}>
                <FirmLogo src={profileFirm.logo} name={profileFirm.name} imageClassName={styles.previewLogo} fallbackClassName={styles.previewFallback} />
                <div><strong>{profileFirm.name}</strong><small>{profileFirm.evaluationSteps[0]} · from ${profileFirm.accountTiers[0]?.price}</small></div>
                <button type="button" onClick={() => openProfile(profileFirm)}>View <ArrowUpRight /></button>
              </div>
              <div className={styles.previewVerdict}>
                <span>Why it stands out</span>
                <p>{decisionCopy(profileFirm)}</p>
              </div>
              <div className={styles.previewSignals}>
                <div><Check /><span><strong>{profileFirm.maxDrawdown}</strong> drawdown</span></div>
                <div><Gift /><span><strong>{profileFirm.rewardTags?.[0] || 'No'}</strong> rewards</span></div>
                <div><FileCheck2 /><span><strong>Sources</strong> pending</span></div>
              </div>
            </aside>
          </section>

          <section className={styles.trustStrip}>
            <p>Research model</p>
            <div><Database /><span>Rules normalized</span></div>
            <div><FileCheck2 /><span>Sources attached</span></div>
            <div><Clock3 /><span>Changes dated</span></div>
            <div><ShieldCheck /><span>Uncertainty visible</span></div>
          </section>

          <section className={styles.directory} id="firm-directory">
            <div className={styles.sectionHeading}>
              <div><span>Firm directory</span><h2>Start with fit, then inspect the proof.</h2></div>
              <p>Six prototype profiles using the future information structure. Values remain sample data.</p>
            </div>

            <div className={styles.directoryLayout}>
              <aside className={styles.filters}>
                <div className={styles.filterTitle}><strong>Filters</strong><button type="button" onClick={() => { setStep('All'); setQuery(''); }}>Reset</button></div>
                <label className={styles.searchField}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Firm or platform" /></label>
                <fieldset>
                  <legend>Evaluation</legend>
                  {['All', '1-Step', '2-Step', 'Instant Funding'].map((item) => (
                    <label key={item}><input type="radio" name="step" checked={step === item} onChange={() => setStep(item)} /><span>{item}</span></label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>What matters</legend>
                  <label><input type="checkbox" /><span>Static drawdown</span></label>
                  <label><input type="checkbox" /><span>Weekend holding</span></label>
                  <label><input type="checkbox" /><span>Points or airdrop</span></label>
                  <label><input type="checkbox" /><span>On-chain payout</span></label>
                </fieldset>
                <div className={styles.filterNote}><Sparkles /><p><strong>Later: AI match</strong><br />Turn a trader profile into a shortlist.</p></div>
              </aside>

              <div className={styles.results}>
                <div className={styles.resultToolbar}>
                  <span><strong>{filtered.length}</strong> firms in this prototype</span>
                  <div><button className={styles.viewSelected} type="button"><LayoutList /> List</button><button type="button"><Columns3 /> Grid</button></div>
                  <button className={styles.sortButton} type="button">Decision fit <ChevronDown /></button>
                </div>

                <div className={styles.firmList}>
                  {filtered.map((firm) => {
                    const isSelected = selected.includes(firm.id);
                    return (
                      <article className={styles.firmRow} key={firm.id}>
                        <div className={styles.firmIdentity}>
                          <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.firmLogo} fallbackClassName={styles.firmFallback} />
                          <div>
                            <span className={styles.statusLine}><i /> Prototype profile</span>
                            <h3>{firm.name}</h3>
                            <p>{decisionCopy(firm)}</p>
                            <div className={styles.tags}>{firm.rewardTags?.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                          </div>
                        </div>

                        <div className={styles.rowMetrics}>
                          <div><span>From</span><strong>${firm.accountTiers[0]?.price ?? '—'}</strong><small>{firm.evaluationSteps[0]}</small></div>
                          <div><span>Drawdown</span><strong>{firm.maxDrawdown.split(' ')[0]}</strong><small>{firm.maxDrawdown.replace(firm.maxDrawdown.split(' ')[0], '').trim() || 'Maximum'}</small></div>
                          <div><span>Split</span><strong>{firm.profitSplit.replace('Up to ', '')}</strong><small>Up to</small></div>
                          <div><span>Capital</span><strong>{formatCapital(firm.maxCapital)}</strong><small>Maximum</small></div>
                        </div>

                        <div className={styles.rowActions}>
                          <button className={isSelected ? styles.compareAdded : ''} type="button" onClick={() => toggleCompare(firm.id)}>
                            {isSelected ? <Check /> : <span>+</span>} {isSelected ? 'Added' : 'Compare'}
                          </button>
                          <button className={styles.profileLink} type="button" onClick={() => openProfile(firm)}>View brief <ArrowRight /></button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {selected.length > 0 && (
                  <div className={styles.compareTray}>
                    <div className={styles.trayFirms}>
                      {selectedFirms.map((firm) => (
                        <span key={firm.id}><FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.trayLogo} fallbackClassName={styles.trayFallback} /> {firm.name}</span>
                      ))}
                    </div>
                    <p>{selected.length}/3 selected</p>
                    <button type="button" onClick={() => setView('compare')}>Compare firms <ArrowRight /></button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {view === 'profile' && (
        <div className={styles.productPage}>
          <div className={styles.breadcrumbs}><button type="button" onClick={() => setView('directory')}>Firms</button><span>/</span><span>{profileFirm.name}</span></div>

          <section className={styles.profileHero}>
            <div className={styles.profileIdentity}>
              <FirmLogo src={profileFirm.logo} name={profileFirm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
              <div>
                <span className={styles.kicker}><span /> Prototype research profile</span>
                <h1>{profileFirm.name}</h1>
                <p>{profileFirm.tagline}</p>
              </div>
            </div>
            <div className={styles.profileActions}>
              <button type="button" onClick={() => toggleCompare(profileFirm.id)}>{selected.includes(profileFirm.id) ? <Check /> : '+'} {selected.includes(profileFirm.id) ? 'In comparison' : 'Add to compare'}</button>
              <a href={profileFirm.website} target="_blank" rel="noreferrer">Official site <ExternalLink /></a>
            </div>
          </section>

          <section className={styles.decisionGrid}>
            <article className={styles.decisionMain}>
              <span>PropHub decision brief</span>
              <h2>{decisionCopy(profileFirm)}</h2>
              <p>This is the answer-first layer. It explains who the program may suit before exposing every plan, exception and source.</p>
            </article>
            <article className={styles.decisionGood}><Check /><div><span>Best fit</span><strong>{profileFirm.weekendHoldingAllowed ? 'Swing and event-aware traders' : 'Structured intraday traders'}</strong><p>{profileFirm.newsTradingAllowed ? 'News trading is listed as allowed.' : 'News restrictions require attention.'}</p></div></article>
            <article className={styles.decisionRisk}><CircleAlert /><div><span>Main trade-off</span><strong>{profileFirm.maxDrawdown}</strong><p>Confirm calculation method and funded-stage exceptions in the official rules.</p></div></article>
          </section>

          <section className={styles.profileLayout}>
            <div className={styles.profilePrimary}>
              <section className={styles.profileSection}>
                <div className={styles.profileSectionTitle}><div><span>01</span><h2>Challenge economics</h2></div><p>Start with the real constraints, not advertised account size.</p></div>
                <div className={styles.metricBand}>
                  <div><span>Entry price</span><strong>${profileFirm.accountTiers[0]?.price}</strong><small>Smallest listed plan</small></div>
                  <div><span>Profit target</span><strong>{profileFirm.profitTarget}</strong><small>Evaluation stage</small></div>
                  <div><span>Maximum loss</span><strong>{profileFirm.maxDrawdown}</strong><small>Method needs source</small></div>
                  <div><span>Profit split</span><strong>{profileFirm.profitSplit}</strong><small>Funded stage</small></div>
                </div>
                <div className={styles.planTable}>
                  <div className={styles.planHead}><span>Account</span><span>Price</span><span>Target</span><span>Max loss</span><span>Daily loss</span></div>
                  {profileFirm.accountTiers.slice(0, 4).map((tier) => (
                    <div className={styles.planRow} key={tier.accountSize}><strong>{formatCapital(tier.accountSize)}</strong><span>${tier.price}</span><span>{tier.profitTarget}</span><span>{tier.maxDrawdown}</span><span>{tier.dailyDrawdown}</span></div>
                  ))}
                </div>
              </section>

              <section className={styles.profileSection}>
                <div className={styles.profileSectionTitle}><div><span>02</span><h2>Rules that change the outcome</h2></div><p>Every rule should eventually open its source and exceptions.</p></div>
                <div className={styles.rulesList}>
                  {[
                    ['Weekend holding', profileFirm.weekendHoldingAllowed ? 'Allowed' : 'Restricted', 'Check whether positions may remain open through market close.'],
                    ['News trading', profileFirm.newsTradingAllowed ? 'Allowed' : 'Restricted', 'High-impact event windows may have separate funded-stage rules.'],
                    ['Expert advisors', profileFirm.eaAllowed ? 'Allowed' : 'Restricted', 'Automation, copy trading and third-party signals need separate definitions.'],
                    ['Time limit', profileFirm.noTimeLimit ? 'No time limit' : 'Time limit applies', 'The minimum trading-day requirement may still apply.'],
                  ].map(([label, value, description]) => (
                    <div key={label}><div><strong>{label}</strong><p>{description}</p></div><span className={value === 'Allowed' || value === 'No time limit' ? styles.rulePositive : styles.ruleNeutral}>{value}</span><button type="button">Source slot <ArrowUpRight /></button></div>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.profileAside}>
              <section className={styles.evidenceCard}>
                <div><FileCheck2 /><span>Evidence status</span></div>
                <strong>Prototype data</strong>
                <p>No factual purchase decision should be made from this record yet.</p>
                <dl><div><dt>Last reviewed</dt><dd>{shortDate(profileFirm.lastReviewedAt)}</dd></div><div><dt>Sources attached</dt><dd>0</dd></div><div><dt>Confidence</dt><dd>Low</dd></div></dl>
                <button type="button">How verification works <ArrowRight /></button>
              </section>
              <section className={styles.rewardCard}>
                <div><Gift /><span>Reward layer</span></div>
                <h3>{profileFirm.rewardTags?.join(', ') || 'No rewards listed'}</h3>
                <p>{profileFirm.tokenomicsInfo?.rewardDescription || 'No reward program has been documented.'}</p>
                <span>Potential value is never included in the core challenge score.</span>
              </section>
              <section className={styles.sourceCard}>
                <div><BookOpen /><span>Future source stack</span></div>
                <ul><li><span>Official rulebook</span><em>Pending</em></li><li><span>Payout policy</span><em>Pending</em></li><li><span>Platform documentation</span><em>Pending</em></li><li><span>On-chain evidence</span><em>Pending</em></li></ul>
              </section>
            </aside>
          </section>
        </div>
      )}

      {view === 'compare' && (
        <div className={styles.productPage}>
          <section className={styles.compareIntro}>
            <div><span className={styles.kicker}><span /> Side-by-side workspace</span><h1>Compare the rules that can end an account.</h1><p>Every row uses the same definition. Differences are highlighted; PropHub does not declare a universal winner.</p></div>
            <button type="button" onClick={() => setView('directory')}>Add or change firms <ArrowRight /></button>
          </section>

          {selectedFirms.length < 2 ? (
            <section className={styles.emptyCompare}><Columns3 /><h2>Select at least two firms</h2><p>Comparison begins after two profiles are added from the directory.</p><button type="button" onClick={() => setView('directory')}>Browse firms</button></section>
          ) : (
            <section className={styles.compareWorkspace}>
              <div className={styles.compareHeaderRow}>
                <div className={styles.compareLabelCell}><span>{selectedFirms.length} firms</span><strong>Core comparison</strong></div>
                {selectedFirms.map((firm) => (
                  <div className={styles.compareFirmCell} key={firm.id}>
                    <button type="button" onClick={() => toggleCompare(firm.id)} aria-label={`Remove ${firm.name}`}><X /></button>
                    <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} />
                    <div><strong>{firm.name}</strong><span>{firm.evaluationSteps[0]}</span></div>
                  </div>
                ))}
              </div>

              <div className={styles.compareVerdictRow}>
                <div className={styles.compareLabelCell}><span>Decision lens</span><strong>Quick read</strong></div>
                {selectedFirms.map((firm) => <div key={firm.id}><p>{decisionCopy(firm)}</p><button type="button" onClick={() => openProfile(firm)}>Open brief <ArrowRight /></button></div>)}
              </div>

              <div className={styles.compareRows}>
                {compareRows.map((row) => (
                  <div className={styles.compareDataRow} key={row.label}>
                    <div className={styles.compareLabelCell}><span>{row.label}</span></div>
                    {selectedFirms.map((firm) => <div className={row.emphasis ? styles.comparisonEmphasis : ''} key={firm.id}>{row.value(firm)}</div>)}
                  </div>
                ))}
              </div>

              <div className={styles.compareFootnote}><Database /><p><strong>Prototype data:</strong> this screen validates the information architecture only. Every production value will require a status, source and review date.</p></div>
            </section>
          )}
        </div>
      )}

      <footer className={styles.labFooter}>
        <div><span className={styles.brandMark}>P</span><strong>PropHub product direction</strong></div>
        <p>Designed around decisions, not rankings.</p>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
      </footer>
    </div>
  );
}
