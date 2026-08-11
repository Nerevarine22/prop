'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Database, Percent } from 'lucide-react';
import { MOCK_COUPONS } from '@/lib/data/firms';
import pageStyles from '@/components/layout/PublicPage.module.css';

export default function CouponsPage() {
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
            <p className={pageStyles.lead}>A verification-ready structure for future promotions and affiliate records. Discounts never replace the underlying challenge comparison.</p>
            <div className={pageStyles.notice}><Database /><span>Current codes are sample records and are not guaranteed to be active.</span></div>
          </div>
        </header>

        <section className={pageStyles.section} aria-labelledby="coupon-records-heading">
          <div className={pageStyles.sectionHeader}><h2 id="coupon-records-heading">Promotion records</h2><p>Each record will eventually include its source, review date and validity status.</p></div>
          <div className={pageStyles.grid3}>
            {MOCK_COUPONS.map((coupon) => (
              <article key={coupon.id} className={pageStyles.card}>
                <div className={pageStyles.sectionHeader}>
                  <h2>{coupon.firmName}</h2>
                  <span className={`${pageStyles.tag} ${pageStyles.tagPositive}`}><Database className="h-3 w-3" /> Demo</span>
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
          </div>
        </section>
      </div>
    </div>
  );
}
