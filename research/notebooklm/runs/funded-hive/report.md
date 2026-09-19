# Funded Hive: Source-Grounded Research Study

### 1. Project Identification and Operating Model

**Institutional Framework**
Funded Hive operates as a Decentralized Autonomous Corporation (DAC), legally represented by TradingHive Technologies Ltd. (Company License No: CL9878), headquartered in the Dubai International Financial Center (DIFC). The project facilitates a simulated and live-market trading environment where users qualify for capital allocation based on risk-adjusted performance.

**The Automated A-Book Dealing System (AADS)**
The core execution logic is governed by the proprietary Automated A-Book Dealing System (AADS). This infrastructure functions as a hybrid routing engine, managing order flow between internal simulation (B-Book) and live liquidity (A-Book). The system is designed to derive all payouts from "Positive A-Book PnL"—realized market profits—thereby mitigating traditional conflicts associated with internal dealing desks.

**Dynamic Switching and Recovery Protocols**
Live funded accounts utilize a "Dynamic Switching Protocol" based on a -1% threshold below the initial balance. 
*   **A-Book Initialization:** Every funded account commences with live market execution using real capital.
*   **Automated B-Book Transition:** Should an account incur an A-Book loss of -1% below the starting balance, the AADS force-closes all open positions and re-routes future orders to the B-Book (internal simulation).
*   **Recovery Offset Logic:** While in B-Book, the system monitors floating equity. Per Annex 3, Section 3.5, if a trader opens positions in B-Book that reach a profit level sufficient to offset the outstanding A-Book loss, the AADS will automatically close those positions at that exact moment to secure the offset.
*   **Manual Reactivation:** Once the balance returns to the initial level, the trader must manually select "Activate A-Book" via the dashboard to resume live market routing.

---

### 2. The Trader Lifecycle: From Entry to Compensation

**Step 1: Registration and Access Architectures**
The platform supports two distinct onboarding paths:
*   **Web3 Anonym Accounts:** Utilizes self-custodial MetaMask/Web3 wallets for decentralized access passes. No traditional KYC/ID documents are processed; the public wallet address serves as the unique cryptographic identifier.
*   **Regular KYC Accounts:** Mandatory for fiat-oriented transactions, requiring standard identity verification in accordance with DIFC regulatory frameworks.

**Step 2: Evaluation Phases and Capital Commitment**
Traders undergo 1-Step or 2-Step challenges. The "PayFromProfits" (PFP) model minimizes initial capital commitment via an "Access Fee," shifting the primary cost of capital to the post-evaluation phase. Fees for PFP Phase 2 must be paid within 14 days of passing Phase 1.

**Step 3: AADS Risk Categorization (Performance-Based Capacity)**
Upon successful completion of evaluation, the AADS performs a forensic analysis of the trader’s risk management (Stop Loss hygiene, drawdown patterns, and trade frequency). This analysis is the *sole determinant* for assigning a Risk Group (Low, Moderate, Medium, or High), which subsequently dictates the funded account fee and leverage constraints.

**Step 4: Funded Execution and Fee Settlement**
For PFP models, Low/Moderate risk traders pay 100% of the funded fee from future profits. Medium/High-risk traders are viewed as higher-risk capacity constraints and must pay 50% of the funded fee upfront before account issuance.

**Step 5: Compensation and Smart Contract Settlement**
Withdrawals are restricted to "Positive A-Book PnL," recorded on-chain via the "Truth Protocol." Payouts are claimed via smart contracts and settled in USDC (ERC-20).

---

### 3. Comprehensive Catalog of Programs and Tracks

*   **Classic 2-Step Challenge:** Traditional evaluation featuring NewBee (70% split), WorkerBee (80%), and QueenBee (90%) tiers. 
*   **PayFromProfits (PFP) 1-Step & 2-Step:** A "Pay After You Pass" structure. Traders settle the "Funded Fee" post-evaluation, determined by AADS risk scores.
*   **InstantGrowth (Golden Tower):** A 10-level scaling structure. Capital doubles from Level 1 through Level 5. From Level 6 onward, growth is defined as "proportional," though the exact mathematical formula for this proportion remains proprietary and undefined in current source documentation. A 2% upgrade fee (of the new balance) is required at each level.
*   **Web3 Anonym Accounts:** Anonymized access via NFT certificates. These accounts bypass standard data collection, relying on blockchain transaction history for performance auditing.

---

### 4. Advanced Risk Metrics and Rule Mechanics

**Slippage Protection (Challenge Phase Only)**
The platform provides a credit system to mitigate abnormal execution during evaluations:
*   **Standard Market Slippage:** Slippage up to 10% of the realized loss is considered a market standard and is not adjusted.
*   **Excess Slippage Credit:** Negative slippage exceeding 10% is credited back to the trader’s balance, capped at 50% of the total position loss. This protection is disabled on funded accounts to reflect real A-Book execution dynamics.

**Profitable Day Requirements**
Challenges require "3 Profitable Days." A day qualifies only if:
1.  The trader realizes a profit ≥ 1% of the initial balance.
2.  The account balance at day-end is ≥ initial balance.

**Drawdown and Profit Realization**
*   **Drawdown:** Static and balance-based. Capped at 10% for most models; 6% for InstantGrowth.
*   **Automatic Profit Realization:** The system reserves the right to auto-close positions to secure outstanding PFP fees or realize A-Book profit thresholds to preserve operational stability.

---

### 5. Funding Rules and Offers Table

| Track / Level | Account Size | Access Fee | Funded Fee (AADS Determined) | Profit Target (P1/P2) | Daily Loss | Max Drawdown | Leverage (Dynamic) | Profit Split |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Classic NewBee** | $5K - $200K | Varies | Upfront | 8% / 6% | 5% | 10% | 1:50 - 1:5* | 70% |
| **Classic WorkerBee**| $5K - $200K | Varies | Upfront | 8% / 6% | 4% | 10% | 1:100 - 1:5* | 80% |
| **Classic QueenBee** | $5K - $200K | Varies | Upfront | 8% / 6% | 3% | 10% | 1:200 - 1:10* | 90% |
| **PFP 2-Step** | $5K | $9 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 2-Step** | $10K | $19 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 2-Step** | $25K | $49 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 2-Step** | $50K | $75 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 2-Step** | $100K | $99 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 2-Step** | $200K | $199 | 1% - 3% | 8% / 6% | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $5K | $19 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $10K | $39 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $25K | $99 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $50K | $149 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $100K | $249 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **PFP 1-Step** | $200K | $399 | 1% - 3% | 10% / N/A | Risk-Based | 10% | Up to 1:50 | 80% |
| **Golden Tower L1** | $10K | Standard | N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L2** | $20K | 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L3** | $40K | 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L4** | $80K | 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L5** | $160K | 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L6** | Proportional| 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L7** | Proportional| 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L8** | Proportional| 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L9** | Proportional| 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |
| **Golden Tower L10**| $1M | 2% Upgrade| N/A | 6% | None | 6% | Up to 1:50 | 80% |

*\*Dynamic Leverage on FX majors: 1:100-1:200 for balances ≤ $100k, scaling down to 1:5-1:15 for balances up to $500k to ensure real-market margin stability.*

---

### 6. Risk Categorization & Assigned Parameters

Traders are categorized by AADS logic after evaluation. This determines the funded fee and leverage tier.

| Metric | Low Risk | Moderate Risk | Medium Risk | High Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Stop Loss (SL)** | Mandatory (within 20s) | Mandatory (before close) | Not Mandatory | Not Mandatory |
| **Max Loss / Trade** | ≤ 1% | ≤ 1.5% | ≤ 2% | ≤ 3% |
| **Max Daily Loss** | ≤ 2% | ≤ 3% | ≤ 4% | ≤ 5% |
| **Max Drawdown** | ≤ 5% | ≤ 6% | ≤ 7% | ≤ 10% |
| **Funded Fee** | 1% (100% from PnL) | 2% (100% from PnL) | 2.5% (50% Upfront) | 3% (50% Upfront) |
| **Leverage Tier** | Highest Available | High | Medium | Low |

**Accidental Trade Threshold:** A 10-second grace period is provided for execution errors. Trades opened unintentionally and closed within 10 seconds without an SL will not trigger a risk group downgrade.

---

### 7. Trading Permissions and Behavioral Restrictions

**Permitted Activities**
*   **News Trading:** Fully permitted across all categories.
*   **One-Sided Trading:** Consistent directional bias (long-only or short-only) is allowed.
*   **Holding Duration:** No minimum holding time exists, provided activity does not reach high-frequency trading (HFT) thresholds.

**Prohibited Strategies (Clause 9.2.1)**
*   **Arbitrage:** Latency exploits, Hedge Arbitrage, and Reverse Arbitrage are strictly banned.
*   **Systemic Risk:** Martingale and grid systems are prohibited (Annex 2.1).
*   **Copy Trading:** Prohibited on funded accounts, including between accounts owned by the same user.
*   **Weekend Holding:** Forbidden on funded accounts; positions must close by Friday market close.
*   **Consistency Score:** The platform does not utilize a consistency score for payout eligibility.

---

### 8. Execution, Settlement, and Wallet Logistics

*   **Terminal:** cTrader is the primary interface.
*   **Brokerage:** Live A-Book trades are executed by TradingHive Global Brokerage Ltd. via margin accounts with Tier-1 liquidity providers.
*   **Audit Trail:** The "Truth Protocol" utilizes smart contracts to record payouts and NFT certificates, ensuring immutable verification of performance.

---

### 9. Payout Mechanics and Withdrawal Policy

*   **Eligibility:** Limited to "Positive A-Book PnL" (Verified market profit net of A-Book losses).
*   **Logistics:** $50 minimum; USDC (ERC-20); user covers ETH gas.
*   **Security Limits:** 
    *   **Classic/PFP:** $1,000 daily cap per wallet address.
    *   **InstantGrowth:** $2,000 daily cap per wallet address.
    *   **Maximization Rule:** To reach the full limit across multiple accounts, traders must connect different ERC-20 addresses from the same wallet. Shared addresses share a single limit.
*   **Hive Coin Utility:** 
    *   **200% Refund:** Issued as Hive Coins *only after passing* the challenge.
    *   **Utility:** Can cover up to 50% of the cost for new challenges.
    *   **B-Book Conversion:** Eligible B-Book profits from breached accounts may be converted to Hive Coins.

---

### 10. Legal Entity and Geographic Governance

*   **Jurisdiction:** Dubai International Financial Center (DIFC).
*   **Dispute Resolution:** Escalation to the London Court of International Arbitration (LCIA) seated in the DIFC.
*   **KYC Policy:** Regular accounts require full identity data. Web3 Anonym accounts rely on "technical access passes" and wallet identifiers, bypassing traditional document collection.
*   **Abuse Protections:** Strict prohibition on "wallet cycling" and account multiplication (one account per user/IP/household).

---

### 11. Sources, Conflicts, and Unresolved Questions

**Source Ledger**
1.  General Terms and Conditions (TradingHive Technologies Ltd, CL9878), Effective January 5, 2026.
2.  Annex 1.1–1.4 (Product Parameters/Dynamic Leverage).
3.  Annex 2 (PFP/Risk Categorization).
4.  Annex 2.1 (InstantGrowth/Golden Tower).
5.  Annex 3 (AADS Protocol/B-Book Offset Logic).
6.  Annex 4 (Web3 Anonym Framework/Abuse Protection).

**Conflict Resolution**
*   **Payout Speed:** Marketing materials claim automated payouts in "under 60 seconds." However, Clause 9.1 of the General Terms grants the firm the right to reverse, suspend, or withhold payouts for manual verification, technical audits, or suspected rule violations.

**Unresolved Questions**
*   **Counterparty Transparency:** The specific "Tier-1 Liquidity Providers" are not identified by name in the legal annexes.
*   **Scaling Logic:** The mathematical formula for "proportional growth" in the Golden Tower beyond Level 5 remains undefined in the public rulebook.