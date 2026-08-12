import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock3, Database, FileCheck2, Gift, ShieldCheck } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { decisionCopy } from './experience';
import { FirmDirectory } from './FirmDirectory';
import styles from '@/app/product-lab/page.module.css';

export function PublicHome() {
  const featured = MOCK_PROP_FIRMS[0];

  return (
    <>
      <section className={styles.intro} aria-labelledby="home-heading">
        <div className={styles.introCopy}>
          <span className={styles.kicker}><span /> Independent prop research</span>
          <h1 id="home-heading">Choose the rules.<br />Not the marketing.</h1>
          <p>Find an on-chain prop firm that fits the way you trade. Compare real constraints, reward programs and the evidence behind each claim.</p>
          <div className={styles.introActions}>
            <Link href="/prop-firms">Browse firms <ArrowRight /></Link>
            <Link className={styles.secondaryIntroAction} href="/compare">Open comparison</Link>
          </div>
        </div>

        <aside className={styles.briefPreview} aria-label={`${featured.name} decision brief preview`}>
          <div className={styles.previewTop}><span>Decision brief</span><span>Research profile</span></div>
          <div className={styles.previewFirm}>
            <FirmLogo src={featured.logo} name={featured.name} imageClassName={styles.previewLogo} fallbackClassName={styles.previewFallback} />
            <div><strong>{featured.name}</strong><small>{featured.evaluationSteps[0]} · from ${featured.accountTiers[0]?.price}</small></div>
            <Link href={`/prop-firms/${featured.slug}`}>View <ArrowUpRight /></Link>
          </div>
          <div className={styles.previewVerdict}><span>Why it stands out</span><p>{decisionCopy(featured)}</p></div>
          <div className={styles.previewSignals}>
            <div><Check /><span><strong>{featured.maxDrawdown}</strong> drawdown</span></div>
            <div><Gift /><span><strong>{featured.rewardTags?.[0] || 'No'}</strong> rewards</span></div>
            <div><FileCheck2 /><span><strong>Sources</strong> in review</span></div>
          </div>
        </aside>
      </section>

      <section className={styles.trustStrip} aria-label="Research model">
        <p>Research model</p>
        <div><Database /><span>Rules normalized</span></div>
        <div><FileCheck2 /><span>Sources attached</span></div>
        <div><Clock3 /><span>Changes dated</span></div>
        <div><ShieldCheck /><span>Uncertainty visible</span></div>
      </section>

      <FirmDirectory mode="preview" />
    </>
  );
}
