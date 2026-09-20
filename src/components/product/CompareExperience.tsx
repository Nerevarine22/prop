'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Columns3, Database, X, CircleAlert } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import {
  comparisonListText,
  comparisonRangeText,
  firmModelTypeLabel,
  getFirmModularProfile,
} from '@/lib/data/firmModularProfiles';
import {
  profileLogo,
} from '@/lib/data/publicFirmProfiles';
import type { FirmContentFact, FirmNormalizedProfile, NormalizedChallengeProgram, NormalizedChallengeTier } from '@/types/database';
import { useComparisonSelection } from '@/hooks/useComparisonSelection';
import styles from '@/app/product-lab/page.module.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

function knownValue(fact: any): any {
  if (!fact) return undefined;
  return fact.status === 'reported' || fact.status === 'verified' ? fact.value : undefined;
}

function getPrograms(firm: FirmNormalizedProfile): NormalizedChallengeProgram[] {
  return knownValue(firm.challengePrograms) ?? [];
}

function formatCapital(value: number): string {
  if (value >= 1_000_000) return `$${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `$${Number((value / 1_000).toFixed(0))}K`;
  return `$${value.toLocaleString('en-US')}`;
}

function getTiers(program: NormalizedChallengeProgram): NormalizedChallengeTier[] {
  return knownValue(program.tiers) ?? [];
}


function sizeAndFeeRange(program: NormalizedChallengeProgram): React.ReactNode {
  const tiers = getTiers(program).filter((t) => knownValue(t.available) !== false);
  const validTiers = tiers
    .map(t => ({ size: knownValue(t.accountSize), fee: knownValue(t.fee), currency: knownValue(t.currency) ?? 'USD' }))
    .filter((t): t is { size: number, fee: number, currency: string } => t.size !== undefined && t.fee !== undefined);

  if (!validTiers.length) return 'ND';

  const minTier = validTiers.reduce((prev, curr) => prev.size < curr.size ? prev : curr);
  const maxTier = validTiers.reduce((prev, curr) => prev.size > curr.size ? prev : curr);

  const formatPrice = (tier: { fee: number, currency: string }) => tier.currency === 'USD' ? `$${tier.fee}` : `${tier.fee} ${tier.currency}`;

  if (minTier.size === maxTier.size) {
    return `${formatCapital(minTier.size)} for ${formatPrice(minTier)}`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div><strong>Min:</strong> {formatCapital(minTier.size)} for {formatPrice(minTier)}</div>
      <div><strong>Max:</strong> {formatCapital(maxTier.size)} for {formatPrice(maxTier)}</div>
    </div>
  );
}

function drawdownLabel(type: string): string {
  const map: Record<string, string> = {
    'static': 'Static',
    'trailing-high-water-mark': 'Trailing HWM',
    'trailing-daily': 'Trailing daily',
    'dynamic': 'Dynamic',
    'none': 'None',
  };
  return map[type] ?? type.replaceAll('-', ' ');
}

function stagesLabel(program: NormalizedChallengeProgram): string {
  const stages = knownValue(program.stages) ?? [];
  if (!stages.length) return 'ND';
  const evalCount = stages.filter((s: any) => !knownValue(s.funded)).length;
  const hasFunded = stages.some((s: any) => knownValue(s.funded));
  return `${evalCount}-step${hasFunded ? ' + funded' : ''}`;
}

function kindLabel(program: NormalizedChallengeProgram): string {
  const kind = knownValue(program.kind);
  const map: Record<string, string> = {
    'evaluation': 'Evaluation',
    'instant-funding': 'Instant',
    'collateralized': 'Collateral',
    'competition': 'Competition',
    'progression': 'Progression',
  };
  return kind ? (map[kind] ?? kind) : 'Challenge';
}

// ─── Row definitions ────────────────────────────────────────────────────────

type RowDef = {
  label: string;
  sub?: string;
  getValue: (p: NormalizedChallengeProgram) => React.ReactNode;
  emphasis?: boolean;
  getRawValue?: (program: NormalizedChallengeProgram) => any;
  compareDirection?: 'higher' | 'lower' | 'custom';
  customCompare?: (vals: any[]) => number[];
};



const ROWS: RowDef[] = [
  { label: 'Account bounds', sub: 'min/max range', getValue: sizeAndFeeRange, emphasis: true },
  { label: 'Evaluation', sub: 'phases', getValue: stagesLabel },
  {
    label: 'Profit target',
    sub: 'per eval stage',
    getRawValue: (p) => {
      const stages = (knownValue(p.stages) ?? []).filter((s: any) => !knownValue(s.funded));
      if (!stages.length) return undefined;
      return knownValue(stages[0].profitTargetPercent);
    },
    compareDirection: 'lower',
    getValue: (p) => {
      const stages = (knownValue(p.stages) ?? []).filter((s: any) => !knownValue(s.funded));
      const targets = stages.map((s: any) => knownValue(s.profitTargetPercent)).filter((v: any): v is number => v !== undefined);
      return targets.length ? targets.map((v: any) => `${v}%`).join(' / ') : 'ND';
    },
  },
  {
    label: 'Daily loss',
    sub: 'limit',
    getRawValue: (p) => knownValue(p.dailyLossPercent),
    compareDirection: 'higher',
    getValue: (p) => {
      const v = knownValue(p.dailyLossPercent);
      return v !== undefined ? `${v}%` : 'ND';
    },
  },
  {
    label: 'Max drawdown',
    sub: 'limit',
    getRawValue: (p) => knownValue(p.maxDrawdownPercent),
    compareDirection: 'higher',
    getValue: (p) => {
      const v = knownValue(p.maxDrawdownPercent);
      return v !== undefined ? `${v}%` : 'ND';
    },
  },
  {
    label: 'Drawdown type',
    sub: 'rule',
    getValue: (p) => {
      const v = knownValue(p.maxDrawdownType);
      return v ? drawdownLabel(v) : 'ND';
    },
  },
  {
    label: 'Profit split',
    sub: 'funded stage',
    getRawValue: (p) => knownValue(p.fundedProfitSplitPercent),
    compareDirection: 'higher',
    getValue: (p) => {
      const v = knownValue(p.fundedProfitSplitPercent);
      return v !== undefined ? `${v}%` : 'ND';
    },
    emphasis: true,
  },
  {
    label: 'Fee refundable',
    sub: '',
    getValue: (p) => {
      const v = knownValue(p.feeRefundable);
      return v === undefined ? 'ND' : v ? 'Yes' : 'No';
    },
  },
  {
    label: 'Time limit',
    sub: '',
    getValue: (p) => {
      const v = knownValue(p.noTimeLimit);
      return v === undefined ? 'ND' : v ? 'No limit' : 'Applies';
    },
  },
];


export function CompareExperience({ firms }: { firms: FirmNormalizedProfile[] }) {
  const searchParams = useSearchParams();
  const { hydrated, selectedIds: selected, toggle: toggleSelection, replace } = useComparisonSelection();
  const appliedUrlSelection = useRef(false);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);

  const renderFirmRow = (row: FirmRowDef, index: number, applyEmphasis: boolean = false) => {
    const rawValues = row.getRawValue ? selectedFirms.map(firm => row.getRawValue!(firm)) : [];
    const bestIndices = getBestIndices(rawValues, row.compareDirection, row.customCompare);

    return (
      <div className={styles.compareDataRow} key={row.label}>
        <div className={styles.compareLabelCell}>{row.sub && <span>{row.sub}</span>}<strong>{row.label}</strong></div>
        {selectedFirms.map((firm, fIdx) => {
          const value = row.getValue(firm);
          const isNd = value === 'ND';
          const isBest = bestIndices.includes(fIdx);
          const emphasisClass = applyEmphasis && index === 0 ? styles.comparisonEmphasis : '';

          return (
            <div
              key={firm.id}
              className={[
                emphasisClass,
                isNd ? styles.challengeCompareNd : '',
                isBest ? styles.isBestValue : ''
              ].filter(Boolean).join(' ')}
            >
              {value}
              {isBest && <Check className={styles.bestIcon} size={16} strokeWidth={3} />}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (!hydrated || appliedUrlSelection.current) return;
    appliedUrlSelection.current = true;
    const requested = [...new Set(searchParams.get('ids')?.split(',') ?? [])]
      .map((id) => firms.find((firm) => firm.id === id))
      .filter((firm): firm is FirmNormalizedProfile => Boolean(firm))
      .slice(0, 3);
    if (requested.length) {
      replace(requested.map((firm) => ({ id: firm.id, name: firm.name, slug: firm.slug, logo: profileLogo(firm) })));
    }
  }, [firms, hydrated, replace, searchParams]);

  const selectedFirms = selected.map((id) => firms.find((firm) => firm.id === id)).filter(Boolean) as FirmNormalizedProfile[];
  
  // State for selected challenge program per firm
  const [programSelections, setProgramSelections] = useState<Record<string, string>>(() => 
    Object.fromEntries(selectedFirms.map((f) => [f.id, getPrograms(f)[0]?.id ?? '']))
  );
  
  // Sync state if new firms are added
  useEffect(() => {
    setProgramSelections(prev => {
      const next = { ...prev };
      let changed = false;
      for (const f of selectedFirms) {
        if (next[f.id] === undefined) {
          next[f.id] = getPrograms(f)[0]?.id ?? '';
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [selectedFirms]);

  const modelLabel = (firm: FirmNormalizedProfile) => {
    const modular = getFirmModularProfile(firm);
    return modular.modelTypes.map(firmModelTypeLabel).join(' · ');
  };
  const evidenceSummary = (firm: FirmNormalizedProfile) => {
    const tagline = knownValue(firm.identity?.tagline);
    const description = knownValue(firm.identity?.description);
    return tagline || description || 'ND';
  };


function getBestIndices(values: any[], direction?: 'higher' | 'lower' | 'custom', customCompare?: (vals: any[]) => number[]): number[] {
  try {
    if (!direction) return [];
    if (direction === 'custom' && customCompare) return customCompare(values);
    
    const validIndices = values.map((v, i) => v !== undefined && v !== null && v !== 'ND' ? i : -1).filter(i => i !== -1);
    if (validIndices.length < 2) return []; 
    
    const validValues = validIndices.map(i => {
      const num = Number(values[i]);
      if (isNaN(num)) throw new Error('NaN encountered for value: ' + values[i]);
      return num;
    });
    
    const bestValue = direction === 'higher' ? Math.max(...validValues) : Math.min(...validValues);
    const bestIdxs = validIndices.filter(i => Number(values[i]) === bestValue);
    
    if (bestIdxs.length === validIndices.length) return [];
    return bestIdxs;
  } catch (err) {
    console.error("Error in getBestIndices:", err);
    return [];
  }
}


type FirmRowDef = {
  label: string;
  sub?: string;
  getValue: (firm: FirmNormalizedProfile) => React.ReactNode;
  emphasis?: boolean;
  getRawValue?: (firm: FirmNormalizedProfile) => any;
  compareDirection?: 'higher' | 'lower' | 'custom';
  customCompare?: (vals: any[]) => number[];
};

const formatPermission = (val: string | undefined) => {
  if (!val) return 'ND';
  if (val === 'allowed') return 'Allowed';
  if (val === 'restricted') return 'Restricted';
  if (val === 'conditional') return 'Conditional';
  return val;
}










  function toggle(id: string) {
    const firm = firms.find((item) => item.id === id);
    if (!firm) return;
    toggleSelection({ id: firm.id, name: firm.name, slug: firm.slug, logo: profileLogo(firm) });
  }


  const overviewRows: FirmRowDef[] = [
    { label: 'Operating model', getValue: modelLabel },
    { 
      label: 'Trustpilot rating', 
      getValue: (firm) => {
        const tp = firm.externalRatings?.find(r => r.source === 'trustpilot');
        if (!tp) return 'ND';
        return `${tp.score} / 5 (${tp.label})`;
      }
    },
    { 
      label: 'Year founded', 
      getValue: (firm) => {
        const year = knownValue((firm as any).company?.yearEstablished);
        return year ? year.toString() : 'ND';
      } 
    },
  ];

  const executionRows: FirmRowDef[] = [
    { label: 'Execution model', getValue: (firm) => knownValue(firm.executionPolicy?.model) ?? 'ND' },
    { label: 'Trading platforms', getValue: (firm) => knownValue(firm.tradingPolicy?.platforms)?.join(', ') ?? 'ND' },
    { label: 'Crypto leverage', getValue: (firm) => knownValue(firm.summary?.cryptoLeverage) ?? 'ND' },
  ];

  const permissionRows: FirmRowDef[] = [
    { label: 'News trading', getValue: (firm) => formatPermission(knownValue(firm.tradingPolicy?.newsTrading)) },
    { label: 'Weekend holding', getValue: (firm) => formatPermission(knownValue(firm.tradingPolicy?.weekendHolding)) },
    { label: 'EAs / Bots', getValue: (firm) => formatPermission(knownValue(firm.tradingPolicy?.automatedTrading)) },
    { label: 'Copy trading', getValue: (firm) => formatPermission(knownValue(firm.tradingPolicy?.copyTrading)) },
    { label: 'Mandatory stop-loss', getValue: (firm) => { const v = knownValue(firm.tradingPolicy?.mandatoryStopLoss); return v === true ? 'Yes' : v === false ? 'No' : 'ND'; } },
  ];

  const payoutRows: FirmRowDef[] = [
    { label: 'Profit split', getValue: (firm) => knownValue(firm.summary?.profitSplit) ?? 'ND',
      getRawValue: (firm) => {
        const str = knownValue(firm.summary?.profitSplit);
        if (!str) return undefined;
        const match = str.match(/(\d+)/);
        return match ? Number(match[1]) : undefined;
      },
      compareDirection: 'higher'
    },
    { label: 'Payout schedule', getValue: (firm) => knownValue(firm.payoutPolicy?.schedule) ?? 'ND' },
    { label: 'Supported currencies', getValue: (firm) => knownValue(firm.payoutPolicy?.currencies)?.join(', ') ?? 'ND' },
    { label: 'First payout time', sub: 'processing', getValue: (firm) => { const h = knownValue(firm.payoutPolicy?.processingTimeHours); return h ? `${h} hours` : 'ND'; } },
  ];



  return (
    <div className={styles.productPage}>
      <section className={styles.compareIntro}>
        <div><span className={styles.kicker}><span /> Side-by-side workspace</span><h1>Compare operating models without flattening them.</h1><p>Only shared decision fields are aligned here. Each firm keeps its own lifecycle, terminology and model-specific evidence in the full profile.</p></div>
        <a href="#compare-picker">Add or change firms <ArrowRight /></a>
      </section>

      
      
      {selectedFirms.length < 2 ? <section className={styles.emptyCompare}><Columns3 /><h2>Select at least two firms</h2><p>Comparison begins after two profiles are added below.</p><a href="#compare-picker">Browse firms</a></section> : (
        <section className={`${styles.compareWorkspace} ${selectedFirms.length === 2 ? styles.compareTwo : styles.compareThree}`} aria-label="Prop firm comparison">
          <div className={styles.compareHeaderRow}>
            <div className={styles.compareLabelCell}>
              <span>{selectedFirms.length} firms</span>
              <strong>Comparison</strong>
              <a href="#compare-picker" className={styles.addFirmHeaderLink}>+ Add firm</a>
            </div>
            {selectedFirms.map((firm) => {
              return (
                <div className={styles.compareFirmCell} key={firm.id}>
                  <button type="button" onClick={() => toggle(firm.id)} aria-label={`Remove ${firm.name}`} className={styles.removeFirmBtn}><X /></button>
                  <div className={styles.firmCellTop}>
                    <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} />
                    <strong>{firm.name}</strong>
                  </div>
                </div>
              );
            })}
          </div>
          
          
          <div className={`${styles.compareDataRow} ${styles.challengeDropdownRow}`}>
            <div className={styles.compareLabelCell}>
              <strong>Overview & Trust</strong>
            </div>
            {selectedFirms.map((firm) => <div key={firm.id} className={styles.compareFirmCell}></div>)}
          </div>
          
          <div className={styles.compareVerdictRow}>
            <div className={styles.compareLabelCell}><span>Evidence lens</span><strong>Quick read</strong></div>
            {selectedFirms.map((firm) => <div key={firm.id}><p>{evidenceSummary(firm)}</p><Link href={`/prop-firms/${firm.slug}`} scroll={false} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}>Open brief <ArrowRight /></Link></div>)}
          </div>
          
          {overviewRows.map((row, index) => renderFirmRow(row, index, true))}


          <div className={`${styles.compareDataRow} ${styles.challengeDropdownRow}`}>
            <div className={styles.compareLabelCell}>
              <strong>Challenge program</strong>
            </div>
            {selectedFirms.map((firm) => {
              const programs = getPrograms(firm);
              const selectedProgramId = programSelections[firm.id];
              return (
                <div className={styles.compareFirmCell} key={firm.id} style={{ padding: '12px 20px', justifyContent: 'center' }}>
                  {programs.length > 0 && (
                    <div className={styles.firmCellDropdown}>
                      <select 
                        value={selectedProgramId} 
                        onChange={(e) => setProgramSelections(prev => ({...prev, [firm.id]: e.target.value}))}
                        className={styles.challengeSelect}
                      >
                        {programs.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({kindLabel(p)})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {ROWS.map((row) => {
            const rawValues = row.getRawValue ? selectedFirms.map(firm => {
              const pId = programSelections[firm.id];
              const p = getPrograms(firm).find(x => x.id === pId);
              return p ? row.getRawValue!(p) : undefined;
            }) : [];
            const bestIndices = getBestIndices(rawValues, row.compareDirection, row.customCompare);
            
            return (
              <div className={styles.compareDataRow} key={row.label}>
                <div className={styles.compareLabelCell}>
                  {row.sub && <span>{row.sub}</span>}
                  <strong>{row.label}</strong>
                </div>
                {selectedFirms.map((firm, fIdx) => {
                  const programId = programSelections[firm.id];
                  const program = getPrograms(firm).find(p => p.id === programId);
                  const value = program ? row.getValue(program) : 'ND';
                  const isNd = value === 'ND';
                  const isBest = bestIndices.includes(fIdx);
                  
                  return (
                    <div
                      key={firm.id}
                      className={[
                        row.emphasis && !isNd ? styles.comparisonEmphasis : '',
                        isNd ? styles.challengeCompareNd : '',
                        isBest ? styles.isBestValue : ''
                      ].filter(Boolean).join(' ')}
                    >
                      {value}
                      {isBest && <Check className={styles.bestIcon} size={16} strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          {/* Tiers Row */}
          <div className={`${styles.compareDataRow} ${styles.challengeCompareTiersRow}`} style={{ alignItems: 'flex-start' }}>
            <div className={styles.compareLabelCell}>
              <span>all plans</span>
              <strong>Account tiers</strong>
            </div>
            {selectedFirms.map((firm) => {
              const programId = programSelections[firm.id];
              const program = getPrograms(firm).find(p => p.id === programId);
              const tiers = program ? getTiers(program) : [];
              return (
                <div key={firm.id} className={styles.challengeCompareTiersCell}>
                  {tiers.length === 0 ? (
                    <span className={styles.challengeCompareNd}>ND</span>
                  ) : (
                    <div className={styles.challengeTierList}>
                      {tiers.map((tier, idx) => {
                        const size = knownValue(tier.accountSize);
                        const fee = knownValue(tier.fee);
                        const orig = knownValue(tier.originalFee);
                        const currency = knownValue(tier.currency) ?? 'USD';
                        const available = knownValue(tier.available);
                        return (
                          <div
                            key={idx}
                            className={[styles.challengeTierRow, available === false ? styles.challengeTierUnavailable : ''].filter(Boolean).join(' ')}
                          >
                            <strong>{size !== undefined ? formatCapital(size) : 'ND'}</strong>
                            <span>
                              {fee !== undefined ? (
                                <>
                                  <b>{currency !== 'USD' ? `${fee} ${currency}` : `$${fee}`}</b>
                                  {orig !== undefined && (
                                    <s>{currency !== 'USD' ? `${orig} ${currency}` : `$${orig}`}</s>
                                  )}
                                </>
                              ) : 'ND'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`${styles.compareDataRow} ${styles.challengeDropdownRow}`}>
            <div className={styles.compareLabelCell}>
              <strong>Execution & Trading Environment</strong>
            </div>
            {selectedFirms.map((firm) => <div key={firm.id} className={styles.compareFirmCell}></div>)}
          </div>
          {executionRows.map((row, index) => renderFirmRow(row, index))}

          <div className={`${styles.compareDataRow} ${styles.challengeDropdownRow}`}>
            <div className={styles.compareLabelCell}>
              <strong>Trading Permissions</strong>
            </div>
            {selectedFirms.map((firm) => <div key={firm.id} className={styles.compareFirmCell}></div>)}
          </div>
          {permissionRows.map((row, index) => renderFirmRow(row, index))}

          <div className={`${styles.compareDataRow} ${styles.challengeDropdownRow}`}>
            <div className={styles.compareLabelCell}>
              <strong>Payouts & Settlement</strong>
            </div>
            {selectedFirms.map((firm) => <div key={firm.id} className={styles.compareFirmCell}></div>)}
          </div>
          {payoutRows.map((row, index) => renderFirmRow(row, index))}
          

          <div className={styles.challengeCompareRiskNote}>
            <CircleAlert />
            <div>
              <strong>How to read daily / max loss:</strong>
              <p>
                Daily loss resets at the firm&apos;s stated UTC time; floating PnL counts and touching the limit is a breach.
                Static drawdown is tied to the starting balance; trailing HWM follows your equity peak until it locks at starting balance.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className={styles.comparePicker} id="compare-picker" aria-labelledby="compare-picker-heading">
        <div className={styles.profileSectionTitle}><div><span>+</span><h2 id="compare-picker-heading">Choose firms</h2></div><p>Select up to three profiles.</p></div>
        <div className={styles.pickerGrid}>{firms.map((firm) => { const active = selected.includes(firm.id); const modular = getFirmModularProfile(firm); return <button className={active ? styles.pickerActive : ''} type="button" key={firm.id} onClick={() => toggle(firm.id)}><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} /><span><strong>{firm.name}</strong><small>{modelLabel(firm)} · {comparisonRangeText(modular.comparison.maxDrawdown)}</small></span>{active ? <Check /> : <span>+</span>}</button>; })}</div>
      </section>
    </div>
  );
}










