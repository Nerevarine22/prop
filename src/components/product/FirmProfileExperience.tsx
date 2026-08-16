import Link from 'next/link';
import { ArrowRight, ExternalLink, FileCheck2 } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { FirmNormalizedProfile } from '@/types/database';
import { factText, profileLogo, profileSourceCount, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
import { FirmResearchTabs } from './FirmResearchTabs';
import styles from '@/app/product-lab/page.module.css';

export function FirmProfileExperience({ firm }: { firm: FirmNormalizedProfile }) {
  const evidenceLabel = 'Primary-source record';
  const offerUrl = profileWebsite(firm);

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>

      <section className={styles.profileHero}>
        <div className={styles.profileIdentity}>
          <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
          <div><span className={styles.kicker}><span /> Research profile</span><h1>{firm.name}</h1><p>{factText(firm.identity.tagline)}</p></div>
        </div>
        <div className={styles.profileActions}>
          {offerUrl && <a href={offerUrl} target="_blank" rel="noreferrer">Official site <ExternalLink /></a>}
          <Link className={styles.compactCompareAction} href={`/compare?ids=${firm.id}`}>+ Compare</Link>
        </div>
      </section>

      <section className={styles.profileLayout}>
        <main className={styles.profilePrimary}><FirmResearchTabs firm={firm} offerUrl={offerUrl} /></main>
        <aside className={styles.profileAside}>
          <section className={styles.evidenceCard}>
            <div><FileCheck2 /><span>Evidence status</span></div>
            <strong>{evidenceLabel}</strong>
            <p>Claims are manually extracted from official sources. ND means the value was not documented; resolved source differences remain visible with both URLs.</p>
            <dl><div><dt>Last reviewed</dt><dd>{shortDate(firm.checkedAt)}</dd></div><div><dt>Sources attached</dt><dd>{profileSourceCount(firm)}</dd></div><div><dt>Method</dt><dd>Primary sources only</dd></div></dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
          <section className={styles.noPromoCard}><span>Unknown values</span><strong>{firm.ndFields.length} ND fields</strong><p>Unknown values are displayed explicitly and are never replaced with zero, false or demo data.</p></section>
        </aside>
      </section>
    </div>
  );
}
