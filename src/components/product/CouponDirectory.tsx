'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Database, Percent } from 'lucide-react';
import type { Coupon } from '@/types/firm';
import pageStyles from '@/components/layout/PublicPage.module.css';

export function CouponDirectory({ coupons }: { coupons: Coupon[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <header className={pageStyles.hero}>
          <div>
            <span className={pageStyles.eyebrow}><Percent /> Coupon research</span>
            <h1 className={pageStyles.title}>Crypto prop firm coupon records</h1>
          </div>
          <div>
            <p className={pageStyles.lead}>Published promotion and affiliate records. Discounts never replace the underlying challenge comparison.</p>
            <div className={pageStyles.notice}><Database /><span>Only codes attached to published firm profiles appear here.</span></div>
          </div>
        </header>

        <section className={pageStyles.section} aria-labelledby="coupon-records-heading">
          <div className={pageStyles.sectionHeader}><h2 id="coupon-records-heading">Promotion records</h2><p>Each record stays attached to the firm profile used by the rest of the site.</p></div>
          <div className={pageStyles.grid3}>
            {coupons.map((coupon) => (
              <article key={coupon.id} className={pageStyles.card}>
                <div className={pageStyles.sectionHeader}>
                  <h2>{coupon.firmName}</h2>
                  {coupon.verified && <span className={`${pageStyles.tag} ${pageStyles.tagPositive}`}><Check className="h-3 w-3" /> Verified</span>}
                </div>
                <div className={pageStyles.metric}>
                  <small>Reported discount</small>
                  <strong>{coupon.discount}</strong>
                  <p>{coupon.description}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#29313d] bg-[#0e1117] px-3 font-mono text-xs font-extrabold tracking-wider text-[#a9c7ff]">{coupon.code}</div>
                  <button onClick={() => handleCopy(coupon.id, coupon.code)} className={pageStyles.buttonPrimary}>
                    {copiedId === coupon.id ? <Check /> : <Copy />}
                    <span>{copiedId === coupon.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <Link href="/prop-firms" className={`${pageStyles.link} mt-4`}>View firm directory <ArrowRight /></Link>
              </article>
            ))}
            {!coupons.length && <div className={pageStyles.card}><h2>No published codes</h2><p>Verified promotions will appear here when they are attached to a published research profile.</p></div>}
          </div>
        </section>
      </div>
    </div>
  );
}
