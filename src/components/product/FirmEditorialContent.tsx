import { ArrowUpRight, CircleAlert } from 'lucide-react';
import type {
  FirmContentBlock,
  FirmContentFact,
  FirmContentRecord,
  FirmNormalizedProfile,
  FirmNormalizedProfileV2,
  FirmProfileSection,
} from '@/types/database';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { ProprSectionNav, type EditorialNavItem } from './ProprSectionNav';
import styles from './FirmEditorialContent.module.css';

function visibleFact(fact: FirmContentFact): boolean {
  const value = fact.value.trim().toLowerCase();
  return fact.status !== 'ND' && value !== 'nd' && value !== 'not documented' && value !== 'not stated';
}

function cleanFacts(facts: FirmContentFact[] | undefined): FirmContentFact[] {
  return (facts ?? []).filter(visibleFact);
}

function splitCopy(paragraphs: string[]): { paragraphs: string[]; bullets: string[] } {
  const copy: string[] = [];
  const bullets: string[] = [];

  for (const paragraph of paragraphs) {
    const segments = paragraph
      .split(/\n+/)
      .flatMap((line) => line.split(/\s+•\s+/))
      .map((line) => line.replace(/^•\s*/, '').trim())
      .filter(Boolean);

    for (const segment of segments) {
      if (/^[\w /&()-]{2,42}:\s+/.test(segment) || paragraph.includes('•')) bullets.push(segment);
      else copy.push(segment);
    }
  }

  return { paragraphs: copy, bullets };
}

function NarrativeBlock({ block, featured, selected }: { block: Extract<FirmContentBlock, { type: 'text' }>; featured: boolean; selected: boolean }) {
  const content = splitCopy(block.paragraphs);
  if (!content.paragraphs.length && !content.bullets.length) return null;

  return (
    <article className={styles.narrative} data-featured={featured} data-cms-block-id={block.id} data-selected={selected}>
      <span>{block.eyebrow ?? (featured ? 'Research brief' : 'Documented detail')}</span>
      {block.title && <h3>{block.title}</h3>}
      {content.paragraphs.map((paragraph, index) => <p key={`${block.id}-p-${index}`}>{paragraph}</p>)}
      {!!content.bullets.length && <ul>{content.bullets.map((item, index) => <li key={`${block.id}-b-${index}`}>{item}</li>)}</ul>}
      {block.meta && <small>{block.meta}</small>}
    </article>
  );
}

function FactGrid({ block, selected }: { block: Extract<FirmContentBlock, { type: 'fact-grid' }>; selected: boolean }) {
  const facts = cleanFacts(block.items);
  if (!facts.length) return null;
  return (
    <dl className={styles.factGrid} data-columns={Math.min(block.columns ?? 3, facts.length)} data-cms-block-id={block.id} data-selected={selected}>
      {facts.map((fact) => (
        <div key={fact.id}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
          {fact.note && <small>{fact.note}</small>}
        </div>
      ))}
    </dl>
  );
}

function RecordCard({ record }: { record: FirmContentRecord }) {
  const facts = cleanFacts(record.facts);
  return (
    <article className={styles.recordCard}>
      {record.eyebrow && <span>{record.eyebrow}</span>}
      <h3>{record.title}</h3>
      {record.description && <p>{record.description}</p>}
      {!!facts.length && <dl>{facts.map((fact) => <div key={fact.id}><dt>{fact.label}</dt><dd>{fact.value}</dd>{fact.note && <small>{fact.note}</small>}</div>)}</dl>}
      {!!record.meta?.length && <ul>{record.meta.map((item, index) => <li key={`${record.id}-meta-${index}`}>{item}</li>)}</ul>}
      {!!record.links?.length && <div className={styles.recordLinks}>{record.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={`${record.id}-${link.url}`}>{link.label} <ArrowUpRight /></a>)}</div>}
    </article>
  );
}

function RecordList({ block, selected }: { block: Extract<FirmContentBlock, { type: 'record-list' }>; selected: boolean }) {
  if (!block.items.length) return null;
  return <div className={styles.recordGrid} data-cms-block-id={block.id} data-selected={selected}>{block.items.map((record) => <RecordCard key={record.id} record={record} />)}</div>;
}

function DataTable({ block, selected }: { block: Extract<FirmContentBlock, { type: 'table' }>; selected: boolean }) {
  if (!block.rows.length) return null;
  return (
    <div className={styles.tableBlock} data-cms-block-id={block.id} data-selected={selected}>
      {(block.title || block.description) && <div><h3>{block.title}</h3>{block.description && <p>{block.description}</p>}</div>}
      <div className={styles.tableScroller}>
        <table>
          <thead><tr>{block.columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
          <tbody>{block.rows.map((row) => <tr key={row.id}>{block.columns.map((column) => <td key={`${row.id}-${column.key}`}>{row.cells[column.key] === 'ND' ? '—' : row.cells[column.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function EditorialBlock({ block, featured, selected }: { block: FirmContentBlock; featured: boolean; selected: boolean }) {
  if (block.type === 'text') return <NarrativeBlock block={block} featured={featured} selected={selected} />;
  if (block.type === 'fact-grid') return <FactGrid block={block} selected={selected} />;
  if (block.type === 'record-list') return <RecordList block={block} selected={selected} />;
  if (block.type === 'table') return <DataTable block={block} selected={selected} />;
  return <aside className={styles.notice} data-tone={block.tone} data-cms-block-id={block.id} data-selected={selected}><CircleAlert /><p>{block.text}</p></aside>;
}

function EditorialSection({ section, index, selectedBlockId }: { section: FirmProfileSection; index: number; selectedBlockId?: string | null }) {
  const firstTextId = section.blocks.find((block) => block.type === 'text')?.id;
  return (
    <section className={styles.section} id={`research-${section.id}`} data-cms-section-id={section.id}>
      <header className={styles.sectionHeading}>
        <span>{String(index + 1).padStart(2, '0')} · {section.tabLabel}</span>
        <h2>{section.title}</h2>
        {section.description && <p>{section.description}</p>}
      </header>
      <div className={styles.blocks}>
        {section.blocks.map((block) => <EditorialBlock block={block} featured={block.id === firstTextId} selected={block.id === selectedBlockId} key={block.id} />)}
      </div>
    </section>
  );
}

export function FirmEditorialContent({
  firm,
  profileOverride,
  editMode = false,
  selectedBlockId,
}: {
  firm: FirmNormalizedProfile;
  profileOverride?: FirmNormalizedProfileV2;
  editMode?: boolean;
  selectedBlockId?: string | null;
}) {
  const profile = profileOverride ?? getFirmModularProfile(firm);
  const navItems: EditorialNavItem[] = profile.sections.map((section) => ({
    id: `research-${section.id}`,
    label: section.tabLabel,
  }));

  return (
    <div className={styles.editorial} data-editing={editMode}>
      <ProprSectionNav items={navItems} firmName={firm.name} promoCode="" />
      {profile.sections.map((section, index) => <EditorialSection section={section} index={index} selectedBlockId={selectedBlockId} key={section.id} />)}
    </div>
  );
}
