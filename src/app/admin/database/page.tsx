'use client';

import { useEffect, useState } from 'react';
import { Database, ExternalLink, RefreshCw, UploadCloud } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { getFirmRegistry, seedFirmRegistry } from '@/lib/services/firmRegistryService';
import type { FirmDatabaseRecord } from '@/types/database';

export default function FirmDatabasePage() {
  const [records, setRecords] = useState<FirmDatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadRegistry() {
    setLoading(true);
    try {
      setRecords(await getFirmRegistry());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load the firm registry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getFirmRegistry()
      .then((items) => {
        if (!cancelled) setRecords(items);
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : 'Could not load the firm registry.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function initializeDatabase() {
    setLoading(true);
    setMessage('');
    try {
      const count = await seedFirmRegistry();
      setMessage(`${count} canonical firm records were written to Firestore.`);
      await loadRegistry();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not initialize Firestore.');
      setLoading(false);
    }
  }

  const researched = records.filter((record) => record.researchStatus !== 'stub').length;

  return (
    <div className="space-y-7 font-satoshi">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400"><Database className="h-4 w-4" /> Firestore schema v1</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Firm research database</h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-400">Propr is the complete reference record. Every other firm remains an identity-only stub until its sources are reviewed.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadRegistry()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs font-bold text-zinc-300"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button type="button" disabled={!isFirebaseConfigured || loading} onClick={() => void initializeDatabase()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-400 px-4 text-xs font-extrabold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"><UploadCloud className="h-4 w-4" /> Initialize Firestore</button>
        </div>
      </div>

      {!isFirebaseConfigured && <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-200">Firebase environment variables are not configured. The table below is the exact local seed preview; no remote write has been attempted.</div>}
      {message && <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs text-zinc-300">{message}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-[#141416] p-4"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Records</span><strong className="mt-2 block font-mono text-2xl text-white">{records.length}</strong></div>
        <div className="rounded-xl border border-zinc-800 bg-[#141416] p-4"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Researched</span><strong className="mt-2 block font-mono text-2xl text-emerald-400">{researched}</strong></div>
        <div className="rounded-xl border border-zinc-800 bg-[#141416] p-4"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Stubs</span><strong className="mt-2 block font-mono text-2xl text-amber-300">{records.length - researched}</strong></div>
        <div className="rounded-xl border border-zinc-800 bg-[#141416] p-4"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Collection</span><strong className="mt-2 block font-mono text-sm text-white">firmRegistry</strong></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[10px] uppercase tracking-wider text-zinc-500"><tr><th className="px-4 py-3.5">Firm</th><th className="px-4 py-3.5">Research</th><th className="px-4 py-3.5">Publication</th><th className="px-4 py-3.5">Links</th><th className="px-4 py-3.5">Profile payload</th></tr></thead>
            <tbody className="divide-y divide-zinc-800/70">
              {records.map((record) => <tr key={record.id} className="text-zinc-300"><td className="px-4 py-4"><strong className="block text-white">{record.name}</strong><span className="mt-1 block font-mono text-[10px] text-zinc-600">{record.id} · /{record.slug}</span></td><td className="px-4 py-4"><span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${record.researchStatus === 'stub' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{record.researchStatus}</span></td><td className="px-4 py-4 text-zinc-400">{record.publicationStatus}</td><td className="px-4 py-4"><div className="flex gap-2">{record.links.officialWebsite && <a href={record.links.officialWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-300">Website <ExternalLink className="h-3 w-3" /></a>}{record.links.x && <a href={record.links.x.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-zinc-300">{record.links.x.handle} <ExternalLink className="h-3 w-3" /></a>}</div></td><td className="px-4 py-4 font-mono text-[10px] text-zinc-500">{record.profile ? 'Complete PropFirm record' : 'Not created'}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
