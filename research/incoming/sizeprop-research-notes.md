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
