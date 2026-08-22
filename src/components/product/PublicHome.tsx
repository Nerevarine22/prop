import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock3, Database, FileCheck2, Gift, ShieldCheck } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { factText, firstKnownFee, profileLogo, profilePrograms, profileRewardLabels } from '@/lib/data/publicFirmProfiles';
import type { FirmNormalizedProfile } from '@/types/database';
import { FirmDirectory } from './FirmDirectory';
import styles from '@/app/product-lab/page.module.css';

export function PublicHome({ firms }: { firms: FirmNormalizedProfile[] }) {
  const featured = firms.find((firm) => firm.slug === 'propr') ?? firms[0];
  const fee = firstKnownFee(featured);
  const programs = profilePrograms(featured);
  const reward = profileRewardLabels(featured)[0] ?? 'ND';

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
            <FirmLogo src={profileLogo(featured)} name={featured.name} imageClassName={styles.previewLogo} fallbackClassName={styles.previewFallback} />
            <div><strong>{featured.name}</strong><small>{programs[0]?.name ?? 'ND'} · from {fee === undefined ? 'ND' : `$${fee}`}</small></div>
            <Link href={`/prop-firms/${featured.slug}`}>View <ArrowUpRight /></Link>
          </div>
          <div className={styles.previewVerdict}><span>Research status</span><p>Primary-source facts use explicit ND and preserve resolved differences between official pages.</p></div>
          <div className={styles.previewSignals}>
            <div><Check /><span><strong>{factText(featured.summary.maxDrawdown)}</strong> drawdown</span></div>
            <div><Gift /><span><strong>{reward}</strong> rewards</span></div>
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

      <FirmDirectory firms={firms} mode="preview" />
    </>
  );
}
