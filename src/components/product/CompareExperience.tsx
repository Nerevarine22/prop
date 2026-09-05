'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Columns3, Database, X } from 'lucide-react';
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
import type { FirmContentFact, FirmNormalizedProfile } from '@/types/database';
import { useComparisonSelection } from '@/hooks/useComparisonSelection';
import styles from '@/app/product-lab/page.module.css';

export function CompareExperience({ firms }: { firms: FirmNormalizedProfile[] }) {
  const searchParams = useSearchParams();
  const { hydrated, selectedIds: selected, toggle: toggleSelection, replace } = useComparisonSelection();
  const appliedUrlSelection = useRef(false);

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
  const modelLabel = (firm: FirmNormalizedProfile) => {
    const modular = getFirmModularProfile(firm);
    return modular.modelTypes.map(firmModelTypeLabel).join(' · ');
  };
  const evidenceSummary = (firm: FirmNormalizedProfile) => {
    const modular = getFirmModularProfile(firm);
    if (modular.researchStandard !== 'model-first-v1') {
      return `${firm.ndFields.length} fields are ND; ${firm.sourceDiscrepancies.length} source differences are resolved.`;
    }
    const facts = new Map<string, FirmContentFact>();
    for (const section of modular.sections) {
      for (const block of section.blocks) {
        if (block.type === 'fact-grid') block.items.forEach((fact) => facts.set(fact.id, fact));
        if (block.type === 'record-list') block.items.flatMap((item) => item.facts ?? []).forEach((fact) => facts.set(fact.id, fact));
      }
    }
    const unknown = [...facts.values()].filter((fact) => fact.status === 'ND').length;
    return `${facts.size} model-specific facts; ${unknown ? `${unknown} relevant ${unknown === 1 ? 'value is' : 'values are'} ND` : 'no artificial template gaps'}.`;
  };
  const rows: Array<[string, (firm: FirmNormalizedProfile) => string]> = [
    ['Operating model', modelLabel],
    ['Entry cost', (firm) => comparisonRangeText(getFirmModularProfile(firm).comparison.entryCost)],
    ['Capital', (firm) => comparisonRangeText(getFirmModularProfile(firm).comparison.capital)],
    ['Programs / path', (firm) => getFirmModularProfile(firm).offerNames.join(' / ') || 'ND'],
    ['Maximum drawdown', (firm) => comparisonRangeText(getFirmModularProfile(firm).comparison.maxDrawdown)],
    ['Profit sharing', (firm) => comparisonRangeText(getFirmModularProfile(firm).comparison.profitSplit)],
    ['Compensation timing', (firm) => comparisonListText(getFirmModularProfile(firm).comparison.payoutSchedules)],
    ['Execution', (firm) => comparisonListText(getFirmModularProfile(firm).comparison.executionModels)],
  ];

  function toggle(id: string) {
    const firm = firms.find((item) => item.id === id);
    if (!firm) return;
    toggleSelection({ id: firm.id, name: firm.name, slug: firm.slug, logo: profileLogo(firm) });
  }

  return (
    <div className={styles.productPage}>
      <section className={styles.compareIntro}>
        <div><span className={styles.kicker}><span /> Side-by-side workspace</span><h1>Compare operating models without flattening them.</h1><p>Only shared decision fields are aligned here. Each firm keeps its own lifecycle, terminology and model-specific evidence in the full profile.</p></div>
        <a href="#compare-picker">Add or change firms <ArrowRight /></a>
      </section>

      {selectedFirms.length < 2 ? <section className={styles.emptyCompare}><Columns3 /><h2>Select at least two firms</h2><p>Comparison begins after two profiles are added below.</p><a href="#compare-picker">Browse firms</a></section> : (
        <section className={`${styles.compareWorkspace} ${selectedFirms.length === 2 ? styles.compareTwo : styles.compareThree}`} aria-label="Prop firm comparison">
          <div className={styles.compareHeaderRow}>
            <div className={styles.compareLabelCell}><span>{selectedFirms.length} firms</span><strong>Core comparison</strong></div>
            {selectedFirms.map((firm) => <div className={styles.compareFirmCell} key={firm.id}><button type="button" onClick={() => toggle(firm.id)} aria-label={`Remove ${firm.name}`}><X /></button><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} /><div><strong>{firm.name}</strong><span>{modelLabel(firm)}</span></div></div>)}
          </div>
          <div className={styles.compareVerdictRow}>
            <div className={styles.compareLabelCell}><span>Evidence lens</span><strong>Quick read</strong></div>
            {selectedFirms.map((firm) => <div key={firm.id}><p>{evidenceSummary(firm)}</p><Link href={`/prop-firms/${firm.slug}`}>Open brief <ArrowRight /></Link></div>)}
          </div>
          <div className={styles.compareRows}>{rows.map(([label, value], index) => <div className={styles.compareDataRow} key={label}><div className={styles.compareLabelCell}><span>{label}</span></div>{selectedFirms.map((firm) => <div className={index === 0 || index === 3 || index === 5 ? styles.comparisonEmphasis : ''} key={firm.id}>{value(firm)}</div>)}</div>)}</div>
          <div className={styles.compareFootnote}><Database /><p><strong>Evidence note:</strong> every displayed value comes from the firm’s normalized primary-source profile. Non-applicable fields are not converted into ND.</p></div>
        </section>
      )}

      <section className={styles.comparePicker} id="compare-picker" aria-labelledby="compare-picker-heading">
        <div className={styles.profileSectionTitle}><div><span>+</span><h2 id="compare-picker-heading">Choose firms</h2></div><p>Select up to three profiles.</p></div>
        <div className={styles.pickerGrid}>{firms.map((firm) => { const active = selected.includes(firm.id); const modular = getFirmModularProfile(firm); return <button className={active ? styles.pickerActive : ''} type="button" key={firm.id} onClick={() => toggle(firm.id)}><FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} /><span><strong>{firm.name}</strong><small>{modelLabel(firm)} · {comparisonRangeText(modular.comparison.maxDrawdown)}</small></span>{active ? <Check /> : <span>+</span>}</button>; })}</div>
      </section>
    </div>
  );
}
