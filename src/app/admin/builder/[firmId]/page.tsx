'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowDown, ArrowLeft, ArrowUp, Check, Copy, Monitor,
  Eye, FileText, Grid2X2, List, Moon, Plus, Save, Smartphone, Sun,
  Table2, Trash2, TriangleAlert, UploadCloud, X,
} from 'lucide-react';
import { FirmEditorialContent } from '@/components/product/FirmEditorialContent';
import { FirmEditorialHero } from '@/components/product/ProprEditorialHero';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import {
  getFirmRegistry, publishFirmRegistryProfile, saveFirmRegistryDraft,
} from '@/lib/services/firmRegistryService';
import type {
  FirmContentBlock, FirmContentFact, FirmContentRecord, FirmDatabaseRecord,
  FirmModelType, FirmNormalizedProfile, FirmNormalizedProfileV2, FirmProfileSection,
} from '@/types/database';
import productStyles from '@/app/product-lab/page.module.css';

type BlockType = FirmContentBlock['type'];
type PreviewTheme = 'light' | 'dark';
type PreviewWidth = 'desktop' | 'mobile';

const fieldClass = 'w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-zinc-600';
const labelClass = 'space-y-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500';

function id(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function starterProfile(record: FirmDatabaseRecord): FirmNormalizedProfileV2 {
  return {
    version: 2,
    methodology: 'primary-sources-only',
    researchStandard: 'model-first-v1',
    researchMode: 'manual',
    id: record.id,
    slug: record.slug,
    name: record.name,
    checkedAt: new Date().toISOString(),
    modelTypes: ['other'],
    offerNames: [],
    sections: [{
      id: 'overview',
      tabLabel: 'Overview',
      title: 'Firm overview',
      description: 'Model-specific research profile.',
      blocks: [{ id: 'introduction', type: 'text', title: `About ${record.name}`, paragraphs: ['Add the reviewed project description here.'] }],
    }],
    comparison: {
      modelTypes: ['other'],
      capital: { status: 'ND', unit: 'USD' },
      entryCost: { status: 'ND', unit: 'USD' },
      profitSplit: { status: 'ND', unit: 'percent' },
      maxDrawdown: { status: 'ND', unit: 'percent' },
      payoutSchedules: { status: 'ND', values: [] },
      executionModels: { status: 'ND', values: [] },
    },
    sourceDiscrepancies: [],
  };
}

function createBlock(type: BlockType): FirmContentBlock {
  if (type === 'text') return { id: id('text'), type, eyebrow: 'Research note', title: 'New text section', paragraphs: ['Add the reviewed explanation here.'] };
  if (type === 'fact-grid') return { id: id('facts'), type, columns: 3, presentation: 'metrics', items: [{ id: id('fact'), label: 'Metric', value: 'Value', status: 'reported' }] };
  if (type === 'record-list') return { id: id('records'), type, presentation: 'records', items: [{ id: id('record'), eyebrow: 'Record', title: 'New record', description: 'Add a concise explanation.', facts: [] }] };
  if (type === 'table') return { id: id('table'), type, title: 'New table', description: 'Structured research data.', columns: [{ key: 'field', label: 'Field' }, { key: 'value', label: 'Value' }], rows: [{ id: id('row'), cells: { field: 'Example', value: 'Value' } }] };
  return { id: id('notice'), type: 'notice', tone: 'neutral', text: 'Add an important research note.' };
}

function move<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function factsToText(facts: FirmContentFact[] | undefined): string {
  return (facts ?? []).map((fact) => [fact.label, fact.value, fact.status ?? 'reported', fact.note ?? ''].join(' | ')).join('\n');
}

function factsFromText(value: string, previous: FirmContentFact[] = []): FirmContentFact[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean).map((line, index) => {
    const [label = '', factValue = '', status = 'reported', note = ''] = line.split('|').map((part) => part.trim());
    return { id: previous[index]?.id ?? id('fact'), label, value: factValue, status: status as FirmContentFact['status'], ...(note ? { note } : {}) };
  });
}

function BlockEditor({ block, onChange }: { block: FirmContentBlock; onChange: (block: FirmContentBlock) => void }) {
  if (block.type === 'text') {
    return <div className="space-y-4"><label className={labelClass}>Eyebrow<input className={fieldClass} value={block.eyebrow ?? ''} onChange={(event) => onChange({ ...block, eyebrow: event.target.value })} /></label><label className={labelClass}>Title<input className={fieldClass} value={block.title ?? ''} onChange={(event) => onChange({ ...block, title: event.target.value })} /></label><label className={labelClass}>Paragraphs<textarea className={`${fieldClass} min-h-52 resize-y leading-5`} value={block.paragraphs.join('\n\n')} onChange={(event) => onChange({ ...block, paragraphs: event.target.value.split(/\n\s*\n/) })} /><small className="normal-case tracking-normal text-zinc-600">Separate paragraphs with an empty line. Bullet characters are rendered as structured lists.</small></label><label className={labelClass}>Meta note<input className={fieldClass} value={block.meta ?? ''} onChange={(event) => onChange({ ...block, meta: event.target.value })} /></label></div>;
  }
  if (block.type === 'notice') {
    return <div className="space-y-4"><label className={labelClass}>Tone<select className={fieldClass} value={block.tone} onChange={(event) => onChange({ ...block, tone: event.target.value as typeof block.tone })}><option value="neutral">Neutral</option><option value="positive">Positive</option><option value="warning">Warning</option></select></label><label className={labelClass}>Message<textarea className={`${fieldClass} min-h-36 resize-y leading-5`} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} /></label></div>;
  }
  if (block.type === 'fact-grid') {
    return <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><label className={labelClass}>Columns<select className={fieldClass} value={block.columns ?? 3} onChange={(event) => onChange({ ...block, columns: Number(event.target.value) as 2 | 3 | 4 })}><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label><label className={labelClass}>Presentation<select className={fieldClass} value={block.presentation ?? 'metrics'} onChange={(event) => onChange({ ...block, presentation: event.target.value as 'metrics' | 'details' | 'steps' })}><option value="metrics">Metrics</option><option value="details">Details</option><option value="steps">Steps</option></select></label></div><label className={labelClass}>Facts<textarea className={`${fieldClass} min-h-64 resize-y font-mono text-[10px] leading-5`} value={factsToText(block.items)} onChange={(event) => onChange({ ...block, items: factsFromText(event.target.value, block.items) })} /><small className="normal-case tracking-normal text-zinc-600">One fact per line: Label | Value | status | optional note</small></label></div>;
  }
  if (block.type === 'record-list') {
    const updateRecord = (index: number, next: FirmContentRecord) => onChange({ ...block, items: block.items.map((item, itemIndex) => itemIndex === index ? next : item) });
    return <div className="space-y-4"><label className={labelClass}>Presentation<select className={fieldClass} value={block.presentation ?? 'records'} onChange={(event) => onChange({ ...block, presentation: event.target.value as 'records' | 'tracks' | 'sources' })}><option value="records">Records</option><option value="tracks">Tracks</option><option value="sources">Sources</option></select></label>{block.items.map((record, index) => <article key={record.id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"><div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Record {index + 1}</span><button type="button" onClick={() => onChange({ ...block, items: block.items.filter((_, itemIndex) => itemIndex !== index) })} className="text-zinc-600 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div><input className={fieldClass} placeholder="Eyebrow" value={record.eyebrow ?? ''} onChange={(event) => updateRecord(index, { ...record, eyebrow: event.target.value })} /><input className={fieldClass} placeholder="Title" value={record.title} onChange={(event) => updateRecord(index, { ...record, title: event.target.value })} /><textarea className={`${fieldClass} min-h-20 resize-y`} placeholder="Description" value={record.description ?? ''} onChange={(event) => updateRecord(index, { ...record, description: event.target.value })} /><textarea className={`${fieldClass} min-h-28 resize-y font-mono text-[10px] leading-5`} placeholder="Label | Value | status | note" value={factsToText(record.facts)} onChange={(event) => updateRecord(index, { ...record, facts: factsFromText(event.target.value, record.facts) })} /></article>)}<button type="button" onClick={() => onChange({ ...block, items: [...block.items, { id: id('record'), eyebrow: 'Record', title: 'New record', description: '', facts: [] }] })} className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-400"><Plus className="h-3 w-3" /> Add record</button></div>;
  }

  const columnLabels = block.columns.map((column) => column.label).join(' | ');
  const rows = block.rows.map((row) => block.columns.map((column) => row.cells[column.key] ?? '').join(' | ')).join('\n');
  return <div className="space-y-4"><label className={labelClass}>Title<input className={fieldClass} value={block.title ?? ''} onChange={(event) => onChange({ ...block, title: event.target.value })} /></label><label className={labelClass}>Description<textarea className={`${fieldClass} min-h-20 resize-y`} value={block.description ?? ''} onChange={(event) => onChange({ ...block, description: event.target.value })} /></label><label className={labelClass}>Columns<input className={`${fieldClass} font-mono text-[10px]`} value={columnLabels} onChange={(event) => { const labels = event.target.value.split('|').map((item) => item.trim()).filter(Boolean); const columns = labels.map((label, index) => ({ key: block.columns[index]?.key ?? `column-${index + 1}`, label })); onChange({ ...block, columns }); }} /><small className="normal-case tracking-normal text-zinc-600">Separate labels with |</small></label><label className={labelClass}>Rows<textarea className={`${fieldClass} min-h-48 resize-y font-mono text-[10px] leading-5`} value={rows} onChange={(event) => { const nextRows = event.target.value.split('\n').filter(Boolean).map((line, rowIndex) => ({ id: block.rows[rowIndex]?.id ?? id('row'), cells: Object.fromEntries(block.columns.map((column, columnIndex) => [column.key, line.split('|')[columnIndex]?.trim() ?? ''])) })); onChange({ ...block, rows: nextRows }); }} /><small className="normal-case tracking-normal text-zinc-600">One row per line; separate cells with |</small></label></div>;
}

const modelOptions: Array<{ value: FirmModelType; label: string }> = [
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'instant-funding', label: 'Instant funding' },
  { value: 'collateralized', label: 'Collateralized' },
  { value: 'competition', label: 'Competition' },
  { value: 'progression', label: 'Progression' },
  { value: 'other', label: 'Other' },
];

function numberValue(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function HeroEditor({ profile, onChange }: { profile: FirmNormalizedProfileV2; onChange: (profile: FirmNormalizedProfileV2) => void }) {
  const summary = profile.operatingModel?.summary.value ?? '';
  const accountEnvironment = profile.operatingModel?.accountEnvironment?.value ?? '';

  function updateOperatingModel(field: 'summary' | 'accountEnvironment', value: string) {
    const base = profile.operatingModel ?? {
      classification: { id: id('model'), label: 'Operating model', value: profile.modelTypes.join(' · '), status: 'reported' as const },
      summary: { id: id('summary'), label: 'How the model works', value: '', status: 'reported' as const },
      lifecycle: [],
    };
    onChange({
      ...profile,
      operatingModel: {
        ...base,
        [field]: {
          ...(field === 'summary'
            ? base.summary
            : base.accountEnvironment ?? { id: id('environment'), label: 'Account environment', status: 'reported' as const }),
          value,
        },
      },
    });
  }

  function toggleModel(model: FirmModelType) {
    const exists = profile.modelTypes.includes(model);
    const modelTypes = exists ? profile.modelTypes.filter((item) => item !== model) : [...profile.modelTypes, model];
    if (!modelTypes.length) return;
    onChange({ ...profile, modelTypes, comparison: { ...profile.comparison, modelTypes } });
  }

  function updateRange(key: 'entryCost' | 'capital' | 'profitSplit', field: 'min' | 'max', value: string) {
    const nextValue = numberValue(value);
    const current = profile.comparison[key];
    const next = { ...current, [field]: nextValue };
    const hasRange = next.min !== undefined || next.max !== undefined;
    onChange({ ...profile, comparison: { ...profile.comparison, [key]: { ...next, status: hasRange ? (next.max !== undefined && next.min !== next.max ? 'varies' : 'known') : 'ND' } } });
  }

  function updateList(key: 'payoutSchedules' | 'executionModels', value: string) {
    const values = value.split('\n').map((item) => item.trim()).filter(Boolean);
    onChange({ ...profile, comparison: { ...profile.comparison, [key]: { ...profile.comparison[key], values, status: values.length ? (values.length > 1 ? 'varies' : 'known') : 'ND' } } });
  }

  return <div className="space-y-5">
    <label className={labelClass}>Hero summary<textarea className={`${fieldClass} min-h-40 resize-y leading-5`} value={summary} onChange={(event) => updateOperatingModel('summary', event.target.value)} /></label>
    <label className={labelClass}>Account environment<input className={fieldClass} value={accountEnvironment} onChange={(event) => updateOperatingModel('accountEnvironment', event.target.value)} /></label>
    <fieldset className="space-y-2"><legend className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Operating models</legend><div className="grid grid-cols-2 gap-2">{modelOptions.map((option) => <label key={option.value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[10px] ${profile.modelTypes.includes(option.value) ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-zinc-800 text-zinc-500'}`}><input type="checkbox" className="accent-sky-400" checked={profile.modelTypes.includes(option.value)} onChange={() => toggleModel(option.value)} />{option.label}</label>)}</div></fieldset>
    <label className={labelClass}>Offer names<textarea className={`${fieldClass} min-h-24 resize-y`} value={profile.offerNames.join('\n')} onChange={(event) => onChange({ ...profile, offerNames: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} /><small className="normal-case tracking-normal text-zinc-600">One offer per line.</small></label>
    <div className="border-t border-zinc-800 pt-5"><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Quick facts</span><div className="mt-3 space-y-4">
      {([['entryCost', 'Entry cost'], ['capital', 'Capital'], ['profitSplit', 'Profit split']] as const).map(([key, label]) => <div key={key}><span className="text-[10px] font-bold text-zinc-300">{label}</span><div className="mt-2 grid grid-cols-2 gap-2"><input className={fieldClass} inputMode="decimal" placeholder="Minimum" value={profile.comparison[key].min ?? ''} onChange={(event) => updateRange(key, 'min', event.target.value)} /><input className={fieldClass} inputMode="decimal" placeholder="Maximum" value={profile.comparison[key].max ?? ''} onChange={(event) => updateRange(key, 'max', event.target.value)} /></div></div>)}
      <label className={labelClass}>Payout schedules<textarea className={`${fieldClass} min-h-20 resize-y`} value={profile.comparison.payoutSchedules.values.join('\n')} onChange={(event) => updateList('payoutSchedules', event.target.value)} /></label>
      <label className={labelClass}>Execution models<textarea className={`${fieldClass} min-h-20 resize-y`} value={profile.comparison.executionModels.values.join('\n')} onChange={(event) => updateList('executionModels', event.target.value)} /></label>
    </div></div>
  </div>;
}

function blockLabel(block: FirmContentBlock): string {
  if (block.type === 'text') return block.title || 'Text block';
  if (block.type === 'fact-grid') return `${block.items.length} facts`;
  if (block.type === 'record-list') return `${block.items.length} records`;
  if (block.type === 'table') return block.title || 'Table';
  return block.text.slice(0, 42) || 'Notice';
}

const blockLibrary: Array<{ type: BlockType; label: string; icon: typeof FileText }> = [
  { type: 'text', label: 'Text', icon: FileText },
  { type: 'fact-grid', label: 'Facts', icon: Grid2X2 },
  { type: 'record-list', label: 'Records', icon: List },
  { type: 'table', label: 'Table', icon: Table2 },
  { type: 'notice', label: 'Notice', icon: TriangleAlert },
];

export default function FirmPageBuilder() {
  const params = useParams<{ firmId: string }>();
  const [record, setRecord] = useState<FirmDatabaseRecord | null>(null);
  const [profile, setProfile] = useState<FirmNormalizedProfileV2 | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingHero, setEditingHero] = useState(true);
  const [theme, setTheme] = useState<PreviewTheme>('dark');
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>('desktop');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getFirmRegistry().then((records) => {
      const current = records.find((item) => item.id === params.firmId);
      if (!current) throw new Error('Firm registry record not found.');
      const source = current.draftProfileV2 ?? current.normalizedProfileV2 ?? (current.normalizedProfile ? getFirmModularProfile(current.normalizedProfile) : starterProfile(current));
      if (!cancelled) {
        const draft = clone(source);
        setRecord(current); setProfile(draft); setSavedSnapshot(JSON.stringify(draft));
        setActiveSectionId(draft.sections[0]?.id ?? '');
      }
    }).catch((error: unknown) => { if (!cancelled) setMessage(error instanceof Error ? error.message : 'Could not load builder.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params.firmId]);

  const activeSection = profile?.sections.find((section) => section.id === activeSectionId) ?? profile?.sections[0];
  const selectedBlock = activeSection?.blocks.find((block) => block.id === selectedBlockId) ?? null;
  const dirty = Boolean(profile && JSON.stringify(profile) !== savedSnapshot);
  const previewFirm = useMemo<FirmNormalizedProfile | null>(() => {
    if (!record?.normalizedProfile || !profile) return null;
    return { ...record.normalizedProfile, modularProfile: profile };
  }, [profile, record]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [dirty]);

  function updateSection(updater: (section: FirmProfileSection) => FirmProfileSection) {
    if (!profile || !activeSection) return;
    setProfile({ ...profile, sections: profile.sections.map((section) => section.id === activeSection.id ? updater(section) : section) });
  }

  function updateSelectedBlock(next: FirmContentBlock) {
    updateSection((section) => ({ ...section, blocks: section.blocks.map((block) => block.id === next.id ? next : block) }));
  }

  function addSection() {
    if (!profile) return;
    const section: FirmProfileSection = { id: id('section'), tabLabel: 'New section', title: 'New section', description: '', blocks: [] };
    setProfile({ ...profile, sections: [...profile.sections, section] });
    setActiveSectionId(section.id); setSelectedBlockId(null); setEditingHero(false);
  }

  function addBlock(type: BlockType) {
    const block = createBlock(type);
    updateSection((section) => ({ ...section, blocks: [...section.blocks, block] }));
    setSelectedBlockId(block.id); setEditingHero(false);
  }

  function selectSection(sectionId: string, scroll = true) {
    setActiveSectionId(sectionId);
    setSelectedBlockId(null);
    setEditingHero(false);
    if (scroll) window.setTimeout(() => previewRef.current?.querySelector<HTMLElement>(`[data-cms-section-id="${sectionId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  function selectHero() {
    setSelectedBlockId(null);
    setEditingHero(true);
    previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePreviewClick(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const hero = target.closest<HTMLElement>('[data-cms-hero]');
    const block = target.closest<HTMLElement>('[data-cms-block-id]');
    const section = target.closest<HTMLElement>('[data-cms-section-id]');
    if (!hero && !block && !section) {
      if (target.closest('a, button')) event.preventDefault();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (hero) {
      selectHero();
      return;
    }
    if (section?.dataset.cmsSectionId) setActiveSectionId(section.dataset.cmsSectionId);
    setSelectedBlockId(block?.dataset.cmsBlockId ?? null);
    setEditingHero(false);
  }

  async function saveDraft() {
    if (!record || !profile) return;
    setSaving(true); setMessage('');
    try {
      const next = { ...profile, name: record.name, slug: record.slug, checkedAt: new Date().toISOString() };
      const timestamp = await saveFirmRegistryDraft(record.id, next);
      setProfile(next); setSavedSnapshot(JSON.stringify(next)); setMessage(`Draft saved · ${new Date(timestamp).toLocaleTimeString()}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save draft.'); }
    finally { setSaving(false); }
  }

  async function publish() {
    if (!record || !profile || !window.confirm('Publish this draft to the public firm profile?')) return;
    setSaving(true); setMessage('');
    try {
      const next = { ...profile, name: record.name, slug: record.slug, checkedAt: new Date().toISOString() };
      const timestamp = await publishFirmRegistryProfile(record.id, next);
      setProfile(next); setSavedSnapshot(JSON.stringify(next)); setMessage(`Published · ${new Date(timestamp).toLocaleTimeString()}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not publish profile.'); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0c0d0e] text-xs text-zinc-500">Loading page builder…</div>;
  if (!record || !profile || !activeSection) return <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0c0d0e] text-sm text-zinc-400"><TriangleAlert className="h-5 w-5 text-amber-300" />{message || 'Builder could not be opened.'}<Link href="/admin" className="text-sky-300">Back to registry</Link></div>;

  return <div className="min-h-screen bg-[#0c0d0e] text-white">
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#111214]/95 px-4 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3"><Link href="/admin" aria-label="Back to firm registry" className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link><div className="min-w-0"><div className="flex items-center gap-2"><strong className="truncate text-sm">{record.name}</strong><span className={`h-2 w-2 rounded-full ${dirty ? 'bg-amber-400' : 'bg-emerald-400'}`} /></div><span className="text-[9px] uppercase tracking-wider text-zinc-600">Page builder · {dirty ? 'unsaved changes' : 'draft saved'}</span></div></div>
      <div className="hidden items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1 md:flex"><button type="button" aria-label="Desktop preview" onClick={() => setPreviewWidth('desktop')} className={`rounded-md p-2 ${previewWidth === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}><Monitor className="h-3.5 w-3.5" /></button><button type="button" aria-label="Mobile preview" onClick={() => setPreviewWidth('mobile')} className={`rounded-md p-2 ${previewWidth === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}><Smartphone className="h-3.5 w-3.5" /></button><span className="mx-1 h-5 w-px bg-zinc-800" /><button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-md p-2 text-zinc-400">{theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}</button></div>
      <div className="flex items-center gap-2">{message && <span className="hidden text-[9px] text-zinc-500 xl:block">{message}</span>}<Link href={`/prop-firms/${record.slug}`} target="_blank" className="hidden items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-400 sm:inline-flex"><Eye className="h-3.5 w-3.5" /> Public page</Link><button type="button" disabled={saving || !dirty} onClick={() => void saveDraft()} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-200 disabled:opacity-40"><Save className="h-3.5 w-3.5" /> Save draft</button><button type="button" disabled={saving} onClick={() => void publish()} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-extrabold text-zinc-950 disabled:opacity-40"><UploadCloud className="h-3.5 w-3.5" /> Publish</button></div>
    </header>

    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-[250px_minmax(0,1fr)_330px]">
      <aside className="border-r border-zinc-800 bg-[#111214] p-4">
        <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">Page sections</span><button type="button" aria-label="Add section" onClick={addSection} className="rounded-md border border-zinc-800 p-1.5 text-zinc-500 hover:text-white"><Plus className="h-3 w-3" /></button></div>
        <button type="button" onClick={selectHero} className={`mt-3 w-full rounded-lg border px-3 py-3 text-left ${editingHero ? 'border-violet-500/40 bg-violet-500/10' : 'border-transparent hover:border-zinc-800'}`}><span className="block text-[11px] font-bold text-zinc-200">Hero & quick facts</span><span className="mt-1 block text-[8px] text-zinc-600">Identity, model and comparison metrics</span></button>
        <div className="mt-1.5 space-y-1.5">{profile.sections.map((section, index) => <div key={section.id} className={`group flex items-center gap-1 rounded-lg border p-1 ${!editingHero && activeSection.id === section.id ? 'border-sky-500/40 bg-sky-500/10' : 'border-transparent hover:border-zinc-800'}`}><button type="button" onClick={() => selectSection(section.id)} className="min-w-0 flex-1 px-2 py-2 text-left"><span className="block truncate text-[11px] font-bold text-zinc-200">{section.tabLabel}</span><span className="mt-1 block text-[8px] text-zinc-600">{section.blocks.length} blocks</span></button><div className="hidden flex-col group-hover:flex"><button type="button" onClick={() => setProfile({ ...profile, sections: move(profile.sections, index, -1) })} className="text-zinc-600"><ArrowUp className="h-3 w-3" /></button><button type="button" onClick={() => setProfile({ ...profile, sections: move(profile.sections, index, 1) })} className="text-zinc-600"><ArrowDown className="h-3 w-3" /></button></div></div>)}</div>
        <div className="mt-6 border-t border-zinc-800 pt-5"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">Block library</span><div className="mt-3 grid grid-cols-2 gap-2">{blockLibrary.map(({ type, label, icon: Icon }) => <button key={type} type="button" onClick={() => addBlock(type)} className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 text-[9px] font-bold text-zinc-500 hover:border-zinc-700 hover:text-white"><Icon className="h-4 w-4" />{label}</button>)}</div></div>
      </aside>

      <main className="min-w-0 overflow-auto bg-[#090a0b] p-5 sm:p-8">
        <div className={`mx-auto overflow-hidden rounded-xl border border-zinc-800 shadow-2xl transition-[max-width] ${previewWidth === 'mobile' ? 'max-w-[430px]' : 'max-w-[1180px]'}`}>
          <div ref={previewRef} onClickCapture={handlePreviewClick} className={`${productStyles.lab} ${theme === 'dark' ? productStyles.dark : ''} max-h-[calc(100vh-112px)] min-h-[760px] overflow-y-auto`}>
            <div style={previewWidth === 'desktop' ? { width: 1240, zoom: 0.5 } : undefined} data-cms-mobile={previewWidth === 'mobile'}>
              {previewFirm ? <div className={`${productStyles.productPage} py-8`}>
                <FirmEditorialHero firm={previewFirm} profileOverride={profile} />
                <FirmEditorialContent firm={previewFirm} profileOverride={profile} editMode selectedBlockId={selectedBlockId} />
              </div> : <div className="flex min-h-[760px] items-center justify-center p-10 text-center text-xs text-zinc-500">A normalized firm identity is required for the visual preview.</div>}
            </div>
          </div>
        </div>
      </main>

      <aside className="border-l border-zinc-800 bg-[#111214] p-4">
        {editingHero ? <><div className="border-b border-zinc-800 pb-4"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-300">Hero settings</span><h2 className="mt-2 text-sm font-bold">Identity and quick facts</h2><p className="mt-1 text-[9px] leading-4 text-zinc-600">Edit the operating model and the structured values used by the public hero.</p></div><div className="py-5"><HeroEditor profile={profile} onChange={setProfile} /></div></> : selectedBlock ? <><div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4"><div><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-sky-300">{selectedBlock.type}</span><h2 className="mt-2 text-sm font-bold">{blockLabel(selectedBlock)}</h2></div><button type="button" onClick={() => setSelectedBlockId(null)} className="text-zinc-600"><X className="h-4 w-4" /></button></div><div className="flex gap-1 border-b border-zinc-800 py-3">{activeSection.blocks.map((block, index) => block.id === selectedBlock.id && <div key={block.id} className="flex w-full justify-between"><div className="flex gap-1"><button type="button" onClick={() => updateSection((section) => ({ ...section, blocks: move(section.blocks, index, -1) }))} className="rounded-md border border-zinc-800 p-2 text-zinc-500"><ArrowUp className="h-3 w-3" /></button><button type="button" onClick={() => updateSection((section) => ({ ...section, blocks: move(section.blocks, index, 1) }))} className="rounded-md border border-zinc-800 p-2 text-zinc-500"><ArrowDown className="h-3 w-3" /></button><button type="button" onClick={() => { const duplicate = { ...clone(block), id: id(block.type) }; updateSection((section) => ({ ...section, blocks: [...section.blocks.slice(0, index + 1), duplicate, ...section.blocks.slice(index + 1)] })); setSelectedBlockId(duplicate.id); }} className="rounded-md border border-zinc-800 p-2 text-zinc-500"><Copy className="h-3 w-3" /></button></div><button type="button" onClick={() => { updateSection((section) => ({ ...section, blocks: section.blocks.filter((item) => item.id !== block.id) })); setSelectedBlockId(null); }} className="rounded-md border border-red-500/20 p-2 text-red-400"><Trash2 className="h-3 w-3" /></button></div>)}</div><div className="py-5"><BlockEditor block={selectedBlock} onChange={updateSelectedBlock} /></div></> : <><div className="border-b border-zinc-800 pb-4"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">Section settings</span><h2 className="mt-2 text-sm font-bold">{activeSection.tabLabel}</h2></div><div className="space-y-4 py-5"><label className={labelClass}>Tab label<input className={fieldClass} value={activeSection.tabLabel} onChange={(event) => updateSection((section) => ({ ...section, tabLabel: event.target.value }))} /></label><label className={labelClass}>Section title<input className={fieldClass} value={activeSection.title} onChange={(event) => updateSection((section) => ({ ...section, title: event.target.value }))} /></label><label className={labelClass}>Description<textarea className={`${fieldClass} min-h-24 resize-y`} value={activeSection.description ?? ''} onChange={(event) => updateSection((section) => ({ ...section, description: event.target.value }))} /></label>{profile.sections.length > 1 && <button type="button" onClick={() => { const next = profile.sections.filter((section) => section.id !== activeSection.id); setProfile({ ...profile, sections: next }); setActiveSectionId(next[0].id); setSelectedBlockId(null); }} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-[10px] font-bold text-red-400"><Trash2 className="h-3 w-3" /> Delete section</button>}</div><div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"><div className="flex gap-2"><Check className="h-4 w-4 text-emerald-400" /><div><strong className="text-[10px] text-zinc-300">Live component preview</strong><p className="mt-1 text-[9px] leading-4 text-zinc-600">The builder and public profile use the same content renderer.</p></div></div></div></>}
      </aside>
    </div>
  </div>;
}
