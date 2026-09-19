# Research Brief: Levli Crypto Prop Trading Project

### 1. Project Overview and Operating Model
Levli is a cryptocurrency proprietary trading platform utilizing a "simulated skill evaluation" model to identify and reward disciplined traders. The platform provides a structured environment where participants can demonstrate market proficiency without risking personal trading capital.

**Operating Model Clarification**
Levli acts as the sole economic counterparty for all user interactions. All account tiers—Trial, Evaluation, and Funded—operate within a strictly simulated environment. No orders are routed to external exchanges or live liquidity providers; instead, trades are filled via an internal simulation engine.

**Economic Structure**
Payouts are classified as "discretionary performance-based rewards." These are not investment returns from live market execution but are performance-linked incentives paid in USDC from company revenue based on the simulated profit realized by eligible traders.

### 2. The Trader Lifecycle
The progression from applicant to rewarded trader follows a chronological six-stage narrative:

1.  **Entry:** Traders may utilize an optional $10,000 Free Trial. This account is valid for 7 days and serves as a technical rehearsal for the evaluation environment.
2.  **Selection:** The trader selects an Evaluation size ($2,500–$50,000) and pays a one-time participation fee.
3.  **Evaluation:** The trader operates against a 10% profit target while adhering to risk limits. There is no time limit to complete this stage.
4.  **Review:** Upon meeting the passing criteria, the account undergoes an internal review. Successful candidates are issued a simulated "Funded" account.
5.  **Funded Status:** The trader manages the funded account with live market data. At this stage, mandatory exposure controls are activated to manage simulated risk (see Section 7).
6.  **Compensation:** Traders request USDC rewards based on realized profit and eligibility tiers. Performance is subject to consistency and fair-play audits.

### 3. Funding Rules and Offers

The following tiers represent the standardized entry points for the Levli evaluation process:

| Account Size (Simulated Capital) | One-time Fee | Reset Fee | Profit Target | Max Drawdown (6% Static) | Daily Loss (4%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **$2,500** | $29 | $12 | $250 (10%) | $2,350 Floor | $100 |
| **$10,000** | $89 | $35 | $1,000 (10%) | $9,400 Floor | $400 |
| **$25,000** | $249 | $99 | $2,500 (10%) | $23,500 Floor | $1,000 |
| **$50,000** | $449 | $179 | $5,000 (10%) | $47,000 Floor | $2,000 |

**Field Explanations**
*   **Static Drawdown:** The 6% maximum drawdown is a fixed floor calculated as `Initial Capital × 0.94`. Unlike trailing drawdowns, this floor remains constant regardless of profit, effectively increasing the trader's risk buffer as the account balance grows.
*   **Daily Loss Circuit Breaker:** A 4% limit based on the equity at the start of the UTC day (the "anchor"). If triggered, positions are auto-liquidated and trading is paused until the UTC 00:00 reset. The account remains active unless the Max Drawdown floor is also breached.
*   **Refund Policy:** The initial evaluation fee is refunded exclusively with the first approved payout. Reset fees are non-refundable.

### 4. Critical Rule Mechanics and Calculations

**The Consistency Rule (35%)**
To mitigate "lucky" outlier events, no single UTC day may account for more than 35% of the total realized profit at the time of passing. 
*   *Calculation Example:* On a $10,000 account (10% target), if a trader nets $800 on their best day, the total realized profit must reach at least ~$2,286 ($800 / 0.35) before the account is eligible to pass.

**Rule Evaluation Hierarchy**
In scenarios where multiple rule events occur simultaneously (e.g., a single tick hitting both a profit target and a drawdown limit), the system evaluates them in the following priority order:
1.  **Max Drawdown** (Termination event)
2.  **Daily Loss** (Pause event)
3.  **Profit Target** (Passing event)

**Passing Requirements**
An Evaluation is considered "passed" only when these three conditions are met simultaneously:
*   [ ] **Profit Target:** Realized profit ≥ 10% of initial capital.
*   [ ] **Consistency:** Best day’s realized profit ≤ 35% of total realized profit.
*   [ ] **Position State:** Zero open positions.

**Rule Locking**
Specific targets and risk parameters are "locked" at the time of account creation. Future global rule updates apply only to new accounts, protecting active traders from mid-cycle policy changes.

### 5. Trading Permissions and Restrictions

**Supported Markets**
Levli focuses exclusively on crypto perpetual futures. Leverage is configured per symbol and is visible within the trading interface prior to order submission.

**Behavioral Restrictions (Manual Trading Only)**
*   **Automation:** Bots, Expert Advisors (EAs), and API access are strictly prohibited.
*   **Account Management:** Account sharing, delegation, and trade mirroring/copy-trading (across personal or external accounts) are forbidden.
*   **Strategy Prohibitions:** Cross-account hedging and price-feed abuse (latency exploitation or stale quote arbitrage) are grounds for account closure.

**Allowed Activities**
*   **News Trading:** Permitted, provided traders do not exploit technical simulation delays.
*   **Holding Periods:** Overnight and weekend holding is permitted.

### 6. Execution and Technical Infrastructure

**Simulation Engine**
Orders are filled by Levli's proprietary engine using real-time market data. This engine determines fills based on data availability without external order routing.

**Platform Constraints**
*   **Official Interface:** Traders must use the manual platform interface; third-party software is not supported.
*   **Order Duration:** Unfilled limit orders are automatically cancelled after 72 hours.
*   **Simulated Fees:** Indicative fees of 0.02% (Maker) and 0.05% (Taker) are applied.
*   **Limitation:** Funding payments (periodic long/short fee exchanges) are currently not implemented in the simulation.

### 7. Payout and Reward Mechanics

**Reward Split Tiers**
Traders advance through tiers based on the number of consecutive approved payouts:

| Tier | Reward Share | Per-Request Cap | Requirement |
| :--- | :--- | :--- | :--- |
| **Tier 1** | 80% | 5% of account capital | First approved payout |
| **Tier 2** | 85% | 10% of account capital | 3 consecutive approved payouts |
| **Tier 3** | 90% | No per-request cap | 6 consecutive approved payouts |

**Funded Exposure Constraints**
Once in the "Funded" stage, traders must adhere to strict margin limits:
*   **Total Margin Exposure:** Must be ≤ 25% of the account balance.
*   **Single Position Notional:** Capped at ≤ 2x the account balance.

**Eligibility and Definitions**
Initial payout eligibility requires 7 "Trading Days" (defined by the **open** date of a trade) and 3 "Profitable Days" (defined by the **close** date of a trade). A $50 minimum realized profit is required.

**Processing Workflow**
Requests are batched daily at 09:00 UTC, with a 24-hour target for USDC disbursement. A request is blocked if the withdrawal would push the account balance below the fixed 6% Max Drawdown floor.

### 8. Compliance, Jurisdictions, and Promotions

**Geographic Restrictions**
Services are prohibited for residents of the USA, UK, and sanctioned jurisdictions.

**KYC and Compliance**
Levli currently maintains a "no KYC" policy for participation in trials and evaluations. However, eligibility, sanctions, and recipient-information checks apply prior to payout issuance.

**Beta and Waitlist Context**
*   **Levli Points:** Currently part of the waitlist phase, rewarding 100 points for signups and referrals.
*   **Network:** The platform utilizes Arbitrum One (Chain ID 42161) for waitlist and on-chain interactions.

### 9. Sources and Unresolved Questions

**Source List**
*   Levli Official FAQ and Rules Documentation
*   Levli Official Website and Waitlist Interface

**Unresolved Questions**
*   **Specific Sanctions:** The comprehensive list of sanctioned jurisdictions is located in the "Terms of Use," which was not provided in full.
*   **Symbol Leverage:** Exact leverage multipliers are configuration-dependent and only visible within the active trading terminal.
*   **Inactivity Recovery:** Accounts with no trades for 30 days are marked inactive. The "recovery path" or associated costs are not globally defined and must be verified via the user's **account dashboard**.

**Disclosed Technical Limitations**
The simulation does not currently apply funding payments, which may cause a material difference between simulated performance and live market conditions.