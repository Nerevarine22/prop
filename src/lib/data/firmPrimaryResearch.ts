import type { FirmPrimaryResearch, PrimaryResearchObservation } from '@/types/database';

const CHECKED_AT = '2026-08-15T00:00:00.000Z';
const CURRENT_RESEARCH_CHECKED_AT = '2026-08-16T00:00:00.000Z';

type ObservationInput = Omit<PrimaryResearchObservation, 'id' | 'checkedAt'>;

function research(
  slug: string,
  observations: ObservationInput[],
  checkedAt = CHECKED_AT,
): FirmPrimaryResearch {
  return {
    methodology: 'primary-sources-only',
    checkedAt,
    observations: observations.map((observation, index) => ({
      ...observation,
      id: `${slug}-${observation.field}-${index + 1}`,
      checkedAt,
    })),
  };
}

const nd = (field: ObservationInput['field'], sourceUrl: string, notes: string): ObservationInput => ({
  field,
  value: 'ND',
  status: 'ND',
  sourceUrl,
  notes,
});

export const PRIMARY_RESEARCH_BY_SLUG: Record<string, FirmPrimaryResearch> = {
  propr: research('propr', [
    { field: 'officialWebsite', value: 'https://www.propr.xyz', status: 'verified', sourceUrl: 'https://x.com/ProprXYZ' },
    { field: 'rulebook', value: 'Official Rulebook v1.0.5 documents Classic 1-Step, Turbo 1-Step and Classic 2-Step programs.', status: 'reported', sourceUrl: 'https://www.propr.xyz/rules' },
    { field: 'faq', value: 'Rule explanations are incorporated into the official rulebook; no separate FAQ page was located.', status: 'reported', sourceUrl: 'https://www.propr.xyz/rules' },
    { field: 'pricingCheckout', value: 'Rulebook lists $5K-$100K tiers and program-specific fees.', status: 'reported', sourceUrl: 'https://www.propr.xyz/rules' },
    { field: 'terms', value: 'Legal entity, KYC, restricted jurisdictions and simulated-account disclosures are documented in the rulebook.', status: 'reported', sourceUrl: 'https://www.propr.xyz/rules' },
    { field: 'payoutPolicy', value: '80% split; on-demand full-balance USDC payout; $20 minimum; stated processing within 24 hours.', status: 'reported', sourceUrl: 'https://www.propr.xyz/rules' },
    { field: 'tokenRewards', value: 'Project reports 1B fixed $PROPR supply and 13% allocation to XBG stakers; challenge-trader eligibility is not documented.', status: 'reported', sourceUrl: 'https://www.propr.xyz/register-interest' },
  ]),

  foxify: research('foxify', [
    { field: 'officialWebsite', value: 'https://foxify.trade', status: 'verified', sourceUrl: 'https://x.com/foxifytrade', notes: 'The X profile identifies foxify.trade; the official site links back to @foxifytrade.' },
    { field: 'rulebook', value: 'FUNDED is an instant-funded collateral model with no evaluation or KYC. Entry starts with a $100 deposit for $500 FUNDED and Pro with $500 for $2,500. Promotion requires 100 points plus at least 15% P&L against the original balance. Drawdown is fixed from the initial funded balance and varies by track and level.', status: 'reported', sourceUrl: 'https://docs.foxify.trade/' },
    { field: 'rulebook', value: 'Current consolidated documentation lists the minimum trading-days rule as 1 Day.', status: 'conflict', sourceUrl: 'https://docs.foxify.trade/', notes: 'The dedicated official FAQ separately says there is no minimum trading time.' },
    { field: 'rulebook', value: 'Dedicated official FAQ says there is no minimum trading time required.', status: 'conflict', sourceUrl: 'https://docs.foxify.trade/faq-challenge-funding', notes: 'The consolidated documentation separately lists minimum trading days as 1 Day.' },
    { field: 'faq', value: 'Official FAQ explains points-based promotion, the +15% minimum P&L threshold, instant 80% cashout after the points target, inactivity timing and penalties, and liquidation after maximum drawdown is reached.', status: 'reported', sourceUrl: 'https://docs.foxify.trade/faq-challenge-funding' },
    { field: 'pricingCheckout', value: 'Official homepage advertises currently available FUNDED accounts up to $10,000. Pro requires a $500 collateral deposit for $2,500 starting funding and scales through $5,000, $7,500 and $10,000 levels.', status: 'conflict', sourceUrl: 'https://www.foxify.trade/', notes: 'Documentation overview advertises scaling up to $20,000, although its detailed Elite section qualifies the $20,000 track as coming soon.' },
    { field: 'pricingCheckout', value: 'Documentation advertises deposits from $100, up to $5,000 instant starting funding and scaling to $20,000; the detailed $20,000 Elite track is marked coming soon. Current Entry and Pro tracks scale to $10,000.', status: 'conflict', sourceUrl: 'https://docs.foxify.trade/', notes: 'Official homepage markets the currently available maximum as $10,000.' },
    nd('terms', 'https://www.foxify.trade/', 'The footer displays Terms of Service, but its link resolves only to the general documentation homepage. No dedicated first-party Terms text or distinct Terms URL was located.'),
    { field: 'payoutPolicy', value: 'Standard manually traded FUNDED accounts pay an 80% trader share after the 100-point and profit targets are met; settlement is instant, on-chain and in USDC through smart-contract execution. Automated FUNDED Beta accounts separately use a 70% trader / 30% protocol split.', status: 'reported', sourceUrl: 'https://docs.foxify.trade/' },
    { field: 'tokenRewards', value: 'FOX is reported as a deflationary utility token with zero emissions and zero minting. 30% of net trading fees buy FOX from the market and distribute it to stakers. Staked Silver and Gold FOXIFY Trading Co NFTs add 10% and 25% funding respectively when staked before the challenge.', status: 'reported', sourceUrl: 'https://docs.foxify.trade/', notes: 'Dynamic displayed APYs were intentionally omitted.' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  chainfunded: research('chainfunded', [
    { field: 'officialWebsite', value: 'https://www.chainfunded.io', status: 'verified', sourceUrl: 'https://x.com/chainfunded', notes: 'The official site reciprocally identifies twitter.com/chainfunded in its structured data.' },
    { field: 'rulebook', value: 'Two-phase evaluation: Phase 1 target 10%, Phase 2 target 5%; both phases use a 5% daily-loss limit, 10% maximum drawdown and four minimum trading days. Challenge rules are fixed in the smart contract when registered.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/' },
    { field: 'faq', value: 'Official FAQ covers challenge rules, account sizes, payouts, wallets, assets, concurrent challenges, liquidity provision and smart-contract security.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/FAQ' },
    { field: 'pricingCheckout', value: 'One-time USDC evaluation fee with no subscription. Published tiers span $1,000-$200,000 and entry starts at 20 USDC; some tiers unlock as protocol TVL grows.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/' },
    { field: 'terms', value: 'Official Terms and Conditions were last updated April 6, 2026. The provider is MZF Protocol Inc., trading as ChainFunded Labs, organised in Panama; the terms cover the evaluation programme, terminal, funded accounts and Ethereum smart-contract access.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/terms-and-conditions.md' },
    { field: 'payoutPolicy', value: 'Trader share is 80%. The trader submits signed performance proof, the smart contract verifies compliance and transfers USDC on Ethereum from the LP pool; the site states settlement takes seconds and is not subject to a discretionary approval queue.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/' },
    { field: 'tokenRewards', value: 'CFG is the governance token with a fixed 100,000,000 supply and no further minting. Seasonal budgets reward registered challenge accounts and staked CFND liquidity tokens; challenge accounts must be registered for CFG Rewards.', status: 'reported', sourceUrl: 'https://www.chainfunded.io/cfg-rewards' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'solana-funded': research('solana-funded', [
    { field: 'officialWebsite', value: 'https://solanafunded.com', status: 'verified', sourceUrl: 'https://x.com/solanafunded', notes: 'The official website links @solanafunded and the documentation identifies it as the announcement account.' },
    { field: 'rulebook', value: 'Four paths are documented. 1-Step Standard: 45% target, 5 positions, 25% max drawdown, 10% daily drawdown, five days; 1-Step Elite: 50%, unlimited positions, 20%/10%, five days. Standard 2-Step targets 30% then 20%; Elite 2-Step targets 35% then 25%.', status: 'reported', sourceUrl: 'https://docs.solanafunded.com/choose-a-challenge-complete-it-to-prove-your-trading-skills/choose-a-challenge' },
    { field: 'faq', value: 'Homepage FAQ and official help centre cover funding, failed evaluations, tradable Solana tokens, payouts, experience requirements and KYC.', status: 'reported', sourceUrl: 'https://solanafunded.com/', notes: 'Official help centre: https://help.solanafunded.com/.' },
    { field: 'pricingCheckout', value: 'Current 1-Step $2,500 checkout shows an $88 list fee and $61.60 after the applied sf30 coupon. It offers 90% split and payout-cycle add-ons at $12.32 each or $21.56 bundled, and accepts SOL/USDC, MoonPay, Confirmo and cards.', status: 'reported', sourceUrl: 'https://checkout.solanafunded.com/?add-to-cart=249', notes: 'Pricing varies by path and account size.' },
    { field: 'terms', value: 'Homepage markets up to $100K of company capital, a USDC-backed funded account and real on-chain execution.', status: 'conflict', sourceUrl: 'https://solanafunded.com/', notes: 'Terms state all platform activity is simulated and a Funded Account is virtual.' },
    { field: 'terms', value: 'Terms last updated March 16, 2026 identify SolaraX Markets and state evaluations and platform trading are entirely simulated; successful evaluation creates no entitlement to actual capital.', status: 'conflict', sourceUrl: 'https://solanafunded.com/terms-of-service', notes: 'Homepage separately markets company capital and real on-chain execution.' },
    { field: 'payoutPolicy', value: 'Account rules specify 80% standard or up to 90% with an add-on. Standard timing is first payout after 21 days and then every 14 days; the weekly add-on changes both to seven days. Confirmed payouts settle in SOL or USDC on Solana.', status: 'conflict', sourceUrl: 'https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles', notes: 'Homepage FAQ presents 90% and on-demand withdrawals without the standard cycles.' },
    { field: 'payoutPolicy', value: 'Homepage FAQ says funded traders receive a 90% split and can withdraw on demand, with instant SOL or USDC payments.', status: 'conflict', sourceUrl: 'https://solanafunded.com/', notes: 'Account rules define default 80%, standard 21/14-day cycles and paid add-ons.' },
    { field: 'tokenRewards', value: 'SF Points are non-transferable loyalty/performance points with no cash value; they do not expire and may be redeemed for discounts, retries, free challenges and perks.', status: 'reported', sourceUrl: 'https://docs.solanafunded.com/sf-points/what-are-sf-points' },
    { field: 'tokenRewards', value: 'Creator Rewards pays approved X-content campaigns through USDC/SOL bounties and funded-account prizes; no transferable proprietary token was documented.', status: 'reported', sourceUrl: 'https://creators.solanafunded.com/' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  hypernova: research('hypernova', [
    { field: 'officialWebsite', value: 'https://hypernova.xyz', status: 'verified', sourceUrl: 'https://x.com/HypernovaX', notes: 'The official site links @HypernovaX.' },
    { field: 'rulebook', value: 'Rulebook v1.1 defines one-step $5K-$200K assessments. Tight/Low/Medium/High tiers use 9%/10%/10%/10% targets, 3%/3%/4%/5% daily loss and 3%/6%/7%/8% static max drawdown; High Risk is restricted.', status: 'reported', sourceUrl: 'https://hypernova.xyz/rulebook' },
    { field: 'faq', value: 'Official FAQ covers simulated trading, Fast Track, markets, payouts, scaling and verification of the on-chain reserve and stats.', status: 'reported', sourceUrl: 'https://hypernova.xyz/#faq' },
    { field: 'pricingCheckout', value: 'Homepage lists $25K Tight/Low/Medium assessments at $120/$275/$365.', status: 'conflict', sourceUrl: 'https://hypernova.xyz/#pricing', notes: 'Rulebook v1.1 lists Low Risk at $280.' },
    { field: 'pricingCheckout', value: 'Rulebook v1.1 lists $25K Tight/Low/Medium fees at $120/$280/$365; complete schedules span $25-$800 Tight, $60-$1,850 Low and $80-$1,350 Medium, with some prices TBD.', status: 'conflict', sourceUrl: 'https://hypernova.xyz/rulebook', notes: 'Homepage lists $25K Low Risk at $275.' },
    { field: 'terms', value: 'Terms identify Hypernova Systems in the Cayman Islands and define the service as a performance-based payout programme, not a brokerage, investment or custodial account.', status: 'reported', sourceUrl: 'https://hypernova.xyz/docs/terms-of-use' },
    { field: 'payoutPolicy', value: 'Funded traders receive 80% of net profits. On-demand payouts require the account to be in profit, have no stated minimum or waiting period, and settle in USDC on-chain 24/7.', status: 'reported', sourceUrl: 'https://hypernova.xyz/rulebook' },
    { field: 'payoutPolicy', value: 'Homepage live statistics report an average payout time of 6.2 seconds.', status: 'conflict', sourceUrl: 'https://hypernova.xyz/', notes: 'Rulebook states an average under 0.02 seconds.' },
    { field: 'payoutPolicy', value: 'Rulebook states average payout processing under 0.02 seconds.', status: 'conflict', sourceUrl: 'https://hypernova.xyz/rulebook', notes: 'Homepage reports 6.2 seconds.' },
    { field: 'tokenRewards', value: 'Top performers are advertised as unlocking monthly cash grants, increased funding and priority feature access; no proprietary token, points or airdrop page was located.', status: 'reported', sourceUrl: 'https://hypernova.xyz/' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  polyquid: research('polyquid', [
    { field: 'officialWebsite', value: 'https://www.polyquid.xyz', status: 'reported', sourceUrl: 'https://www.polyquid.xyz/', notes: 'The live waitlist site links @polyquid, but reciprocal X-to-site confirmation was unavailable; non-www returned HTTP 403.' },
    nd('rulebook', 'https://www.polyquid.xyz/', 'The live waitlist only states One challenge / Every market / Built on Hyperliquid & Polymarket; no rules or risk parameters are published.'),
    nd('faq', 'https://www.polyquid.xyz/', 'No FAQ link or FAQ content is present.'),
    nd('pricingCheckout', 'https://www.polyquid.xyz/', 'Only waitlist, Discord and X actions are published; no price table or checkout is available.'),
    nd('terms', 'https://www.polyquid.xyz/', 'No Terms, Privacy or legal page is linked, and no sitemap is published.'),
    nd('payoutPolicy', 'https://www.polyquid.xyz/', 'No split, currency, minimum, cadence, eligibility rule or processing time is published.'),
    nd('tokenRewards', 'https://www.polyquid.xyz/', 'No token, points, airdrop, referral or rewards-program page is published.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  alphagrid: research('alphagrid', [
    { field: 'officialWebsite', value: 'https://alphagrid.capital', status: 'verified', sourceUrl: 'https://x.com/AlphaGridProp', notes: 'The X profile links alphagrid.capital and the official site links back to @AlphaGridProp.' },
    { field: 'rulebook', value: 'Challenge uses simulated 10,000 USDC with 15% max drawdown and 5% daily realized-loss cap; Funded uses real 50,000 USDC with 12%/4%; Prime uses real 100,000 USDC with 10%/3%. Challenge to Funded requires 5 trades, score 70 and 14 days; Funded to Prime requires 10 trades, score 75 and 30 days.', status: 'reported', sourceUrl: 'https://docs.alphagrid.capital/agents/progression' },
    { field: 'faq', value: 'Official FAQ covers agent funding, risk enforcement, chains, costs, LP deposits and returns; returns are not guaranteed and agents cannot withdraw LP principal.', status: 'reported', sourceUrl: 'https://docs.alphagrid.capital/resources/faq' },
    { field: 'pricingCheckout', value: 'One-time registration is 0.1 USDC through x402. Agent registration and API trading gas are sponsored; trade intents and current track promotions have no protocol fee; vault deposit/redeem has no protocol fee, but the capital provider pays Arbitrum gas.', status: 'reported', sourceUrl: 'https://docs.alphagrid.capital/overview/pricing' },
    nd('terms', 'https://docs.alphagrid.capital/llms.txt', 'The complete official documentation index and site navigation contain no standalone Terms page.'),
    { field: 'payoutPolicy', value: 'Landing page reports a 70-80% agent profit share depending on track. Technical pricing docs state that exact splits are not hardcoded and depend on each vault policy. Payout method, minimum, cadence and processing time are ND.', status: 'reported', sourceUrl: 'https://alphagrid.capital/', notes: 'https://docs.alphagrid.capital/overview/pricing confirms profit sharing but does not publish payout mechanics or a fixed split.' },
    nd('tokenRewards', 'https://docs.alphagrid.capital/llms.txt', 'No token, points, airdrop or separate rewards-program page exists in the complete official documentation index.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  hyperpnl: research('hyperpnl', [
    { field: 'officialWebsite', value: 'https://hyperpnl.com', status: 'verified', sourceUrl: 'https://x.com/hyperpnl', notes: 'The official website links @hyperpnl.' },
    { field: 'rulebook', value: 'Homepage currently offers 1-Step Flex with a 10% target, 3% max daily drawdown and 5% static max drawdown.', status: 'conflict', sourceUrl: 'https://hyperpnl.com/', notes: 'GitBook describes every challenge as two-phase.' },
    { field: 'rulebook', value: 'GitBook states every challenge has two phases: 10% then 5% targets, 5% daily drawdown, 9% static max drawdown and 2/3 profitable days.', status: 'conflict', sourceUrl: 'https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules', notes: 'Conflicts with the active homepage 1-Step Flex product and 3%/5% limits.' },
    { field: 'rulebook', value: 'Homepage says there are no trading restrictions, while official evaluation rules prohibit multiple accounts and copy trading.', status: 'conflict', sourceUrl: 'https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules', notes: 'Marketing and documentation use incompatible restriction language.' },
    { field: 'faq', value: 'Official GitBook FAQ covers the business model, evaluations, rules, funded accounts, payouts, security and restricted jurisdictions.', status: 'reported', sourceUrl: 'https://hyperpnl.gitbook.io/docs/faq' },
    { field: 'pricingCheckout', value: 'Displayed 1-Step Flex tiers are $5K/$42, $10K/$86 and $25K/$215; $50K and $100K are marked coming soon. Fees are one-time.', status: 'reported', sourceUrl: 'https://hyperpnl.com/' },
    { field: 'terms', value: 'An official Terms of Use page is linked from the homepage.', status: 'reported', sourceUrl: 'https://app.hyperpnl.com/terms', notes: 'The page did not expose readable legal text to the research client.' },
    { field: 'payoutPolicy', value: 'Funded traders receive 80% of eligible profits. One payout may be requested daily with no cycle or waiting window; minimum is 1% of funded account size, positions must be closed, and eligible on-chain payouts are described as automatic and under three seconds.', status: 'reported', sourceUrl: 'https://hyperpnl.gitbook.io/docs/faq/payouts' },
    nd('tokenRewards', 'https://hyperpnl.gitbook.io/docs/llms.txt', 'The complete official documentation index and homepage contain no token, points, airdrop or separate non-payout rewards programme.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  dizso: research('dizso', [
    { field: 'officialWebsite', value: 'https://dizso.com', status: 'verified', sourceUrl: 'https://x.com/dizsofunded', notes: 'The official site reciprocally links @dizsofunded.' },
    nd('rulebook', 'https://dizso.com/en', 'The public site remains a Launching August 2026 early-access landing page and publishes no challenge rules.'),
    nd('faq', 'https://dizso.com/en', 'No FAQ was present in the official navigation or public sitemap.'),
    nd('pricingCheckout', 'https://dizso.com/en', 'Only an early-access email form is available; no program prices or checkout were published.'),
    nd('terms', 'https://dizso.com/en', 'No terms page was present in the official navigation or public sitemap.'),
    nd('payoutPolicy', 'https://dizso.com/en', 'The landing page only markets keeping up to 80% of profits; payout timing, eligibility, minimum, currency, network and processing terms are not published.'),
    nd('tokenRewards', 'https://dizso.com/en', 'No token, points, airdrop or rewards-program page was located.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  hyrotrader: research('hyrotrader', [
    { field: 'officialWebsite', value: 'https://www.hyrotrader.com', status: 'verified', sourceUrl: 'https://x.com/hyrotrader_com', notes: 'Official X and website reciprocally identify each other.' },
    { field: 'rulebook', value: 'One-Step: unlimited duration, five minimum days, 10% target, 4% daily drawdown and 6% max loss. Two-Step targets 10% then 5% with 5% daily drawdown. Controls include a 40% best-day contribution rule, 3% maximum realized loss per trade, no martingale/cross-account hedging and low-cap exposure limits.', status: 'reported', sourceUrl: 'https://www.hyrotrader.com/trading-rules/' },
    { field: 'faq', value: 'Official FAQ covers onboarding, evaluation, rules, restrictions, funded accounts and payouts, swing drawdown, platforms, billing and certificates.', status: 'reported', sourceUrl: 'https://www.hyrotrader.com/faq/' },
    { field: 'pricingCheckout', value: 'Homepage publishes $5K-$200K tiers. Displayed Two-Step fees are $59/$119/$249/$379/$579/$969; a selected $25K Swing upgrade is +$89. The challenge fee is described as refundable with the first payout and there are no monthly fees.', status: 'reported', sourceUrl: 'https://www.hyrotrader.com/' },
    { field: 'terms', value: 'Terms last updated March 24, 2026 identify Hyro Finance, j. s. a. and Hyro Trading s. r. o.; challenge and verification trading is simulated with fictitious funds.', status: 'reported', sourceUrl: 'https://www.hyrotrader.com/terms-and-conditions/' },
    { field: 'payoutPolicy', value: 'Canonical homepage and FAQ report 80% starting split, increasing by 5 points every four months to 90%; $100 minimum after split; requests from the first funded-account trading day; normally 12-24 hours in USDT/USDC with no withdrawal commission.', status: 'conflict', sourceUrl: 'https://www.hyrotrader.com/faq/hyrotrader-account/how-can-i-withdraw-my-profits/', notes: 'A still-live product-category page separately markets a 70-90% range.' },
    { field: 'payoutPolicy', value: 'Official challenge product-category page markets profit splits starting at 70% and scaling to 90%.', status: 'conflict', sourceUrl: 'https://www.hyrotrader.com/product-category/hyro_challenge/', notes: 'Canonical homepage and payout FAQ say standard traders start at 80%.' },
    { field: 'tokenRewards', value: 'Whitepaper reports a 50,000,000-supply ERC-20 $HYRO utility token, including 10% for community/airdrops and 10% for staking rewards/cashbacks. Current launch status, contract and trader eligibility are not documented on live product pages.', status: 'reported', sourceUrl: 'https://www.hyrotrader.com/whitepaper.pdf' },
    { field: 'tokenRewards', value: 'Complementary Accounts FAQ says giveaway, invite-a-friend and team-assigned challenge accounts carry an 80% split and one payout.', status: 'conflict', sourceUrl: 'https://www.hyrotrader.com/faq/hyrotrader-account/complementary-accounts--challenge-rewards/', notes: 'Terms specify 70% for the same category.' },
    { field: 'tokenRewards', value: 'Terms say complimentary challenge accounts may feature a 70% split and normally only one payout.', status: 'conflict', sourceUrl: 'https://www.hyrotrader.com/terms-and-conditions/', notes: 'Dedicated FAQ says 80%.' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  o2: research('o2', [
    { field: 'officialWebsite', value: 'https://www.o2.app', status: 'verified', sourceUrl: 'https://x.com/o2dotapp', notes: 'Official X and trading application reciprocally identify each other.' },
    { field: 'rulebook', value: 'Turbo is instant and on-chain with no evaluation, target or minimum days. A trader pays a non-refundable premium and refundable margin that caps loss. Focused and Broad profiles run for 6h, 1d, 1w or 1mo; liquidation occurs at the threshold and the current FAQ says 1% is deducted from leftover margin.', status: 'reported', sourceUrl: 'https://trade.o2.app/turbo' },
    { field: 'faq', value: 'Turbo page contains official questions on mechanics, plans, fees, markets, expiry/renewal, risk/liquidation, payouts and wallet funding.', status: 'reported', sourceUrl: 'https://trade.o2.app/turbo' },
    { field: 'pricingCheckout', value: 'Live configurator offers Starter, Standard and Pro with Focused/Broad profiles and 6h/1d/1w/1mo terms. Cost is a fixed non-refundable premium plus refundable margin; exact values change by selection. Trading fees are 0.00% maker and 0.01% taker.', status: 'reported', sourceUrl: 'https://trade.o2.app/turbo', notes: 'No static universal price table is published.' },
    { field: 'terms', value: 'Terms last updated December 15, 2025 identify Breathe Speed Inc., cover wallet-based on-chain trading, restricted jurisdictions, liability and arbitration, and specify Panama law.', status: 'reported', sourceUrl: 'https://trade.o2.app/terms-of-use' },
    { field: 'payoutPolicy', value: 'Turbo trader keeps 100% of realized profit with no split, minimum, waiting period, withdrawal charge or manual review. Gains can move to the main account anytime in USDC; ending the account returns margin net of losses and all realized profit.', status: 'reported', sourceUrl: 'https://trade.o2.app/turbo' },
    { field: 'tokenRewards', value: 'Official exchange homepage documents USDC trading competitions and a lifetime o2 Legend Score. Turbo referrals offer tiered shares of referred opening premiums and temporary discounts; no token or airdrop page is published.', status: 'reported', sourceUrl: 'https://www.o2.app/', notes: 'Referral interface: https://trade.o2.app/turbo?tab=referrals.' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'carrot-funding': research('carrot-funding', [
    { field: 'officialWebsite', value: 'https://www.carrotfunding.io', status: 'verified', sourceUrl: 'https://x.com/carrotfunding', notes: 'The official X profile identifies carrotfunding.io and links the site.' },
    { field: 'rulebook', value: 'Formal rulebook: 2-Phase target 5% then 8%, 5% daily loss and 10% max loss; 1-Phase target 8%, 4% daily loss, 8% max loss and 50% Best Day Rule. No time limit or minimum trading days; up to 5x leverage.', status: 'conflict', sourceUrl: 'https://www.carrotfunding.io/rulebook/', notes: 'The formal rulebook and FAQ agree, but the homepage 2-Phase walkthrough separately says max loss below 8%, while its own cards and rulebook specify 10%.' },
    { field: 'rulebook', value: 'Homepage 2-Phase walkthrough states max loss below 8%, while also displaying a $10,000 max loss for the illustrated $100,000 account.', status: 'conflict', sourceUrl: 'https://www.carrotfunding.io/', notes: 'Formal rulebook and FAQ specify 10% max loss for the 2-Phase program.' },
    { field: 'faq', value: 'Official FAQ covers challenge plans, fees, payment methods, drawdowns, prohibited practices, funded accounts, payouts, referrals, points and on-chain transparency.', status: 'reported', sourceUrl: 'https://www.carrotfunding.io/faq/' },
    { field: 'pricingCheckout', value: '2-Phase fees: $5K/$65, $10K/$119, $20K/$239, $50K/$449, $100K/$699. 1-Phase: $5K/$75, $10K/$129, $20K/$249, $50K/$499, $100K/$799. One-time and non-refundable after activation; checkout supports crypto, cards, Apple Pay and Google Pay.', status: 'reported', sourceUrl: 'https://www.carrotfunding.io/rulebook/', notes: 'Payment methods are additionally documented at https://www.carrotfunding.io/faq/.' },
    { field: 'terms', value: 'Terms bind users to CTECHNOLOGIES GAMING DEVELOPMENT - FZCO; services are simulated evaluation programs, not brokerage or investment services; fees are non-refundable; UAE law and DIAC arbitration in Dubai apply.', status: 'reported', sourceUrl: 'https://carrotfunding.gitbook.io/carrotfunding.io-docs/challenge-faq-and-support/terms-and-conditions' },
    { field: 'payoutPolicy', value: 'Rulebook and FAQ report an 80% trader split, on-demand requests, 100 USDC minimum, full payout only, all positions and orders closed, and processing within 24 hours in USDC on Arbitrum.', status: 'conflict', sourceUrl: 'https://www.carrotfunding.io/rulebook/', notes: 'Section 8.3 of the official Terms says payouts may be processed no more frequently than weekly.' },
    { field: 'payoutPolicy', value: 'Terms state payouts, if applicable, may be processed no more frequently than weekly and remain conditional rather than an entitlement.', status: 'conflict', sourceUrl: 'https://carrotfunding.gitbook.io/carrotfunding.io-docs/challenge-faq-and-support/terms-and-conditions', notes: 'Rulebook, homepage and FAQ advertise on-demand payouts at any time, processed within 24 hours.' },
    { field: 'tokenRewards', value: 'Points Program Season 1 reports 50% of CRT supply reserved for the community. Points include 10 per USDC NFT cost, 5 per USDC profit at payout and referral/partner allocations. Weekly Harvest distributes 10% of platform revenue in USDC to the top 10.', status: 'conflict', sourceUrl: 'https://www.carrotfunding.io/docs/community/points-program-season-1/', notes: 'Official FAQ describes a different affiliate and Growth Partner point formula.' },
    { field: 'tokenRewards', value: 'FAQ says affiliates earn 0.5 Carrot Point per USDC of referral revenue and Growth Partners earn 1 point per USDC; points may support future airdrop allocations.', status: 'conflict', sourceUrl: 'https://www.carrotfunding.io/faq/', notes: 'Current Points Program Season 1 page instead calculates these categories as percentages of referred traders’ points.' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'doji-funded': research('doji-funded', [
    { field: 'officialWebsite', value: 'https://app.dojifunded.com', status: 'verified', sourceUrl: 'https://x.com/DojiFunded', notes: 'The X profile identifies app.dojifunded.com; first-party documentation links back to @DojiFunded.' },
    { field: 'rulebook', value: 'Rulebook v1.0 Live covers Instant Funding, 1-Step, 2-Step Classic and 2-Step Elite accounts from $1,000 to $100,000. All use static drawdown measured on a balance/equity high-water-mark basis. Max/daily drawdown: Instant 5%/none, 1-Step 6%/3%, Classic 6%/3%, Elite 8%/5%.', status: 'reported', sourceUrl: 'https://docs.dojifunded.com/resources/rules-risk-parameters' },
    { field: 'faq', value: 'FAQ reports funding up to $100,000, a $200,000 maximum combined starting allocation, purchases in USDC on Arbitrum, automated trading support subject to anti-abuse rules, and a 60-second minimum position duration with warnings before breach.', status: 'reported', sourceUrl: 'https://docs.dojifunded.com/getting-started/faq', notes: 'The supplied app FAQ route renders only the application shell to non-interactive retrieval; the dedicated first-party documentation FAQ contains the published answers.' },
    { field: 'pricingCheckout', value: 'One-time base pricing: $1K Instant $33 and 1-Step $17; $5K $157/$55/$45/$65; $10K $304/$100/$90/$118; $25K $770/$248/$225/$268; $50K $1,540/$446/$407/$482; $100K 1-Step $899, Classic $805, Elite $963. Each add-on increases base price by 20%.', status: 'reported', sourceUrl: 'https://docs.dojifunded.com/account-pricing', notes: 'Instant Funding is marked coming soon and is not offered at $100K; Classic and Elite are not offered at $1K.' },
    { field: 'terms', value: 'Terms of Use, last updated May 9, 2026, require age 18+, permit KYC/compliance checks and make KYC mandatory before funded-account payouts. Evaluation fees are generally non-refundable after trading begins; restricted jurisdictions are published.', status: 'reported', sourceUrl: 'https://docs.dojifunded.com/legal/terms-of-use' },
    { field: 'payoutPolicy', value: 'Payouts are requested through the dashboard and settled on-chain to the selected wallet. Profit share is 80% or 90% depending on add-ons. Minimum withdrawal profit is 1% for 1-Step and both 2-Step plans; Instant Funding, marked coming soon, requires 5%. Terms state eligible payouts are processed in USDC after compliance, rule and platform-risk checks.', status: 'reported', sourceUrl: 'https://docs.dojifunded.com/platform/payouts' },
    nd('tokenRewards', 'https://docs.dojifunded.com/llms.txt', 'The complete first-party documentation index contains no token, rewards, loyalty or airdrop page.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  'hyper-stack': research('hyper-stack', [
    { field: 'officialWebsite', value: 'https://www.hyperstack.trade', status: 'verified', sourceUrl: 'https://x.com/hyper_stack', notes: 'The website links @hyper_stack.' },
    { field: 'rulebook', value: 'Vanta-powered simulated one-step challenge: 10% target, 5% intraday daily-loss limit, 5% EOD trailing-loss limit, no fixed time limit, but elimination after 30 inactive days. News, weekend and algorithmic trading are allowed.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/rules' },
    { field: 'faq', value: 'Official FAQ covers the challenge, scaled accounts and rewards, KYC, platform mechanics and trading fees.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/faq' },
    { field: 'pricingCheckout', value: '$1K/$0, $5K/$74, $10K/$135, $25K/$309, $50K/$579 and $100K/$999; fees are paid to Vanta in USDC.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/pricing' },
    { field: 'terms', value: 'Terms identify the challenge as a simulated Vanta evaluation. Hyperstack is an authorized marketing partner; Vanta operates the challenge, receives payments and decides eligibility.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/terms' },
    { field: 'payoutPolicy', value: 'Rules state a monthly payout cycle and 90/10 split of eligible performance rewards, paid as independent-contractor compensation based on simulated performance.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/rules' },
    { field: 'payoutPolicy', value: 'Marketing states hitting the target activates a scaled account immediately and qualified participants receive automatic on-chain USDC rewards every 30 days, keeping 90%.', status: 'conflict', sourceUrl: 'https://www.hyperstack.trade/', notes: 'Terms make invitation and compensation discretionary.' },
    { field: 'payoutPolicy', value: 'Terms state passing does not guarantee a Scaled Trader invitation or compensation; invitation is at Vanta’s discretion and requires a separate ICA/KYC.', status: 'conflict', sourceUrl: 'https://www.hyperstack.trade/terms', notes: 'Marketing advertises immediate activation and automatic rewards.' },
    { field: 'tokenRewards', value: 'Rewards are USDC performance compensation, not a proprietary token. Scaling requires a 5% quarterly return and Sharpe above 1; a 25% realized-PnL quarterly bonus is documented at 2% return and Sharpe above 1.', status: 'reported', sourceUrl: 'https://www.hyperstack.trade/rules' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'vanta-trading': research('vanta-trading', [
    { field: 'officialWebsite', value: 'https://www.vantatrading.io', status: 'verified', sourceUrl: 'https://x.com/VantaTrading', notes: 'The official footer links @VantaTrading.' },
    { field: 'rulebook', value: 'Rules and FAQ state a 10% one-step target across tiers, two static 5% loss limits, no time limit or minimum days and a 60-day initial activity requirement.', status: 'conflict', sourceUrl: 'https://www.vantatrading.io/rules', notes: 'The live homepage Kickstarter card displays an 8% target.' },
    { field: 'rulebook', value: 'The live homepage Kickstarter $1K card displays an 8% target and 5% maximum drawdown.', status: 'conflict', sourceUrl: 'https://www.vantatrading.io/', notes: 'Pricing page, FAQ and rulebook display 10%.' },
    { field: 'faq', value: 'Official FAQ covers evaluation and scaled-account rules, KYC, leverage, permitted strategies, weekly rewards, pricing/payment methods, scaling and safety.', status: 'reported', sourceUrl: 'https://www.vantatrading.io/faq' },
    { field: 'pricingCheckout', value: 'Current one-time fees: $1K/$9, $5K/$24 promo ($59 list), $10K/$39 ($99), $25K/$84 ($199), $50K/$159 ($349), $100K/$299 ($599). Cards/bank use Stripe and crypto uses NowPayments.', status: 'reported', sourceUrl: 'https://www.vantatrading.io/pricing' },
    { field: 'terms', value: 'Terms effective February 10, 2026 bind users to Taoshi VT Services in the Cayman Islands. Challenges use simulated assets; fees become non-refundable after opening; passing does not guarantee invitation to the separate Network Trader Program or ICA.', status: 'reported', sourceUrl: 'https://www.vantatrading.io/terms-of-service' },
    { field: 'payoutPolicy', value: 'Rules say a Scaled Account activates immediately after passing; rewards are paid every seven days at a 100% split with no minimum and on-chain verification. FAQ says an entitled payout cannot be denied.', status: 'conflict', sourceUrl: 'https://www.vantatrading.io/rules', notes: 'Terms make invitation discretionary and payout economics informational.' },
    { field: 'payoutPolicy', value: 'Terms state passing does not guarantee Network Trader invitation; invitation is discretionary and requires a separate ICA. Website payout, split, scaling, bonus and timeline descriptions are informational only.', status: 'conflict', sourceUrl: 'https://www.vantatrading.io/terms-of-service', notes: 'Rulebook and FAQ state immediate activation and guaranteed weekly rewards.' },
    { field: 'tokenRewards', value: '2X Rewards pays eligible Scaled-account rewards at 200% while a finite $200,000 pool remains; rules also document a quarterly 25% realized-PnL bonus. No proprietary trader token or airdrop is documented.', status: 'reported', sourceUrl: 'https://www.vantatrading.io/2x-rewards', notes: 'Quarterly bonus source: https://www.vantatrading.io/rules.' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  size: research('size', [
    { field: 'officialWebsite', value: 'https://www.size.club', status: 'verified', sourceUrl: 'https://x.com/sizedotclub', notes: 'Official documentation links @sizedotclub.' },
    { field: 'rulebook', value: 'A Key enters a 15-minute Trial on live markets; first place awards a simulated funded Life. The available Alpha Life is $100. Life limits are 5% daily/10% total drawdown for Alpha-Gold and 4%/8% for Diamond/Ruby.', status: 'reported', sourceUrl: 'https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives' },
    { field: 'faq', value: 'Official FAQ covers Trials, Lives, drawdowns, payouts, Wallet/Store, fees, XP, Preseason, payout token, identity verification and referrals.', status: 'reported', sourceUrl: 'https://www.size.club/docs/help/faq' },
    { field: 'pricingCheckout', value: 'Product docs list Alpha $1/$100 Life, Bronze $9/$1K, Silver $49/$5K, Gold $199/$25K, Diamond $799/$100K and Ruby $1,499/$200K.', status: 'conflict', sourceUrl: 'https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives', notes: 'Terms list Bronze Key as Free.' },
    { field: 'pricingCheckout', value: 'Terms schedule lists Alpha $1/$100, Bronze Free/$1K, Silver $49/$5K, Gold $199/$25K, Diamond $799/$100K and Ruby $1,499/$200K.', status: 'conflict', sourceUrl: 'https://www.size.club/legal/terms-of-service.pdf', notes: 'Product docs list Bronze at $9.' },
    { field: 'terms', value: 'Terms operated by Trench Labs Group Ltd., effective June 30, 2026, define Size as a simulated skill-based entertainment service; it is non-custodial, supports USDC on HyperEVM and restricts listed jurisdictions.', status: 'reported', sourceUrl: 'https://www.size.club/legal/terms-of-service.pdf' },
    { field: 'payoutPolicy', value: 'Payouts are on demand with no review-cycle window; $5 minimum, partial payouts, USDC smart-contract settlement to the Size wallet and no Size payout fee. External wallet withdrawal costs $1. Tier splits range 60-85%; Alpha is 80%.', status: 'reported', sourceUrl: 'https://www.size.club/docs/after-you-win/profit-split-and-payouts' },
    { field: 'tokenRewards', value: 'XP is a permanent score earned through Trial wins, payouts, referrals, Key purchases, Practice and missions. Preseason uses XP standings for funded-Life prizes; no proprietary liquid token or airdrop is documented.', status: 'reported', sourceUrl: 'https://www.size.club/docs/progress-and-preseason/xp-leveling-and-achievements' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  breakout: research('breakout', [
    { field: 'officialWebsite', value: 'https://www.breakoutprop.com', status: 'verified', sourceUrl: 'https://x.com/breakoutprop', notes: 'The official X profile identifies Breakout and breakoutprop.com.' },
    { field: 'rulebook', value: 'Formal Program Rules: 1-Step Classic target/drawdown/daily loss 10%/6%/3%; Pro 12%/5%/3%; Turbo 9%/3%/3%. 2-Step targets 5% then 10%, static drawdown 6%, daily loss 4%. No minimum or maximum duration. BTC/ETH leverage 5x and other instruments 2x.', status: 'conflict', sourceUrl: 'https://checkout.breakoutprop.com/program-rules/', notes: 'Current homepage says 3% daily loss across all products and advertises leverage up to 10x, conflicting with the formal 2-Step 4% daily limit and formal 5x/2x leverage rules.' },
    { field: 'rulebook', value: 'Current homepage reports profit targets of 9-12%, 3% daily loss across all products, 3-6% static drawdown and leverage up to 10x.', status: 'conflict', sourceUrl: 'https://www.breakoutprop.com/', notes: 'Program Rules retain a 4% daily loss for 2-Step and 5x BTC/ETH plus 2x for other instruments; the pricing page separately says major-market leverage up to 5x.' },
    { field: 'faq', value: 'Official Help Center contains Evaluation and Funded Trader collections covering rules, drawdowns, fees, leverage, KYC, prohibited practices, payouts and trading conditions.', status: 'reported', sourceUrl: 'https://intercom.help/breakoutprop/en/' },
    { field: 'pricingCheckout', value: 'One-time fees start at Turbo $20, Pro $33 and Classic $45. Official comparison lists $100K prices: Turbo $330, Pro $545, Classic $800. Standard split is 80/20; a permanent 90/10 upgrade is available only at checkout, but its current added price is not publicly stated.', status: 'reported', sourceUrl: 'https://tools.breakoutprop.com/breakout' },
    { field: 'terms', value: 'Terms of Use, last revised June 10, 2025, bind users to Breakout Trading Group, LLC; minimum age is 18; purchases are generally non-refundable; separate Additional Terms may control specific products.', status: 'reported', sourceUrl: 'https://www.breakoutprop.com/terms-of-use/' },
    { field: 'payoutPolicy', value: 'Pricing and marketing pages advertise on-demand 24/7 payouts, $50 minimum after split, USDC on Ethereum ERC-20, and no approval delays or approval wait.', status: 'conflict', sourceUrl: 'https://www.breakoutprop.com/pricing/', notes: 'Funded Trader FAQ explicitly says POL must approve the payout before the trader supplies an ERC-20 wallet address.' },
    { field: 'payoutPolicy', value: 'A funded trader requests at least $50 after the split with no open positions or breach; the amount is deducted immediately, but POL approval is required before the USDC ERC-20 payment step.', status: 'conflict', sourceUrl: 'https://intercom.help/breakoutprop/en/articles/11647224-when-can-i-request-a-payout-from-my-funded-account', notes: 'Official pricing and homepage claim no approval wait, queue or delays.' },
    nd('tokenRewards', 'https://www.breakoutprop.com/', 'No official proprietary token, points, airdrop or trader rewards-program page was located across the site, Program Rules and Help Center.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  'funded-hive': research('funded-hive', [
    { field: 'officialWebsite', value: 'https://fundedhive.com', status: 'verified', sourceUrl: 'https://x.com/FundedHive', notes: 'The official X account identifies and links fundedhive.com.' },
    { field: 'rulebook', value: 'General Terms and annexes govern Classic 2-Step, Pay From Profits 1-Step/2-Step, InstantGrowth, AADS routing, drawdowns and payout eligibility; parameters vary by product and risk category.', status: 'reported', sourceUrl: 'https://fundedhive.com/downloads/terms-and-conditions.pdf' },
    { field: 'faq', value: 'Official searchable FAQ covers products, rules, smart contracts, AADS and payouts.', status: 'reported', sourceUrl: 'https://fundedhive.com/faq' },
    { field: 'pricingCheckout', value: 'Displayed Pay After You Pass 1-Step access fees are $19/$39/$99/$149/$249/$399 for $5K/$10K/$25K/$50K/$100K/$200K; later funded fee depends on risk category and can equal 1-3% of account size.', status: 'reported', sourceUrl: 'https://fundedhive.com/funding-models' },
    { field: 'terms', value: 'Official General Terms and product annexes are published as a 41-page PDF effective January 2026.', status: 'reported', sourceUrl: 'https://fundedhive.com/downloads/terms-and-conditions.pdf' },
    { field: 'payoutPolicy', value: 'Only verified positive A-Book PnL is withdrawable. Terms specify $50 minimum, USDC ERC-20, user-paid ETH gas, closed positions, split/fee-debt deductions and daily caps of $1,000 for Classic/PFP or $2,000 for Instant.', status: 'reported', sourceUrl: 'https://fundedhive.com/downloads/terms-and-conditions.pdf' },
    { field: 'payoutPolicy', value: 'Marketing states payouts are automatic, require no manual approval and are sent within 60 seconds.', status: 'conflict', sourceUrl: 'https://fundedhive.com/', notes: 'Terms permit reversals, suspensions, withholding and verification delays.' },
    { field: 'payoutPolicy', value: 'Terms allow cancellation, correction, reversal or clawback and suspension/withholding in specified circumstances; verification or third-party delays may apply.', status: 'conflict', sourceUrl: 'https://fundedhive.com/downloads/terms-and-conditions.pdf', notes: 'This qualifies the homepage no-approval/no-delay claim.' },
    { field: 'tokenRewards', value: 'A 200% challenge-fee refund may be issued in Hive Coins; Hive Coins can cover up to 50% of another challenge. Eligible B-Book profits may convert to Hive Coin, described as a utility token. Approved payouts mint NFT certificates.', status: 'reported', sourceUrl: 'https://fundedhive.com/downloads/terms-and-conditions.pdf' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'klein-funding': research('klein-funding', [
    { field: 'officialWebsite', value: 'https://kleinfunding.com', status: 'verified', sourceUrl: 'https://x.com/KleinFunding', notes: 'Official X and site footer reciprocally identify each other.' },
    { field: 'rulebook', value: 'Rules are configurable. Bybit programs publish 6-10% targets, 6-10% static drawdown, daily drawdown at half max drawdown, 30% one-phase/45% two-phase stability and up to 1:100 leverage. Cleo publishes 9-14% targets, 3-8% drawdown, 3-4% daily drawdown, no stability and up to 1:5 leverage. Instant Pro has separate payout-day rules.', status: 'reported', sourceUrl: 'https://kleinfunding.com/pricing', notes: 'Prohibited practices: https://kleinfunding.com/general-rules.' },
    { field: 'faq', value: 'Official FAQ covers eligibility, evaluation, drawdowns, funded payouts, payout methods, stability, platform rules, prohibited strategies, Instant Pro and Cleo.', status: 'reported', sourceUrl: 'https://kleinfunding.com/faqs' },
    { field: 'pricingCheckout', value: 'Live configurator offers Cleo Standard/Flex, Bybit Standard One/Two-Step and Instant Pro. Sizes range from $1,250 Instant Pro to $100,000 evaluations; selected Cleo One-Step $5,000 displays $66 list and $52.25 current. Cards and crypto are accepted.', status: 'reported', sourceUrl: 'https://kleinfunding.com/pricing', notes: 'Prices are live and option-dependent.' },
    { field: 'terms', value: 'Terms identify KUENTECH LLC, require age 18+, incorporate FAQ/help/product rules by reference, describe accounts as simulated, permit KYC/compliance review and allow suspension, payout rejection or profit adjustment. A separate all-sales-final refund policy applies.', status: 'reported', sourceUrl: 'https://kleinfunding.com/terms-of-use' },
    { field: 'payoutPolicy', value: 'Pricing reports 60-90% configured shares for Bybit/Cleo and 70-90% for Instant Pro. Bybit/Cleo rewards are on demand; Instant Pro requires three 0.5% profitable days and 4% minimum profit. Methods include bank, Wise, USDT, BTC and ETH.', status: 'conflict', sourceUrl: 'https://kleinfunding.com/pricing', notes: 'How It Works advertises 40-100% and up to 100%.' },
    { field: 'payoutPolicy', value: 'How It Works advertises on-demand payouts, a 40-100% split range, up to 100% of simulated profits and processing in 4-12 hours.', status: 'conflict', sourceUrl: 'https://kleinfunding.com/how-it-works', notes: 'Pricing matrix caps displayed configured splits at 90%.' },
    { field: 'payoutPolicy', value: 'Rewards page advertises a 48-hour guarantee: if unpaid after 48 hours, trader receives a 100% split; displayed average payout time is three hours.', status: 'reported', sourceUrl: 'https://kleinfunding.com/rewards-and-testimonials' },
    nd('tokenRewards', 'https://kleinfunding.com/sitemap.xml', 'No token, points, airdrop or separate community-rewards programme was found; the site uses rewards for performance payouts and promotional accounts.'),
  ], CURRENT_RESEARCH_CHECKED_AT),

  'cf-trader': research('cf-trader', [
    { field: 'officialWebsite', value: 'https://cryptofundtrader.com', status: 'verified', sourceUrl: 'https://x.com/CFTradercom', notes: 'The live official-site footer reciprocally links @CFTradercom; a stale structured-data X reference returns 404.' },
    { field: 'rulebook', value: 'Official FAQ documents model-specific rules: 2-Phase targets 8% then 5%, 5% daily loss and 10% fixed overall loss; 1-Phase has a 10% target, 4% daily loss and 6% balance-based trailing drawdown. No maximum time limit or minimum trading days; HFT, tick scalping, latency/arbitrage and gambling-style trading are prohibited.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/faq/' },
    { field: 'faq', value: 'Official FAQ covers evaluation stages, account rules, platforms, instruments, leverage, prohibited strategies, KYC and scholarship-reward withdrawals.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/faq/' },
    { field: 'pricingCheckout', value: 'Published account sizes depend on model and span $2,500-$200,000. Terms list 2-Phase fees of $58-$1,250 for $5K-$200K, 1-Phase fees of $40-$1,199 for $5K-$200K, and Instant fees of $125-$475 for $2.5K-$10K.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/terms-and-conditions/' },
    { field: 'terms', value: 'Official Terms identify SWISS RLCRATES AG in Zug and describe the service as education and simulated trading using demo funds; KYC and a signed contract are required before a performance-based scholarship reward can be processed.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/terms-and-conditions/' },
    { field: 'payoutPolicy', value: 'Standard final-stage scholarship rewards may be requested after at least 15 traded days or every 30 calendar days; the Weekly Payouts add-on permits every 7 traded days. KYC approval and closed trades are required. Methods include EUR/USD bank transfer, USDT ERC20/TRC20, BTC and ETH; stated processing averages about 8 hours with up to 48 business hours.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/faq/' },
    { field: 'tokenRewards', value: 'Competitive Ranking awards ELO for successful trades, passed phases and scholarship requests. Displayed Season IV prizes include cash, Ascend evaluations, TradingView Essential and custom titles. No proprietary token or airdrop is documented on this rewards page.', status: 'reported', sourceUrl: 'https://cryptofundtrader.com/competitive-ranking/' },
  ], CURRENT_RESEARCH_CHECKED_AT),

  'upscale-trade': research('upscale-trade', [
    { field: 'officialWebsite', value: 'https://upscale.trade', status: 'verified', sourceUrl: 'https://x.com/UpscaleTrade', notes: 'The official site and documentation reciprocally link @UpscaleTrade.' },
    { field: 'rulebook', value: 'Basic is two stages with 5% then 8% targets, 5% daily and 10% max drawdown; Accelerated is one stage with 10% target and 3%/6%; Turbo is instant with no target or daily drawdown and 6% trailing max drawdown. Funded allocation cap is $400K.', status: 'reported', sourceUrl: 'https://docs.upscale.trade/how-to-join-upscale/participation_requirements' },
    { field: 'rulebook', value: 'Current rules define a profit day using at least 0.5% balance change and explicitly include unrealized PnL.', status: 'conflict', sourceUrl: 'https://docs.upscale.trade/how-to-join-upscale/participation_requirements', notes: 'FAQ says only realized profit and closed trades count.' },
    { field: 'rulebook', value: 'FAQ defines a profitable day as realized profit of at least 0.5% of initial balance and only closed trades count.', status: 'conflict', sourceUrl: 'https://upscale.trade/faq', notes: 'Current rules include unrealized PnL.' },
    { field: 'faq', value: 'Official FAQ covers onboarding, KYC claims, models, price tables, payments, risk, leverage, fees, funded accounts, withdrawals, referrals and tournaments.', status: 'reported', sourceUrl: 'https://upscale.trade/faq' },
    { field: 'pricingCheckout', value: 'Published fees: Basic $59-$1,499, Accelerated $69-$1,599 and Turbo $199-$1,099, varying by size and market selection. Payments include Telegram Stars, TON, USDT networks, USDC, ETH, BNB, TRX and SBP.', status: 'reported', sourceUrl: 'https://upscale.trade/faq' },
    { field: 'terms', value: 'FAQ claims no geographic restrictions and worldwide availability.', status: 'conflict', sourceUrl: 'https://upscale.trade/faq', notes: 'Terms exclude US residents and sanctions-connected persons.' },
    { field: 'terms', value: 'Terms last updated May 15, 2026 describe software and professional-development services, not a financial institution. Eligibility excludes US residents and sanctions-connected persons.', status: 'conflict', sourceUrl: 'https://app.upscale.trade/terms-of-use-upscale.pdf', notes: 'FAQ says there are no geographic restrictions.' },
    { field: 'payoutPolicy', value: 'Withdrawals require 14 calendar days, five profit days, no breach and at least $1 available; USDT on TON/Base/BSC; standard split 80% or 90% upgrade; size-dependent per-cycle caps apply.', status: 'reported', sourceUrl: 'https://docs.upscale.trade/how-upscale-works/withdrawal_rules' },
    { field: 'payoutPolicy', value: 'Homepage and FAQ say registration and withdrawals require no KYC and pay directly to a non-custodial wallet.', status: 'conflict', sourceUrl: 'https://upscale.trade/faq', notes: 'Terms require passport and live-selfie KYC before withdrawal.' },
    { field: 'payoutPolicy', value: 'Terms require passport and live-selfie KYC; review may take up to 48 business hours and requests remain Pending KYC until approval.', status: 'conflict', sourceUrl: 'https://app.upscale.trade/terms-of-use-upscale.pdf', notes: 'Homepage and FAQ advertise withdrawals without KYC.' },
    { field: 'tokenRewards', value: 'FAQ documents free-challenge tournament prizes, a one-time 20% discount after a demo payout and a tiered referral programme. No proprietary token, transferable points or airdrop is documented.', status: 'reported', sourceUrl: 'https://upscale.trade/faq' },
  ], CURRENT_RESEARCH_CHECKED_AT),
};

const REQUIRED_FIELDS: PrimaryResearchObservation['field'][] = [
  'officialWebsite',
  'rulebook',
  'faq',
  'pricingCheckout',
  'terms',
  'payoutPolicy',
  'tokenRewards',
];

for (const [slug, ledger] of Object.entries(PRIMARY_RESEARCH_BY_SLUG)) {
  const presentFields = new Set(ledger.observations.map((observation) => observation.field));
  const missingFields = REQUIRED_FIELDS.filter((field) => !presentFields.has(field));

  if (missingFields.length) {
    throw new Error(`Incomplete primary research for ${slug}: ${missingFields.join(', ')}`);
  }
}
