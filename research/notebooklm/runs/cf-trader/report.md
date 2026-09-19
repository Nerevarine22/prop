# Research Brief: Crypto Fund Trader (CFT) Operating Model and Rules

## 1. Project Overview and Operating Model
Crypto Fund Trader (CFT) is an **Evaluation Firm** centered on financial education and simulated trading environments. The platform operates under a **Scholarship Model**, wherein the firm provides participants with access to demo capital to demonstrate trading proficiency. Rather than traditional investment returns or brokerage services, successful participants become eligible for performance-based rewards (educational scholarships) based on their simulated results.

**Key Corporate Entities:**
*   **SWISS RLCRATES AG:** Headquartered in Zug, Switzerland. This is the primary service provider responsible for the platform's tools, general administration, and the distribution of scholarship rewards.
*   **RLCRATES, S.L.:** Based in Spain, this entity serves as the marketing and payment agent. Crucially, it is the specific provider of services related to the MetaTrader 5 (MT5) platform.

## 2. The Trader Lifecycle
Participants navigate a structured chronological path to reach eligibility for rewards:

1.  **Entry:** The participant selects an evaluation package and pays a registration fee to access the training program.
2.  **Evaluation Phase:** The trader must meet specific profit targets while adhering to risk management rules. Depending on the track, this involves 1, 2, or 3 distinct stages.
3.  **KYC and Contractual Audit:** Upon passing the evaluation, the participant must complete a "KYC Audit" (Proof of Identity and Proof of Address) and sign an individual scholarship agreement with SWISS RLCRATES AG.
4.  **Final Stage:** The trader enters a final simulation environment. Success here generates the performance-based scholarship rewards.
5.  **Payout Phase:** Rewards are requested via the dashboard, subject to minimum trading day requirements or specific program cycles.

## 3. Program Typology and Evaluation Tracks

### 2-Phase Evaluation
The standard multi-stage path. Traders must hit an 8% profit target in Phase 1 and a 5% target in Phase 2 to progress.

### 1-Phase Evaluation
The "Accelerated" path. It features a single stage with a 10% profit target. This track utilizes a trailing drawdown mechanic that becomes static once a specific profit threshold is reached.

### 3-Phase Evaluation
A progression-heavy model requiring the successful completion of three stages, each typically requiring a 5% profit target.

### Instant (0-Phase) Evaluation
Direct entry into a reward-eligible stage with no preliminary evaluation. This track utilizes a scaling structure where the account balance doubles upon hitting a 10% profit target, up to $1,280,000.

### Ascend Evaluation
A specialized track where passing two phases (8% and 5%) does not lead to a funded simulation, but instead triggers a fixed, one-time scholarship reward based on the initial account size.

### Break Evaluation
A unique track characterized by lower entry fees and higher profit targets ($1,250 for a $25k account). Progression to the Final Stage requires the payment of a specific "Activation Fee" after the evaluation is passed.

## 4. Funding Rules and Offers

| Program Name | Initial Demo Capital | Entry Fee | Target (%) | Daily Loss (%) | Max/Trailing Drawdown (%) | Account Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2-Phase** | $1,000 | $15* | 8% / 5% | 5% | 10% (Fixed) | Student |
| **2-Phase** | $5,000 | $58 | 8% / 5% | 5% | 10% (Fixed) | Student |
| **2-Phase** | $10,000 | $110 | 8% / 5% | 5% | 10% (Fixed) | Student |
| **2-Phase** | $25,000 | $240 | 8% / 5% | 5% | 10% (Fixed) | Student |
| **2-Phase** | $50,000 | $389 | 8% / 5% | 5% | 10% (Fixed) | Advanced |
| **2-Phase** | $100,000 | $660 | 8% / 5% | 5% | 10% (Fixed) | Advanced |
| **2-Phase** | $200,000 | $1,250 | 8% / 5% | 5% | 10% (Fixed) | Advanced |
| **1-Phase** | $1,000 | $12* | 10% | 4% | 6% (Trailing) | Student |
| **1-Phase** | $5,000 | $40 | 10% | 4% | 6% (Trailing) | Student |
| **1-Phase** | $10,000 | $80 | 10% | 4% | 6% (Trailing) | Student |
| **1-Phase** | $25,000 | $219 | 10% | 4% | 6% (Trailing) | Student |
| **1-Phase** | $50,000 | $369 | 10% | 4% | 6% (Trailing) | Advanced |
| **1-Phase** | $100,000 | $619 | 10% | 4% | 6% (Trailing) | Advanced |
| **1-Phase** | $200,000 | $1,199 | 10% | 4% | 6% (Trailing) | Advanced |
| **Instant** | $2,500 | $125 | 10% (Scale) | 4% | 6% (Fixed) | Student |
| **Instant** | $5,000 | $240 | 10% (Scale) | 4% | 6% (Fixed) | Student |
| **Instant** | $10,000 | $475 | 10% (Scale) | 4% | 6% (Fixed) | Student |
| **Break** | $25,000 | $70 | $1,250 (Amt) | 4% | 4% (Trailing) | Student |
| **Break** | $50,000 | $140 | $3,000 (Amt) | 4% | 4% (Trailing) | Student |
| **Break** | $100,000 | $200 | $6,000 (Amt) | 3% | 3% (Trailing) | Student |

*\*Note: Fee extrapolated from Student Account scaling in Section 6 of Terms.*

**Instant Scaling Structure:**
*   **Target:** 10% profit to double the account size.
*   **Levels:** $2,500 $\rightarrow$ $5,000 $\rightarrow$ $10,000 $\rightarrow$ $20,000 $\rightarrow$ $40,000 $\rightarrow$ $80,000 $\rightarrow$ $160,000 $\rightarrow$ $320,000 $\rightarrow$ $640,000 $\rightarrow$ $1,280,000.
*   **Profit Split:** Starts at 50% (Level 1-3), 60% (Level 4), 70% (Level 5), 80% (Level 6), and 90% (Levels 7-10).

**Key to Mechanics:**
*   **Daily Loss Reset:** Calculated based on the account balance at **12:05 AM UTC**.
*   **Drawdown Breach Logic:** All breaches are calculated based on **real-time equity**.
*   **Trailing Drawdown Calculation:** The High-Water Mark (HWM) is calculated based on **closed balance**, following the highest balance reached by the account.
*   **Leverage Differentiation:** Student accounts ($1k-$25k) are limited to **1:30 Forex** (1:5 Crypto); Advanced accounts ($50k+) are provided **1:100** across all asset classes.
*   **Add-on Pricing:** 
    *   Weekly Scholarship Request: 20% of fee.
    *   90% Bonus Performance: 20% of fee.
    *   Daily Drawdown 6%: 15% of fee.
    *   Max Drawdown 12%: 25% of fee.

## 5. Detailed Rule Mechanics and Drawdown Logic

### 1-Phase Trailing Drawdown Nuance
The trailing drawdown is initially set at 6% of the initial balance. The HWM moves upward with the closed balance. However, once the trailing drawdown reaches the **initial opening balance** (typically after reaching a 6% profit), it becomes static. It no longer moves upward, providing the trader with more breathing room as profits continue to grow.

### Break Consistency Rule
In the Break Final Stage, no more than **40% of total profits** may be generated in a single trading day. This rule is **only checked at the time of a payout request**. If a violation is found, the payout is rejected, and the trader must continue trading to distribute profits more evenly. The consistency check resets after every approved payout.

### Gambling / All-In Trading Rule
A hard cap of **$10,000** in simulated profit is allowed per day or per individual trade. If this limit is exceeded, excess profit is deducted, and trades may be closed. This rule is calculated based on the balance at **12:10 AM UTC**. It applies to the user profile holistically; multiple trades or partial closes within similar timeframes are treated as a single operation.

## 6. Trading Permissions and Strategic Restrictions

### Allowed Activities
*   **News Trading:** Generally permitted in 1-Phase, 2-Phase, and 3-Phase evaluations.
*   **Position Holding:** Overnight and weekend holding is permitted for all instruments.
*   **Copy-Trading:** Permitted **only** during the evaluation phase of Break accounts and **only** between accounts owned by the same trader.

### Prohibited Activities
*   **Technical Exploits:** High-frequency trading (HFT), tick scalping, latency arbitrage, and exploiting data feed errors.
*   **Account Sharing:** Sharing credentials or operating multiple accounts from the same IP/VPS/Device.
*   **Reverse Trading/Hedging:** Opening opposite positions across different accounts or within the same account if the first position has been open for less than 24 hours.
*   **Gambling Style:** Strategies demonstrating a lack of risk management, such as "all-in" trades or excessive margin usage.

### Ascend-Specific News Rule
Traders in the Ascend track are subject to a **4-minute window** restriction (2 minutes before and 2 minutes after) around high-impact news or market opens. During this window:
1.  New trades cannot be opened.
2.  Volume cannot be added to existing trades.
3.  The maximum theoretical loss cannot exceed 2% of the initial balance.
*Note: While the firm provides a weekly calendar, any event can be designated "high-impact" at the firm's discretion, and news restrictions apply regardless of calendar inclusion.*

## 7. Platform Execution and Technical Custody
CFT provides three primary execution environments:

1.  **MetaTrader 5:** Restricted for US residents; provided via RLCRATES, S.L.
2.  **Match-Trader:** Available for US residents; web and mobile accessible.
3.  **Bybit:** A crypto-native futures platform.

### Bybit Technical Requirements
Traders must link their personal Bybit account via **API Key and Subaccount**. This link is immutable; deleting or modifying the API key results in **automatic account invalidation**. 
*   **Instrument Restriction:** Restricted to USDT crypto futures/derivatives.
*   **Exclusions:** Trades placed on **USDC pairs** will not be counted toward targets. Spot and options trading are strictly prohibited.

### Commission Structure (MT5 & Match-Trader)
*   **Forex:** $2.5 per lot per side.
*   **Crypto:** 0.0325% per side.
*   **Indices:** 0.005% per lot per side.
*   **Commodities:** 0.0005% per side.
*   **Stocks:** 0.002% per side.

## 8. Payout and Compensation Framework

### Scholarship Reward Mechanics
*   **Eligibility:** Standard cycle is 15 traded days or 30 calendar days. With the Weekly Payout add-on, eligibility is every 7 traded days.
*   **Payout Methods:** Bank transfer (EUR/USD via SEPA) or Crypto (USDT ERC20/TRC20, BTC, ETH).
*   **Processing Time:** Averages 8 hours; maximum of 48 business hours.
*   **Suspended Account Payouts:** Traders may receive **50% of simulated profits** from a suspended 1-Phase or 2-Phase Final Stage account if:
    1.  All trades used a Stop Loss.
    2.  No trade exceeded 2% risk of the account size.
    3.  The account was active for at least 15 days.

## 9. Corporate Governance and Compliance
*   **Jurisdiction:** SWISS RLCRATES AG is governed by the laws of the Canton of Zug, Switzerland.
*   **KYC Requirements:** Mandatory for all rewards. Requires Proof of Identity (Passport, ID, or License) and Proof of Address (Utility bill or bank statement).
*   **Competitive Ranking (Season IV):** A rewards program based on ELO points earned from passing phases and requesting payouts. Prizes include cash and TradingView subscriptions.
*   **Regional Restrictions:** MT5 is unavailable to US residents due to platform provider constraints.

## 10. Sources, Conflicts, and Unresolved Questions

### Information Sources
*   Existing Research Ledger (Verified 2026-08-16)
*   Official Pricing Checkout (Terms & Conditions)
*   Official Rulebook (FAQ)
*   Official Token Rewards (Competitive Ranking)
*   Official Website Content

### Conflict Resolution
*   **Ascend Evaluation Fees:** The Ledger lists the entry at $39, while the Pricing Checkout/Website lists it as **$45**. Users should expect the higher checkout price as the current active rate.
*   **Break Evaluation Fees:** The $50k Break Evaluation is listed at $139 in the pricing section but cited as **$140** in the formal Terms (Section 5.6.6). 
*   **Instant Scaling:** The website source indicates levels up to $1.28M, while the Ledger focuses on the $2.5k-$10k entry points.

### Unresolved Questions
*   **High-Impact News Source:** The specific external calendar provider (e.g., Forex Factory) used for definitive rule enforcement is not named.
*   **HFT Numerical Definition:** The exact "trades per second" or volume threshold that triggers an HFT breach remains qualitatively defined.
*   **Scholarship Contract:** The full text of the individual agreement signed before the Final Stage is not included in public documentation.