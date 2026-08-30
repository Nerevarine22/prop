'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Archive, CheckCircle2, ChevronRight, Database, Download, ExternalLink,
  FileJson, FileSearch, Filter, Globe2, Layers3, RefreshCw, Save, Search,
  ShieldCheck, X,
} from 'lucide-react';
import {
  getFirmRegistry, updateFirmRegistryMetadata, type FirmRegistryMetadataInput,
} from '@/lib/services/firmRegistryService';
import type {
  FirmContentBlock, FirmDatabaseRecord, FirmPublicationStatus, FirmResearchStatus,
} from '@/types/database';

type RegistrySummary = {
  generation: 'Model-first V2' | 'Normalized V1' | 'Identity only';
  sectionCount: number;
  blockCount: number;
  factCount: number;
  unknownCount: number;
  sourceCount: number;
};

const inputClass = 'w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white outline-none transition-colors focus:border-zinc-600';

function isUnknown(value: unknown, status?: string): boolean {
  return status === 'ND' || (typeof value === 'string' && value.trim().toUpperCase() === 'ND');
}

function blockSummary(block: FirmContentBlock): Pick<RegistrySummary, 'factCount' | 'unknownCount'> {
  if (block.type === 'fact-grid') {
    return { factCount: block.items.length, unknownCount: block.items.filter((item) => isUnknown(item.value, item.status)).length };
  }
  if (block.type === 'record-list') {
    const facts = block.items.flatMap((item) => item.facts ?? []);
    return { factCount: facts.length, unknownCount: facts.filter((item) => isUnknown(item.value, item.status)).length };
  }
  if (block.type === 'table') {
    const values = block.rows.flatMap((row) => Object.values(row.cells));
    return { factCount: values.length, unknownCount: values.filter((value) => isUnknown(value)).length };
  }
  return {
    factCount: 1,
    unknownCount: isUnknown(block.type === 'text' ? block.paragraphs.join(' ') : block.text, block.status) ? 1 : 0,
  };
}

function summarizeRecord(record: FirmDatabaseRecord): RegistrySummary {
  const profile = record.normalizedProfileV2;
  const sections = profile?.sections ?? [];
  const blocks = sections.flatMap((section) => section.blocks);
  const totals = blocks.reduce((result, block) => {
    const summary = blockSummary(block);
    result.factCount += summary.factCount;
    result.unknownCount += summary.unknownCount;
    return result;
  }, { factCount: 0, unknownCount: 0 });
  const sourceUrls = new Set<string>();
  record.primaryResearch?.observations.forEach((item) => sourceUrls.add(item.sourceUrl));
  profile?.sourcesInspected?.forEach((item) => sourceUrls.add(item.url));

  return {
    generation: profile ? 'Model-first V2' : record.normalizedProfile ? 'Normalized V1' : 'Identity only',
    sectionCount: sections.length,
    blockCount: blocks.length,
    factCount: totals.factCount,
    unknownCount: totals.unknownCount,
    sourceCount: sourceUrls.size,
  };
}

function statusClass(status: FirmResearchStatus | FirmPublicationStatus): string {
  if (status === 'verified' || status === 'published') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
  if (status === 'researched') return 'border-sky-500/20 bg-sky-500/10 text-sky-300';
  if (status === 'archived') return 'border-zinc-700 bg-zinc-800 text-zinc-400';
  return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
}

function RegistryBadge({ value }: { value: FirmResearchStatus | FirmPublicationStatus }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] ${statusClass(value)}`}>{value}</span>;
}

function downloadRecord(record: FirmDatabaseRecord) {
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${record.slug}-firm-registry.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function RegistryInspector({ record, onClose, onSaved }: {
  record: FirmDatabaseRecord;
  onClose: () => void;
  onSaved: (record: FirmDatabaseRecord) => void;
}) {
  const [name, setName] = useState(record.name);
  const [slug, setSlug] = useState(record.slug);
  const [researchStatus, setResearchStatus] = useState(record.researchStatus);
  const [publicationStatus, setPublicationStatus] = useState(record.publicationStatus);
  const [website, setWebsite] = useState(record.links.officialWebsite ?? '');
  const [xHandle, setXHandle] = useState(record.links.x?.handle ?? '');
  const [xUrl, setXUrl] = useState(record.links.x?.url ?? '');
  const [logoPath, setLogoPath] = useState(record.brandAssets?.logoPath ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const summary = summarizeRecord(record);
  const profile = record.normalizedProfileV2;

  async function saveMetadata() {
    setSaving(true);
    setMessage('');
    try {
      const normalizedHandle = xHandle.trim() ? `@${xHandle.trim().replace(/^@/, '')}` : '';
      const links: FirmRegistryMetadataInput['links'] = {
        ...(website.trim() ? { officialWebsite: website.trim() } : {}),
        ...(normalizedHandle && xUrl.trim() ? { x: { handle: normalizedHandle, url: xUrl.trim() } } : {}),
      };
      const brandAssets = logoPath.trim() ? {
        logoPath: logoPath.trim(),
        sourceUrl: record.brandAssets?.sourceUrl ?? links.x?.url ?? links.officialWebsite ?? '',
        status: record.brandAssets?.status ?? ('reported' as const),
        checkedAt: record.brandAssets?.checkedAt ?? new Date().toISOString(),
      } : undefined;
      const input: FirmRegistryMetadataInput = { name, slug, researchStatus, publicationStatus, links, brandAssets };
      await updateFirmRegistryMetadata(record.id, input);
      const updated = { ...record, ...input, updatedAt: new Date().toISOString() };
      onSaved(updated);
      setMessage('Registry metadata saved. Research payload was left unchanged.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save registry metadata.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${record.name} registry inspector`}>
      <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-zinc-800 bg-[#101112] shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-[#101112]/95 px-6 py-5 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-sky-300"><FileSearch className="h-3.5 w-3.5" /> Firm registry inspector</div>
            <h2 className="mt-2 truncate text-xl font-extrabold text-white">{record.name}</h2>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">{record.id}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white" aria-label="Close inspector"><X className="h-4 w-4" /></button>
        </header>

        <div className="space-y-7 p-6">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ['Sections', summary.sectionCount], ['Blocks', summary.blockCount], ['Facts', summary.factCount],
              ['Unknown', summary.unknownCount], ['Sources', summary.sourceCount],
            ].map(([label, value]) => <div key={label} className="rounded-xl border border-zinc-800 bg-[#161719] p-3"><span className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</span><strong className="mt-2 block font-mono text-lg text-white">{value}</strong></div>)}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><h3 className="text-sm font-bold text-white">Canonical identity</h3><p className="mt-1 text-[10px] leading-4 text-zinc-500">Safe metadata only. Saving does not rewrite the research payload.</p></div>
              <div className="flex gap-2"><RegistryBadge value={researchStatus} /><RegistryBadge value={publicationStatus} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Firm name<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Slug<input className={`${inputClass} font-mono`} value={slug} onChange={(event) => setSlug(event.target.value)} /></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Research status<select className={inputClass} value={researchStatus} onChange={(event) => setResearchStatus(event.target.value as FirmResearchStatus)}><option value="stub">Stub</option><option value="researched">Researched</option><option value="verified">Verified</option></select></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Publication<select className={inputClass} value={publicationStatus} onChange={(event) => setPublicationStatus(event.target.value as FirmPublicationStatus)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 sm:col-span-2">Official website<input className={inputClass} value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">X handle<input className={inputClass} value={xHandle} onChange={(event) => setXHandle(event.target.value)} /></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">X URL<input className={inputClass} value={xUrl} onChange={(event) => setXUrl(event.target.value)} /></label>
              <label className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 sm:col-span-2">Logo path<input className={`${inputClass} font-mono`} value={logoPath} onChange={(event) => setLogoPath(event.target.value)} /></label>
            </div>
            {message && <p className={`mt-4 rounded-lg border px-3 py-2 text-[10px] ${message.startsWith('Registry') ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>{message}</p>}
            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-zinc-800 pt-5">
              <div className="flex gap-2">
                <Link href={`/admin/builder/${record.id}`} className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-3 py-2 text-[10px] font-extrabold text-zinc-950">Open builder <ChevronRight className="h-3 w-3" /></Link>
                <Link href={`/prop-firms/${record.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-300">Public profile <ExternalLink className="h-3 w-3" /></Link>
                <button type="button" onClick={() => downloadRecord(record)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-[10px] font-bold text-zinc-300"><Download className="h-3 w-3" /> JSON</button>
              </div>
              <button type="button" disabled={saving} onClick={() => void saveMetadata()} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-extrabold text-zinc-950 disabled:opacity-50"><Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save metadata'}</button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-end justify-between gap-4"><div><h3 className="text-sm font-bold text-white">Dynamic profile structure</h3><p className="mt-1 text-[10px] text-zinc-500">{summary.generation} · content follows this firm’s own operating model.</p></div>{profile?.researchMode && <span className="text-[9px] uppercase tracking-wider text-zinc-500">{profile.researchMode}</span>}</div>
            {profile?.sections.length ? profile.sections.map((section, index) => (
              <article key={section.id} className="rounded-xl border border-zinc-800 bg-[#141416] p-4">
                <div className="flex items-start justify-between gap-4"><div><span className="font-mono text-[9px] text-sky-300">{String(index + 1).padStart(2, '0')}</span><h4 className="mt-2 text-sm font-bold text-white">{section.tabLabel}</h4><p className="mt-1 text-[10px] leading-4 text-zinc-500">{section.title}</p></div><span className="rounded-md bg-zinc-900 px-2 py-1 font-mono text-[9px] text-zinc-400">{section.blocks.length} blocks</span></div>
                <div className="mt-3 flex flex-wrap gap-1.5">{section.blocks.map((block) => <span key={block.id} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[9px] text-zinc-500">{block.type}</span>)}</div>
              </article>
            )) : <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500">No model-first sections are stored for this firm yet.</div>}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<FirmDatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [researchFilter, setResearchFilter] = useState<'all' | FirmResearchStatus>('all');
  const [publicationFilter, setPublicationFilter] = useState<'all' | FirmPublicationStatus>('all');
  const [selected, setSelected] = useState<FirmDatabaseRecord | null>(null);

  async function loadRecords() {
    setLoading(true);
    setError('');
    try { setRecords(await getFirmRegistry()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Could not load firmRegistry.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadRecords(); }, []);

  const summaries = useMemo(() => new Map(records.map((record) => [record.id, summarizeRecord(record)])), [records]);
  const filteredRecords = useMemo(() => records.filter((record) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [record.name, record.slug, record.id, record.links.x?.handle].some((value) => value?.toLowerCase().includes(needle));
    return matchesQuery && (researchFilter === 'all' || record.researchStatus === researchFilter) && (publicationFilter === 'all' || record.publicationStatus === publicationFilter);
  }), [publicationFilter, query, records, researchFilter]);

  const modelFirstCount = records.filter((record) => Boolean(record.normalizedProfileV2)).length;
  const publishedCount = records.filter((record) => record.publicationStatus === 'published').length;
  const sourceCount = [...summaries.values()].reduce((total, item) => total + item.sourceCount, 0);

  return (
    <div className="space-y-7 font-satoshi">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400"><Database className="h-4 w-4" /> Canonical research registry</div><h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Firm research workspace</h1><p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-400">Review identity, publication state and model-specific research without flattening firms into one legacy template.</p></div>
        <div className="flex gap-2"><Link href="/admin/database" className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-bold text-zinc-300"><ShieldCheck className="h-4 w-4 text-sky-300" /> Database health</Link><button type="button" onClick={() => void loadRecords()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-zinc-950"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button></div>
      </header>

      {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</div>}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-[#141416] p-4"><Layers3 className="h-4 w-4 text-sky-300" /><span className="mt-4 block text-[9px] uppercase tracking-wider text-zinc-500">Registry records</span><strong className="mt-1 block font-mono text-2xl text-white">{records.length}</strong></div>
        <div className="rounded-2xl border border-zinc-800 bg-[#141416] p-4"><FileJson className="h-4 w-4 text-violet-300" /><span className="mt-4 block text-[9px] uppercase tracking-wider text-zinc-500">Model-first profiles</span><strong className="mt-1 block font-mono text-2xl text-white">{modelFirstCount}</strong></div>
        <div className="rounded-2xl border border-zinc-800 bg-[#141416] p-4"><CheckCircle2 className="h-4 w-4 text-emerald-300" /><span className="mt-4 block text-[9px] uppercase tracking-wider text-zinc-500">Published</span><strong className="mt-1 block font-mono text-2xl text-white">{publishedCount}</strong></div>
        <div className="rounded-2xl border border-zinc-800 bg-[#141416] p-4"><Globe2 className="h-4 w-4 text-amber-300" /><span className="mt-4 block text-[9px] uppercase tracking-wider text-zinc-500">Unique source links</span><strong className="mt-1 block font-mono text-2xl text-white">{sourceCount}</strong></div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#141416] p-3 sm:p-4"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]"><label className="relative"><Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-600" /><input className={`${inputClass} pl-10`} placeholder="Search firm, slug, ID or X handle…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="relative"><Filter className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-zinc-600" /><select className={`${inputClass} pl-10`} value={researchFilter} onChange={(event) => setResearchFilter(event.target.value as 'all' | FirmResearchStatus)}><option value="all">All research states</option><option value="stub">Stub</option><option value="researched">Researched</option><option value="verified">Verified</option></select></label><select className={inputClass} value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value as 'all' | FirmPublicationStatus)}><option value="all">All publication states</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div></section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{filteredRecords.length} visible records</span><span className="text-[9px] text-zinc-600">firmRegistry · schema v1 + dynamic V2 payload</span></div>
        <div className="divide-y divide-zinc-800/80">
          {loading && !records.length ? <div className="p-12 text-center text-xs text-zinc-500">Loading canonical registry…</div> : filteredRecords.map((record) => {
            const summary = summaries.get(record.id)!;
            return <article key={record.id} className="grid gap-5 px-4 py-5 transition-colors hover:bg-zinc-900/35 lg:grid-cols-[minmax(230px,1.25fr)_minmax(260px,1fr)_minmax(250px,.9fr)_44px] lg:items-center"><div className="flex min-w-0 items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">{record.brandAssets?.logoPath ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={record.brandAssets.logoPath} alt="" className="h-full w-full object-cover" /></> : <span className="font-mono text-sm font-bold text-zinc-600">{record.name.slice(0, 2).toUpperCase()}</span>}</div><div className="min-w-0"><h2 className="truncate text-sm font-bold text-white">{record.name}</h2><p className="mt-1 truncate font-mono text-[9px] text-zinc-600">/{record.slug} · {record.id}</p><div className="mt-2 flex gap-1.5"><RegistryBadge value={record.researchStatus} /><RegistryBadge value={record.publicationStatus} /></div></div></div><div><span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Profile model</span><strong className="mt-2 block text-xs text-zinc-200">{summary.generation}</strong><p className="mt-1 text-[10px] text-zinc-500">{summary.sectionCount} sections · {summary.blockCount} content blocks</p></div><div className="grid grid-cols-3 gap-2"><div><span className="text-[8px] uppercase tracking-wider text-zinc-600">Facts</span><strong className="mt-1 block font-mono text-sm text-zinc-200">{summary.factCount}</strong></div><div><span className="text-[8px] uppercase tracking-wider text-zinc-600">Unknown</span><strong className="mt-1 block font-mono text-sm text-amber-300">{summary.unknownCount}</strong></div><div><span className="text-[8px] uppercase tracking-wider text-zinc-600">Sources</span><strong className="mt-1 block font-mono text-sm text-sky-300">{summary.sourceCount}</strong></div></div><button type="button" onClick={() => setSelected(record)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white" aria-label={`Inspect ${record.name}`}><ChevronRight className="h-4 w-4" /></button></article>;
          })}
          {!loading && !filteredRecords.length && <div className="p-12 text-center"><Archive className="mx-auto h-5 w-5 text-zinc-700" /><p className="mt-3 text-xs text-zinc-500">No registry records match these filters.</p></div>}
        </div>
      </section>
      {selected && <RegistryInspector key={selected.id} record={selected} onClose={() => setSelected(null)} onSaved={(updated) => { setRecords((items) => items.map((item) => item.id === updated.id ? updated : item)); setSelected(updated); }} />}
    </div>
  );
}
