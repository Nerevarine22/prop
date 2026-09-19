# Research Brief: Upscale Trade Proprietary Trading Model

### 1. Project Identity and Operating Model
Upscale Trade is an information technology platform dedicated to the evaluation of trading skills and competencies. Operating as a proprietary trading model, it is explicitly not a financial institution, bank, brokerage, or custodian. The platform does not hold client deposits, manage investment funds, or provide brokerage services. 

The core of the operation is a **Simulated Environment**. All trading activity occurs with "notional capital" within a simulation; no real market orders are executed. Consequently, payouts to users are legally categorized as compensation for independent contractor services provided to the platform. 

**Jurisdictional Note:** While marketing materials and the official FAQ state the platform operates from Dubai, the legal "Terms of Use" specify that the platform is governed by the laws of the **Republic of Seychelles**, with all arbitration proceedings seated in Victoria, Seychelles.

### 2. The Trader Lifecycle: From Onboarding to Payout
The progression of a trader on the Upscale platform follows a rigid operational workflow:

*   **Entry:** Users select a challenge track (Basic, Accelerated, or Turbo), specify an asset category (Crypto, RWA, or ALL Markets), and choose a notional account size.
*   **Evaluation:** Traders must meet specific profit targets while adhering to risk parameters.
    *   **Basic:** Requires passage of Phase 1 (5% target) and Phase 2 (8% target).
    *   **Accelerated:** Requires passage of a single phase (10% target).
    *   **Turbo:** Bypasses evaluation, providing immediate access to simulated funding.
*   **Funding Activation:** Upon passing evaluation, the account is upgraded to "Funded" status. During this transition, the system executes an automatic closure of all open positions and cancels all pending limit orders to reset the account baseline.
*   **Execution and Risk Maintenance:** Traders manage the funded account within strict daily and maximum drawdown limits. **Critically, drawdown is recorded in real-time based on the moment it occurs, including unrealized PnL.** Consistency is monitored via "Profit Days" and specific payout dilution rules.
*   **Compensation:** After a 14-day "Trading Iteration" and the achievement of five profit days, the trader may request a withdrawal.

### 3. Funding Rules and Offers

#### Upscale Trade Funding Offers
| Track Type | Account Size ($) | Entry Cost (RWA) | Stages | Profit Targets | Daily Loss | Max Drawdown | Drawdown Type | Min Profit Days |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Basic** | $5,000 | $59 | 2 | 5% / 8% | 5% | 10% | Static | 3 / 5 |
| **Basic** | $10,000 | $99 | 2 | 5% / 8% | 5% | 10% | Static | 3 / 5 |
| **Basic** | $25,000 | $219 | 2 | 5% / 8% | 5% | 10% | Static | 3 / 5 |
| **Basic** | $50,000 | $349 | 2 | 5% / 8% | 5% | 10% | Static | 3 / 5 |
| **Basic** | $100,000 | $699 | 2 | 5% / 8% | 5% | 10% | Static | 3 / 5 |
| **Basic** | $200,000 | $1,299 | 2 | 5% / 8% | 5% | 10% (S1) / 8% (S2) | Static | 3 / 5 |
| **Accelerated** | $5,000 | $69 | 1 | 10% | 3% | 6% | Static | 3 |
| **Accelerated** | $10,000 | $109 | 1 | 10% | 3% | 6% | Static | 3 |
| **Accelerated** | $25,000 | $249 | 1 | 10% | 3% | 6% | Static | 3 |
| **Accelerated** | $50,000 | $399 | 1 | 10% | 3% | 6% | Static | 3 |
| **Accelerated** | $100,000 | $799 | 1 | 10% | 3% | 6% | Static | 3 |
| **Accelerated** | $200,000 | $1,399 | 1 | 10% | 3% | 6% | Static | 3 |
| **Turbo** | $5,000 | $199 | 0 | None | N/A | 6% | Trailing | 5 |
| **Turbo** | $10,000 | $399 | 0 | None | N/A | 6% | Trailing | 5 |
| **Turbo** | $25,000 | $799 | 0 | None | N/A | 6% | Trailing | 5 |

#### Field Glossary
*   **Drawdown Type:** 
    *   **Starting Balance (Static):** Limit is measured from the initial account notional. 
    *   **Highest Balance (Trailing):** Applied only to Turbo. The limit is calculated from the "High Water Mark" (highest balance reached).
*   **Profit Target:** For all evaluation phases, targets are strictly calculated based on **Realized PnL** (closed trades only).
*   **Max Drawdown (Basic $200k):** Note that the limit tightens to 8% for Stage 2 and the Funded stage.

### 4. Mechanics of Critical Trading Rules

#### The "Profit Day" Definition
A day is recorded as a "Profit Day" when the account balance increases by at least **0.5%** of the initial starting balance. This threshold remains fixed throughout the account lifecycle.

> **Conflict Alert:** There is a fundamental discrepancy in calculation logic. The **Rulebook** states that unrealized PnL (open positions) is included in the daily 0.5% balance change calculation. However, the **FAQ** claims that only realized profit from closed trades contributes to profit day requirements.

#### Daily Drawdown Reset and Calculation
The daily drawdown limit is calculated based on the balance at the start of the trading day (**00:00 UTC**).
*   **Inclusion of Unrealized PnL:** All drawdown limits include open positions. A losing open position reduces the balance in real-time and can breach the limit even before the trade is closed.
*   **Independence:** Each trading day is treated independently; a loss on a previous day does not affect the permitted loss for the subsequent day.

#### The 30% Consistency Rule (Turbo Only)
Withdrawals from Turbo accounts are blocked if a single trading day accounts for 30% or more of the total profit earned within a payout cycle.
*   **Example:** If total profit is $2,500 and the best day was $1,500 (60%), the withdrawal is locked. The trader must continue trading to increase the total profit to $5,000. At $5,000, the $1,500 day represents exactly 30%, unlocking the request.

#### Hedging Restrictions
*   **Intra-account (Permitted):** Holding opposing long and short positions on the same instrument within a single challenge account is allowed.
*   **Cross-account (Prohibited):** Holding opposing positions on the same instrument across multiple trading accounts (regardless of size or track) is a terminal violation.

### 5. Asset Classes and Trading Permissions
Traders choose from three market categories: **Crypto** (100+ pairs), **RWA** (Forex, Commodities, Indices), or **ALL Markets**.

#### Position Limits and Leverage
| Asset Category | Basic / Accelerated Leverage | Turbo Leverage |
| :--- | :--- | :--- |
| **Crypto** | 1:5 | 1:2 |
| **Forex** | 1:100 | 1:30 |
| **Commodities** | 1:10 | 1:5 |
| **Indices (ETFs)** | 1:15 | 1:5 |

**Prohibited Behaviors:** Use of automated trading bots, API-based execution, and coordinated/mirrored trading between different users or accounts is strictly forbidden. 

**Weekend Constraints:** RWA markets (Forex, Commodities, Indices) pause during weekends (following New York time). Withdrawal requests are unavailable if a trader holds open RWA positions during this pause.

### 6. Execution, Infrastructure, and Custody
The technical environment consists of a **TradingView-based terminal** integrated within a **Telegram Mini-App (TMA)** or web interface. Pricing data is sourced from **Pyth Network** decentralized oracles.

**Non-Market Situation Policy:**
Upscale reserves the right to review results or decline payouts if profits stem from:
*   Price provider errors or incorrect quotes.
*   Exploitation of technical failures or platform bugs.
*   Arbitrage on price anomalies during the first seconds of market opening.
*   External broker cancellations due to abnormal market conditions or manipulation.

### 7. Payout and Compensation Mechanics

#### Eligibility and Processing
*   **14-Day Cycle:** Withdrawals are available every 14 calendar days from activation or the last payout.
*   **Verification:** While marketed as "No KYC," the Terms of Use state that **withdrawals remain in "Pending KYC" status** until a passport and live-selfie are approved (review takes up to 48 business hours).
*   **Settlement:** Payouts are issued in **USDT** on TON, Base, or BSC networks. Processing takes up to 48 hours on-chain following approval.

#### Withdrawal Limits (Per 14-Day Period)
| Account Size | Max Withdrawal (%) | Max Withdrawal ($) |
| :--- | :--- | :--- |
| $5,000 | 50% | $2,500 |
| $10,000 | 40% | $4,000 |
| $25,000 | 40% | $10,000 |
| $50,000 | 25% | $12,500 |
| $100,000 | 20% | $20,000 |
| $200,000 | 15% | $30,000 |

#### Account Restoration Rules
If an account is restored with a balance below its original notional, the trader must first recover the "gap" through trading. Only profit generated above the **original starting balance** is eligible for payout.

#### Trading Iteration Synthesis
Every payout initiates a new "Trading Iteration." The account balance after the payout becomes the new "Iteration Starting Balance."
*   **Example ($100k Account):** Account reaches $130k. Trader withdraws the $20k limit. The remaining $110k is the new iteration baseline.
*   **Buffer:** The $10k profit remaining on the account serves as a buffer for drawdown calculations but does not count toward the next payout until the balance exceeds $110k.

### 8. Compliance, Rewards, and Scaling
*   **Maximum Allocation:** Limited to a combined funded notional of **$400,000**. Success beyond this limit results in accounts being placed in a "Reserve Queue."
*   **Referral Program:** Tiers include Silver (10%), Gold (12%), and Platinum (15%).
*   **Demo Incentive:** Passing a demo evaluation provides a 20% discount on a real challenge.
*   **Inactivity Policy:** 90 consecutive days of no trading will result in a "Freeze," requiring support intervention to reactivate.

### 9. Sources, Conflicts, and Unresolved Questions
**Sources:** Research Ledger (2026-08-16), Rulebook, Payout Policy, Terms of Use (May 2026), Official FAQ.

#### Table of Documented Contradictions
| Topic | Marketing / FAQ | Legal Terms / Rulebook |
| :--- | :--- | :--- |
| **KYC Requirements** | No KYC; Register via TG. | Passport and live-selfie required for payouts. |
| **Geographic Rules** | Worldwide / No restrictions. | US Residents and sanctioned persons excluded. |
| **Profit Day PnL** | Realized profit (closed trades) only. | Unrealized PnL (open positions) included. |
| **Jurisdiction** | Operated from Dubai. | Governed by Republic of Seychelles law. |

#### Unresolved Questions
*   **Legal Identity:** Specific registration numbers or entity names for the "Dubai" office are not documented.
*   **AI Mentor:** Marketed as a tool to analyze trades and suggest risk reductions, but the underlying algorithmic logic and mechanics remain an undocumented "black box."
*   **External Broker:** The specific identity of the "external broker" utilized for price execution/cancellation is not disclosed.