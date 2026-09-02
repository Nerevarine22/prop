# Fundex Proprietary Trading Firm Research Brief

> **Editorial status — research input, not yet published.** Generated from 73 captured Fundex Help Center articles plus official Fundex web/X sources on 2026-09-02. Marketing claims, especially “60-second” payouts, are treated as self-reported until independently verified. Legal entity details, governing law, independent payout evidence and dated third-party reviews remain open research gaps.

### 1. Executive Brief and Institutional Identity
Fundex positions itself as a premier "A-Book" proprietary trading firm, utilizing a "trader-first" philosophy designed to eliminate the structural conflict of interest inherent in B-Book models. The firm’s value proposition is centered on its "RiskDesk" infrastructure—an AI-driven autonomous auditor—and its claim of mirroring funded trader activity directly onto live exchanges.

**Operating Model Classification: Hybrid Mirroring Execution**
Our analysis classifies Fundex's operational framework as a "Hybrid Mirroring Execution" model:
*   **Evaluation Stage:** A simulated environment mirroring the liquidity and spreads of external venues (Bitunix and MarketMates).
*   **Funded Stage:** A discretionary hedging model where the firm mirrors trader positions on live exchanges. RiskDesk monitors for "B-Book Episodes," temporary periods where the firm holds risk internally to buffer against specific drawdown triggers.

**Trader Lifecycle Mapping**
1.  **Phase 1 (Evaluation):** Reaching an 8% profit target with active risk monitoring.
2.  **Phase 2 (Establishment):** Reaching a 5% profit target on a reset balance.
3.  **Verification:** Successful AI-led review by RiskDesk, followed by KYC via RISE and execution of the Fundex Trader Agreement.
4.  **Funded Status:** Transition to a live-mirrored environment with active A-Book/B-Book transition logic.

---

### 2. Programs, Challenges, and Pricing
Fundex provides five evaluation tiers. Fees are one-time assessment costs; there are no recurring monthly subscriptions.

**Fundex Evaluation Tiers**

| Account Size | Fee | Phase 1 Target (8%) | Phase 2 Target (5%) | Max Drawdown (10%) | Daily Loss Limit (5%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $10,000 | $89 | $800 | $500 | $1,000 | $500 |
| $25,000 | $259 | $2,000 | $1,250 | $2,500 | $1,250 |
| $50,000 | $359 | $4,000 | $2,500 | $5,000 | $2,500 |
| $100,000 | $529 | $8,000 | $5,000 | $10,000 | $5,000 |
| $200,000 | $1,139 | $16,000 | $10,000 | $20,000 | $10,000 |

**Evaluation Parameters**
*   **Minimum Trading Days:** 5 days per phase. A "trading day" is only validated if at least one trade is opened with a notional size $\ge$ 5% of the starting account balance. 
*   **3-Minute Rule:** During evaluation, positions must be held for at least 180 seconds. A first violation triggers a RiskDesk warning; subsequent violations result in a hard breach.
*   **Execution Note:** There are no maximum time limits for either evaluation phase.

**Technical Breach Logic**
*   **Max Drawdown:** Fixed at 10% of the initial starting balance. This is a static "floor" and does not trail equity or balance.
*   **Daily Loss Limit:** Set at 5% of the starting balance of the day (recalculating at 00:00 UTC). This includes both realized PnL and floating (open) PnL.

**Test and Giveaway Accounts**
*   **$1,000 Free Test Account:** Requires a 10% profit target and 5 trading days. Completion awards a 30% discount code and renders the trader **eligible for a free $10,000 2-Step evaluation account.**
*   **Giveaway Accounts:** These carry a **5% cumulative payout cap** (e.g., a $50,000 account has a lifetime withdrawal limit of $2,500). They are ineligible for the Monthly Bonus.

---

### 3. Payouts and Trader Compensation
**The Reward Model**
Fundex utilizes a 70/30 profit split. The minimum payout threshold is $50.

**Logistics and Processing**
*   **Settlement:** Fundex markets on-demand payouts as typically completed within 60 minutes and states a maximum processing time of 24 hours, including weekends. The supplied sources do not independently verify actual processing performance.
*   **The "Offset" Recovery Trap:** A critical technical nuance involves "B-Book Episodes." If an account triggers a switch to B-Book (dropping 1% below starting balance), all losses incurred during this episode form an "Offset." The trader must recover this entire amount without receiving a profit split before the 70/30 A-Book distribution resumes. Because the trigger is pinned to the *starting balance* rather than *current equity*, a trader in high profit who encounters a drawdown can still be forced into this recovery hurdle.

---

### 4. Trading Environment and Execution
**Execution Infrastructure & Transparency Note**
Investigation reveals inconsistencies in CFD venue naming within official documentation, which variously cites "Pure Market," "MarketMarket," and "MarketMates." Crypto perpetuals are consistently routed through Bitunix. 

**Asset Specification**
Traders have access to 200+ Crypto pairs, Forex, Metals, Stocks, ETFs, and Indices.

**Leverage and Fees**
*   **Forex:** 1:16 | **Metals/BTC/ETH:** 1:4 | **Altcoins:** 1:2.
*   **Crypto Fees (Bitunix):** Maker 0.02% / Taker 0.06%.
*   **Unresolved Question:** The specific fee schedule for CFD instruments remains non-transparent in the provided source material.

**Prohibited Strategies & Exposure Caps**
*   **Simultaneous Exposure Limits:** RiskDesk enforces hard caps on total notional exposure. Evaluation stage limits are 50%–80% of equity. The **Funded stage has a hard 60% total exposure limit.**
*   **Position Stacking:** Defined as opening 3 or more positions in the same direction on the same instrument.
*   **Banned:** Martingale, Grid trading, Latency Arbitrage, and HFT. 
*   **Gambling Behavior:** Single positions exceeding 40% of account equity trigger a violation review.

---

### 5. Legal Entity and Global Availability
**Compliance and Identity**
RISE handles all KYC. Participants must be 18+ and are prohibited from using VPNs or VPS/Datacenters. RiskDesk uses Hardware ID (CID) and IP range detection to monitor for account sharing.

**Jurisdictional Restrictions (June 2026)**
Fundex restricts 16 countries: Russia, Belarus, UAE, Pakistan, North Korea, Iran, Syria, Cuba, Afghanistan, Myanmar, Iraq, Somalia, Sudan, South Sudan, Libya, and Yemen. 
*   **Analyst Note:** The inclusion of the **UAE** as a restricted jurisdiction is a rare constraint among global prop firms and suggests a specific regulatory or banking compliance posture.

---

### 6. Rewards, Promotions, and Incentives
**The Monthly Bonus (Participation Salary)**
Starting from Day 30 of funded status, traders may receive a 1% monthly bonus (e.g., $1,000 for a $100k account). This is a **discretionary "participation salary"** offered independently of whether the monthly PnL is positive, negative, or flat, provided volume requirements are met.

**Monthly Volume Requirements**
| Account Size | Fundex Terminal (Crypto) | MatchTrader (CFD) |
| :--- | :--- | :--- |
| $10,000 | $200,000 | $1,000,000 |
| $50,000 | $1,000,000 | $5,000,000 |
| $100,000 | $2,000,000 | $10,000,000 |
| $200,000 | $4,000,000 | $20,000,000 |

**Affiliate Nuance**
Affiliates earn 10% lifetime recurring commissions. Unlike trader payouts, affiliate withdrawals require internal verification and are not subject to the 60-second automated claim window.

---

### 7. Transparency and Operating Statistics
**Self-Reported Data (As of August 28, 2026)**
*   **Total Payouts:** $500,000+
*   **Test Account Enrollment:** 3,200+ traders (870+ passing the 10% target).
*   **Audit Status:** These metrics are self-reported and have not been independently audited.

---

### 8. Reviews and Reputation
**Institutional Sentiment**
The firm attracts high-volume traders due to the absence of consistency rules and the "60-second" payout marketing. However, the reliance on RiskDesk's AI introduces a "Human vs. Machine" friction.
*   **Appeal Process:** Traders can contest RiskDesk decisions. A maximum of two appeals are permitted; the second appeal involves a manual review by the Fundex risk team, and its decision is final.

---

### 9. Fundex-Specific Mechanics: The A-Book/B-Book Logic
The "RiskDesk" system manages a unique transition model:
1.  **B-Book Trigger:** If a balance drops 1% below the *starting balance* with open positions, the account enters a "B-Book Episode."
2.  **Breach Counter:** Four consecutive unrecovered B-Book switches (failing to return to the starting balance before another 1% drop) results in a permanent breach.
3.  **Absolute Breach:** A 10% total drop from the starting balance while in B-Book mode results in an immediate account termination.

---

### 10. Red Flags and Green Flags
**Red Flags**
*   **The Offset Hurdle:** The complexity of recovering B-Book losses before profit sharing resumes can act as a significant barrier to earnings for traders in drawdown.
*   **Discretionary Nature:** The Monthly Bonus is not a guaranteed entitlement.
*   **Naming Inconsistency:** The variance between "Pure Market" and "MarketMates" suggests internal documentation gaps.

**Green Flags**
*   **Zero Consistency Rules:** No limits on "big days."
*   **Fast-payout policy:** Fundex publishes a 60-minute typical-processing claim and a 24-hour maximum; this is a company policy claim, not independent proof of payout performance.
*   **Test Account Incentives:** High-value rewards for the free test account ($10k account eligibility).

---

### 11. Sources and Unresolved Questions
**Research Gaps**
*   The legal registration number and physical headquarters address are not disclosed.
*   The specific fee structure for CFD execution venues is omitted.
*   Founder and executive identities remain anonymous in official 2026 captures.

**Source Inventory**
Data synthesized from 73 Help Center articles, official "X" account communications (Aug-Sep 2026), and web captures from fundex.gg and trade.fundex.gg.
