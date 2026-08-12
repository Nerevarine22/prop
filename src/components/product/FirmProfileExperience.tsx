import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Check, CircleAlert, ExternalLink, FileCheck2, Gift } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { PropFirm } from '@/types/firm';
import { decisionCopy, formatCapital, shortDate } from './experience';
import styles from '@/app/product-lab/page.module.css';

export function FirmProfileExperience({ firm }: { firm: PropFirm }) {
  const evidenceLabel = firm.dataStatus === 'verified' ? 'Verified record' : firm.dataStatus === 'reported' ? 'Reported record' : 'Research in progress';

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>

      <section className={styles.profileHero}>
        <div className={styles.profileIdentity}>
          <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
          <div>
            <span className={styles.kicker}><span /> Research profile</span>
            <h1>{firm.name}</h1>
            <p>{firm.tagline}</p>
          </div>
        </div>
        <div className={styles.profileActions}>
          <Link className={styles.primaryProfileAction} href={`/compare?ids=${firm.id}`}>+ Add to compare</Link>
          {firm.website && <a href={firm.website} target="_blank" rel="noreferrer">Official site <ExternalLink /></a>}
        </div>
      </section>

      <section className={styles.decisionGrid}>
        <article className={styles.decisionMain}>
          <span>PropHub decision brief</span>
          <h2>{decisionCopy(firm)}</h2>
          <p>Start with who the program may suit, then inspect the plan economics, exceptions and evidence behind the conclusion.</p>
        </article>
        <article className={styles.decisionGood}><Check /><div><span>Best fit</span><strong>{firm.weekendHoldingAllowed ? 'Swing and event-aware traders' : 'Structured intraday traders'}</strong><p>{firm.newsTradingAllowed ? 'News trading is listed as allowed.' : 'News restrictions require attention.'}</p></div></article>
        <article className={styles.decisionRisk}><CircleAlert /><div><span>Main trade-off</span><strong>{firm.maxDrawdown}</strong><p>Confirm the calculation method and funded-stage exceptions in the official rules.</p></div></article>
      </section>

      <section className={styles.profileLayout}>
        <div className={styles.profilePrimary}>
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>01</span><h2>Challenge economics</h2></div><p>Start with the constraints that can end the account, not the advertised account size.</p></div>
            <div className={styles.metricBand}>
              <div><span>Entry price</span><strong>${firm.accountTiers[0]?.price}</strong><small>Smallest listed plan</small></div>
              <div><span>Profit target</span><strong>{firm.profitTarget}</strong><small>Evaluation stage</small></div>
              <div><span>Maximum loss</span><strong>{firm.maxDrawdown}</strong><small>Calculation needs source</small></div>
              <div><span>Profit split</span><strong>{firm.profitSplit}</strong><small>Funded stage</small></div>
            </div>
            <div className={styles.planTable}>
              <div className={styles.planHead}><span>Account</span><span>Price</span><span>Target</span><span>Max loss</span><span>Daily loss</span></div>
              {firm.accountTiers.slice(0, 4).map((tier) => (
                <div className={styles.planRow} key={tier.accountSize}><strong>{formatCapital(tier.accountSize)}</strong><span>${tier.price}</span><span>{tier.profitTarget}</span><span>{tier.maxDrawdown}</span><span>{tier.dailyDrawdown}</span></div>
              ))}
            </div>
          </section>

          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>02</span><h2>Rules that change the outcome</h2></div><p>Material rules keep their status separate from the supporting source.</p></div>
            <div className={styles.rulesList}>
              {[
                ['Weekend holding', firm.weekendHoldingAllowed ? 'Allowed' : 'Restricted', 'Check whether positions may remain open through market close.'],
                ['News trading', firm.newsTradingAllowed ? 'Allowed' : 'Restricted', 'High-impact event windows may have separate funded-stage rules.'],
                ['Expert advisors', firm.eaAllowed ? 'Allowed' : 'Restricted', 'Automation, copy trading and third-party signals need separate definitions.'],
                ['Time limit', firm.noTimeLimit ? 'No time limit' : 'Time limit applies', 'The minimum trading-day requirement may still apply.'],
              ].map(([label, value, description]) => (
                <div key={label}><div><strong>{label}</strong><p>{description}</p></div><span className={value === 'Allowed' || value === 'No time limit' ? styles.rulePositive : styles.ruleNeutral}>{value}</span><Link href="/methodology">Source status <ArrowUpRight /></Link></div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.profileAside}>
          <section className={styles.evidenceCard}>
            <div><FileCheck2 /><span>Evidence status</span></div>
            <strong>{evidenceLabel}</strong>
            <p>{firm.dataStatus === 'mock' ? 'Values currently exercise the product structure and require primary-source review.' : 'Claims are shown with their current research status.'}</p>
            <dl>
              <div><dt>Last reviewed</dt><dd>{shortDate(firm.lastReviewedAt)}</dd></div>
              <div><dt>Sources attached</dt><dd>{firm.sources.length}</dd></div>
              <div><dt>Confidence</dt><dd>{firm.verification.confidence || 'Pending'}</dd></div>
            </dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
          <section className={styles.rewardCard}>
            <div><Gift /><span>Reward layer</span></div>
            <h3>{firm.rewardTags?.join(', ') || 'No rewards listed'}</h3>
            <p>{firm.tokenomicsInfo?.rewardDescription || 'No reward program has been documented.'}</p>
            <span>Potential token value is never included in the core challenge comparison.</span>
          </section>
          <section className={styles.sourceCard}>
            <div><BookOpen /><span>Source stack</span></div>
            <ul><li><span>Official rulebook</span><em>Pending</em></li><li><span>Payout policy</span><em>Pending</em></li><li><span>Platform documentation</span><em>Pending</em></li><li><span>On-chain evidence</span><em>Pending</em></li></ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
