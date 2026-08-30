import type { FirmContentBlock, FirmNormalizedProfileV2, FirmProfileSection } from '@/types/database';

type PilotCopy = {
  overviewTitle: string;
  overviewDescription: string;
  overviewBlockTitle: string;
  overviewParagraphs: string[];
  offersTitle: string;
  offersDescription: string;
  payoutsTitle: string;
  payoutsDescription: string;
  considerations: string[];
};

const PILOT_COPY: Partial<Record<string, PilotCopy>> = {
  breakout: {
    overviewTitle: 'A crypto evaluation with a fixed cost of entry.',
    overviewDescription: 'The essential operating model before comparing individual programs.',
    overviewBlockTitle: 'Pass an evaluation, then trade allocated capital.',
    overviewParagraphs: [
      'Breakout sells one-step and two-step crypto trading evaluations. The trader pays a one-time fee and must reach the selected program target without breaching its loss limits.',
      'After qualification, Breakout allocates the funded account and pays the trader a documented share of eligible profits. The evaluation fee defines the trader’s initial financial exposure.',
    ],
    offersTitle: 'Choose the risk profile, not just the fee.',
    offersDescription: 'Profit target and maximum loss change between Classic, Pro, Turbo and the two-step route.',
    payoutsTitle: 'On-demand withdrawals with an 80% split.',
    payoutsDescription: 'Payout conditions are separated from evaluation pricing so the funded-stage mechanics remain readable.',
    considerations: [
      'The cheapest one-step program also has the tightest documented maximum loss.',
      'A funded account is a separate stage; passing an evaluation does not turn the evaluation balance into withdrawable capital.',
      'Program Rules remain the canonical source when a marketing or checkout page presents a different parameter.',
    ],
  },
  chainfunded: {
    overviewTitle: 'An evaluation connected to a decentralized liquidity pool.',
    overviewDescription: 'ChainFunded combines prop-firm qualification with smart-contract settlement and LP-backed capital.',
    overviewBlockTitle: 'Fixed protocol rules replace discretionary account changes.',
    overviewParagraphs: [
      'Traders qualify through an evaluation whose entry parameters and risk thresholds are documented as smart-contract-fixed. Successful traders can be backed by liquidity supplied to the protocol pool.',
      'Performance verification and USDC settlement run through the Ethereum-based protocol rather than a conventional prop-firm balance sheet and manual payout queue.',
    ],
    offersTitle: 'One documented evaluation path.',
    offersDescription: 'The offer card keeps the published target, loss limits and available account range together.',
    payoutsTitle: 'Protocol-verified USDC settlement.',
    payoutsDescription: 'The payout layer is presented separately from evaluation rules and token incentives.',
    considerations: [
      'Smart-contract settlement reduces discretionary processing, but it introduces contract, wallet and network risk.',
      'Published protocol mechanics should not be interpreted as regulated brokerage or investment services.',
      'Token and liquidity-provider incentives are separate from the trader’s core evaluation economics.',
    ],
  },
};

function block(profile: FirmNormalizedProfileV2, id: string): FirmContentBlock | undefined {
  return profile.sections.flatMap((section) => section.blocks).find((item) => item.id === id);
}

function available(profile: FirmNormalizedProfileV2, ids: string[]): FirmContentBlock[] {
  return ids.flatMap((id) => {
    const found = block(profile, id);
    return found ? [found] : [];
  });
}

function section(id: string, tabLabel: string, title: string, description: string, blocks: FirmContentBlock[]): FirmProfileSection {
  return { id, tabLabel, title, description, blocks };
}

function buildPilotProfile(profile: FirmNormalizedProfileV2, copy: PilotCopy): FirmNormalizedProfileV2 {
  const sourceBlocks = available(profile, ['source-differences-notice', 'source-differences']);
  const rewardBlocks = available(profile, ['reward-facts', 'reward-description']);
  const sections: FirmProfileSection[] = [
    section('overview', 'At a glance', copy.overviewTitle, copy.overviewDescription, [
      {
        id: `${profile.slug}-editorial-model`,
        type: 'text',
        eyebrow: 'Operating model',
        title: copy.overviewBlockTitle,
        paragraphs: copy.overviewParagraphs,
        meta: `Editorial summary · research checked ${profile.checkedAt.slice(0, 10)}`,
      },
      ...available(profile, ['overview-facts']),
    ]),
    section('offers', profile.slug === 'chainfunded' ? 'Evaluation' : 'Programs', copy.offersTitle, copy.offersDescription, available(profile, ['offer-records'])),
    section('payouts', 'Payouts', copy.payoutsTitle, copy.payoutsDescription, available(profile, ['payout-facts', 'payout-notes'])),
    ...(rewardBlocks.length ? [section('rewards', 'Rewards', 'Token and ecosystem incentives.', 'Reward claims remain separate from the trading offer and payout policy.', rewardBlocks)] : []),
    section('considerations', 'Before you choose', 'What changes the decision.', 'Short decision notes replace long imported research passages on the public page.', [
      { id: `${profile.slug}-editorial-considerations`, type: 'fact-grid', columns: 3, presentation: 'steps', items: copy.considerations.map((value, index) => ({ id: `${profile.slug}-consideration-${index + 1}`, label: String(index + 1).padStart(2, '0'), value })) },
      ...sourceBlocks,
    ]),
    section('sources', 'Sources', 'Official sources and research record.', 'The full source trail remains available without interrupting the decision flow.', available(profile, ['source-claims'])),
  ].filter((item) => item.blocks.length);

  return { ...profile, contentStage: 'editorial', sections };
}

export function getEditorialPageProfile(profile: FirmNormalizedProfileV2): FirmNormalizedProfileV2 {
  if (profile.contentStage === 'editorial') return profile;
  const copy = PILOT_COPY[profile.slug];
  return copy ? buildPilotProfile(profile, copy) : profile;
}
