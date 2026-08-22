import Link from 'next/link';
import { ArrowRight, ExternalLink, FileCheck2 } from 'lucide-react';
import { FirmLogo } from '@/components/firms/FirmLogo';
import type { FirmContentFact, FirmNormalizedProfile } from '@/types/database';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factText, profileLogo, profileSourceCount, profileWebsite, shortDate } from '@/lib/data/publicFirmProfiles';
import { FirmResearchTabs } from './FirmResearchTabs';
import styles from '@/app/product-lab/page.module.css';

export function FirmProfileExperience({ firm }: { firm: FirmNormalizedProfile }) {
  const modularProfile = getFirmModularProfile(firm);
  const isModelFirst = modularProfile.researchStandard === 'model-first-v1';
  const isManualResearch = modularProfile.researchMode === 'manual';
  const evidenceLabel = isManualResearch ? 'Manual research record' : isModelFirst ? 'Model-first primary-source record' : 'Primary-source record';
  const offerUrl = profileWebsite(firm);
  const facts = new Map<string, FirmContentFact>();
  for (const section of modularProfile.sections) {
    for (const block of section.blocks) {
      if (block.type === 'fact-grid') block.items.forEach((item) => facts.set(item.id, item));
      if (block.type === 'record-list') block.items.flatMap((item) => item.facts ?? []).forEach((item) => facts.set(item.id, item));
    }
  }
  const modelFirstNdCount = [...facts.values()].filter((fact) => fact.status === 'ND').length;
  const displayedNdCount = isModelFirst ? modelFirstNdCount : firm.ndFields.length;
  const sourceCount = modularProfile.sourcesInspected
    ? new Set(modularProfile.sourcesInspected.map((source) => source.url)).size
    : profileSourceCount(firm);
  const checkedAt = isModelFirst ? modularProfile.checkedAt : firm.checkedAt;
  const heroDescription = modularProfile.operatingModel?.classification.value ?? factText(firm.identity.tagline);
  const evidenceDescription = isManualResearch
    ? 'This profile was structured from a human-authored research file. Only recorded facts are published; remaining gaps stay outside the profile until the next research pass.'
    : isModelFirst
      ? 'The profile follows this project’s own operating model. Every claim is linked to primary evidence, and differing official sources remain visible.'
    : 'Claims are manually extracted from official sources. ND means the value was not documented; resolved source differences remain visible with both URLs.';

  return (
    <div className={styles.productPage}>
      <div className={styles.breadcrumbs}><Link href="/prop-firms">Firms</Link><span>/</span><span>{firm.name}</span></div>

      <section className={styles.profileHero}>
        <div className={styles.profileIdentity}>
          <FirmLogo src={profileLogo(firm)} name={firm.name} imageClassName={styles.profileLogo} fallbackClassName={styles.profileFallback} />
          <div><span className={styles.kicker}><span /> Research profile</span><h1>{firm.name}</h1><p>{heroDescription}</p></div>
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
            <p>{evidenceDescription}</p>
            <dl><div><dt>Last reviewed</dt><dd>{shortDate(checkedAt)}</dd></div><div><dt>Sources attached</dt><dd>{sourceCount}</dd></div><div><dt>Method</dt><dd>{isManualResearch ? 'Manual research · structured import' : isModelFirst ? 'Model first · primary only' : 'Primary sources only'}</dd></div></dl>
            <Link href="/methodology">How verification works <ArrowRight /></Link>
          </section>
          {isModelFirst
            ? <section className={styles.noPromoCard}><span>Profile coverage</span><strong>{facts.size} model-specific facts</strong><p>{displayedNdCount ? `${displayedNdCount} genuinely unknown ${displayedNdCount === 1 ? 'value remains' : 'values remain'} visible.` : 'No legacy template fields or artificial unknown values are added.'}</p></section>
            : <section className={styles.noPromoCard}><span>Unknown values</span><strong>{displayedNdCount} ND {displayedNdCount === 1 ? 'field' : 'fields'}</strong><p>Unknown values are displayed explicitly and are never replaced with zero, false or demo data.</p></section>}
        </aside>
      </section>
    </div>
  );
}
