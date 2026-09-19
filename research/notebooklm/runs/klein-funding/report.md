# Research Brief: Klein Funding Operating Model and Program Mechanics

## 1. Project Overview and Operating Model
Klein Funding, a brand operated by **KUENTECH LLC**, is a proprietary trading service provider that specializes in performance-based simulated trading environments. Unlike traditional brokerage firms that provide direct market access, Klein Funding utilizes a "simulated account" model. In this framework, traders do not execute orders on live exchanges; instead, they operate within a synthetic environment where performance is measured against simulated market data.

The core operating model relies on the distribution of "simulated profits." Traders who successfully navigate the evaluation phases and adhere to strict risk management protocols are eligible for monetary rewards. These rewards are legally structured as a performance fee based on a percentage of the simulated profit generated. The firm offers three primary program tracks: **Bybit**, **Cleo**, and **Instant Pro**, each designed to accommodate different risk appetites and trading styles.

## 2. The Trader Lifecycle
The journey of a trader within the Klein Funding ecosystem is a structured progression from selection to capital allocation.

1.  **Entry and Selection:** The trader selects a program track and account size. An entry cost is paid, granting access to the simulated evaluation environment.
2.  **Evaluation Phase:** Traders must reach a defined profit target (e.g., 6% to 14%) while remaining within drawdown limits. This phase serves as a filter to identify disciplined participants.
3.  **Simulated Capital Allocation:** Upon hitting targets, the trader moves to a "Funded" status. It is critical to note that "funding" refers to the allocation of simulated capital; the platform remains a paper-trading environment.
4.  **Risk Enforcement & Monitoring:** The firm employs automated monitoring for drawdown and "Stability." If a trader breaches a static loss limit or fails to maintain consistent profit distribution (in Bybit tracks), the account is terminated.
5.  **Reward Distribution:** Payouts are triggered either on-demand or after meeting specific activity hurdles (in Instant Pro). Rewards are processed via various financial gateways based on the pre-selected profit split.

## 3. Program Variations and Specifications

### Bybit Programs (1-Step and 2-Step)
The Bybit track is the standard evaluation offering, catering to traders who require high leverage and traditional multi-phase structures.
*   **Profit Targets:** 6% to 10% depending on the specific step.
*   **Leverage:** Up to 1:100.
*   **Payout Share:** Configurable between 60% and 90%.
*   **Risk Metrics:** Governed by static drawdown and mandatory stability requirements.

### Cleo Programs (Standard and Flex)
The Cleo track is designed for more conservative traders or those who employ strategies that may not meet consistency checks.
*   **Profit Targets:** Higher thresholds ranging from 9% to 14%.
*   **Leverage:** Limited to 1:5.
*   **Stability:** Explicitly features **no stability requirements**, allowing for "lumpy" profit distributions.
*   **Payout Share:** Configurable between 60% and 90%.

### Instant Pro
Instant Pro is an accelerated track that bypasses the traditional multi-stage evaluation.
*   **Payout Rules:** Governed by strict profitable-day requirements and a 4% minimum profit threshold before any reward can be requested.
*   **Payout Share:** Higher base range, configurable between 70% and 90%.

## 4. Technical Rule Mechanics

### Drawdown Mechanics: The "Static" Advantage
Unlike trailing drawdowns that move upward with account growth, Klein Funding utilizes a **Static Drawdown** model. This means the maximum loss limit is a fixed floor relative to the account’s initial balance. 
*   **Daily Drawdown:** This is mathematically enforced at exactly **half of the maximum drawdown**. For example, on a $100,000 account with a 10% ($10,000) static drawdown, the daily loss limit is fixed at 5% ($5,000) of the initial balance. This provides a predictable risk ceiling that does not fluctuate with intraday equity peaks.

### Stability Rules: The Consistency Metric
For Bybit programs, the firm enforces a "Stability" score (30% for 1-Step, 45% for 2-Step). This ensures that a trader’s success is a result of consistent performance rather than a single outlier event.
*   **Hypothetical Example:** In a Bybit 1-Step account with a $10,000 profit target and a 30% stability rule, a trader cannot earn more than $3,000 toward that target in a single trading day. If a trader earns $5,000 in one day, only $3,000 counts toward the evaluation target, requiring further trading to prove consistency.

### Instant Pro Specifics
The Instant Pro track replaces traditional targets with activity-based hurdles:
*   **Profitability Hurdle:** Must achieve a minimum of three trading days where simulated profit is at least 0.5% of the account size.
*   **Withdrawal Floor:** No payouts can be requested until the account balance has reached a minimum 4% net profit.

## 5. Funding Rules and Offers Table

| Track/Program Name | Account Size | Entry Cost (Current/List) | Stages | Profit Target | Daily Loss Limit | Max Drawdown | Drawdown Type | Leverage | Stability Req. |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Instant Pro** | $1,250 | Variable | N/A | 4% Min Profit | 1.5% - 2% | 3% - 4% | Static | 1:5 - 1:100 | None |
| **Cleo One-Step** | $5,000 | $52.25 / $66.00 | 1-Step | 9% - 14% | 1.5% - 4% | 3% - 8% | Static | 1:5 | None |
| **Bybit One-Step** | $5,000 | Variable | 1-Step | 10% | 3% | 6% | Static | 1:100 | 30% |
| **Bybit Two-Step** | $5,000 | Variable | 2-Step | 8% / 5% | 5% | 10% | Static | 1:100 | 45% |
| **Bybit/Cleo/IP** | Up to $100k | Variable* | 1 or 2 | 6% - 14% | Variable | 3% - 10% | Static | 1:5 - 1:100 | Configurable |

*\*Specific pricing and parameters for tiers between $5,000 and $100,000 are dependent on the "Live Configurator" and are option-dependent.*

### Terminology Key
*   **Stability:** A consistency metric defining the maximum portion of the total profit target that can be earned in a single day (30% or 45%).
*   **Static Drawdown:** A fixed loss limit based on the starting balance that does not trail or move with profit.

## 6. Trading Permissions and Restrictions
*   **Strategy Constraints:** Prohibited practices include certain forms of latency arbitrage, HFT exploitation, and account sharing, as detailed in the 'general-rules' documentation.
*   **Leverage Limits:** Range from 1:5 (Cleo) to 1:100 (Bybit). These are hard limits; exceeding them is technically restricted by the platform.
*   **Configurability:** News trading and weekend holding are not universally banned; permissions are specific to the program type (Bybit vs. Cleo) and are selectable during the checkout process.
*   **KYC Requirements:** All traders must pass a KYC/compliance review before receiving payouts.

## 7. Execution and Payout Mechanics
The Klein Funding environment is **100% simulated**. This model effectively shifts performance risk entirely to the trader’s ability to navigate the Stability and Drawdown rules, while eliminating market risk for the firm (as no real assets are being traded in live markets).

### Payout Process
*   **Cadence:** Bybit and Cleo rewards are available "on-demand." Instant Pro requires the 3-day/4% threshold.
*   **Processing Time:** Average processing is 3 hours; the official window is 4–12 hours.
*   **48-Hour Guarantee:** If a reward is not processed within 48 hours, the trader is granted a 100% split for that specific payout.
*   **Methods:** Bank Transfer, Wise, USDT, BTC, and ETH.
*   **The Profit Split Contradiction:** While marketing materials highlight "up to 100%," this is a promotional/delay-based guarantee. The operational pricing matrix caps standard selectable profit splits at 90%.

## 8. Legal and Administrative Context
*   **Corporate Entity:** KUENTECH LLC.
*   **Age Requirement:** 18 years or older.
*   **Refund Policy:** All sales are final. The no-refund policy is strictly enforced once a simulation has commenced.
*   **Loyalty Programs:** There is currently no native token, airdrop, or points-based loyalty program. Rewards are strictly monetary performance distributions.

## 9. Sources, Conflicts, and Unresolved Questions

### Sources
*   Official Website (kleinfunding.com)
*   Official Pricing Matrix & Configurator
*   Official FAQ & General Rules
*   Terms of Use
*   Verified X Account (@KleinFunding)

### Conflict Table: Profit Splits and Payouts
| Feature | Marketing / "How It Works" | Operational Matrix | Impact on Trader |
| :--- | :--- | :--- | :--- |
| **Profit Split** | 40% to 100% | 60% to 90% | The "100%" split is a penalty/bonus for processing delays, not a standard selectable option. |
| **Payout Cadence** | On-demand | Instant Pro: Specific Hurdles | Instant Pro traders must trade for at least 3 days regardless of total profit. |
| **Processing** | 4-12 Hours | 3-Hour Average | Marketing emphasizes the "3-hour" average, but the 48-hour limit is the legal guarantee. |

### Unresolved Questions
*   **Prohibited Strategy Definitions:** The documentation lacks precise mathematical definitions for "High-Frequency Trading" (HFT) and "Arbitrage" within the simulated environment.
*   **Geographic Restrictions:** While KYC is required, the firm does not publish a specific list of prohibited jurisdictions (e.g., restricted countries) in the public FAQ or Terms.