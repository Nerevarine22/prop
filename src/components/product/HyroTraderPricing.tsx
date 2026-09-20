import type { FirmContentBlock, FirmNormalizedProfileV2 } from '@/types/database';
import styles from './HyroTraderPricing.module.css';

export function HyroTraderPricing({ profile }: { profile: FirmNormalizedProfileV2 }) {
  const rules = profile.sections.find((section) => section.id === 'offers')?.blocks.filter((block): block is Extract<FirmContentBlock, { type: 'text' }> => block.type === 'text' && block.id.startsWith('hyrotrader-rule-')) ?? [];
  const copy = profile.editorialCopy ?? {};
  return (
    <details className={styles.pricing}>
      <summary>Challenge details & evaluation rules</summary>
      <div className={styles.explanation}>
        <h3>Swing drawdown upgrade</h3>
        <p>{copy['programs.swing']}</p>
        <p>Prices show the base fee by default. Enable Swing in each card to see the total including the upgrade. Standard uses intraday trailing daily drawdown; Swing uses a fixed daily reference.</p>
      </div>
      <section className={styles.rules} aria-label="Challenge and evaluation rules">
        <h3>Challenge & evaluation rules</h3>
        <div>{rules.map((rule) => <article key={rule.id}>
          <h4>{rule.title}</h4>
          {rule.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>)}</div>
      </section>
    </details>
  );
}
