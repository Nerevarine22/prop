# Doji Funded: Comprehensive Research Brief

## 1. Project Type and Operating Model

Doji Funded is an on-chain proprietary trading infrastructure engineered to support manual traders, systematic strategies, and autonomous agents. Positioned as a "risk orchestration layer," the platform utilizes an on-chain ledger to ensure total transparency; every position and risk event is logged and verifiable via a public explorer.

The model’s core value proposition rests on the total removal of manual intervention in risk enforcement. Unlike traditional firms where breach decisions may be subjective, Doji’s internal risk engine automatically terminates accounts based on immutable, on-chain parameters.

**Core Value Propositions:**
*   **Decentralized Transparency:** All execution history and ledger entries are logged on-chain, eliminating the "black box" nature of traditional prop trading.
*   **Automated Risk Protocols:** Permanent and daily floors are enforced programmatically, removing human bias or manual review from the breach process.
*   **Net Exposure Routing:** The platform aggregates internal ledger activity and routes net exposure to primary on-chain execution venues (GMX and Ostium).
*   **Realistic Execution Simulation:** The environment utilizes live venue pricing and liquidity conditions to simulate a real market, ensuring that evaluation performance translates accurately to live conditions.

## 2. The Trader Lifecycle

The trader journey is divided into four distinct phases, transitioning from wallet-based onboarding to on-chain capital settlement.

*   **Phase 1: Entry:** Users onboard using EVM-compatible wallets (MetaMask, Rabby, etc.) and purchase account access using USDC on the Arbitrum network. This is a one-time fee model with no recurring subscriptions.
*   **Phase 2: Evaluation:** Traders select between 1-Step or 2-Step tracks ($1,000 to $100,000 tiers). The objective is to meet defined profit targets while respecting static and daily drawdown floors. There are no time limits or minimum trading day requirements.
*   **Phase 3: Funding:** Upon reaching the profit target and passing automated compliance checks, accounts achieve "Funded" status. The profit target is removed, and the trader operates within a simulated environment where they are entitled to a share of generated profits.
*   **Phase 4: Compensation:** Traders request payouts via the dashboard. The minimum threshold for the first withdrawal on Instant Funding accounts is 5% profit; all other accounts require a 1% profit minimum. Settlements are paid in USDC on-chain following mandatory KYC verification.

## 3. Risk Mechanics and Calculation Logic

The platform employs a Static Drawdown model, ensuring the risk floor is anchored to the initial account size rather than trailing profit growth.

**Static Drawdown**
The maximum drawdown floor is a fixed value established at the time of account creation. It does not move upward as the account balance increases.
> **Static Floor Formula:** `Starting balance × (1 − max drawdown %)`

**High Water Mark (HWM)**
Drawdown is calculated based on the HWM, defined as the higher of account balance or equity. Because equity is included, open positions impact drawdown in real-time. The **Daily HWM resets at 00:00 UTC**, which is critical for calculating the dynamic daily floor.

**Daily Loss Limit**
Evaluation and funded accounts (excluding Instant Funding) are subject to a daily loss limit. This floor is dynamic and moves upward if a new HWM is established during the trading day.
> **Daily Loss Amount:** `Daily loss % × Initial account size`
> **Daily Floor:** `Day's High Water Mark − Daily loss amount`

**Worked Examples ($100,000 Account, 5% Daily Limit):**
*   **Scenario A:** Starting at $100,000, the daily floor is $95,000. 
*   **Scenario B:** During the day, equity reaches $105,000 (New HWM). The daily floor rises to $100,000 ($105,000 − $5,000). If equity subsequently drops to $99,999, the account is breached.
*   **Scenario C:** If the HWM reaches $110,000, the floor moves to $105,000. The account is terminated if value drops below this level before the 00:00 UTC reset.

## 4. Funding Rules and Offers Table

The following data represents the core account tracks and size-tiers. Note that 2-Step targets follow Section 07 of the Rulebook (10% Step 1 / 5% Step 2).

| Account Type | Size | Entry Cost (Base) | Profit Target (S1/S2) | Daily Loss | Max Drawdown | Min. Payout |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Instant (Soon)** | $1k | $33 | None | None | 5% | 5%* |
| **Instant (Soon)** | $5k | $157 | None | None | 5% | 5%* |
| **Instant (Soon)** | $10k | $304 | None | None | 5% | 5%* |
| **Instant (Soon)** | $25k | $770 | None | None | 5% | 5%* |
| **Instant (Soon)** | $50k | $1,540 | None | None | 5% | 5%* |
| **Instant (Soon)** | $100k | — | — | — | — | — |
| **1-Step** | $1k | $17 | 10% | 3% | 6% | 1% |
| **1-Step** | $5k | $55 | 10% | 3% | 6% | 1% |
| **1-Step** | $10k | $100 | 10% | 3% | 6% | 1% |
| **1-Step** | $25k | $248 | 10% | 3% | 6% | 1% |
| **1-Step** | $50k | $446 | 10% | 3% | 6% | 1% |
| **1-Step** | $100k | $899 | 10% | 3% | 6% | 1% |
| **2-Step Classic** | $1k | — | — | — | — | — |
| **2-Step Classic** | $5k | $45 | 10% / 5% | 3% | 6% | 1% |
| **2-Step Classic** | $10k | $90 | 10% / 5% | 3% | 6% | 1% |
| **2-Step Classic** | $25k | $225 | 10% / 5% | 3% | 6% | 1% |
| **2-Step Classic** | $50k | $407 | 10% / 5% | 3% | 6% | 1% |
| **2-Step Classic** | $100k | $805 | 10% / 5% | 3% | 6% | 1% |
| **2-Step Elite** | $1k | — | — | — | — | — |
| **2-Step Elite** | $5k | $65 | 10% / 5% | 5% | 8% | 1% |
| **2-Step Elite** | $10k | $118 | 10% / 5% | 5% | 8% | 1% |
| **2-Step Elite** | $25k | $268 | 10% / 5% | 5% | 8% | 1% |
| **2-Step Elite** | $50k | $482 | 10% / 5% | 5% | 8% | 1% |
| **2-Step Elite** | $100k | $963 | 10% / 5% | 5% | 8% | 1% |

*\*5% minimum applies specifically to the first withdrawal from Instant Funding accounts.*

**Sub-note on Add-ons:**
Traders can apply add-ons to modify account parameters. The final price is calculated using the following formula:
> `Final price = Base price × (1 + 0.20 × number of add-ons)`

## 5. Trading Permissions and Restrictions

Doji Funded operates with a "guardrail" philosophy—any style is permitted as long as it does not exploit the simulation or violate risk floors.

**Permitted Behaviors**
*   Scalping, Swing Trading, and Position Trading.
*   Algorithmic/Automated Trading and AI-Assisted Systems.
*   Unrestricted overnight and weekend holding.
*   Autonomous agents (as per the planned funding track).

**Prohibited Behaviors**
*   **Cross-Account Hedging:** Opening opposing positions across multiple accounts to guarantee a pass.
*   **Latency Exploitation:** Arbitrage involving pricing errors, oracle manipulation, or execution desync.
*   **Manipulation:** Multi-account manipulation through multiple identities or account sharing.
*   **Strategy Exploitation:** "Unrealistic micro-scalping" tuned to simulation assumptions or strategies that could not run in live markets.
*   **Market Abuse:** Wash trading, spoofing, or intentional liquidity disruption.

**Execution & Account Protocols**
*   **Minimum Duration:** Trades must be held for at least 60 seconds. The platform uses a "two warnings" protocol; a third violation results in a permanent account breach.
*   **Inactivity:** Accounts must execute at least one trade every 30 days to remain active.
*   **Allocation Cap:** Maximum combined starting allocation is $200,000 per trader across all account types.

## 6. Execution, Custody, and Payout Mechanics

Doji Funded operates as a sophisticated "funded trading and risk orchestration layer." While trades are initially recorded in an internal ledger, net exposure is aggregated and routed on-chain to liquidity partners.

*   **Venues:** Execution is handled via GMX (Crypto/Commodities) and Ostium (Forex/Stocks/Indices/Crypto/Commodities).
*   **Asset Leverage:**
    *   Crypto: 5x
    *   Forex: 15x
    *   Indices, Stocks, and Commodities: 10x
*   **Settlement:** Payouts are settled in USDC on the Arbitrum network. 
*   **Profit Share:** The default payout is 80% of generated profits. This can be increased to 90% through account add-ons. 

## 7. Legal and Jurisdictional Framework

*   **Entity:** Dojifunded Inc., a Delaware corporation (Wilmington, DE).
*   **Age Requirement:** 18 years or older.
*   **Restricted Jurisdictions:** The platform does not service users in the United States, North Korea, Iran, Syria, Cuba, Russia, or the sanctioned Ukrainian regions of **Crimea, Donetsk, and Luhansk**.

## 8. Sources, Conflicts, and Unresolved Questions

### Source List
1.  Official rulebook v1.0
2.  Official terms (Updated May 9, 2026)
3.  Official faq
4.  Official pricing checkout
5.  Official payout policy

### Conflicts Identified
*   **Instant Funding Status:** Rulebook v1.0 describes Instant Funding as "Live," while the Pricing Ledger and Payout Policy label it as "Coming Soon."
*   **Profit Targets:** A typo in the "At a Glance" section of the rulebook suggests inconsistent Step-2 targets; however, Section 07 (10% Step 1 / 5% Step 2) is the definitive authority for this brief.

### Unresolved Questions
*   **Processing Time:** Payouts are described as "instant" but remain subject to compliance, rule, and "platform-risk checks." The specific duration for these reviews is not defined.
*   **Positioning Limits:** While leverage is defined by asset class, the exact per-pair limits referenced in the "Available Markets" documentation were not provided for this audit.