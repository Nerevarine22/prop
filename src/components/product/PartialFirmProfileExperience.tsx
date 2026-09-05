import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CircleAlert, ExternalLink, FileCheck2 } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { FirmDatabaseRecord, PrimaryResearch, PrimaryResearchField, PrimaryResearchStatus } from '@/types/database';
import { shortDate } from './experience';
import styles from '@/app/product-lab/page.module.css';

const fieldLabels: Record<PrimaryResearchField, string> = {
  officialWebsite: 'Official website',
  rulebook: 'Rules and challenge model',
  faq: 'FAQ and product documentation',
  pricingCheckout: 'Pricing and checkout',
  terms: 'Terms and legal pages',
  payoutPolicy: 'Payout policy',
  tokenRewards: 'Token and rewards',
};

const statusLabels: Record<PrimaryResearchStatus, string> = {
  verified: 'Verified source',
  reported: 'Reported by firm',
  conflict: 'Source conflict',
  ND: 'Not documented',
};

type PartialRecord = FirmDatabaseRecord & { primaryResearch: PrimaryResearch };

export function PartialFirmProfileExperience({ record }: { record: PartialRecord }) {
  const observations = record.primaryResearch.observations;
  const ruleSummary = observations.find((observation) => observation.field === 'rulebook' && observation.status !== 'ND')?.value;
  const officialWebsite = observations.find((observation) => observation.field === 'officialWebsite' && observation.status !== 'ND')?.value || record.links.officialWebsite;
  const conflictCount = observations.filter((observation) => observation.status === 'conflict').length;
  const documentedCount = observations.filter((observation) => observation.status !== 'ND').length;
  const sourceCount = new Set(observations.map((observation) => observation.sourceUrl)).size;

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{record.name}</span></div>

      <section className={styles.profileHero}>
        <div className={styles.profileIdentity}>
          <FirmLogo src={record.brandAssets?.logoPath} name={record.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
          <div><span className={styles.kicker}><span /> Research notes</span><h1>{record.name}</h1><p>{ruleSummary || 'Primary-source research is in progress. Structured comparison data is not available yet.'}</p></div>
        </div>
        <div className={styles.profileActions}>
          {officialWebsite && <a href={officialWebsite} target="_blank" rel="noreferrer">Official site <ExternalLink /></a>}
        </div>
      </section>

      <section className={styles.profileLayout}>
        <main className={styles.profilePrimary}>
          <div className={styles.researchWorkspace}>
            <section className={styles.profileSection}>
              <div className={styles.profileSectionTitle}><div><span>01</span><h2>Primary research notes</h2></div><p>What the official sources currently document, without filling missing fields with estimates.</p></div>
              {conflictCount > 0 && <p className={styles.policyNote}><CircleAlert /> {conflictCount} source conflict{conflictCount === 1 ? ' is' : 's are'} preserved for manual review.</p>}
              <div className={styles.sourceList}>
                {observations.map((observation) => (
                  <article key={observation.id}>
                    <div>
                      <span>{statusLabels[observation.status]}</span>
                      <h3>{fieldLabels[observation.field]}</h3>
                      <p>{observation.value === 'ND' ? 'No usable value was found in the inspected official sources.' : observation.value}</p>
                      {observation.notes && <p>{observation.notes}</p>}
                    </div>
                    <div>
                      <time>{shortDate(observation.checkedAt)}</time>
                      <a href={observation.sourceUrl} target="_blank" rel="noopener noreferrer">Open source <ArrowUpRight /></a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>

        <aside className={styles.profileAside}>
          <section className={styles.evidenceCard}>
            <div><FileCheck2 /><span>Research coverage</span></div>
            <strong>{documentedCount}/{observations.length} documented</strong>
            <p>This is a source-backed research record that is not yet ready for full comparison. Missing values stay visibly unavailable.</p>
            <dl>
              <div><dt>Checked</dt><dd>{shortDate(record.primaryResearch.checkedAt)}</dd></div>
              <div><dt>Sources</dt><dd>{sourceCount}</dd></div>
              <div><dt>Conflicts</dt><dd>{conflictCount}</dd></div>
              <div><dt>Comparison</dt><dd>Pending</dd></div>
            </dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
