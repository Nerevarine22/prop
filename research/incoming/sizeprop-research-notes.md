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
