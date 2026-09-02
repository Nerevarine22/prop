# SizeProp — Working Research Notes

Status: incremental manual research; not yet normalized for Firestore
Last updated: 2026-09-02

## Sources supplied

- Official website: https://www.sizeprop.com/
- Official rules: https://www.sizeprop.com/our-rules
- X: https://x.com/SizeProp

## Rules shared across all programs

### Time and activity requirements

- **Time limit:** None.
- **Minimum trading days:** None.
- **Consistency rule:** None.
- **Inactivity requirement:** At least one trade must be placed within every 90-day period.

### Profit-target calculation

- The profit target is calculated using **account balance**.
- Unrealized profit from open positions does not count toward completing the profit target.

### Risk-limit calculation

- Risk limits are enforced using **account equity**.
- The daily loss limit resets at **20:00 UTC** under the current rulebook.

### Maximum drawdown

- Maximum drawdown is **static** and is calculated from the starting balance.
- The maximum-drawdown threshold does not trail upward when the account generates profit.
- The May 2026 rules describe the maximum drawdown as **not affected by payouts**.

## Normalization notes for the future database entry

- Keep `profit target basis = balance` separate from `risk limit basis = equity`; these are different mechanisms.
- Store the daily reset time explicitly as `20:00 UTC`, not merely as “daily”.
- Apply these rules at firm level unless later program-specific research documents an exception.
- Preserve the May 2026 qualifier for the payout interaction until the current rulebook version is mapped to an exact review date.

## Programs and pricing

### Degen

- **Program type:** One-step / single-phase evaluation.
- **Number of phases:** 1.
- **Profit target:** 8%.
- **Daily loss limit:** 2%.
- **Maximum loss / maximum drawdown:** 3%, static.

| Account size | Challenge fee |
| ---: | ---: |
| $5K | $19 |
| $10K | $39 |
| $25K | $94 |
| $50K | $177 |
| $100K | $344 |

Example for the $5K account:

- Daily loss allowance: $100.
- Maximum drawdown allowance: $150.
- Profit target: $400.

### 1-Step

- **Program type:** One-step evaluation.
- **Number of phases:** 1.
- **Profit target:** 10%.
- **Daily loss limit:** 3%.
- **Maximum drawdown:** 5%, static.

| Account size | Challenge fee |
| ---: | ---: |
| $5K | $77 |
| $10K | $132 |
| $25K | $299 |
| $50K | $539 |
| $100K | $999 |

### 2-Step

- **Program type:** Two-step evaluation.
- **Number of phases:** 2.
- **Phase 1 profit target:** 5%.
- After Phase 1, the account resets to the starting balance for Phase 2.
- **Phase 2 profit target:** 10%.
- **Daily loss limit:** 4%.
- **Maximum drawdown:** 6%, static; the same threshold applies across both phases.

| Account size | Challenge fee |
| ---: | ---: |
| $5K | $61 |
| $10K | $121 |
| $25K | $299 |
| $50K | $521 |
| $100K | Not offered |

## Profit-split options shared across all programs

- **Base profit split:** 80% to the trader.
- **90% profit split:** Available as a $350 checkout add-on.
- **95% profit split:** Available as a $450 checkout add-on.
- The 90% and 95% options are offered only during checkout.

## Database normalization notes for programs

- Store Degen, 1-Step and 2-Step as three separate program records.
- Store the Phase 1 balance reset as a lifecycle rule for the 2-Step program, not as a drawdown reset.
- Mark the $100K 2-Step tier as `not offered`, not as unknown.
- Keep the base challenge fee separate from the optional profit-split checkout add-on.
- Model the 80%, 90% and 95% profit splits as selectable variants shared by all three programs.

## Checkout and payment methods

- **Promo code:** `IGLOO` commonly provides a 10% discount when active.
- Treat the promo code as a time-sensitive offer rather than a permanent reduction to the documented base prices.
- **Price currency:** Program prices are displayed in USD.
- **Fiat and wallet payment methods:** Card, Apple Pay and Google Pay.
- **Cryptocurrency payment methods:** USDT, USDC, BTC, ETH and SOL.

## Project-specific context

- SizeProp currently presents three products: **Degen**, **1-Step** and **2-Step**.
- The current rules use static maximum drawdown. Earlier versions used a trailing / high-water-mark model, so older third-party descriptions may no longer match the active rulebook.
- The project has a points program and teases a future **$SIZE** token.
- Igloo and Pudgy Penguins backing is used as a prominent marketing and credibility anchor.
- The website describes on-chain payout verification as **“launching soon”**; it should not yet be presented as an available verification feature.

## Normalization notes for project-specific claims

- Store `IGLOO` as a promotional offer with an activity/status field and review date, not as part of the challenge-fee matrix.
- Preserve the distinction between current static drawdown rules and the historical trailing/HWM model.
- Keep the points program and the $SIZE token teaser as separate reward facts; a token teaser does not establish a confirmed token launch or airdrop.
- Record on-chain payout verification as announced or upcoming until the live verification interface can be inspected.

## Positioning versus legal operating model

### How the project presents itself

SizeProp describes itself publicly as a crypto-native proprietary trading firm for perpetual-futures traders. The marketed path is:

1. Pay a one-time evaluation fee.
2. Complete a skill-based trading challenge.
3. Receive access to up to $100,000 in “prop capital”.
4. Retain up to 95% of the resulting profit.

The public positioning emphasizes backing from Igloo Inc. / Pudgy Penguins and execution access associated with Hyperliquid, Trade.xyz and Bybit.

### Legal characterization

The legal language on the same website defines a materially narrower model:

- The service is a simulated educational and skill-evaluation environment.
- User trades are not executed or settled on a live market on the user’s behalf.
- A funded account does not give the trader ownership of real capital, custody of assets or participation in a traditional proprietary-trading desk.
- A payout is characterized as a discretionary reward based on simulated performance.
- The operator is not a broker and does not accept user deposits for live trading.

### Working classification

- **Primary classification:** Retail evaluation prop / skill-challenge platform.
- **Legal framework:** Educational simulation with discretionary performance rewards.
- **Not classified as:** An institutional proprietary-trading desk or broker.

## User lifecycle and account model

1. The user purchases a challenge.
2. The user trades in a simulated account under the documented risk rules.
3. After passing, the user receives a funded-stage simulation governed by the same general risk framework.
4. The firm may pay a USDT reward calculated as a percentage of simulated profit.

- Traditional instant funding is not offered.
- Degen is the closest instant-like product, but it remains a one-phase evaluation with a low entry fee and tighter drawdown limits.
- Maximum capital per account is $100,000.
- No formal scaling plan is documented; access to a larger account requires purchasing a separate challenge.

## First payout flow

1. Complete KYC using an identity document and live selfie.
2. Submit a payout request in USDT on ERC-20.
3. Wait for the request to be reviewed and approved.
4. Receive the approved reward payment.

## Refund and activation rules

- A full refund is available within 24 hours of purchase if no trade has been placed.
- After the first trade, the evaluation fee becomes non-refundable.
- There is no funded-account activation fee.
- The original challenge fee is not automatically refunded with the first funded payout.

## Normalization notes for legal and lifecycle data

- Keep marketing terms such as “prop capital” in quotation marks when explaining the public positioning.
- The canonical account environment should be stored as simulated unless later primary documentation establishes a separate live-execution layer.
- Store payouts as discretionary performance rewards in the legal/model explanation while retaining the user-facing term `payout` for navigation and comparison.
- Do not classify Degen as instant funding; classify it as a low-cost one-step evaluation.
- Separate `maximum capital per account = $100,000` from scaling. The available maximum tier does not establish a scaling plan.

## Payout policy

### Trader share

- The trader receives 80%, 90% or 95% depending on the profit-split option purchased at checkout.
- The base program includes an 80% share; the higher shares are paid checkout upgrades.

### First payout eligibility

- A payout becomes available after reaching the funded stage and generating closed, realized profit above the starting balance.
- Marketing language says a trader may request a payout immediately after the first profitable funded trade.
- There are no minimum trading-day or profit-day requirements before a payout request.

### Frequency and minimum

- Payouts are on demand and do not follow a fixed calendar.
- The firm says traders may request multiple payouts per day.
- No official minimum payout amount is stated in the current policy.
- A company blog gives $10 as an example, but this should not be treated as a canonical minimum without confirmation in the rules or Terms.

### Processing time and observed experience

- The firm says payouts are **usually processed within 24 hours after approval**.
- This wording measures processing after approval and does not necessarily define the time required to reach approval.
- User reviews report examples ranging from approximately 7 to 30 hours. These are anecdotal observations, not guaranteed service levels.
- Some users report that trading is blocked while a payout request is pending. This behavior requires confirmation from primary documentation before being presented as a formal rule.

### Currency, network and fees

- Payouts are made in USDT on ERC-20.
- Support for additional networks is described as roadmap functionality.
- The firm states that the withdrawal cost is approximately $1 in gas fees.

### KYC and position requirements

- KYC is performed once, at the first payout.
- KYC requires an identity document and live selfie.
- KYC is not required when purchasing the challenge.
- All positions must be closed before submitting a payout request.

### Partial withdrawals and account balance

- Partial withdrawals are allowed.
- A payout removes the requested realized profit from the account balance; any balance not withdrawn remains in the account.
- This is a balance reduction caused by the withdrawal, not necessarily a reset to the original starting balance.

### Drawdown interaction and version conflict

- The May 2026 `Our Rules` version says static maximum drawdown is not affected by payouts.
- Older February rules and parts of the FAQ described a trailing/HWM model in which the HWM or daily threshold was reduced by the payout amount.
- This is a critical version conflict. The May 2026 static-drawdown rule should be treated as current, while the older behavior must remain visible as historical documentation.

### Additional eligibility conditions

A payout request depends on all of the following:

- Funded status.
- Closed and realized profit above the starting balance.
- All positions being closed.
- Completion of first-payout KYC.
- No account-rule breach.
- Discretionary approval under the Terms.

There is no separate consistency requirement or profit-day requirement for payout eligibility.

### Account breach and unpaid profit

- Previous completed payouts are not clawed back after a later account breach.
- A company blog says that unrealized or unpaid eligible profit remaining after a breach may be claimed through the normal payout flow.
- Because this statement comes from a blog rather than the complete Terms, it should be presented as a company claim rather than a guaranteed contractual entitlement.

### Legal interpretation

- Legally, a payout is a discretionary reward for simulated performance, not the trader’s ownership share of live-market PnL.
- Marketing language presents the mechanism more simply as the trader retaining a percentage of profit.
- Both descriptions should remain visible so the user can distinguish the commercial explanation from the legal framework.

## Database normalization notes for payouts

- Store the purchased profit-split option separately from payout eligibility and processing.
- Represent frequency as `on-demand`; store the claim of multiple requests per day as an explanatory note.
- Keep the official minimum payout as unknown unless a current primary policy defines it; preserve the blog’s $10 example separately.
- Store `processing within 24 hours after approval` exactly; do not normalize it to an unconditional 24-hour total turnaround.
- Set payout currency/network to `USDT · ERC-20`; label other networks as roadmap.
- Set `positions must be closed = yes`, `partial withdrawals = yes`, and `KYC stage = first payout`.
- Model balance reduction and drawdown-threshold behavior as separate fields.
- Attach the May 2026 and February rule statements to a versioned source discrepancy instead of merging them.
- Store pending-payout trading restrictions and post-breach claims with lower evidence strength until confirmed by current rules or Terms.

## Trading environment and rules

### Terminal and access

- Trading takes place in SizeProp's proprietary web terminal.
- There is no dedicated mobile application; the terminal can be accessed through a mobile browser.
- The user does not receive a personal brokerage or exchange account.

### Infrastructure and execution model

- The trading environment references infrastructure and market data associated with Hyperliquid, Trade.xyz and Bybit order books.
- Execution is simulated, using a hybrid or live-derived price feed.
- Prices may originate from real market order books, but user orders are not routed to or executed on the live market on the user's behalf.

### Tradable assets

- Crypto perpetual futures are supported; a company blog claims more than 100 pairs.
- Stocks, forex and metals are also presented through the Trade.xyz integration.
- The exact current instrument list should be taken from the terminal or a current official instrument table rather than inferred from the broad marketing categories.

### Leverage

- A May 2026 company blog states leverage of **5x for BTC** and **2x for altcoins**.
- Independent reviews sometimes cite leverage between 10x and 20x. These values appear outdated or incorrect and should not override the newer first-party statement.
- Until leverage is confirmed in the current rulebook or terminal, retain the blog date and evidence level alongside the values.

### Trading costs

- SizeProp describes a swap fee rather than a conventional exchange funding-rate mechanism.
- The swap fee applies to both long and short positions.
- The public rulebook does not provide a complete current fee table, so exact rates remain undocumented.

### Permitted activity

- News trading is allowed, with no documented blackout window.
- Weekend and overnight position holding are allowed.
- Frontend bots that automate browser interaction are allowed.
- Cross-asset pair trades are described by the firm as acceptable.
- A mandatory stop loss is not required.

### Prohibited activity

- Copy trading is prohibited.
- High-frequency trading, latency arbitrage and cross-exchange arbitrage are prohibited.
- Hedging opposing positions on the same pair is prohibited.
- There is no public trading API, and reverse-engineering the platform API is prohibited.

### Unclear or undocumented strategy limits

- The current `Our Rules` page does not explicitly prohibit grid or martingale strategies.
- Tight loss limits may make martingale strategies impractical, but this operational consequence should not be presented as a formal ban.
- Third-party reviews mention “non-replicable strategies”; this wording requires confirmation in current primary documentation.
- No separate public maximum-position-size or concurrent-position limit was found beyond leverage and drawdown controls.

### Account, location and access controls

- At least one trade must be placed every 90 days to avoid inactivity.
- The model is one account per trader.
- A complete public policy for IP addresses, VPN use and device changes has not been identified.
- Restricted jurisdictions result in access being blocked.

### Current drawdown calculation

According to the rulebook dated **12 May 2026**:

1. The daily-loss amount is calculated as a percentage of the current balance at 20:00 UTC and remains fixed for the following trading day.
2. Maximum drawdown is calculated as a percentage of the starting balance and remains static.
3. Both limits are monitored continuously against account equity.
4. Open-position profit and loss is always included when testing risk-limit compliance.
5. Breaching either limit automatically closes the account.

## Database normalization notes for trading

- Store `terminal`, `market-data infrastructure` and `execution model` as separate fields.
- Set execution to `simulated` and explain that live-derived prices do not imply live routing of user orders.
- Store crypto perpetuals, stocks, forex and metals as asset classes; keep the blog's `100+ pairs` claim dated and source-qualified.
- Treat `BTC 5x / altcoins 2x` as a dated first-party blog claim until confirmed by a canonical leverage table.
- Do not store older third-party 10x–20x figures as current limits.
- Store trading costs as `swap fee`; leave exact fee rates unknown.
- Represent strategy permissions individually: news trading, weekend holding, overnight holding and frontend automation allowed; copy trading, HFT, latency arbitrage, cross-exchange arbitrage and same-pair hedging prohibited.
- Distinguish allowed browser automation from an unavailable public API and prohibited API reverse engineering.
- Leave grid, martingale, position-size and concurrent-position limits as undocumented rather than inferring formal restrictions.
- Store the daily-loss reference time as `20:00 UTC`, its basis as `current balance`, and enforcement basis as `realtime equity`.
- Store maximum drawdown basis as `starting balance`, type as `static`, and breach consequence as `automatic account closure`.

## Legal entity and availability

### Company identity

- **Legal entity:** SIZ EDU Limited.
- **Registered address:** Cannon Place, North Sound Road, George Town, Grand Cayman KY1-9006.
- **Jurisdiction:** Cayman Islands.
- A third-party review by TheTrustedProp lists company registration number **428744**.
- The registration number has not been verified against an official Cayman Islands registry during this research and must remain marked as third-party reported.

### Product history and team

- The SizeProp product is described as having launched in October 2025.
- Windra Thio is publicly identified as the founder.
- The project refers to a remote-first team.
- PropFirmMap sometimes labels the founder as unknown; this appears to lag behind newer founder coverage in the company blog and The Block.
- The founder attribution should use the newer public evidence while preserving any source-date difference when discussing conflicting directory records.

### Regulatory positioning

- SizeProp is not presented as a licensed broker or investment firm.
- Its disclosures deny that the service provides brokerage, custody, investment advice or issuance of financial products.
- Trustpilot categorizes the business as an `Educational Institution`; this is a platform category, not a regulatory authorization.
- The legal model remains a simulated educational and skill-evaluation service with discretionary rewards.

### Restricted jurisdictions

According to a SizeProp blog post current as of **May 2026**, access is restricted from:

- United Arab Emirates.
- Afghanistan.
- Belarus.
- Myanmar.
- Cambodia.
- Central African Republic.
- China.
- Cuba.
- Democratic Republic of the Congo.
- Ethiopia.
- Eritrea.
- Haiti.
- Iran.
- Iraq.
- Lebanon.
- Libya.
- Nicaragua.
- North Korea.
- Russia.
- Somalia.
- South Sudan.
- Sudan.
- Syria.
- Venezuela.
- Vietnam.
- Yemen.
- Zimbabwe.
- Crimea, Donetsk and Luhansk regions.

Ukraine as a whole is not listed as restricted in that May 2026 publication, while the specifically named occupied regions are restricted.

### Age, KYC and access conditions

- A precise minimum-age clause was not independently extracted from the raw Terms during this research.
- The working assumption is 18+, based on the Terms framework, but this should remain unconfirmed until the exact clause is captured.
- KYC occurs after passing the evaluation and at the first payout, rather than at challenge purchase.
- The service is not offered where its use would be unlawful.

### Terms hierarchy and changeability

- `Our Rules` explicitly describes itself as a simplified summary.
- The Terms and Conditions and FAQ take precedence over the summary when wording differs.
- The Terms may be changed by the operator.
- Payouts remain subject to discretionary approval.
- Because the full raw Terms page is poorly parsed in the public index, the working legal sources are the homepage disclosures, `Our Rules` and the SizeProp help center.

## Database normalization notes for legal and availability data

- Store `SIZ EDU Limited`, its Cayman Islands address and jurisdiction as legal-entity fields.
- Store registration number `428744` with source type `third-party` and verification status `unverified`; do not present it as registry-confirmed.
- Keep product launch date separate from legal-entity incorporation date, which has not been established here.
- Store Windra Thio as the publicly identified founder and retain the dated directory discrepancy as a source note.
- Do not infer licensing from the Trustpilot business category.
- Store restricted jurisdictions as a dated policy snapshot with a review date, not as a permanent firm attribute.
- Represent Ukraine and the named occupied regions separately so Ukraine is not incorrectly classified as wholly restricted.
- Keep minimum age as unknown until the exact Terms clause is captured; `18+` may be shown only as an unconfirmed working assumption.
- Store KYC timing as `after pass / first payout` and distinguish it from purchase eligibility.
- Preserve document precedence: Terms and Conditions and FAQ override the simplified `Our Rules` summary.
- Treat the homepage disclosures, `Our Rules` and `help.sizeprop.com` as the current working legal source set until the complete Terms text is captured reliably.

## Rewards and incentives

### Points program

- SizeProp operates a live points-farming program.
- Points have been awarded for purchasing a challenge, passing an evaluation, receiving a payout and making referrals.
- The program has previously offered a **5x points boost**.
- Its progression tiers run from **Bronze** through **Obsidian**.
- The points program is confirmed by SizeProp's website and the official `@SizeProp` X account.

### $SIZE token status

- Media coverage and posts on X have described `$SIZE` as “hotly anticipated”.
- No live official token, contract address, token supply or utility paper was confirmed during this research.
- `$SIZE` should therefore be classified as a teaser or anticipated future product, not as a launched token.
- No token utility has been officially established in the evidence collected here.

### Airdrop status

- A token airdrop has not been announced as a guaranteed reward.
- Messaging such as “something is coming for point holders” is a teaser and does not establish eligibility, allocation, timing or delivery.
- Points ownership must not be presented as a guaranteed claim on a future token or airdrop.

### Referral and affiliate program

- SizeProp provides a referral portal at `sizeprop.com/referral`.
- A complete public commission schedule has not been identified.
- The existence of the portal confirms a referral mechanism, but not a specific commission rate or payout structure.

### Leaderboards, competitions and promotions

- SizeProp has used points-based activity and account giveaways on X.
- No separate permanent cashback program was identified.
- Promotional codes are available, but temporary discounts should remain separate from rewards and cashback in the data model.

## Database normalization notes for rewards

- Set `points program status = live` and store earning actions individually: purchase, evaluation pass, payout and referral.
- Store the 5x multiplier as a historical or time-limited promotion, not as the permanent base earning rate.
- Store Bronze through Obsidian as points-tier progression only after the complete tier list and thresholds are captured.
- Set `$SIZE token status = teased / not launched`; leave contract address, supply and utility unknown.
- Set `airdrop status = unconfirmed`; do not derive guaranteed eligibility from points ownership or teaser copy.
- Store the referral portal as live while leaving commission rates undocumented.
- Keep account giveaways and competitions as time-limited promotions.
- Set permanent cashback program to `not identified`; keep promo codes in the offers model rather than treating them as cashback.
- Preserve evidence provenance: the points program is first-party confirmed, while token expectations may include media or social interpretation.

## Transparency and reported statistics

The following figures are public company claims, mostly published around May 2026 and subsequently repeated in marketing. They should not be treated as independently audited operating metrics.

| Metric | Company claim | External verifiability |
| --- | --- | --- |
| Funded capital granted | More than $50 million | Not independently verified. This refers to simulated account allocation, not on-chain TVL or deployed trader capital. |
| Funded traders | More than 200 in a company blog; more than 3,500 in a press release | The two public figures materially differ and require source dates and definitions before comparison. |
| Total users / traders signed | More than 2,500; “thousands”; and more than 1,000 within 24 hours are used across landing-page claims | Not audited; the terms `user`, `trader`, `signed up` and `funded trader` may describe different cohorts. |
| Payouts processed | More than 100 | Partially illustrated through Discord screenshots or individual transactions, but not supported by a complete public ledger. |
| Denied payouts | 0 | Company claim; not independently demonstrated. |
| Largest payout | More than $8,500; a landing-page figure shows $8,520 | Supported only by a screenshot or site widget, not a complete payout registry. |
| Average payout | $300–$500 | Self-reported figure. |
| Trading volume | $3 billion | Public-relations claim; not audited. |
| On-chain verification page | Described as “launching soon”; still not live as a complete registry in September 2026 | The announced feature should not be presented as currently available. |
| Smart contracts, proof of reserves or audit | None identified | No public PoR, independent audit or open payout contract was identified in this research. |

### Transparency assessment

- The available operating statistics are primarily marketing claims rather than audited disclosures.
- No complete public proof-of-reserves report, payout ledger, independent operating audit or open payout smart contract was identified.
- Individual payout screenshots and transactions may demonstrate that particular payments occurred, but they cannot establish aggregate payout volume, denial rate or solvency.
- Simulated account allocations must never be presented as assets under management, treasury reserves, on-chain TVL or capital actually deployed to live markets.
- Conflicting trader-count claims may reflect different dates or cohort definitions, but the available material does not establish a reliable reconciliation.

## Database normalization notes for transparency metrics

- Store every reported statistic as a dated claim with its exact source, publication type and wording.
- Add a verification state such as `self-reported`, `partially evidenced`, `independently verified` or `not verified`.
- Keep simulated funded allocation separate from treasury assets, live capital, TVL and assets under management.
- Do not merge users, sign-ups, challenge customers and funded traders into one metric.
- Preserve the `200+` and `3,500+` funded-trader figures as separate source claims until their definitions and dates can be reconciled.
- Treat a payout screenshot or individual transaction as evidence for that payment only, not for aggregate payout or denial statistics.
- Set on-chain payout verification to `announced / not live` based on the September 2026 observation.
- Set proof of reserves, independent audit and public payout-ledger availability to `not identified`, not to a definitive claim that none can exist.

## Red flags and material cautions

1. **Marketing versus legal model.** Marketing invites users to trade with up to $100,000 in prop capital, while the legal disclosures describe a simulated service with discretionary rewards. This difference must be made prominent rather than hidden in legal footnotes.
2. **Material rule changes.** February 2026 material described trailing/HWM drawdown with 7% or 8% limits; the May 2026 rules use static drawdown of 3%, 5% or 6% depending on the program. Parts of the landing experience may still use trailing terminology.
3. **Balance versus equity conflict.** Older blog content said drawdown applied only to closed trades, while the current rulebook enforces risk limits against equity and therefore includes open-position PnL.
4. **Daily reset-time conflict.** A blog cited 04:00 UTC, whereas the current `Our Rules` document sets the daily-loss snapshot at 20:00 UTC.
5. **Document hierarchy and payout discretion.** The Terms override the simplified rulebook and characterize payouts as discretionary, leaving the operator contractual latitude to reject a request even when the user-facing checklist appears satisfied.
6. **Short operating history.** The product has an operating record of approximately 11 months as of this research snapshot.
7. **Jurisdiction and educational wrapper.** A Cayman Islands entity operating through an educational simulation and reward framework carries the familiar regulatory and enforcement uncertainty of retail evaluation-prop platforms.
8. **Unaudited performance claims.** Statements such as more than $50 million in funded allocation and zero denied payouts have not been independently verified.
9. **Token teaser without token documentation.** `$SIZE` is discussed without a confirmed contract address, supply or utility paper.
10. **Anecdotal product complaints.** Users report terminal lag and being unable to trade while a payout is pending. These reports require first-party confirmation and should be labeled anecdotal.
11. **No independent on-chain dashboard.** A complete independently verifiable payout dashboard was not live at the time of review.
12. **Stale third-party directories.** External catalogs repeat figures such as 7%–8% drawdown, 20x leverage or $200,000 capital that conflict with current first-party material. Although not controlled by SizeProp, this information noise makes the product harder to evaluate accurately.

## Green flags and positive operating signals

1. **Named founder.** Windra Thio is publicly identified and has a visible professional background.
2. **Reported institutional backing.** The project has publicly reported pre-seed coverage in The Block and backing associated with Igloo.
3. **Dedicated rules page.** SizeProp publishes a separate `Our Rules` page with calculation examples, improving accessibility compared with terms-only disclosure.
4. **Fewer procedural payout barriers.** No consistency rule, minimum trading days or evaluation time limit is documented, reducing common technical denial vectors.
5. **KYC timing.** Identity verification is deferred until the first payout rather than required before challenge purchase.
6. **Observed USDT payouts.** Trustpilot reviewers report receiving real USDT payments. These reports support individual payout occurrence but do not independently prove the aggregate payout statistics or future approval.
7. **Public review responses.** The firm responds to negative reviews, providing at least a visible channel for dispute handling.
8. **Simulation disclosures.** The simulated nature of the service and warnings that most traders fail are published rather than wholly concealed, even though the marketing presentation is more optimistic.
9. **Limited pre-trade refund window.** A full refund is available within 24 hours when no trade has been placed.
10. **No identified recurring platform fee.** Public materials do not disclose a hidden monthly platform charge after the one-time challenge purchase.

## Database normalization notes for risk signals

- Store red and green flags as review findings with an evidence type, source date and confidence level rather than permanent booleans.
- Give current first-party rule conflicts higher evidentiary weight than third-party reviews or user anecdotes.
- Link the February-to-May drawdown change and the 04:00-to-20:00 UTC reset conflict to the specific affected comparison fields.
- Separate legal discretion from confirmed payout denial; contractual latitude is not evidence that a particular claim was improperly rejected.
- Treat jurisdiction and operating age as context, not proof of misconduct.
- Store terminal-lag and pending-payout trading restrictions as user-reported until reproduced or documented by the firm.
- Do not use Trustpilot payout reports as proof of aggregate solvency, a zero-denial rate or guaranteed future payments.
- Treat named leadership, published rules, public responses and refund terms as positive transparency signals while preserving their limitations.
- Never let green-flag presentation cancel or hide a directly conflicting red-flag disclosure; both should be visible where relevant.

## Reviews and reputation

### Platform snapshots

- **Trustpilot, 1–2 September 2026:** approximately 4.3–4.4 out of 5 from roughly 43–45 reviews.
- The Trustpilot sample is small, so the rating is sensitive to a limited number of new reviews and should not be treated as a stable long-term reputation score.
- **PropFirmMap, 2 September 2026:** Grade C, 4.3 stars, with a reported safety downgrade from B to C.
- PropFirmMap's assessment emphasizes the firm's short operating history and limited review volume.

### Recurring positive review themes

User reviews commonly report:

- Successful receipt of payouts.
- Rules that are comparatively easy to understand.
- No hidden consistency requirement.
- Faster withdrawal experiences than at conventional forex evaluation firms.

These are user-experience reports and do not constitute an independent audit of payout policy, aggregate performance or platform solvency.

### Recurring negative review themes

User complaints include:

- Terminal lag or glitches during an evaluation.
- Payout requests remaining pending.
- Inability to trade while a payout request is pending.
- Suspected unfair account failure caused by technical problems.
- Isolated accusations that the platform is a white-label product, which the firm disputes.

### Reputation interpretation

- Systematic payout denial does not appear to be the dominant Trustpilot complaint theme in this small sample.
- The more consistent concerns relate to platform reliability and payout-processing speed.
- This does not prove that payout denials do not occur; it only describes the visible distribution of complaints in the dated sample.
- SizeProp responds to negative reviews rather than leaving them unanswered.
- Some responses allege that competitors posted fake one-star reviews. The response style is defensive, but the company is visibly engaging with criticism.

## Database normalization notes for reviews

- Store rating, review count, grade and safety score as dated platform snapshots rather than live constants.
- Preserve the approximate ranges for Trustpilot until an exact same-time capture is available.
- Keep Trustpilot and PropFirmMap scores separate; their scales, samples and methodologies are not interchangeable.
- Store positive and negative observations as review themes with counts only when a reproducible review sample is captured.
- Label payout receipt, platform lag, pending-request restrictions and technical-failure claims as user-reported.
- Do not infer a zero-denial rate from the absence of a dominant denial theme.
- Store the white-label allegation and the firm's denial together; do not present either side as independently established.
- Record company response rate and tone separately from resolution quality.
