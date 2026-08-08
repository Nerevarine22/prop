import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Coins, Database } from 'lucide-react';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';

export const metadata: Metadata = {
  title: 'Prop firm points, tokens and airdrops',
  description: 'Research prop firm points programs, tokens, airdrop status and trader reward mechanics.',
  alternates: { canonical: '/rewards' },
};

export default function RewardsPage() {
  const rewardFirms = MOCK_PROP_FIRMS.filter((firm) => firm.rewardTags?.length);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <Database className="h-4 w-4" />
          Demo reward records
        </div>
        <h1 className="display-heading text-4xl leading-tight text-white sm:text-6xl text-balance">Points, tokens and airdrops</h1>
        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-400">
          A dedicated research layer for the rewards that can change the effective value of a prop challenge. All current entries are sample data.
        </p>
      </header>

      <section aria-label="Reward program directory" className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214]">
        {rewardFirms.map((firm) => (
          <article key={firm.id} className="grid gap-4 border-b border-zinc-800/70 p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-emerald-300" />
                <h2 className="text-lg font-bold text-white">{firm.name}</h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                {firm.tokenomicsInfo?.rewardDescription || 'Reward program details are being documented.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {firm.rewardTags?.map((tag) => (
                  <span key={tag} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-zinc-300">{tag}</span>
                ))}
              </div>
            </div>
            <Link href={`/prop-firms/${firm.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-300">
              View profile <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
