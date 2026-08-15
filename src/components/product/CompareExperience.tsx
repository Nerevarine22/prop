'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Columns3, Database, X } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { PropFirm } from '@/types/firm';
import { compareRows, decisionCopy } from './experience';
import styles from '@/app/product-lab/page.module.css';

export function CompareExperience({ firms }: { firms: PropFirm[] }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => {
    const requested = searchParams.get('ids')?.split(',').filter((id) => firms.some((firm) => firm.id === id)) ?? [];
    const unique = [...new Set(requested)].slice(0, 3);
    if (unique.length >= 2) return unique;
    const fill = firms.map((firm) => firm.id).filter((id) => !unique.includes(id));
    return [...unique, ...fill].slice(0, 2);
  });

  const selectedFirms = selected.map((id) => firms.find((firm) => firm.id === id)).filter(Boolean);

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return [...current.slice(1), id];
      return [...current, id];
    });
  }

  return (
    <div className={styles.productPage}>
      <section className={styles.compareIntro}>
        <div><span className={styles.kicker}><span /> Side-by-side workspace</span><h1>Compare the rules that can end an account.</h1><p>Every row uses the same definition. Differences are highlighted; PropHub does not declare a universal winner.</p></div>
        <a href="#compare-picker">Add or change firms <ArrowRight /></a>
      </section>

      {selectedFirms.length < 2 ? (
        <section className={styles.emptyCompare}><Columns3 /><h2>Select at least two firms</h2><p>Comparison begins after two profiles are added below.</p><a href="#compare-picker">Browse firms</a></section>
      ) : (
        <section className={`${styles.compareWorkspace} ${selectedFirms.length === 2 ? styles.compareTwo : styles.compareThree}`} aria-label="Prop firm comparison">
          <div className={styles.compareHeaderRow}>
            <div className={styles.compareLabelCell}><span>{selectedFirms.length} firms</span><strong>Core comparison</strong></div>
            {selectedFirms.map((firm) => firm && (
              <div className={styles.compareFirmCell} key={firm.id}>
                <button type="button" onClick={() => toggle(firm.id)} aria-label={`Remove ${firm.name}`}><X /></button>
                <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} />
                <div><strong>{firm.name}</strong><span>{firm.evaluationSteps[0]}</span></div>
              </div>
            ))}
          </div>

          <div className={styles.compareVerdictRow}>
            <div className={styles.compareLabelCell}><span>Decision lens</span><strong>Quick read</strong></div>
            {selectedFirms.map((firm) => firm && <div key={firm.id}><p>{decisionCopy(firm)}</p><Link href={`/prop-firms/${firm.slug}`}>Open brief <ArrowRight /></Link></div>)}
          </div>

          <div className={styles.compareRows}>
            {compareRows.map((row) => (
              <div className={styles.compareDataRow} key={row.label}>
                <div className={styles.compareLabelCell}><span>{row.label}</span></div>
                {selectedFirms.map((firm) => firm && <div className={row.emphasis ? styles.comparisonEmphasis : ''} key={firm.id}>{row.value(firm)}</div>)}
              </div>
            ))}
          </div>

          <div className={styles.compareFootnote}><Database /><p><strong>Evidence note:</strong> every production value will carry a data status, source and review date. Current sample records validate the comparison model.</p></div>
        </section>
      )}

      <section className={styles.comparePicker} id="compare-picker" aria-labelledby="compare-picker-heading">
        <div className={styles.profileSectionTitle}><div><span>+</span><h2 id="compare-picker-heading">Choose firms</h2></div><p>Select up to three profiles. Adding a fourth replaces the oldest selection.</p></div>
        <div className={styles.pickerGrid}>
          {firms.map((firm) => {
            const active = selected.includes(firm.id);
            return (
              <button className={active ? styles.pickerActive : ''} type="button" key={firm.id} onClick={() => toggle(firm.id)}>
                <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.compareLogo} fallbackClassName={styles.compareFallback} />
                <span><strong>{firm.name}</strong><small>{firm.evaluationSteps[0]} · {firm.maxDrawdown}</small></span>
                {active ? <Check /> : <span>+</span>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
