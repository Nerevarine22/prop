import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, FileSearch, GitCompareArrows, ShieldCheck } from 'lucide-react';
import pageStyles from '@/components/layout/PublicPage.module.css';

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
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <header className={pageStyles.hero}>
          <div>
            <span className={pageStyles.eyebrow}><ShieldCheck /> Research methodology</span>
            <h1 className={pageStyles.title}>Every claim needs a status, source and date.</h1>
          </div>
          <p className={pageStyles.lead}>PropHub is an early product prototype. These rules define how verified data will replace sample records without hiding uncertainty from the trader.</p>
        </header>

        <section aria-labelledby="status-heading" className={pageStyles.section}>
          <div className={pageStyles.sectionHeader}><h2 id="status-heading">Data status</h2><p>Polish never substitutes for evidence. Every material field carries an explicit confidence state.</p></div>
          <div className={pageStyles.grid3}>
          {statuses.map(({ title, description, icon: Icon }) => (
            <article key={title} className={pageStyles.card}>
              <Icon className={pageStyles.cardIcon} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
          </div>
        </section>

        <section aria-labelledby="process-heading" className={pageStyles.section}>
          <div className={pageStyles.sectionHeader}><h2 id="process-heading">Review process</h2><GitCompareArrows className={pageStyles.cardIcon} /></div>
          <ol className={pageStyles.grid2}>
          {[
            ['Collect', 'Capture the firm rulebook, pricing, payout policy, platform support and reward terms.'],
            ['Structure', 'Map documented claims into comparable fields without hiding important exceptions.'],
            ['Verify', 'Check primary sources and record the method, reviewer, confidence and date.'],
            ['Monitor', 'Keep a change history and lower the status when a source becomes stale or unavailable.'],
          ].map(([title, description], index) => (
            <li key={title} className={pageStyles.card}>
              <span className={pageStyles.number}>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
          </ol>
        </section>

        <div className={`${pageStyles.section} ${pageStyles.toolbar}`}>
          <p className={pageStyles.lead}>Until this pipeline is live, sample data remains visibly labeled as demo content.</p>
          <Link href="/prop-firms" className={pageStyles.buttonPrimary}>Browse the prototype <ArrowRight /></Link>
        </div>
      </div>
    </div>
  );
}
