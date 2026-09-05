import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Coins, Database } from 'lucide-react';
import { factText, profileHasRewards, profileRewardLabels } from '@/lib/data/publicFirmProfiles';
import { getPublicFirmProfiles } from '@/lib/services/publicFirmProfileService';
import pageStyles from '@/components/layout/PublicPage.module.css';

export const metadata: Metadata = {
  title: 'Prop firm points, tokens and airdrops',
  description: 'Research prop firm points programs, tokens, airdrop status and trader reward mechanics.',
  alternates: { canonical: '/rewards' },
};

export const revalidate = 300;

export default async function RewardsPage() {
  const rewardFirms = (await getPublicFirmProfiles()).filter(profileHasRewards);

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <header className={pageStyles.hero}>
          <div>
            <span className={`${pageStyles.eyebrow} ${pageStyles.eyebrowReward}`}><Coins /> Reward intelligence</span>
            <h1 className={pageStyles.title}>Points, tokens and airdrops</h1>
          </div>
          <div>
            <p className={pageStyles.lead}>A dedicated research layer for rewards that can change the effective value of a prop challenge without being confused with verified cash value.</p>
            <div className={pageStyles.notice}><Database /><span>Reward entries come from official company sources; anything not documented remains clearly unavailable.</span></div>
          </div>
        </header>

        <section className={pageStyles.section} aria-labelledby="reward-directory-heading">
          <div className={pageStyles.sectionHeader}>
            <h2 id="reward-directory-heading">Programs under review</h2>
            <p>Status, eligibility and evidence remain separate from the core challenge economics.</p>
          </div>
          <div className={`${pageStyles.panel} ${pageStyles.list}`}>
            {rewardFirms.map((firm) => (
              <article key={firm.id}>
                <div>
                  <div className={pageStyles.identity}><Coins /><h2>{firm.name}</h2></div>
                  <p>{factText(firm.tokenRewards.description)}</p>
                  <div className={pageStyles.tags}>
                    {profileRewardLabels(firm).map((tag) => <span key={tag} className={`${pageStyles.tag} ${pageStyles.tagReward}`}>{tag}</span>)}
                  </div>
                </div>
                <Link href={`/prop-firms/${firm.slug}`} className={pageStyles.link}>View profile <ArrowRight /></Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
