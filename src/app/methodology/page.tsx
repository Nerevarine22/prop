import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, FileSearch, GitCompareArrows, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research and verification methodology',
  description: 'How PropHub will source, review, label and update crypto prop firm data.',
  alternates: { canonical: '/methodology' },
};

const statuses = [
  {
    title: 'Demo',
    description: 'Sample content used to design and test the product. It is not a factual claim.',
    icon: Database,
  },
  {
    title: 'Reported',
    description: 'Information published by a firm or community source, linked to the original source.',
    icon: FileSearch,
  },
  {
    title: 'Verified',
    description: 'A claim checked against primary documentation or independently inspectable on-chain evidence.',
    icon: ShieldCheck,
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-emerald-300">Research methodology</p>
        <h1 className="display-heading text-4xl leading-tight text-white sm:text-6xl text-balance">
          Every claim needs a status, source and date.
        </h1>
        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-400">
          PropHub is currently an early product prototype. This page defines the rules the production research system will follow as verified data replaces sample records.
        </p>
      </header>

      <section aria-labelledby="status-heading" className="space-y-6">
        <h2 id="status-heading" className="text-2xl font-bold tracking-tight text-white">Data status</h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-3">
          {statuses.map(({ title, description, icon: Icon }) => (
            <article key={title} className="bg-[#121214] p-6 sm:p-7">
              <Icon className="h-5 w-5 text-emerald-300" />
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="process-heading" className="grid gap-8 border-t border-zinc-800 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <GitCompareArrows className="h-6 w-6 text-zinc-300" />
          <h2 id="process-heading" className="mt-4 text-2xl font-bold tracking-tight text-white">Review process</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2">
          {[
            ['Collect', 'Capture the firm rulebook, pricing, payout policy, platform support and reward terms.'],
            ['Normalize', 'Convert claims into comparable fields without hiding important exceptions.'],
            ['Verify', 'Check primary sources and record the method, reviewer, confidence and date.'],
            ['Monitor', 'Keep a change history and lower the status when a source becomes stale or unavailable.'],
          ].map(([title, description]) => (
            <li key={title} className="rounded-xl bg-[#141416] p-5">
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">Until this pipeline is live, sample data remains visibly labeled as demo content.</p>
        <Link href="/prop-firms" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-300">
          Browse the prototype <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
