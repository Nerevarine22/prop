import type { FirmContentBlock, FirmNormalizedProfileV2 } from '@/types/database';
import styles from './HyroTraderTrading.module.css';

export function HyroTraderTrading({ profile }: { profile: FirmNormalizedProfileV2 }) {
  const rules = profile.sections.find((section) => section.id === 'trading')?.blocks.filter(
    (block): block is Extract<FirmContentBlock, { type: 'text' }> => block.type === 'text' && block.id.startsWith('hyrotrader-rule-'),
  ) ?? [];

  return (
    <div className={styles.wrap}>
      <div className={styles.primary} aria-label="Key funded account rules">
        <article data-tone="blue">
          <span>Open margin</span>
          <strong>25%</strong>
          <p>Maximum share of initial balance used as margin across all open positions.</p>
        </article>
        <article data-tone="amber">
          <span>Total exposure</span>
          <strong>2×</strong>
          <p>Maximum combined notional value of open positions relative to initial balance.</p>
        </article>
        <article data-tone="lime">
          <span>Single-trade loss</span>
          <strong>3%</strong>
          <p>A realized loss above this share of initial balance is reviewed as a rule violation.</p>
        </article>
      </div>

      <div className={styles.quickRules}>
        <p><span>Stop loss</span><strong>Not mandatory</strong></p>
        <p><span>Overnight & weekends</span><strong>Allowed</strong></p>
        <p><span>News trading</span><strong>Conditional</strong></p>
        <p><span>Copy trading</span><strong>Prohibited</strong></p>
      </div>

      <details className={styles.details}>
        <summary>Funded account trading details</summary>
        <div className={styles.detailGrid}>
          {rules.map((rule) => <article key={rule.id}>
            <h3>{rule.title}</h3>
            {rule.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>)}
        </div>
      </details>
    </div>
  );
}
