import Link from 'next/link';
import { ArrowRight, ExternalLink, FileCheck2 } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { PropFirm } from '@/types/firm';
import { shortDate } from './experience';
import { FirmResearchTabs } from './FirmResearchTabs';
import { PromoOffer } from './PromoOffer';
import styles from '@/app/product-lab/page.module.css';

export function FirmProfileExperience({ firm }: { firm: PropFirm }) {
  const evidenceLabel = firm.dataStatus === 'verified' ? 'Verified record' : firm.dataStatus === 'reported' ? 'Reported record' : 'Research in progress';
  const offerUrl = firm.verifiedCoupon?.referralUrl || firm.website;

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>

      <section className={styles.profileHero}>
        <div className={styles.profileIdentity}>
          <FirmLogo src={firm.logo} name={firm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
          <div><span className={styles.kicker}><span /> Research profile</span><h1>{firm.name}</h1><p>{firm.tagline}</p></div>
        </div>
        <div className={styles.profileActions}>
          {firm.website && <a href={firm.website} target="_blank" rel="noreferrer">Official site <ExternalLink /></a>}
          {firm.verifiedCoupon && <PromoOffer coupon={firm.verifiedCoupon} />}
          <Link className={styles.compactCompareAction} href={`/compare?ids=${firm.id}`}>+ Compare</Link>
        </div>
      </section>

      <section className={styles.profileLayout}>
        <main className={styles.profilePrimary}><FirmResearchTabs firm={firm} offerUrl={offerUrl} /></main>
        <aside className={styles.profileAside}>
          <section className={styles.evidenceCard}>
            <div><FileCheck2 /><span>Evidence status</span></div>
            <strong>{evidenceLabel}</strong>
            <p>{firm.dataStatus === 'mock' ? 'Values currently exercise the product structure and require primary-source review.' : 'Claims are manually extracted from the attached primary sources. Reported does not mean independently audited.'}</p>
            <dl><div><dt>Last reviewed</dt><dd>{shortDate(firm.lastReviewedAt)}</dd></div><div><dt>Sources attached</dt><dd>{firm.sources.length}</dd></div><div><dt>Confidence</dt><dd>{firm.verification.confidence || 'Pending'}</dd></div></dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
          {!firm.verifiedCoupon && <section className={styles.noPromoCard}><span>Promotion status</span><strong>No verified code</strong><p>A promo code will appear beside the official-site link only after it has a current source.</p></section>}
        </aside>
      </section>
    </div>
  );
}
