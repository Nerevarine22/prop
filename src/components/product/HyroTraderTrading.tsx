import type { FirmContentBlock, FirmContentFact, FirmNormalizedProfileV2 } from '@/types/database';
import styles from './HyroTraderTrading.module.css';

type FactGridBlock = Extract<FirmContentBlock, { type: 'fact-grid' }>;
type TableBlock = Extract<FirmContentBlock, { type: 'table' }>;

const splitFeeValue = (value: string) => {
  const [percentage, basisPoints] = value.split('|');
  return { percentage, basisPoints };
};

export function HyroTraderTrading({ profile }: { profile: FirmNormalizedProfileV2 }) {
  const tradingBlocks = profile.sections.find((section) => section.id === 'trading')?.blocks ?? [];
  const findFactGrid = (id: string) => tradingBlocks.find(
    (block): block is FactGridBlock => block.type === 'fact-grid' && block.id === id,
  );
  const riskMetrics = findFactGrid('hyrotrader-risk-metrics')?.items ?? [];
  const operatingRules = findFactGrid('hyrotrader-operating-rules')?.items ?? [];
  const platformRequirements = findFactGrid('hyrotrader-platform-requirements')?.items ?? [];
  const fees = tradingBlocks.find(
    (block): block is TableBlock => block.type === 'table' && block.id === 'hyrotrader-fees',
  );
  const feeNote = fees?.facts?.find((fact: FirmContentFact) => fact.id === 'fee-note')?.value;
  const details = tradingBlocks.filter(
    (block): block is Extract<FirmContentBlock, { type: 'text' }> => block.type === 'text' && block.id.startsWith('hyrotrader-rule-'),
  );

  return (
    <div className={styles.wrap}>
      <section className={styles.primary} aria-label="Primary risk limits">
        {riskMetrics.map((metric) => (
          <article key={metric.id}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            {metric.note && <p>{metric.note}</p>}
          </article>
        ))}
      </section>

      <section className={styles.operatingRules} aria-labelledby="hyrotrader-operating-rules-heading">
        <h3 className={styles.subsectionHeading} id="hyrotrader-operating-rules-heading">Operating rules</h3>
        <dl>
          {operatingRules.map((rule) => (
            <div key={rule.id}>
              <dt>{rule.label}</dt>
              <dd>{rule.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={styles.feesAndAccess}>
        {fees && <section className={styles.fees} aria-labelledby="hyrotrader-fees-heading">
          <span className={styles.eyebrow}>{fees.description}</span>
          <h3 className={styles.subsectionHeading} id="hyrotrader-fees-heading">{fees.title}</h3>
          <table className={styles.feeTable}>
            <thead>
              <tr>{fees.columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr>
            </thead>
            <tbody>
              {fees.rows.map((row) => (
                <tr key={row.id}>
                  {fees.columns.map((column, index) => {
                    const value = row.cells[column.key] ?? '';
                    if (index === 0) return <th key={column.key} scope="row">{value}</th>;
                    const { percentage, basisPoints } = splitFeeValue(value);
                    return <td key={column.key}><strong>{percentage}</strong><span>{basisPoints}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {feeNote && <p className={styles.feeNote}>{feeNote}</p>}
        </section>}

        <section className={styles.accountRequirement} aria-labelledby="hyrotrader-account-heading">
          <span className={styles.eyebrow}>Platform requirement</span>
          <h3 className={styles.subsectionHeading} id="hyrotrader-account-heading">Choose your platform</h3>
          <dl>
            {platformRequirements.map((platform) => (
              <div key={platform.id}>
                <dt>{platform.label}</dt>
                <dd>{platform.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <details className={styles.details}>
        <summary>Funded account and phase-specific details</summary>
        <div className={styles.detailGrid}>
          {details.map((rule) => <article key={rule.id}>
            <h3>{rule.title}</h3>
            {rule.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>)}
        </div>
      </details>
    </div>
  );
}
