'use client';

import { useState } from 'react';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import type {
  FirmContentBlock,
  FirmContentFact,
  FirmNormalizedProfile,
  FirmNormalizedProfileV2,
  NormalizedEvidence,
} from '@/types/database';
import styles from '@/app/product-lab/page.module.css';

function isSafeExternalUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function EvidenceLinks({ evidence, id }: { evidence: NormalizedEvidence[] | undefined; id: string }) {
  const safeEvidence = evidence?.filter((item) => isSafeExternalUrl(item.sourceUrl)) ?? [];
  if (!safeEvidence.length) return null;
  return (
    <span className={styles.evidenceLinks}>
      {safeEvidence.map((item, index) => (
        <a key={`${id}-${item.sourceUrl}`} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          {safeEvidence.length === 1 ? 'Source' : `Source ${index + 1}`} <ArrowUpRight />
        </a>
      ))}
    </span>
  );
}

function FactStatus({ status }: { status: FirmContentFact['status'] }) {
  if (!status || status === 'reported' || status === 'verified' || status === 'N/A') return null;
  return <em className={styles.factStatus} data-status={status}>{status}</em>;
}

function FactGrid({ block, showEvidence }: { block: Extract<FirmContentBlock, { type: 'fact-grid' }>; showEvidence: boolean }) {
  if (block.presentation === 'steps') {
    return (
      <ol className={styles.modelSteps}>
        {block.items.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
            <div>
              <strong>{item.value}</strong>
              {item.note && <p>{item.note}</p>}
            </div>
            <FactStatus status={item.status} />
          </li>
        ))}
      </ol>
    );
  }

  const columnsClass = styles[`dynamicColumns${block.columns ?? 3}`] ?? '';
  const presentationClass = block.presentation === 'details' ? styles.modelDetails : '';
  return (
    <div className={`${styles.profileFacts} ${columnsClass} ${presentationClass}`}>
      {block.items.map((item) => (
        <article key={item.id}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          {item.note && <p>{item.note}</p>}
          <FactStatus status={item.status} />
          {showEvidence && <EvidenceLinks evidence={item.evidence} id={item.id} />}
        </article>
      ))}
    </div>
  );
}

function RecordFacts({ facts, showEvidence }: { facts: FirmContentFact[] | undefined; showEvidence: boolean }) {
  if (!facts?.length) return null;
  return <dl>{facts.map((fact) => <div key={fact.id}><dt>{fact.label}</dt><dd><span>{fact.value}</span>{fact.note && <small>{fact.note}</small>}<FactStatus status={fact.status} />{showEvidence && <EvidenceLinks evidence={fact.evidence} id={fact.id} />}</dd></div>)}</dl>;
}

function RecordList({ block, showEvidence }: { block: Extract<FirmContentBlock, { type: 'record-list' }>; showEvidence: boolean }) {
  const presentationClass = block.presentation === 'tracks'
    ? styles.trackList
    : block.presentation === 'sources'
      ? styles.sourceDirectory
      : '';
  return (
    <div className={`${styles.sourceList} ${presentationClass}`}>
      {block.items.map((item) => {
        const safeLinks = showEvidence ? item.links?.filter((link) => isSafeExternalUrl(link.url)) ?? [] : [];
        const visibleMeta = block.presentation === 'tracks' ? [] : item.meta ?? [];
        const hasMeta = Boolean(visibleMeta.length || safeLinks.length);

        return (
          <article key={item.id}>
            <div className={styles.recordHeader}>
              <div className={styles.recordIntro}>
                {item.eyebrow && <span>{item.eyebrow}</span>}
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
              {hasMeta && (
                <div className={styles.recordMeta}>
                  {visibleMeta.map((value) => <time key={value}>{value.slice(0, 10)}</time>)}
                  {safeLinks.map((link) => <a key={`${item.id}-${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight /></a>)}
                </div>
              )}
            </div>
            <RecordFacts facts={item.facts} showEvidence={showEvidence} />
          </article>
        );
      })}
    </div>
  );
}

function ContentBlock({ block, showEvidence }: { block: FirmContentBlock; showEvidence: boolean }) {
  if (block.type === 'text') {
    return (
      <article className={styles.aboutFirm}>
        <div>{block.eyebrow && <span>{block.eyebrow}</span>}{block.title && <h3>{block.title}</h3>}</div>
        <div>{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{block.meta && <small>{block.meta}</small>}{showEvidence && <EvidenceLinks evidence={block.evidence} id={block.id} />}</div>
      </article>
    );
  }
  if (block.type === 'fact-grid') return <FactGrid block={block} showEvidence={showEvidence} />;
  if (block.type === 'record-list') return <RecordList block={block} showEvidence={showEvidence} />;
  if (block.type === 'notice') return <p className={`${styles.policyNote} ${styles[`dynamicNotice${block.tone[0].toUpperCase()}${block.tone.slice(1)}`] ?? ''}`}><CircleAlert /> {block.text}{showEvidence && <EvidenceLinks evidence={block.evidence} id={block.id} />}</p>;
  return (
    <div className={styles.dynamicTable}>
      {(block.title || block.description) && <div><h3>{block.title}</h3>{block.description && <p>{block.description}</p>}</div>}
      <div className={styles.dynamicTableScroller}>
        <table>
          <thead><tr>{block.columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
          <tbody>{block.rows.map((row) => <tr key={row.id}>{block.columns.map((column) => <td key={`${row.id}-${column.key}`}>{row.cells[column.key] ?? 'ND'}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function ModularFirmResearchTabs({
  firm,
  profile,
}: {
  firm: FirmNormalizedProfile;
  profile: FirmNormalizedProfileV2;
  offerUrl?: string;
}) {
  const [activeSectionId, setActiveSectionId] = useState(profile.sections[0]?.id ?? 'overview');
  const activeSection = profile.sections.find((section) => section.id === activeSectionId) ?? profile.sections[0];

  if (!activeSection) return null;

  return (
    <div className={styles.researchWorkspace}>
      <div className={styles.researchTabs} role="tablist" aria-label={`${firm.name} research sections`}>
        {profile.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection.id === section.id}
            aria-controls={`research-${section.id}`}
            className={activeSection.id === section.id ? styles.researchTabActive : undefined}
            onClick={() => setActiveSectionId(section.id)}
          >
            {section.tabLabel}
          </button>
        ))}
      </div>

      <div className={styles.researchPanel} id={`research-${activeSection.id}`} role="tabpanel">
        <section className={styles.profileSection}>
          <div className={styles.profileSectionTitle}>
            <div><span>{String(profile.sections.indexOf(activeSection) + 1).padStart(2, '0')}</span><h2>{activeSection.title}</h2></div>
            {activeSection.description && <p>{activeSection.description}</p>}
          </div>
          <div className={styles.dynamicSectionBlocks}>
            {activeSection.blocks.map((block) => <ContentBlock key={block.id} block={block} showEvidence={activeSection.id === 'sources'} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
