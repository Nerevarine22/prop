import { ArrowUpRight, ChevronDown } from 'lucide-react';
import type { FirmTransparencyProfile } from '@/types/database';
import styles from './HyroTraderTransparency.module.css';

export function HyroTraderTransparency({ data }: { data: FirmTransparencyProfile }) {
  return (
    <section className={styles.section} id="transparency" aria-labelledby="hyrotrader-transparency-title">
      <header className={styles.heading}>
        <span className={styles.eyebrow}>Payout records &amp; team</span>
        <h2 id="hyrotrader-transparency-title">Transparency</h2>
        <p>HyroTrader publishes payout totals, challenge pass rates and a public Solana payout wallet. Some payouts have public transaction IDs that can be inspected on-chain.</p>
        <span className={styles.snapshot}>Dashboard snapshot · checked {data.checkedAt}</span>
      </header>

      <div className={styles.primaryMetrics} aria-label="Transparency metrics">
        {data.metrics.map((metric) => (
          <article key={metric.label} data-tone={'tone' in metric ? metric.tone : undefined}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>{metric.context}</small>
          </article>
        ))}
      </div>

      <div className={styles.outcomes}>
        <div className={styles.subsectionHeading}>
          <span className={styles.eyebrow}>Challenge outcomes</span>
          <h3>Pass rates</h3>
        </div>
        <div className={styles.outcomeMetrics}>
          {data.challengeOutcomes.map((outcome) => (
            <article key={outcome.label}>
              <strong>{outcome.value}</strong>
              <span>{outcome.label}</span>
            </article>
          ))}
        </div>
        <p className={styles.outcomeNote}>Company-reported snapshot · rates recalculate as challenges resolve. The <a href={data.passRateArticleUrl} target="_blank" rel="noreferrer">14 Sep article</a> shows an earlier reading.</p>
      </div>

      <div className={styles.verification}>
        <div className={styles.subsectionHeading}>
          <span className={styles.eyebrow}>On-chain verification</span>
          <h3>Public payout records</h3>
        </div>
        <div className={styles.verificationColumns}>
          <article>
            <strong>{data.verification.amount}</strong>
            <p>The dashboard attributes this amount to payouts with public transaction IDs that can be checked independently on Solana.</p>
            <a href={data.dashboardUrl} target="_blank" rel="noreferrer">Verify payouts <ArrowUpRight aria-hidden="true" /></a>
          </article>
          <article>
            <span className={styles.factLabel}>Public payout wallet</span>
            <strong className={styles.wallet} title={data.verification.walletAddress}>{data.verification.wallet}</strong>
            <p>HyroTrader publishes the wallet and transaction history used for on-chain payout inspection.</p>
            <a href={data.verification.walletUrl} target="_blank" rel="noreferrer" aria-label={`View HyroTrader payout wallet ${data.verification.walletAddress}`}>View wallet <ArrowUpRight aria-hidden="true" /></a>
          </article>
        </div>
      </div>

      <dl className={styles.supportingFacts}>
        {data.supportingFacts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <details className={styles.companyDetails}>
        <summary>
          <span>Company &amp; team</span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <div className={styles.companyContent}>
          <div className={styles.companyIntro}>
            <p>
              HyroTrader says it was founded in {data.companyAndTeam.founded} by CEO {data.companyAndTeam.ceo}. Its public team page lists {data.companyAndTeam.teamSize}, and describes its headquarters as {data.companyAndTeam.headquarters}.
            </p>
            <p>{data.companyAndTeam.locationsNote}</p>
          </div>

          <dl className={styles.companyEntities}>
            {data.companyAndTeam.entities.map((entity) => (
              <div key={entity.name}>
                <dt>{entity.label}</dt>
                <dd>
                  <strong>{entity.name}</strong>
                  <span>{entity.jurisdiction}</span>
                  <p>{entity.details}</p>
                </dd>
              </div>
            ))}
          </dl>

          <p className={styles.companyNote}>{data.companyAndTeam.slovakRegistryNote}</p>
          <p className={styles.companyNote}>{data.companyAndTeam.regulatoryNote}</p>
          <nav className={styles.companySources} aria-label="Company information sources">
            <a href={data.companyAndTeam.termsUrl} target="_blank" rel="noreferrer">Terms <ArrowUpRight aria-hidden="true" /></a>
            <a href={data.companyAndTeam.aboutUrl} target="_blank" rel="noreferrer">About <ArrowUpRight aria-hidden="true" /></a>
            <a href={data.companyAndTeam.registryUrl} target="_blank" rel="noreferrer">Slovak Commercial Bulletin <ArrowUpRight aria-hidden="true" /></a>
          </nav>
        </div>
      </details>

    </section>
  );
}
