'use client';

import { useState } from 'react';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import type { ChallengeProgram } from '@/types/firm';
import { formatCapital } from './experience';
import styles from '@/app/product-lab/page.module.css';

type ChallengeExplorerProps = {
  programs: ChallengeProgram[];
  firmName: string;
  offerUrl?: string;
  isReferral?: boolean;
};

function formatTarget(program: ChallengeProgram, accountSize?: number) {
  return program.stages
    .filter((stage) => typeof stage.profitTargetPercent === 'number')
    .map((stage) => {
      const target = stage.profitTargetPercent as number;
      const amount = accountSize ? ` · $${(accountSize * target / 100).toLocaleString('en-US')}` : '';
      return program.stages.length > 1 ? `${stage.name} ${target}%${amount}` : `${target}%${amount}`;
    })
    .join(' / ');
}

function drawdownLabel(program: ChallengeProgram) {
  return program.maxDrawdown.type === 'static' ? 'Static' : program.maxDrawdown.type === 'trailing-high-water-mark' ? 'Trailing HWM' : 'Dynamic';
}

export function ChallengeExplorer({ programs, firmName, offerUrl, isReferral }: ChallengeExplorerProps) {
  const [selectedId, setSelectedId] = useState(programs[0]?.id ?? '');
  const program = programs.find((item) => item.id === selectedId) ?? programs[0];

  if (!program) return null;

  const minimumFee = Math.min(...program.tiers.filter((tier) => tier.available).map((tier) => tier.fee));
  const relationship = program.maxDrawdown.type === 'static'
    ? 'The maximum-loss line stays tied to the initial account balance.'
    : 'The loss floor follows the equity high-water mark until it reaches the starting balance.';

  return (
    <div className={styles.challengeExplorer}>
      <div className={styles.programTabs} role="tablist" aria-label={`${firmName} challenge programs`}>
        {programs.map((item) => (
          <button
            className={item.id === program.id ? styles.programTabActive : undefined}
            id={`${item.id}-tab`}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            role="tab"
            aria-controls={`${item.id}-panel`}
            aria-selected={item.id === program.id}
            type="button"
          >
            <span>{item.stages.length}-step</span>
            <strong>{item.shortName}</strong>
          </button>
        ))}
      </div>

      <div className={styles.programPanel} id={`${program.id}-panel`} role="tabpanel" aria-labelledby={`${program.id}-tab`}>
        <div className={styles.programIntro}>
          <div><span>Selected model</span><h3>{program.name}</h3></div>
          <p>{program.description}</p>
        </div>

        <div className={styles.metricBand}>
          <div><span>Entry fee</span><strong>${minimumFee}</strong><small>Smallest listed plan</small></div>
          <div><span>Profit target</span><strong>{formatTarget(program)}</strong><small>{program.stages.length === 1 ? 'One evaluation stage' : `${program.stages.length} evaluation stages`}</small></div>
          <div><span>Daily loss</span><strong>{program.dailyLoss.percent}%</strong><small>Start-of-day balance</small></div>
          <div><span>Maximum loss</span><strong>{program.maxDrawdown.percent}%</strong><small>{drawdownLabel(program)}</small></div>
        </div>

        <div className={styles.riskMechanics}>
          <CircleAlert />
          <div><strong>How the loss limits work</strong><p>{relationship} Daily loss resets at {program.dailyLoss.resetTimeUtc ?? 'the stated reset time'} UTC; floating PnL counts and touching the limit is a breach.</p></div>
          <span>{program.noTimeLimit ? 'No time limit' : 'Time limit applies'}</span>
        </div>

        <div className={styles.planTable} role="table" aria-label={`${firmName} ${program.name} plans`}>
          <div className={styles.planHead} role="row"><span role="columnheader">Account</span><span role="columnheader">Fee</span><span role="columnheader">Target</span><span role="columnheader">Daily loss</span><span role="columnheader">Max loss</span><span role="columnheader">Offer</span></div>
          {program.tiers.map((tier) => (
            <div className={styles.planRow} key={tier.accountSize} role="row">
              <strong role="cell">{formatCapital(tier.accountSize)}</strong>
              <div className={styles.planPrice} role="cell"><b>${tier.fee}</b>{tier.originalFee && <s>${tier.originalFee}</s>}</div>
              <span role="cell">{formatTarget(program, tier.accountSize)}</span>
              <span role="cell">{program.dailyLoss.percent}% · ${(tier.accountSize * program.dailyLoss.percent / 100).toLocaleString('en-US')}</span>
              <span role="cell">{program.maxDrawdown.percent}% · ${(tier.accountSize * program.maxDrawdown.percent / 100).toLocaleString('en-US')}</span>
              <div className={styles.planAction} role="cell">
                {offerUrl ? <a href={offerUrl} target="_blank" rel={isReferral ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}>Open plan <ArrowUpRight /></a> : <span>Unavailable</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
