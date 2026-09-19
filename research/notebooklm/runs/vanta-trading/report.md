# Research Brief: Vanta Trading Platform Mechanics and Ecosystem

### 1. Project Identity and Operating Model
Vanta Trading utilizes an infrastructure-centric monetization strategy, pivoting away from the traditional "Broker" model that relies on participant attrition. Instead, the platform functions as a sophisticated performance evaluation gateway, leveraging participant-generated alpha as high-fidelity data inputs for proprietary signal replication within live financial markets.

*   **Architectural Duality:** The ecosystem is bifurcated between the centralized **Vanta Trading UI**, which manages user onboarding and account administration, and **Subnet 8 (the Network)**. Subnet 8 is a decentralized layer built on the Bittensor protocol, where independent Validators log execution and verify performance metrics to ensure an immutable record of trader proficiency.
*   **Monetization via Signal Harvesting:** Vanta's value proposition is centered on the extraction of high-quality trading signals. By aggregating performance data through decentralized infrastructure, Vanta informs proprietary models that are copy-traded in institutional environments, allowing for a 100% profit-split model for the traders themselves.

> **[CAUTIONARY NOTE: SIMULATED ASSETS DISCLOSURE]**
> **All trading activities on the Vanta Trading Desk utilize "Simulated Assets" exclusively. These digital representations possess no real-world monetary value or legal tender status. Participants do not deposit, stake, or risk personal capital at any stage of the evaluation or scaling process.**

---

### 2. The Trader Lifecycle: From Entry to Compensation
The transition from participant to compensated network trader is governed by a strictly defined, five-stage lifecycle involving coordinated actions between the trader, the platform, and the decentralized network.

1.  **Entry (Registration):** The trader selects a tier and remits a one-time "Challenge Entry Fee." 
    *   *Party Responsible:* **Trader** (Payment), **Vanta** (Infrastructure access), and **Stripe/NowPayments** (Processing).
2.  **Evaluation (The One-Step Challenge):** The trader must achieve a 10% profit target while adhering to risk caps. 
    *   *Party Responsible:* **Trader** (Execution) and **Subnet 8 Validators** (Performance logging).
3.  **Activation (Scaled Transition):** Upon validation of results, the trader transitions to the "Network Trader Program." This is a discretionary invitation requiring a separate Independent Contractor Agreement (ICA).
    *   *Party Responsible:* **Vanta** (Discretionary invitation and ICA administration) and **Stripe** (KYC verification).
4.  **Trading & Risk (Simulated Execution):** Continuous trading in a scaled environment with automated enforcement of static drawdown parameters.
    *   *Party Responsible:* **Trader** (Ongoing execution) and **Vanta Trading Desk** (Automated risk enforcement).
5.  **Compensation (Reward Cycle):** Weekly distribution of rewards based on realized simulated PnL.
    *   *Party Responsible:* **Subnet 8 Validators** (On-chain reward calculation) and **Vanta** (USD disbursement via Stripe).

---

### 3. Detailed Evaluation Rules and Drawdown Mechanics
Vanta employs a **Static Drawdown Model**, an institutional-grade risk framework where loss limits remain fixed relative to the starting balance and do not trail realized profits. This provides a growing "equity cushion" as the account appreciates.

*   **Rule 1: Static Balance Loss Limit (5%):** The absolute account balance must never drop more than 5% below the initial starting balance.
    *   *Example:* On a $100,000 account, the hard floor is $95,000. If the balance grows to $115,000, the floor remains $95,000.
*   **Rule 2: Static Equity Loss Limit EOD Check (5%):** Account equity, including unrealized floating PnL, is assessed daily at **12:00 AM UTC**. Equity must remain above the 5% hard floor.
    *   *Example:* A $100,000 account with an open position must show equity > $95,000 during the UTC midnight snapshot.
*   **Activity Mandates:**
    *   **Temporal Constraints:** No minimum or maximum trading days are enforced.
    *   **Dormancy Clause:** To prevent infrastructure bloat, traders must execute at least one trade within 60 days of account activation.

---

### 4. Funding Rules and Offers Table
The following table reflects primary pricing from the "Official Pricing Checkout" data.

| Tier Name | Account Size | One-Time Fee | Profit Target | Max Drawdown | Scaling Eligibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kickstarter** | $1,000 | $9 | 10%¹ | 5% (Static) | **None** |
| **Starter** | $5,000 | $49 | 10% | 5% (Static) | Up to $2.5M |
| **Tier I** | $10,000 | $79 | 10% | 5% (Static) | Up to $2.5M |
| **Tier II** | $25,000 | $169 | 10% | 5% (Static) | Up to $2.5M |
| **Tier III** | $50,000 | $319 | 10% | 5% (Static) | Up to $2.5M |
| **Tier IV** | $100,000 | $599 | 10% | 5% (Static) | Up to $2.5M |

¹ *Note: A discrepancy exists regarding the Kickstarter target; see Section 9.*

*   **All Markets Coverage:** Every tier grants access to 1,000+ instruments across Crypto, Forex, Commodities, Indices, and Equities.
*   **Static vs. Trailing:** Unlike "Trailing Drawdown" models that tighten risk as the trader profits, Vanta's static model ensures the risk floor remains locked at the inception basis.

---

### 5. Trading Permissions, Restrictions, and Position Limits
**Leverage Tier Mapping**
Traders are assigned to leverage tiers based on their account status and current simulated capital allocation.

| Current Account Size | Challenge Tier | Funded (Scaled) Tier |
| :--- | :--- | :--- |
| $1,000 – $100,000 | **Tier A** | **Tier B** |
| $200,000 – $750,000 | — | **Tier C** |
| $1,000,000 – $2,500,000 | — | **Tier D** |

**Leverage Caps (Buying Power Multiples)**
Vanta enforces a strictly tiered leverage system across asset classes.

| Asset Class | Tier A | Tier B | Tier C | Tier D |
| :--- | :--- | :--- | :--- | :--- |
| **Crypto (Per-Pair)** | 0.5x | 1.0x | 1.5x | 2.0x |
| **Forex (Per-Pair)** | 2.5x | 5.0x | 7.5x | 10.0x |
| **Commodities—Gold** | 1.0x | 2.0x | 3.0x | 4.0x |
| **Commodities (Other)** | 0.5x | 1.0x | 1.5x | 2.0x |
| **Overall Portfolio Cap** | **6x** | **12x** | **18x** | **24x** |

**Operational Parameters:**
*   **Permitted:** Manual/Algorithmic trading (proprietary only), news trading, overnight holding, and weekend holding (subject to market hours).
*   **Prohibited:** Third-party copy trading, multi-account strategy correlation, and usage of Material Nonpublic Information (MNPI).

---

### 6. Execution Architecture and Trading Conditions
Trading is executed through the **Vanta Trading Desk**, utilizing institutional-grade data feeds to simulate realistic market friction.

| Condition | Crypto / Futures | Forex | Equities Spot |
| :--- | :--- | :--- | :--- |
| **Data Source** | Hyperliquid | Massive / Polygon | Databento / Massive |
| **Transaction Fees** | 3 bps (Crypto) | 0 bps | 1 bp |
| **Slippage Model** | Hyperliquid Orderbook | 0.5–2.0 bps | Bloomberg+ (BB+) |
| **Cash Interest** | — | — | **6.6% Annualized** |
| **Stock Borrow Fee**| — | — | **3.0% Annualized** |

*Note: Equity Spot financing is calculated at midnight UTC for both long (interest) and short (borrow) positions.*

---

### 7. Reward Mechanics, Scaling, and Bonuses
*   **Weekly Rewards:** 100% profit split based on realized simulated PnL, verified on the public Bittensor ledger and distributed in USD via Stripe every 7 days.
*   **2X Rewards Event:** A promotional incentive doubling payouts to 200%, ending **Sunday at 23:59 UTC** or upon exhaustion of the $200,000 pool.
*   **Quarterly Scaling:** High performers (5% return + 1.0 Sharpe Ratio) are eligible for quarterly capital allocation increases. The path scales from a $5k base up to a **$2.5M cap**. (Kickstarter accounts are excluded).
*   **Quarterly Bonus:** An additional 25% realized PnL bonus is awarded for achieving a 2% return and a 1.0 Sharpe Ratio within the quarter.

---

### 8. Legal, Jurisdiction, and Compliance
*   **Entity:** Taoshi VT Services, a Cayman Islands exempted company.
*   **KYC/AML:** Identity verification is facilitated through **Stripe** and is mandatory for Scaled Account activation.
*   **Geographic Restrictions:** Access is denied to residents of "Prohibited Jurisdictions" subject to comprehensive sanctions (OFAC, UK, EU, UN).

---

### 9. Sources, Conflicts, and Unresolved Questions
**Sources Analyzed:** Official Vanta Rulebook (v2026), Terms of Service (Feb 10, 2026), FAQ, Pricing Checkout Portal, and Research Ledger.

**Critical Conflicts & Discrepancies:**
*   **Pricing Discrepancy:** The "Official Pricing Checkout" lists Tier entries from **$49 to $599**, whereas internal promotional ledgers document a lower **$24 to $299** range. The higher pricing tier is currently enforced at checkout.
*   **The Activation Conflict:** While the Rulebook promises "immediate activation" after evaluation, the Terms of Service state that passing is "necessary but not sufficient," with final invitation to the program at the platform’s "sole discretion."
*   **The Kickstarter Target Conflict:** The live homepage displays an **8%** profit target for Kickstarter accounts, but the Rulebook, FAQ, and Pricing pages mandate a **10%** target for all tiers.
*   **Reward Verification Conflict:** Marketing materials cite "guaranteed rewards" due to decentralized ledger verification. However, the legal Terms of Service classify all payout descriptions as "informational only," creating no binding obligation.

**Unresolved Questions:**
*   **Percentile Benchmarks:** The specific "percentile-based metrics" required for quarterly scaling remain undefined in the public documentation.
*   **Processing Timelines:** The platform identifies a transition from manual to automatic payout processing but has not disclosed the definitive timeline for this migration.