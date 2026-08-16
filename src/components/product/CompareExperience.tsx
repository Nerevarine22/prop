'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Columns3, Database, X } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import {
  factArrayText,
  factText,
  firstKnownFee,
  formatCapital,
  profileLogo,
  profilePrograms,
  profileRewardLabels,
} from '@/lib/data/publicFirmProfiles';
import type { FirmNormalizedProfile } from '@/types/database';
import styles from '@/app/product-lab/page.module.css';

export function CompareExperience({ firms }: { firms: FirmNormalizedProfile[] }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => {
    const requested = searchParams.get('ids')?.split(',').filter((id) => firms.some((firm) => firm.id === id)) ?? [];
    const unique = [...new Set(requested)].slice(0, 3);
    if (unique.length >= 2) return unique;
    return [...unique, ...firms.map((firm) => firm.id).filter((id) => !unique.includes(id))].slice(0, 2);
  });

  const selectedFirms = selected.map((id) => firms.find((firm) => firm.id === id)).filter(Boolean) as FirmNormalizedProfile[];
  const rows = [
    ['Challenge from', (firm: FirmNormalizedProfile) => { const fee = firstKnownFee(firm); return fee === undefined ? 'ND' : `$${fee}`; }],
    ['Evaluation', (firm: FirmNormalizedProfile) => profilePrograms(firm).map((program) => program.name).join(' / ') || 'ND'],
    ['Profit target', (firm: FirmNormalizedProfile) => factText(firm.summary.profitTarget)],
    ['Maximum drawdown', (firm: FirmNormalizedProfile) => factText(firm.summary.maxDrawdown)],
    ['Daily drawdown', (firm: FirmNormalizedProfile) => factText(firm.summary.dailyDrawdown)],
    ['Profit split', (firm: FirmNormalizedProfile) => factText(firm.summary.profitSplit)],
    ['Payout schedule', (firm: FirmNormalizedProfile) => factText(firm.summary.payoutFrequency)],
    ['Platforms', (firm: FirmNormalizedProfile) => factArrayText(firm.tradingPolicy.platforms)],
    ['Weekend holding', (firm: FirmNormalizedProfile) => factText(firm.tradingPolicy.weekendHolding)],
    ['News trading', (firm: FirmNormalizedProfile) => factText(firm.tradingPolicy.newsTrading)],
    ['Maximum capital', (firm: FirmNormalizedProfile) => formatCapital(firm.summary.maxCapital.status === 'reported' || firm.summary.maxCapital.status === 'verified' ? firm.summary.maxCapital.value : undefined)],
    ['Rewards', (firm: FirmNormalizedProfile) => profileRewardLabels(firm).join(', ') || 'ND'],
  ] as const;

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? [...current.slice(1), id] : [...current, id]);
  }

  return (
    <div className={styles.productPage}>
      <section className={styles.compareIntro}>
        <div><span className={styles.kicker}><span /> Side-by-side workspace</span><h1>Compare known rules without hiding uncertainty.</h1><p>ND remains ND. When official pages differ, the rulebook or most specific formal policy is canonical and the difference stays visible in the source record.</p></div>
        <a href="#compare-picker">Add or change firms <ArrowRight /></a>
      </section>

      {selectedFirms.length < 2 ? <section className={styles.emptyCompare}><Columns3 /><h2>Select at least two firms</h2><p>Comparison begins after two profiles are added below.</p><a href="#compare-picker">Browse firms</a></section> : (
        <section className={`${styles.compareWorkspace} ${selectedFirms.length === 2 ? styles.compareTwo : styles.compareThree}`} aria-label="Prop firm comparison">
          <div className={styles.compareHeaderRow}>
            <div className={styles.compareLabelCell}><span>{selectedFirms.length} firms</span><strong>Core comparison</strong></div>
            {selectedFirms.map((firm) => <div className={styles.compareFirmCell} key={firm.id}><button type="button" onClick={() => toggle(firm.id)} aria-label={`Remove ${firm.name}`}><X /></button><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} /><div><strong>{firm.name}</strong><span>{profilePrograms(firm)[0]?.name ?? 'ND'}</span></div></div>)}
          </div>
          <div className={styles.compareVerdictRow}>
            <div className={styles.compareLabelCell}><span>Evidence lens</span><strong>Quick read</strong></div>
            {selectedFirms.map((firm) => <div key={firm.id}><p>{firm.ndFields.length} fields are ND; {firm.sourceDiscrepancies.length} source differences are resolved.</p><Link href={`/prop-firms/${firm.slug}`}>Open brief <ArrowRight /></Link></div>)}
          </div>
          <div className={styles.compareRows}>{rows.map(([label, value], index) => <div className={styles.compareDataRow} key={label}><div className={styles.compareLabelCell}><span>{label}</span></div>{selectedFirms.map((firm) => <div className={index === 0 || index === 3 || index === 5 ? styles.comparisonEmphasis : ''} key={firm.id}>{value(firm)}</div>)}</div>)}</div>
          <div className={styles.compareFootnote}><Database /><p><strong>Evidence note:</strong> every displayed value comes from the normalized primary-source profile. ND never means zero or false.</p></div>
        </section>
      )}

      <section className={styles.comparePicker} id="compare-picker" aria-labelledby="compare-picker-heading">
        <div className={styles.profileSectionTitle}><div><span>+</span><h2 id="compare-picker-heading">Choose firms</h2></div><p>Select up to three profiles.</p></div>
        <div className={styles.pickerGrid}>{firms.map((firm) => { const active = selected.includes(firm.id); return <button className={active ? styles.pickerActive : ''} type="button" key={firm.id} onClick={() => toggle(firm.id)}><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} /><span><strong>{firm.name}</strong><small>{profilePrograms(firm)[0]?.name ?? 'ND'} · {factText(firm.summary.maxDrawdown)}</small></span>{active ? <Check /> : <span>+</span>}</button>; })}</div>
      </section>
    </div>
  );
}
